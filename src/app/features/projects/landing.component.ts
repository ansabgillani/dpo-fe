import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import {
  CreateProjectPayload,
  DEFAULT_FILTER_VALUES,
  FilterOptions,
  FilterValues,
  ProjectSummary
} from '@core/models/project.model';
import { FilterStateService } from '@core/services/filter-state.service';
import { ProjectService } from '@core/services/project.service';
import { ButtonComponent } from '../../ui/base/button/button.component';
import { PageShellComponent } from '../../ui/layouts/page-shell/page-shell.component';
import { ThreeColumnLayoutComponent } from '../../ui/layouts/three-column-layout/three-column-layout.component';
import { CreateProjectModalComponent } from './components/create-project-modal/create-project-modal.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectPreviewComponent } from './components/project-preview/project-preview.component';

@Component({
  selector: 'dpo-landing',
  standalone: true,
  imports: [
    PageShellComponent,
    ThreeColumnLayoutComponent,
    ButtonComponent,
    FilterPanelComponent,
    ProjectListComponent,
    ProjectPreviewComponent,
    CreateProjectModalComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  filterOptions: FilterOptions = {
    departments: [],
    businessLines: [],
    types: []
  };
  filterValues: FilterValues = { ...DEFAULT_FILTER_VALUES };
  projects: ProjectSummary[] = [];

  filtersLoading = false;
  projectsLoading = false;
  createProjectSaving = false;

  selectedProject: ProjectSummary | null = null;
  createProjectModalOpen = false;

  constructor(
    private readonly filterStateService: FilterStateService,
    private readonly projectService: ProjectService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.filterValues = this.filterStateService.getFilterValues();
    this.loadFilters();
    this.loadProjects(this.filterValues);
  }

  onValuesChange(values: FilterValues): void {
    this.filterValues = values;
    this.filterStateService.setFilterValues(values);
  }

  onSearch(): void {
    this.filterStateService.setFilterValues(this.filterValues);
    this.loadProjects(this.filterValues);
  }

  onReset(): void {
    this.filterValues = { ...DEFAULT_FILTER_VALUES };
    this.filterStateService.setFilterValues(this.filterValues);
    this.loadProjects(this.filterValues);
  }

  onSelectProject(projectId: number): void {
    this.selectedProject = this.projects.find((project) => project.id === projectId) ?? null;
    this.filterStateService.setSelectedProjectId(projectId);
  }

  onOpenProject(projectId: number): void {
    void this.router.navigate(['/project', projectId]);
  }

  onOpenCreateProjectModal(): void {
    this.createProjectModalOpen = true;
  }

  onCloseCreateProjectModal(): void {
    if (this.createProjectSaving) {
      return;
    }

    this.createProjectModalOpen = false;
  }

  onCreateProject(payload: CreateProjectPayload): void {
    if (this.createProjectSaving) {
      return;
    }

    this.createProjectSaving = true;
    this.projectService.createProject(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (project) => {
        this.filterStateService.setSelectedProjectId(project.id);
        this.createProjectModalOpen = false;
        this.loadProjects(this.filterValues);
      },
      error: () => {
        this.createProjectSaving = false;
      },
      complete: () => {
        this.createProjectSaving = false;
      }
    });
  }

  private loadFilters(): void {
    this.filtersLoading = true;
    this.projectService.getFilters().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (options) => {
        this.filterOptions = options;
      },
      error: () => {
        this.filterOptions = {
          departments: [],
          businessLines: [],
          types: []
        };
      },
      complete: () => {
        this.filtersLoading = false;
      }
    });
  }

  private loadProjects(filters: FilterValues): void {
    this.projectsLoading = true;
    this.projectService.getProjects(filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.resolveSelectedProject();
      },
      error: () => {
        this.projects = [];
        this.selectedProject = null;
      },
      complete: () => {
        this.projectsLoading = false;
      }
    });
  }

  private resolveSelectedProject(): void {
    const selectedProjectId = this.filterStateService.getSelectedProjectId();

    if (selectedProjectId !== null) {
      this.selectedProject = this.projects.find((project) => project.id === selectedProjectId) ?? null;

      if (this.selectedProject) {
        return;
      }
    }

    this.selectedProject = this.projects[0] ?? null;
    this.filterStateService.setSelectedProjectId(this.selectedProject?.id ?? null);
  }
}
