import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { of } from 'rxjs';

import { CreateProjectPayload, DEFAULT_FILTER_VALUES } from '@core/models/project.model';
import { FilterStateService } from '@core/services/filter-state.service';
import { ProjectService } from '@core/services/project.service';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  const filterStateService = {
    getFilterValues: jest.fn(() => ({ ...DEFAULT_FILTER_VALUES })),
    setFilterValues: jest.fn(),
    getSelectedProjectId: jest.fn(() => null),
    setSelectedProjectId: jest.fn()
  };

  const projectService = {
    getFilters: jest.fn(() =>
      of({
        departments: ['DIC'],
        businessLines: ['XP'],
        types: ['SSP']
      })
    ),
    getProjects: jest.fn(() =>
      of([
        {
          id: 1,
          name: 'Imaging Platform Modernization',
          department: 'DIC',
          businessLine: 'XP',
          type: 'SSP',
          startDate: '2025-01-10',
          endDate: '2025-11-30',
          statusProject: 'Active',
          pspProjects: []
        }
      ])
    ),
    createProject: jest.fn(() =>
      of({
        id: 9,
        name: 'New Project',
        department: 'DIC',
        businessLine: 'XP',
        type: 'SSP',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        statusProject: 'Planning',
        pspProjects: []
      })
    )
  };

  const router = {
    navigate: jest.fn(() => Promise.resolve(true))
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        { provide: FilterStateService, useValue: filterStateService },
        { provide: ProjectService, useValue: projectService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads filters and projects on init', () => {
    expect(projectService.getFilters).toHaveBeenCalled();
    expect(projectService.getProjects).toHaveBeenCalled();
    expect(component.projects.length).toBeGreaterThan(0);
  });

  it('opens and closes create project modal', () => {
    component.onOpenCreateProjectModal();
    expect(component.createProjectModalOpen).toBe(true);

    component.onCloseCreateProjectModal();
    expect(component.createProjectModalOpen).toBe(false);
  });

  it('creates project and refetches projects list', () => {
    const payload: CreateProjectPayload = {
      title: 'New Project',
      department: 'DIC',
      businessLine: 'XP',
      type: 'SSP',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      pspElements: []
    };

    component.onOpenCreateProjectModal();
    component.onCreateProject(payload);

    expect(projectService.createProject).toHaveBeenCalledWith(payload);
    expect(filterStateService.setSelectedProjectId).toHaveBeenCalledWith(9);
    expect(component.createProjectModalOpen).toBe(false);
    expect(projectService.getProjects.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
