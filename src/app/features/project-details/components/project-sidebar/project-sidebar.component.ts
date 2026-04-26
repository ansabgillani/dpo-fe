import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ProjectSummary } from '@core/models/project.model';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { ProjectService } from '@core/services/project.service';
import { AvatarComponent } from '../../../../ui/base/avatar/avatar.component';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { FileInputComponent } from '../../../../ui/base/file-input/file-input.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { InputComponent } from '../../../../ui/base/input/input.component';
import { InlineEditFieldComponent } from '../inline-edit-field/inline-edit-field.component';

@Component({
  selector: 'dpo-project-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    IconComponent,
    InlineEditFieldComponent,
    InputComponent,
    ButtonComponent,
    FileInputComponent
  ],
  templateUrl: './project-sidebar.component.html',
  styleUrl: './project-sidebar.component.scss'
})
export class ProjectSidebarComponent {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('avatarFileInput') private avatarFileInput?: FileInputComponent;

  @Input() project: ProjectSummary | null = null;

  activeEditField: string | null = null;
  isAddingPsp = false;
  newPspName = '';
  isEditingTitle = false;
  titleDraft = '';
  avatarSaving = false;

  constructor(
    private readonly projectService: ProjectService,
    private readonly confirmDialogService: ConfirmDialogService
  ) {}

  getInitials(): string {
    if (!this.project) {
      return 'PR';
    }

    const parts = this.project.name.split(' ').filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
  }

  startEditing(fieldKey: string): void {
    this.activeEditField = fieldKey;

    if (fieldKey !== 'title') {
      this.isEditingTitle = false;
    }
  }

  stopEditing(fieldKey: string): void {
    if (this.activeEditField === fieldKey) {
      this.activeEditField = null;
    }
  }

  saveDepartment = (value: string): Observable<void> => this.saveMetadataField('department', value);
  saveBusinessLine = (value: string): Observable<void> => this.saveMetadataField('businessLine', value);
  saveType = (value: string): Observable<void> => this.saveMetadataField('type', value);
  saveStartDate = (value: string): Observable<void> => this.saveMetadataField('startDate', value);
  saveEndDate = (value: string): Observable<void> => this.saveMetadataField('endDate', value);
  saveStatus = (value: string): Observable<void> => this.saveMetadataField('statusProject', value);

  getPspSaveFn(pspId: number): (value: string) => Observable<void> {
    return (value: string) => this.savePspProject(pspId, value);
  }

  onStartAddPsp(): void {
    this.activeEditField = 'psp-new';
    this.isAddingPsp = true;
    this.newPspName = '';
  }

  onStartEditTitle(): void {
    if (!this.project) {
      return;
    }

    this.isEditingTitle = true;
    this.titleDraft = this.project.name;
    this.activeEditField = 'title';
  }

  onTitleDraftChange(value: string): void {
    this.titleDraft = value;
  }

  onCancelEditTitle(): void {
    this.isEditingTitle = false;
    this.titleDraft = this.project?.name || '';

    if (this.activeEditField === 'title') {
      this.activeEditField = null;
    }
  }

  onSaveTitle(): void {
    if (!this.project) {
      return;
    }

    const nextTitle = this.titleDraft.trim();

    if (!nextTitle) {
      return;
    }

    this.projectService.updateMetadata(this.project.id, 'name', nextTitle).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updatedProject) => {
        this.project = updatedProject;
        this.onCancelEditTitle();
      },
      error: () => {
        this.onCancelEditTitle();
      }
    });
  }

  onAvatarEditClick(): void {
    if (this.avatarSaving) {
      return;
    }

    this.avatarFileInput?.open();
  }

  async onAvatarFileSelected(file: File): Promise<void> {
    if (!this.project) {
      return;
    }

    this.avatarSaving = true;

    try {
      const avatarUrl = await this.readFileAsDataUrl(file);

      this.projectService.updateMetadata(this.project.id, 'avatarUrl', avatarUrl).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (updatedProject) => {
          this.project = updatedProject;
        },
        error: () => {
          this.avatarSaving = false;
        },
        complete: () => {
          this.avatarSaving = false;
        }
      });
    } catch {
      this.avatarSaving = false;
    }
  }

  onCancelAddPsp(): void {
    this.isAddingPsp = false;
    this.newPspName = '';
    if (this.activeEditField === 'psp-new') {
      this.activeEditField = null;
    }
  }

  onConfirmAddPsp(): void {
    if (!this.project) {
      return;
    }

    const name = this.newPspName.trim();
    if (!name) {
      return;
    }

    this.projectService.addPspProject(this.project.id, name).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updatedProject) => {
        this.project = updatedProject;
        this.onCancelAddPsp();
      },
      error: () => {
        this.onCancelAddPsp();
      }
    });
  }

  onDeletePspProject(pspId: number, pspName: string): void {
    if (!this.project) {
      return;
    }

    this.confirmDialogService
      .open({
        title: 'Delete PSP Project',
        message: `This will permanently remove ${pspName} from the project.`
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.projectService.deletePspProject(this.project!.id, pspId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (updatedProject) => {
            this.project = updatedProject;
          }
        });
      });
  }

  private saveMetadataField(field: string, value: string): Observable<void> {
    if (!this.project) {
      return of(undefined);
    }

    return this.projectService.updateMetadata(this.project.id, field, value).pipe(
      tap((updatedProject) => {
        this.project = updatedProject;
        this.activeEditField = null;
      }),
      map(() => undefined)
    );
  }

  private savePspProject(pspId: number, value: string): Observable<void> {
    if (!this.project) {
      return of(undefined);
    }

    const nextProjects = this.project.pspProjects.map((item) =>
      item.id === pspId ? { ...item, name: value } : item
    );

    return this.projectService.updateMetadata(this.project.id, 'pspProjects', nextProjects).pipe(
      tap((updatedProject) => {
        this.project = updatedProject;
        this.activeEditField = null;
      }),
      map(() => undefined)
    );
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
          return;
        }

        reject(new Error('Unable to read image'));
      };

      reader.onerror = () => {
        reject(new Error('Unable to read image'));
      };

      reader.readAsDataURL(file);
    });
  }
}
