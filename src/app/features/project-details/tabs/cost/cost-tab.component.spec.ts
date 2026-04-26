import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProjectService } from '@core/services/project.service';
import { CostTabComponent } from './cost-tab.component';

describe('CostTabComponent', () => {
  let component: CostTabComponent;
  let fixture: ComponentFixture<CostTabComponent>;

  const costData = {
    projectCost: 1345000,
    latestReportingPeriod: 'P01',
    project: 'Project A',
    fy: 'FY26',
    pspProject: 'PSP-1',
    breakdownMode: 'product' as const,
    overview: {
      actuals: { gross: 12000, chargingToBL: 9600, net: 9000 },
      budget: { gross: 11800, chargingToBL: 9300, net: 8800 },
      forecasts: { gross: 12500, chargingToBL: 10000, net: 9400 },
      forecastsPlusActuals: { gross: 12700, chargingToBL: 10200, net: 9600 },
      barChart: {
        groups: ['Forecast', 'Budget', 'Actuals', 'FC + Actuals'],
        datasets: [
          { label: 'Charging to BL', data: [9, 10, 11, 12], color: 'rgb(0,176,80)' },
          { label: 'Gross', data: [11, 12, 13, 14], color: 'rgb(232,119,34)' },
          { label: 'NET', data: [8, 9, 10, 11], color: 'rgb(0,112,192)' }
        ]
      }
    },
    monthly: {
      actuals: [{ period: 'P01', gross: 100, chargingToBL: 80, net: 70 }],
      budget: [{ period: 'P01', gross: 102, chargingToBL: 82, net: 72 }],
      forecastsPlusActuals: [{ period: 'P01', gross: 104, chargingToBL: 84, net: 74 }]
    },
    breakdown: {
      products: [
        {
          id: 'prod-1',
          name: 'Product 1',
          target: 12345,
          actual: 12020,
          calculationDate: '2025-05-10',
          trendDirection: 'up' as const,
          trendPercent: 23
        }
      ],
      lineChart: {
        budget: Array.from({ length: 12 }, (_, index) => 90 + index),
        actualsAndForecasts: Array.from({ length: 12 }, (_, index) => 88 + index),
        chargingActualsAndForecasts: Array.from({ length: 12 }, (_, index) => 86 + index)
      },
      periodDetail: [
        {
          period: 'P01',
          gross: 110,
          chargingToInternal: 12,
          ctCosts: 7,
          externalMaterial: 15,
          internalMaterial: 8,
          chargingToBL: 95,
          net: 72
        }
      ]
    }
  };

  const projectService = {
    getCostData: jest.fn(() => of(costData)),
    getStateCards: jest.fn(() => of([
      {
        id: 'targetCost',
        key: 'target-cost',
        label: 'Target Cost',
        value: 2500,
        previousValue: 2000,
        narrative: 'Target cost updated.'
      }
    ])),
    updateCostBreakdown: jest.fn(() => of(costData)),
    getActiveCostSubViewIndex: jest.fn(() => 0),
    setActiveCostSubViewIndex: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostTabComponent],
      providers: [{ provide: ProjectService, useValue: projectService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CostTabComponent);
    component = fixture.componentInstance;
    component.projectId = 1;
    component.ngOnInit();
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

  it('fetches cost data when project changes', () => {
    expect(projectService.getCostData).toHaveBeenCalledWith(1, {
      project: undefined,
      fy: undefined,
      pspProject: undefined,
      breakdownMode: 'project'
    });
    expect(projectService.getStateCards).toHaveBeenCalledWith(1);
    expect(component.costData?.latestReportingPeriod).toBe('P01');
  });

  it('uses state target-cost for top card in product mode', () => {
    component.breakdownMode = 'product';

    expect(component.topCostCardTitle).toBe('Product Cost');
    expect(component.topCostLabel).toBe('2.500 k€');
  });

  it('uses project cost for top card in project mode', () => {
    component.breakdownMode = 'project';

    expect(component.topCostCardTitle).toBe('Project Cost');
    expect(component.topCostLabel).toBe('1.345 Million €');
  });

  it('shows FY/PSP filters and reporting period in project mode', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelector('[data-cy="cost-filter-project"]')).toBeNull();
    expect(nativeElement.querySelector('[data-cy="cost-filter-fy"]')).not.toBeNull();
    expect(nativeElement.querySelector('[data-cy="cost-filter-psp-project"]')).not.toBeNull();
    expect(nativeElement.querySelector('[data-cy="cost-reporting-period"]')).not.toBeNull();
  });

  it('hides project-only filters and reporting period in product mode', () => {
    component.breakdownMode = 'product';
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelector('[data-cy="cost-filter-project"]')).toBeNull();
    expect(nativeElement.querySelector('[data-cy="cost-filter-fy"]')).toBeNull();
    expect(nativeElement.querySelector('[data-cy="cost-filter-psp-project"]')).toBeNull();
    expect(nativeElement.querySelector('[data-cy="cost-reporting-period"]')).toBeNull();
  });

  it('persists sub-view index through service', () => {
    component.onSubViewChange('monthly');

    expect(projectService.setActiveCostSubViewIndex).toHaveBeenCalledWith(1);
  });
});