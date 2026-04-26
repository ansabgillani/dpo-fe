import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProjectSummary } from '@core/models/project.model';
import { ProjectPreviewComponent } from './project-preview.component';

describe('ProjectPreviewComponent', () => {
  let component: ProjectPreviewComponent;
  let fixture: ComponentFixture<ProjectPreviewComponent>;

  const project: ProjectSummary = {
    id: 4,
    name: 'AI Triage Expansion',
    department: 'LMS',
    businessLine: 'XR',
    type: 'Program',
    startDate: '2025-03-05',
    endDate: '2025-11-20',
    statusProject: 'Active',
    pspProjects: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPreviewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not emit open event when no project is selected', () => {
    const spy = jest.spyOn(component.openProject, 'emit');

    component.onOpenProject();

    expect(spy).not.toHaveBeenCalled();
  });

  it('emits open event when project is selected', () => {
    const spy = jest.spyOn(component.openProject, 'emit');
    component.project = project;

    component.onOpenProject();

    expect(spy).toHaveBeenCalledWith(4);
  });
});
