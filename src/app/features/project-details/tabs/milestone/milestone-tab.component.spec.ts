import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProjectService } from '@core/services/project.service';
import { MilestoneTabComponent } from './milestone-tab.component';

describe('MilestoneTabComponent', () => {
  let component: MilestoneTabComponent;
  let fixture: ComponentFixture<MilestoneTabComponent>;

  const milestones = [
    {
      id: 1,
      milestoneSet: 'MP',
      name: 'Architecture Complete',
      startDate: '2025-02-01',
      endDate: '2025-02-18'
    }
  ];

  const projectService = {
    getMilestoneSets: jest.fn(() => of(['MP', 'BL'])),
    getMilestones: jest.fn(() => of(milestones)),
    updateMilestone: jest.fn(() => of(milestones))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneTabComponent],
      providers: [{ provide: ProjectService, useValue: projectService }]
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneTabComponent);
    component = fixture.componentInstance;
    component.projectId = 1;
    component.ngOnChanges({
      projectId: {
        previousValue: null,
        currentValue: 1,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    fixture.detectChanges();
  });

  it('fetches milestone sets and milestones on project change', () => {
    expect(projectService.getMilestoneSets).toHaveBeenCalledTimes(1);
    expect(projectService.getMilestones).toHaveBeenCalledWith(1, undefined);
    expect(component.milestones).toHaveLength(1);
  });

  it('refetches milestones when milestone set changes', () => {
    component.onMilestoneSetChange('MP');
    expect(projectService.getMilestones).toHaveBeenCalledWith(1, 'MP');
  });

  it('updates milestone date via service and refreshes list', () => {
    component.onStartDateChange({ milestoneId: 1, date: '2025-02-02' });

    expect(projectService.updateMilestone).toHaveBeenCalledWith(
      1,
      1,
      { startDate: '2025-02-02' }
    );
  });
});
