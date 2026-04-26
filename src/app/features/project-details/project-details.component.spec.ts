import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProjectService } from '@core/services/project.service';
import { ProjectDetailsComponent } from './project-details.component';

describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectDetailsComponent>;

  const paramMap$ = new BehaviorSubject(convertToParamMap({ id: '1' }));

  const router = {
    navigate: jest.fn(() => Promise.resolve(true))
  };

  const projectService = {
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
    getProjectDetail: jest.fn(() =>
      of({
        id: 1,
        name: 'Imaging Platform Modernization',
        department: 'DIC',
        businessLine: 'XP',
        type: 'SSP',
        startDate: '2025-01-10',
        endDate: '2025-11-30',
        statusProject: 'Active',
        pspProjects: []
      })
    ),
    getStateCards: jest.fn(() => of([])),
    getActiveTabIndex: jest.fn(() => 0),
    setActiveTabIndex: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMap$.asObservable()
          }
        },
        { provide: Router, useValue: router },
        { provide: ProjectService, useValue: projectService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads project detail on route id change', () => {
    expect(projectService.getProjectDetail).toHaveBeenCalledWith(1);
    expect(component.selectedProjectId).toBe(1);
  });

  it('navigates when selected project changes', () => {
    component.selectedProjectId = 1;

    component.onProjectSelected(2);

    expect(router.navigate).toHaveBeenCalledWith(['/project', 2]);
  });

  it('updates active tab in service', () => {
    component.onTabSelected(3);

    expect(component.activeTabIndex).toBe(3);
    expect(projectService.setActiveTabIndex).toHaveBeenCalledWith(3);
  });

  it('navigates to projects landing route', () => {
    component.onNavigateToProjects();

    expect(router.navigate).toHaveBeenCalledWith(['/projects']);
  });

  it('handles detail loading errors', () => {
    projectService.getProjectDetail.mockReturnValue(throwError(() => new Error('fail')));
    component.project = {
      id: 3,
      name: 'Remote Workflow Assistant',
      department: 'DIC',
      businessLine: 'MR',
      type: 'SSP',
      startDate: '2025-02-10',
      endDate: '2025-10-01',
      statusProject: 'Planning',
      pspProjects: []
    };

    paramMap$.next(convertToParamMap({ id: '2' }));
    fixture.detectChanges();

    expect(component.project).toBeNull();
  });
});