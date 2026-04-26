import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FileEntry } from '@core/models/file.model';
import { ErrorModalService } from '@core/services/error-modal.service';
import { ProjectService } from '@core/services/project.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { FileInputComponent } from '../../../../ui/base/file-input/file-input.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { FileRowComponent } from '../../components/file-row/file-row.component';
import { SkeletonFileListComponent } from '../../components/skeleton-file-list/skeleton-file-list.component';

@Component({
  selector: 'dpo-files-tab',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FileInputComponent, IconComponent, FileRowComponent, SkeletonFileListComponent],
  templateUrl: './files-tab.component.html',
  styleUrl: './files-tab.component.scss'
})
export class FilesTabComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  private static readonly MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;

  @Input() projectId: number | null = null;
  @ViewChild(FileInputComponent) private fileInput?: FileInputComponent;

  loading = false;
  saving = false;
  private loadingTimer: ReturnType<typeof setTimeout> | null = null;

  private serverFiles: FileEntry[] = [];

  constructor(
    private readonly projectService: ProjectService,
    private readonly confirmDialog: ConfirmDialogService,
    private readonly errorModalService: ErrorModalService
  ) {
    this.destroyRef.onDestroy(() => {
      if (this.loadingTimer) {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = null;
      }
    });
  }

  ngOnInit(): void {
    if (this.projectId && this.serverFiles.length === 0 && !this.loading) {
      this.fetchFiles();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['projectId']) {
      return;
    }

    if (!this.projectId) {
      this.serverFiles = [];
      return;
    }

    this.fetchFiles();
  }

  get files(): FileEntry[] {
    return this.serverFiles;
  }

  onAddFile(): void {
    if (this.saving) {
      return;
    }

    this.fileInput?.open();
  }

  onUploadSelected(file: File): void {
    if (!this.projectId || this.saving) {
      return;
    }

    if (file.size > FilesTabComponent.MAX_UPLOAD_SIZE_BYTES) {
      this.errorModalService.showError({
        level: 1,
        title: 'File too large',
        message: 'Maximum upload size is 50 MB.',
        errorCode: 'ERR_FILE_UPLOAD'
      });
      return;
    }

    this.saving = true;
    this.projectService.uploadFile(this.projectId, file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (files) => {
        this.serverFiles = files;
      },
      error: (err: unknown) => {
        this.saving = false;
        const typed = err as { type?: string };
        if (typed?.type === 'FILE_TOO_LARGE') {
          this.errorModalService.showError({
            level: 1,
            title: 'File too large',
            message: 'The selected file exceeds the maximum upload size of 50 MB.',
            errorCode: 'ERR_FILE_UPLOAD'
          });
        }
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  onDownloadRequested(fileId: number): void {
    if (!this.projectId) {
      return;
    }

    const entry = this.serverFiles.find((file) => file.id === fileId);
    if (!entry) {
      return;
    }

    const url = entry.downloadUrl;
    window.open(url, '_blank');
  }

  onDeleteRequested(fileId: number): void {
    if (!this.projectId || this.saving) {
      return;
    }

    const projectId = this.projectId;

    this.confirmDialog
      .open({
        title: 'Delete file',
        message: 'This will permanently remove this file from the project.'
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.saving = true;
        this.projectService.deleteFile(projectId, fileId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (files) => {
            this.serverFiles = files;
          },
          error: () => {
            this.saving = false;
          },
          complete: () => {
            this.saving = false;
          }
        });
      });
  }

  private fetchFiles(): void {
    if (!this.projectId) {
      return;
    }

    this.loading = true;
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
    this.projectService.getFiles(this.projectId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (files) => {
        this.serverFiles = files;
      },
      error: () => {
        this.serverFiles = [];
        this.finalizeLoading();
      },
      complete: () => {
        this.finalizeLoading();
      }
    });
  }

  private finalizeLoading(): void {
    this.loadingTimer = setTimeout(() => {
      this.loading = false;
      this.loadingTimer = null;
    }, 200);
  }
}
