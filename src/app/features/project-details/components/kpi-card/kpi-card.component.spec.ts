import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  let component: KpiCardComponent;
  let fixture: ComponentFixture<KpiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCardComponent);
    component = fixture.componentInstance;
    component.label = 'Quality';
    component.value = 84;
    component.trend = { tier: 'green', direction: 'up', deltaPercent: 12 };
    fixture.detectChanges();
  });

  it('maps up direction to trending-up icon', () => {
    expect(component.trendIconName).toBe('trending-up');
  });

  it('returns tier class', () => {
    expect(component.tierClass).toBe('tier-green');
  });
});
