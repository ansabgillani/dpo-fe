import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { calculateTimelineTrend } from '@core/kpi-calculators';
import { MilestoneItem } from '@core/models/milestone.model';
import { DatePickerComponent } from '../../../../ui/base/date-picker/date-picker.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';

@Component({
  selector: 'dpo-milestone-row',
  standalone: true,
  imports: [CommonModule, DatePickerComponent, IconComponent],
  templateUrl: './milestone-row.component.html',
  styleUrl: './milestone-row.component.scss'
})
export class MilestoneRowComponent {
  private readonly plannedDurationDays = 14;

  @Input({ required: true }) milestone!: MilestoneItem;

  @Output() startDateChange = new EventEmitter<{ milestoneId: number; date: string }>();
  @Output() endDateChange = new EventEmitter<{ milestoneId: number; date: string }>();

  get trendClass(): string {
    const trend = calculateTimelineTrend(this.delayDays, 0);
    return `tier-${trend.tier}`;
  }

  get trendIconName(): string {
    const trend = calculateTimelineTrend(this.delayDays, 0);

    if (trend.direction === 'up') {
      return 'trending-up';
    }

    if (trend.direction === 'down') {
      return 'trending-down';
    }

    return 'minus';
  }

  get trendPercent(): number {
    const durationDays = this.durationDays;

    if (!durationDays) {
      return 0;
    }

    return Math.round((this.delayDays / durationDays) * 100);
  }

  onStartDateSelected(date: string): void {
    this.startDateChange.emit({ milestoneId: this.milestone.id, date });
  }

  onEndDateSelected(date: string): void {
    this.endDateChange.emit({ milestoneId: this.milestone.id, date });
  }

  private get delayDays(): number {
    return Math.max(this.durationDays - this.plannedDurationDays, 0);
  }

  private get durationDays(): number {
    const start = new Date(this.milestone.startDate);
    const end = new Date(this.milestone.endDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    const duration = Math.round((end.getTime() - start.getTime()) / msPerDay);

    return Math.max(duration, 0);
  }
}
