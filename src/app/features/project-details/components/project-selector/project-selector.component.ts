import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProjectSummary } from '@core/models/project.model';
import { SelectComponent } from '../../../../ui/base/select/select.component';

@Component({
  selector: 'dpo-project-selector',
  standalone: true,
  imports: [CommonModule, SelectComponent],
  templateUrl: './project-selector.component.html',
  styleUrl: './project-selector.component.scss'
})
export class ProjectSelectorComponent {
  @Input() projects: ProjectSummary[] = [];
  @Input() selectedProjectId: number | null = null;

  @Output() projectSelected = new EventEmitter<number>();

  get options() {
    return this.projects.map((project) => ({
      label: project.name,
      value: String(project.id)
    }));
  }

  get selectedValue(): string {
    return this.selectedProjectId !== null ? String(this.selectedProjectId) : '';
  }

  onProjectChange(value: string): void {
    const projectId = Number(value);
    if (!Number.isNaN(projectId)) {
      this.projectSelected.emit(projectId);
    }
  }
}
