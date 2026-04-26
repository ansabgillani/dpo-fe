import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProjectSummary } from '@core/models/project.model';
import { AvatarComponent } from '../../../../ui/base/avatar/avatar.component';
import { ButtonComponent } from '../../../../ui/base/button/button.component';

@Component({
  selector: 'dpo-project-card',
  standalone: true,
  imports: [CommonModule, AvatarComponent, ButtonComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: ProjectSummary;
  @Input() selected = false;

  @Output() select = new EventEmitter<number>();
  @Output() open = new EventEmitter<number>();

  onSelect(): void {
    this.select.emit(this.project.id);
  }

  onOpen(): void {
    this.open.emit(this.project.id);
  }

  getInitials(): string {
    const parts = this.project.name.split(' ').filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
  }
}
