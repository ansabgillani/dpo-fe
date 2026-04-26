import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { CostDetailTableComponent } from './cost-detail-table.component';

describe('CostDetailTableComponent', () => {
  let fixture: ComponentFixture<CostDetailTableComponent>;
  let component: CostDetailTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostDetailTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CostDetailTableComponent);
    component = fixture.componentInstance;
    component.rows = [
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
    ];
    fixture.detectChanges();
  });

  it('renders period detail rows', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('P01');
    expect(element.textContent).toContain('95k€');
  });
});