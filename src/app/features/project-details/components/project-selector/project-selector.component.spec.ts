import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProjectSelectorComponent } from './project-selector.component';

describe('ProjectSelectorComponent', () => {
  let component: ProjectSelectorComponent;
  let fixture: ComponentFixture<ProjectSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSelectorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('maps projects to select options', () => {
    component.projects = [
      {
        id: 10,
        name: 'Cloud PACS Migration',
        department: 'DAS',
        businessLine: 'CT',
        type: 'Platform',
        startDate: '2025-01-20',
        endDate: '2025-12-15',
        statusProject: 'Active',
        pspProjects: []
      }
    ];

    expect(component.options).toEqual([{ label: 'Cloud PACS Migration', value: '10' }]);
  });

  it('emits selected project id for numeric values', () => {
    const spy = jest.spyOn(component.projectSelected, 'emit');

    component.onProjectChange('3');

    expect(spy).toHaveBeenCalledWith(3);
  });

  it('does not emit when value is not numeric', () => {
    const spy = jest.spyOn(component.projectSelected, 'emit');

    component.onProjectChange('not-a-number');

    expect(spy).not.toHaveBeenCalled();
  });
});