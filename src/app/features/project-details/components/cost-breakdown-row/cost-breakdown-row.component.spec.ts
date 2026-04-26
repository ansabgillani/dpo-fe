import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { CostBreakdownRowComponent } from './cost-breakdown-row.component';

describe('CostBreakdownRowComponent', () => {
  let component: CostBreakdownRowComponent;
  let fixture: ComponentFixture<CostBreakdownRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostBreakdownRowComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CostBreakdownRowComponent);
    component = fixture.componentInstance;
    component.product = {
      id: 'prod-1',
      name: 'Product 1',
      target: 120,
      actual: 110,
      calculationDate: '2025-05-11',
      trendDirection: 'up',
      trendPercent: 23
    };
    fixture.detectChanges();
  });

  it('emits target save patch', () => {
    const spy = jest.spyOn(component.saveChange, 'emit');
    component.targetValue = '130';

    component.onSaveTarget();

    expect(spy).toHaveBeenCalledWith({ productId: 'prod-1', patch: { target: 130 } });
  });

  it('emits date save patch', () => {
    const spy = jest.spyOn(component.saveChange, 'emit');
    component.onDateSelected('2025-05-25');

    component.onSaveDate();

    expect(spy).toHaveBeenCalledWith({ productId: 'prod-1', patch: { calculationDate: '2025-05-25' } });
  });
});