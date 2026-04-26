import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FileEntry } from '@core/models/file.model';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { DividerComponent } from '../../../../ui/base/divider/divider.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';

@Component({
  selector: 'dpo-file-row',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, DividerComponent],
  templateUrl: './file-row.component.html',
  styleUrl: './file-row.component.scss'
})
export class FileRowComponent {
  @Input({ required: true }) file!: FileEntry;
  @Input() disabled = false;

  @Output() downloadRequested = new EventEmitter<number>();
  @Output() deleteRequested = new EventEmitter<number>();

  get fileSizeLabel(): string {
    if (!Number.isFinite(this.file.sizeBytes) || this.file.sizeBytes <= 0) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let value = this.file.sizeBytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    const precision = unitIndex === 0 ? 0 : 1;
    return `${value.toFixed(precision)} ${units[unitIndex]}`;
  }

  onDownloadClick(): void {
    this.downloadRequested.emit(this.file.id);
  }

  onDeleteClick(): void {
    this.deleteRequested.emit(this.file.id);
  }
}
