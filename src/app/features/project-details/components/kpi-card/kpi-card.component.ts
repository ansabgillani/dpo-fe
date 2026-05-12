import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { KpiTrendResult } from '@core/kpi-calculators';
import { IconComponent } from '../../../../ui/base/icon/icon.component';

@Component({
  selector: 'dpo-kpi-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: number | string = 0;
  @Input({ required: true }) trend!: KpiTrendResult;
  @Input() iconName = 'target';
  @Input() statusTier: 'green' | 'yellow' | 'red' | 'gray' = 'gray';

  get trendIconName(): string {
    if (this.trend.direction === 'up') {
      return 'trending-up';
    }

    if (this.trend.direction === 'down') {
      return 'trending-down';
    }

    return 'minus';
  }

  get tierClass(): string {
    return this.statusTier === 'gray' ? '' : `tier-${this.statusTier}`;
  }
}
