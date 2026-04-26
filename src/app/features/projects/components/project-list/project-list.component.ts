import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProjectSummary } from '@core/models/project.model';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';

@Component({
  selector: 'dpo-project-list',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, SkeletonCardComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  @Input() projects: ProjectSummary[] = [];
  @Input() loading = false;
  @Input() selectedProjectId: number | null = null;

  @Output() selectProject = new EventEmitter<number>();
  @Output() openProject = new EventEmitter<number>();

  onSelectProject(projectId: number): void {
    this.selectProject.emit(projectId);
  }

  onOpenProject(projectId: number): void {
    this.openProject.emit(projectId);
  }
}
