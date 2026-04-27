import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { calculateTimelineTrend, KpiTrendResult } from '@core/kpi-calculators';
import { MilestoneItem } from '@core/models/milestone.model';
import { ProjectService } from '@core/services/project.service';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { SelectComponent, SelectOption } from '../../../../ui/base/select/select.component';
import { MilestoneRowComponent } from '../../components/milestone-row/milestone-row.component';
import { SkeletonMilestoneListComponent } from '../../components/skeleton-milestone-list/skeleton-milestone-list.component';

@Component({
  selector: 'dpo-milestone-tab',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    SelectComponent,
    MilestoneRowComponent,
    SkeletonMilestoneListComponent
  ],
  templateUrl: './milestone-tab.component.html',
  styleUrl: './milestone-tab.component.scss'
})
export class MilestoneTabComponent implements OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  private readonly plannedDurationDays = 14;

  @Input() projectId: number | null = null;

  milestones: MilestoneItem[] = [];
  milestoneSets: string[] = [];
  loading = false;
  selectedMilestoneSet = 'MP';
  private loadingTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly projectService: ProjectService) {
    this.destroyRef.onDestroy(() => {
      if (this.loadingTimer) {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = null;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['projectId']) {
      return;
    }

    if (!this.projectId) {
      this.milestones = [];
      this.selectedMilestoneSet = '';
      return;
    }

    this.fetchMilestoneSets();
    this.fetchMilestones();
  }

  get milestoneSetOptions(): SelectOption[] {
    // Only allow MP and BL
    return this.milestoneSets
      .filter((set) => set === 'MP' || set === 'BL')
      .map((set) => ({ label: set, value: set }));
  }

  get milestoneTypeOptions(): SelectOption[] {
    return [
      { label: 'MP', value: 'MP' },
      { label: 'BL', value: 'BL' }
    ];
  }

  get timelineStatus(): string {
    return this.summaryDelayDays > 0 ? 'Behind' : 'On Track';
  }

  get timelineTrendClass(): string {
    return `tier-${this.timelineTrend.tier}`;
  }

  get timelineTrendIconName(): string {
    if (this.timelineTrend.direction === 'up') {
      return 'trending-up';
    }

    if (this.timelineTrend.direction === 'down') {
      return 'trending-down';
    }

    return 'minus';
  }

  get timelineTrendPercent(): number {
    if (!this.milestones.length) {
      return 0;
    }

    const totalDurationDays = this.milestones.reduce((acc, milestone) => {
      return acc + this.getDurationDays(milestone);
    }, 0);

    const totalDelayDays = this.milestones.reduce((acc, milestone) => {
      return acc + this.getDelayDays(milestone);
    }, 0);

    if (!totalDurationDays) {
      return 0;
    }

    return Math.round((totalDelayDays / totalDurationDays) * 100);
  }

  onMilestoneSetChange(value: string): void {
    this.selectedMilestoneSet = value;
    this.fetchMilestones();
  }

  onStartDateChange(event: { milestoneId: number; date: string }): void {
    this.updateMilestone(event.milestoneId, { startDate: event.date });
  }

  onEndDateChange(event: { milestoneId: number; date: string }): void {
    this.updateMilestone(event.milestoneId, { endDate: event.date });
  }

  private fetchMilestoneSets(): void {
    this.projectService.getMilestoneSets().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (milestoneSets) => {
        this.milestoneSets = milestoneSets;
      },
      error: () => {
        this.milestoneSets = [];
      }
    });
  }

  private fetchMilestones(): void {
    if (!this.projectId) {
      return;
    }

    this.loading = true;
    this.milestones = [];
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
    this.projectService
      .getMilestones(this.projectId, this.selectedMilestoneSet || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (milestones) => {
        this.milestones = milestones;
      },
      error: () => {
        this.milestones = [];
      },
      complete: () => {
        this.loadingTimer = setTimeout(() => {
          this.loading = false;
          this.loadingTimer = null;
        }, 200);
      }
    });
  }

  private updateMilestone(
    milestoneId: number,
    patch: { startDate?: string; endDate?: string }
  ): void {
    if (!this.projectId) {
      return;
    }

    this.projectService
      .updateMilestone(this.projectId, milestoneId, patch)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (milestones) => {
        this.milestones = milestones;
      }
    });
  }

  private get timelineTrend(): KpiTrendResult {
    return calculateTimelineTrend(this.summaryDelayDays, 0);
  }

  private get summaryDelayDays(): number {
    if (!this.milestones.length) {
      return 0;
    }

    const totalDelayDays = this.milestones.reduce((acc, milestone) => {
      return acc + this.getDelayDays(milestone);
    }, 0);

    return Math.round(totalDelayDays / this.milestones.length);
  }

  private getDurationDays(milestone: MilestoneItem): number {
    const start = new Date(milestone.startDate);
    const end = new Date(milestone.endDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    const duration = Math.round((end.getTime() - start.getTime()) / msPerDay);

    return Math.max(duration, 0);
  }

  private getDelayDays(milestone: MilestoneItem): number {
    return Math.max(this.getDurationDays(milestone) - this.plannedDurationDays, 0);
  }
}
