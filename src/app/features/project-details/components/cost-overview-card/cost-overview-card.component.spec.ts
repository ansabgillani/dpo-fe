import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { CostOverviewCardComponent } from './cost-overview-card.component';

describe('CostOverviewCardComponent', () => {
  let fixture: ComponentFixture<CostOverviewCardComponent>;
  let component: CostOverviewCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostOverviewCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CostOverviewCardComponent);
    component = fixture.componentInstance;
    component.title = 'Actuals';
    component.section = { gross: 120, chargingToBL: 90, net: 70 };
    fixture.detectChanges();
  });

  it('renders section values', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Actuals');
    expect(element.textContent).toContain('120k€');
    expect(element.textContent).toContain('90k€');
    expect(element.textContent).toContain('70k€');
  });
});