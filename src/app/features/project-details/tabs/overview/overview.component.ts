import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import { catchError, forkJoin, map, of } from 'rxjs';

import {
  calculateBudgetTrend,
  calculateCustomerSatisfactionTrend,
  calculateQualityTrend,
  calculateResourcesTrend,
  calculateTargetCostTrend,
  calculateTimelineTrend,
  KpiTrendResult
} from '@core/kpi-calculators';
import { ProjectSummary } from '@core/models/project.model';
import { StateCard } from '@core/models/state-card.model';
import { OverviewChartData, ProjectService } from '@core/services/project.service';
import { AvatarComponent } from '../../../../ui/base/avatar/avatar.component';
import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';
import { BudgetChartComponent } from '../../components/budget-chart/budget-chart.component';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { SkeletonKpiGridComponent } from '../../components/skeleton-kpi-grid/skeleton-kpi-grid.component';

interface KpiVm {
  id: string;
  label: string;
  value: string;
  iconName: string;
  trend: KpiTrendResult;
  statusTier: 'green' | 'yellow' | 'red' | 'gray';
}

type KpiCardKey =
  | 'quality'
  | 'budget'
  | 'target-cost'
  | 'resources'
  | 'timeline'
  | 'customer-satisfaction';

@Component({
  selector: 'dpo-overview-tab',
  standalone: true,
  imports: [CommonModule, AvatarComponent, SkeletonBlockComponent, KpiCardComponent, BudgetChartComponent, SkeletonKpiGridComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  private readonly kpiOrder: KpiCardKey[] = [
    'quality',
    'budget',
    'target-cost',
    'resources',
    'timeline',
    'customer-satisfaction'
  ];

  @Input() projectId: number | null = null;
  @Input() project: ProjectSummary | null = null;

  loading = false;
  cards: StateCard[] = [];
  chartData: OverviewChartData = { datasets: [] };
  chartHasError = false;

  constructor(private readonly projectService: ProjectService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['projectId']) {
      return;
    }

    if (!this.projectId) {
      this.cards = [];
      this.chartData = { datasets: [] };
      this.chartHasError = false;
      return;
    }

    this.fetchCards(this.projectId);
  }

  get kpis(): KpiVm[] {
    return this.kpiOrder
      .map((key) => this.findCard(key))
      .filter((card): card is StateCard => Boolean(card))
      .map((card) => ({
        id: card.id,
        label: card.label,
        value: this.statusLabelForValue(card.value),
        iconName: this.getIconName(card.key),
        trend: this.toTrend(card),
        statusTier: this.statusTierForValue(card.value)
      }));
  }

  get budgetDatasets(): ChartConfiguration<'line'>['data']['datasets'] {
    if (!this.chartData.datasets.length) {
      return [];
    }

    return this.chartData.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.color,
      backgroundColor: dataset.color.replace('rgb', 'rgba').replace(')', ', 0.15)'),
      tension: 0.25
    }));
  }

  get projectInitials(): string {
    if (!this.project?.name) {
      return 'PR';
    }

    const parts = this.project.name.split(' ').filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
  }

  formatProjectDate(value?: string): string {
    if (!value) {
      return '-';
    }

    const [yearText, monthText, dayText] = value.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);

    if (!year || !month || !day) {
      return value;
    }

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  private fetchCards(projectId: number): void {
    this.loading = true;
    forkJoin({
      cards: this.projectService.getStateCards(projectId).pipe(catchError(() => of([]))),
      chartResult: this.projectService.getOverviewChartData(projectId).pipe(
        map((data) => ({ data, hasError: false })),
        catchError(() => of({ data: { datasets: [] }, hasError: true }))
      )
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ cards, chartResult }) => {
          this.cards = cards;
          this.chartData = chartResult.data;
          this.chartHasError = chartResult.hasError;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private toTrend(card: StateCard): KpiTrendResult {
    switch (card.key) {
      case 'quality':
        return calculateQualityTrend(card.value, card.previousValue);
      case 'budget':
        return calculateBudgetTrend(card.value, 100, card.previousValue, 100);
      case 'target-cost':
        return calculateTargetCostTrend(card.value, 100, card.previousValue, 100);
      case 'resources':
        return calculateResourcesTrend(card.value, card.previousValue);
      case 'timeline':
        return calculateTimelineTrend(card.value, card.previousValue);
      case 'customer-satisfaction':
        return calculateCustomerSatisfactionTrend(card.value, card.previousValue);
      default:
        return calculateQualityTrend(card.value, card.previousValue);
    }
  }

  private getIconName(key: string): string {
    switch (key) {
      case 'quality':
        return 'shield-check';
      case 'budget':
      case 'target-cost':
        return 'circle-dollar-sign';
      case 'resources':
        return 'users';
      case 'timeline':
        return 'clock';
      case 'customer-satisfaction':
        return 'smile';
      default:
        return 'target';
    }
  }

  private findCard(key: string): StateCard | undefined {
    return this.cards.find((card) => card.key === key);
  }

  private statusLabelForValue(value: number): string {
    if (value >= 80) {
      return 'Healthy';
    }

    if (value >= 50) {
      return 'At Risk';
    }

    if (value > 0) {
      return 'Unhealthy';
    }

    return 'N/A';
  }

  private statusTierForValue(value: number): 'green' | 'yellow' | 'red' | 'gray' {
    if (value >= 80) {
      return 'green';
    }

    if (value >= 50) {
      return 'yellow';
    }

    if (value > 0) {
      return 'red';
    }

    return 'gray';
  }
}
