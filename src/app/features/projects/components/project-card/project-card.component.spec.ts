import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProjectSummary } from '@core/models/project.model';
import { ProjectCardComponent } from './project-card.component';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  const project: ProjectSummary = {
    id: 1,
    name: 'Imaging Platform Modernization',
    department: 'DIC',
    businessLine: 'XP',
    type: 'SSP',
    startDate: '2025-01-10',
    endDate: '2025-11-30',
    statusProject: 'Active',
    pspProjects: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    component.project = project;
    fixture.detectChanges();
  });

  it('emits project id on select', () => {
    const spy = jest.spyOn(component.select, 'emit');

    component.onSelect();

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('emits project id on open', () => {
    const spy = jest.spyOn(component.open, 'emit');

    component.onOpen();

    expect(spy).toHaveBeenCalledWith(1);
  });
});
