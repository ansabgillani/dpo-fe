import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ProjectSummary } from '@core/models/project.model';
import { ProjectService } from '@core/services/project.service';
import { ButtonComponent } from '../../ui/base/button/button.component';
import { IconComponent } from '../../ui/base/icon/icon.component';
import { SkeletonBlockComponent } from '../../ui/base/skeleton-block/skeleton-block.component';
import { PageShellComponent } from '../../ui/layouts/page-shell/page-shell.component';
import { ThreeColumnLayoutComponent } from '../../ui/layouts/three-column-layout/three-column-layout.component';
import { ProjectSelectorComponent } from './components/project-selector/project-selector.component';
import { ProjectSidebarComponent } from './components/project-sidebar/project-sidebar.component';
import { SkeletonKpiGridComponent } from './components/skeleton-kpi-grid/skeleton-kpi-grid.component';
import { SkeletonSidebarComponent } from './components/skeleton-sidebar/skeleton-sidebar.component';
import { SkeletonStateGridComponent } from './components/skeleton-state-grid/skeleton-state-grid.component';
import { TabNavComponent } from './components/tab-nav/tab-nav.component';
import { MilestoneTabComponent } from './tabs/milestone/milestone-tab.component';
import { OverviewComponent } from './tabs/overview/overview.component';
import { CostTabComponent } from './tabs/cost/cost-tab.component';
import { StateTabComponent } from './tabs/state/state-tab.component';
import { RiskTabComponent } from './tabs/risk/risk-tab.component';
import { FilesTabComponent } from './tabs/files/files-tab.component';

@Component({
  selector: 'dpo-project-details',
  standalone: true,
  imports: [
    CommonModule,
    PageShellComponent,
    ThreeColumnLayoutComponent,
    ProjectSelectorComponent,
    TabNavComponent,
    ProjectSidebarComponent,
    SkeletonKpiGridComponent,
    SkeletonSidebarComponent,
    SkeletonBlockComponent,
    SkeletonStateGridComponent,
    ButtonComponent,
    IconComponent,
    OverviewComponent,
    StateTabComponent,
    MilestoneTabComponent,
    CostTabComponent,
    RiskTabComponent,
    FilesTabComponent
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly tabs = ['Overview', 'State', 'Milestone', 'Cost', 'Risk', 'Files'];

  projects: ProjectSummary[] = [];
  project: ProjectSummary | null = null;

  selectedProjectId: number | null = null;
  activeTabIndex = 0;

  projectsLoading = false;
  detailLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.activeTabIndex = this.projectService.getActiveTabIndex();
    this.loadProjects();

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.onRouteParamChange(params);
    });
  }

  onProjectSelected(projectId: number): void {
    if (projectId === this.selectedProjectId) {
      return;
    }

    void this.router.navigate(['/project', projectId]);
  }

  onTabSelected(index: number): void {
    this.activeTabIndex = index;
    this.projectService.setActiveTabIndex(index);
  }

  onNavigateToProjects(): void {
    void this.router.navigate(['/projects']);
  }

  private onRouteParamChange(params: ParamMap): void {
    const id = Number(params.get('id'));

    if (Number.isNaN(id) || id <= 0) {
      this.project = null;
      return;
    }

    this.selectedProjectId = id;
    this.loadProjectDetail(id);
  }

  private loadProjects(): void {
    this.projectsLoading = true;
    this.projectService.getProjects().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: () => {
        this.projects = [];
      },
      complete: () => {
        this.projectsLoading = false;
      }
    });
  }

  private loadProjectDetail(projectId: number): void {
    this.detailLoading = true;
    this.projectService.getProjectDetail(projectId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: () => {
        this.project = null;
      },
      complete: () => {
        this.detailLoading = false;
      }
    });
  }
}
