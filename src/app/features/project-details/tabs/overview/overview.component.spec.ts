import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProjectService } from '@core/services/project.service';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  const projectService = {
    getStateCards: jest.fn(() =>
      of([
        {
          id: 'quality',
          key: 'quality',
          label: 'Quality',
          value: 84,
          previousValue: 80,
          narrative: 'Stable quality trend.'
        },
        {
          id: 'budget',
          key: 'budget',
          label: 'Budget',
          value: 98,
          previousValue: 95,
          narrative: 'On track.'
        },
        {
          id: 'targetCost',
          key: 'target-cost',
          label: 'Target Cost',
          value: 103,
          previousValue: 100,
          narrative: 'Slightly up.'
        },
        {
          id: 'resources',
          key: 'resources',
          label: 'Resources',
          value: 90,
          previousValue: 88,
          narrative: 'Healthy staffing.'
        },
        {
          id: 'timeline',
          key: 'timeline',
          label: 'Timeline',
          value: 5,
          previousValue: 2,
          narrative: 'Minor delay.'
        },
        {
          id: 'customerSatisfaction',
          key: 'customer-satisfaction',
          label: 'Customer Satisfaction',
          value: 76,
          previousValue: 74,
          narrative: 'Improving.'
        }
      ])
    ),
    getOverviewChartData: jest.fn(() =>
      of({
        datasets: [
          {
            label: 'Budget',
            color: 'rgb(0, 160, 175)',
            data: [30, 15, 25, 45, 42, 35, 100, 88, 79, 63, 80, 120]
          },
          {
            label: 'Actuals+Forecasts',
            color: 'rgb(232, 119, 34)',
            data: [0, 10, 15, 43, 41, 50, 96, 84, 70, 60, 70, 125]
          },
          {
            label: 'Charging Actuals+Forecasts',
            color: 'rgb(0, 112, 192)',
            data: [35, 18, 27, 44, 41, 35, 96, 85, 79, 62, 79, 118]
          }
        ]
      })
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [{ provide: ProjectService, useValue: projectService }]
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
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

  it('fetches state cards when project id changes', () => {
    expect(projectService.getStateCards).toHaveBeenCalledWith(1);
    expect(projectService.getOverviewChartData).toHaveBeenCalledWith(1);
    expect(component.kpis).toHaveLength(6);
  });

  it('derives status tier from card value', () => {
    const timeline = component.kpis.find((kpi) => kpi.id === 'timeline');
    const quality = component.kpis.find((kpi) => kpi.id === 'quality');

    expect(quality?.statusTier).toBe('green');
    expect(timeline?.statusTier).toBe('red');
  });

  it('builds chart datasets', () => {
    expect(component.budgetDatasets).toHaveLength(3);
    expect(component.budgetDatasets[0].label).toBe('Budget');
  });

  it('shows local chart error state when chart API fails', () => {
    projectService.getOverviewChartData.mockReturnValueOnce(
      throwError(() => new Error('chart endpoint failed'))
    );

    component.projectId = 2;
    component.ngOnChanges({
      projectId: {
        previousValue: 1,
        currentValue: 2,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(component.chartHasError).toBe(true);
    expect(element.querySelector('[data-cy="overview-chart-error"]')).toBeTruthy();
  });
});
