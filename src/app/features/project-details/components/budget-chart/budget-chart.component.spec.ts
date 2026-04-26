import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { BudgetChartComponent } from './budget-chart.component';

describe('BudgetChartComponent', () => {
  let component: BudgetChartComponent;
  let fixture: ComponentFixture<BudgetChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetChartComponent);
    component = fixture.componentInstance;
    component.datasets = [
      { label: 'Budget', data: [1, 2, 3] },
      { label: 'Actuals+Forecasts', data: [2, 3, 4] },
      { label: 'Charging Actuals+Forecasts', data: [3, 4, 5] }
    ];
    fixture.detectChanges();
  });

  it('creates line chart data from datasets', () => {
    expect(component.data.datasets).toHaveLength(3);
    expect(component.data.labels).toHaveLength(12);
  });
});
