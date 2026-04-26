import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { RiskHeatmapComponent } from './risk-heatmap.component';

describe('RiskHeatmapComponent', () => {
  let component: RiskHeatmapComponent;
  let fixture: ComponentFixture<RiskHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskHeatmapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskHeatmapComponent);
    component = fixture.componentInstance;
    component.heatmap = {
      before: {
        high: { low: 1, medium: 2, high: 3, block: 0 },
        medium: { low: 4, medium: 5, high: 6, block: 1 },
        low: { low: 7, medium: 8, high: 9, block: 2 }
      },
      after: {
        high: { low: 2, medium: 1, high: 0, block: 1 },
        medium: { low: 3, medium: 2, high: 1, block: 0 },
        low: { low: 4, medium: 3, high: 2, block: 1 }
      }
    };
    fixture.detectChanges();
  });

  it('renders before and after cell counts', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[data-cy="risk-heatmap-before-high-low"]')?.textContent).toContain('1');
    expect(element.querySelector('[data-cy="risk-heatmap-after-low-block"]')?.textContent).toContain('1');
  });

  it('applies tier classes by column', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[data-cy="risk-heatmap-before-high-low"]')?.classList).toContain('cell-low');
    expect(element.querySelector('[data-cy="risk-heatmap-before-high-high"]')?.classList).toContain('cell-high');
    expect(element.querySelector('[data-cy="risk-heatmap-before-high-block"]')?.classList).toContain('cell-block');
  });
});
