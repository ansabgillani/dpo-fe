import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { CostBarChartComponent } from './cost-bar-chart.component';

describe('CostBarChartComponent', () => {
  let component: CostBarChartComponent;
  let fixture: ComponentFixture<CostBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostBarChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CostBarChartComponent);
    component = fixture.componentInstance;
    component.groups = ['Forecast', 'Budget', 'Actuals', 'FC + Actuals'];
    component.datasets = [
      { label: 'Charging to BL', data: [8, 9, 10, 11], color: 'rgb(0, 176, 80)' },
      { label: 'Gross', data: [10, 11, 12, 13], color: 'rgb(232, 119, 34)' },
      { label: 'NET', data: [7, 8, 9, 10], color: 'rgb(0, 112, 192)' }
    ];
    fixture.detectChanges();
  });

  it('builds bar datasets for chart rendering', () => {
    expect(component.data.labels).toHaveLength(4);
    expect(component.data.datasets).toHaveLength(3);
  });
});