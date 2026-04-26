import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProjectSummary } from '@core/models/project.model';
import { AvatarComponent } from '../../../../ui/base/avatar/avatar.component';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-project-preview',
  standalone: true,
  imports: [CommonModule, AvatarComponent, ButtonComponent, SkeletonBlockComponent],
  templateUrl: './project-preview.component.html',
  styleUrl: './project-preview.component.scss'
})
export class ProjectPreviewComponent {
  @Input() project: ProjectSummary | null = null;
  @Input() loading = false;

  @Output() openProject = new EventEmitter<number>();

  onOpenProject(): void {
    if (!this.project) {
      return;
    }

    this.openProject.emit(this.project.id);
  }

  getInitials(): string {
    if (!this.project) {
      return 'PR';
    }

    const parts = this.project.name.split(' ').filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
  }
}
