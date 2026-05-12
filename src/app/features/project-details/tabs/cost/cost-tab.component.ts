import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';

import {
  BreakdownMode,
  CostBreakdownProduct,
  CostData,
  CostFilters,
  CostPeriodRow,
  CostSubView,
  MonthlyDataType
} from '@core/models/cost.model';
import { StateCard } from '@core/models/state-card.model';
import { calculateBudgetTrend, calculateTargetCostTrend, KpiTrendResult } from '@core/kpi-calculators';
import { ProjectService } from '@core/services/project.service';
import { catchError, forkJoin, of } from 'rxjs';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { SelectComponent, SelectOption } from '../../../../ui/base/select/select.component';
import { CostOverviewCardComponent } from '../../components/cost-overview-card/cost-overview-card.component';
import { CostBarChartComponent } from '../../components/cost-bar-chart/cost-bar-chart.component';
import { CostTableComponent } from '../../components/cost-table/cost-table.component';
import { CostBreakdownRowComponent } from '../../components/cost-breakdown-row/cost-breakdown-row.component';
import { CostDetailTableComponent } from '../../components/cost-detail-table/cost-detail-table.component';
import { SkeletonCostComponent } from '../../components/skeleton-cost/skeleton-cost.component';
import { BudgetChartComponent } from '../../components/budget-chart/budget-chart.component';

@Component({
  selector: 'dpo-cost-tab',
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    ButtonComponent,
    SelectComponent,
    CostOverviewCardComponent,
    CostBarChartComponent,
    CostTableComponent,
    CostBreakdownRowComponent,
    CostDetailTableComponent,
    SkeletonCostComponent,
    BudgetChartComponent
  ],
  templateUrl: './cost-tab.component.html',
  styleUrl: './cost-tab.component.scss'
})
export class CostTabComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  @Input() projectId: number | null = null;

  loading = false;
  costData: CostData | null = null;
  stateCards: StateCard[] = [];

  activeSubView: CostSubView = 'overview';
  monthlyDataType: MonthlyDataType = 'actuals';
  breakdownMode: BreakdownMode = 'project';

  projectFilter = '';
  fyFilter = '';
  pspProjectFilter = '';

  constructor(private readonly projectService: ProjectService) {}

  ngOnInit(): void {
    this.setSubViewByIndex(this.projectService.getActiveCostSubViewIndex());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['projectId']) {
      return;
    }

    if (!this.projectId) {
      this.costData = null;
      return;
    }

    this.fetchCostData();
  }

  get topCostTrend(): KpiTrendResult {
    if (this.breakdownMode === 'product' && this.targetCostStateCard) {
      return calculateTargetCostTrend(
        this.targetCostStateCard.value,
        100,
        this.targetCostStateCard.previousValue,
        100
      );
    }

    const value = this.costData?.projectCost || 0;
    return calculateBudgetTrend(value, value || 1, value * 0.95, value || 1);
  }

  get topCostCardTitle(): string {
    return this.breakdownMode === 'product' ? 'Product Cost' : 'Project Cost';
  }

  get topCostLabel(): string {
    if (this.breakdownMode === 'product' && this.targetCostStateCard) {
      return this.toCostLabel(this.targetCostStateCard.value);
    }

    const value = this.costData?.projectCost || 0;
    return `${(value / 1000000).toFixed(3)} Million €`;
  }

  get reportingPeriod(): string {
    return this.costData?.latestReportingPeriod || 'P01';
  }

  get projectOptions(): SelectOption[] {
    return this.buildOptionList(this.costData?.project || '', ['Project A', 'Project B']);
  }

  get fyOptions(): SelectOption[] {
    const fiscalYears = this.costData?.fiscalYears?.length ? this.costData.fiscalYears : ['FY25', 'FY26'];
    const uniqueYears = Array.from(new Set(fiscalYears.filter((value) => !!value)));
    return [{ label: 'All FYs', value: '' }, ...uniqueYears.map((value) => ({ label: value, value }))];
  }

  get pspProjectOptions(): SelectOption[] {
    return this.buildOptionList(this.costData?.pspProject || '', ['PSP-1', 'PSP-2']);
  }

  get breakdownModeOptions(): SelectOption[] {
    return [
      { label: 'Product', value: 'product' },
      { label: 'Project', value: 'project' }
    ];
  }

  get monthlyRows(): CostPeriodRow[] {
    if (!this.costData) {
      return [];
    }

    if (this.monthlyDataType === 'budget') {
      return this.costData.monthly.budget;
    }

    if (this.monthlyDataType === 'actuals+fc') {
      return this.costData.monthly.forecastsPlusActuals;
    }

    return this.costData.monthly.actuals;
  }

  get productRows(): CostBreakdownProduct[] {
    return this.costData?.breakdown.products || [];
  }

  get targetCostStateCard(): StateCard | undefined {
    return this.stateCards.find((card) => card.key === 'target-cost');
  }

  get breakdownLineDatasets(): ChartConfiguration<'line'>['data']['datasets'] {
    const lineChart = this.costData?.breakdown.lineChart;

    return [
      {
        label: 'Budget',
        data: lineChart?.budget || Array.from({ length: 12 }, (_, index) => 95 + index),
        borderColor: 'rgb(0, 160, 175)',
        backgroundColor: 'rgba(0, 160, 175, 0.15)',
        tension: 0.25
      },
      {
        label: 'Actuals+Forecasts',
        data: lineChart?.actualsAndForecasts || Array.from({ length: 12 }, (_, index) => 90 + index),
        borderColor: 'rgb(232, 119, 34)',
        backgroundColor: 'rgba(232, 119, 34, 0.15)',
        tension: 0.25
      },
      {
        label: 'Charging Actuals+Forecasts',
        data: lineChart?.chargingActualsAndForecasts || Array.from({ length: 12 }, (_, index) => 88 + index),
        borderColor: 'rgb(0, 112, 192)',
        backgroundColor: 'rgba(0, 112, 192, 0.15)',
        tension: 0.25
      }
    ];
  }

  onSubViewChange(view: CostSubView): void {
    this.activeSubView = view;
    this.projectService.setActiveCostSubViewIndex(this.toSubViewIndex(view));
  }

  onProjectFilterChange(value: string): void {
    this.projectFilter = value;
    this.fetchCostData();
  }

  onFyFilterChange(value: string): void {
    this.fyFilter = value;
    this.fetchCostData();
  }

  onPspProjectFilterChange(value: string): void {
    this.pspProjectFilter = value;
    this.fetchCostData();
  }

  onMonthlyDataTypeChange(value: MonthlyDataType): void {
    this.monthlyDataType = value;
  }

  onBreakdownModeChange(mode: string): void {
    this.breakdownMode = mode === 'project' ? 'project' : 'product';
    this.fetchCostData();
  }

  onBreakdownRowSave(event: { productId: string; patch: { target?: number; actual?: number; calculationDate?: string } }): void {
    if (!this.projectId) {
      return;
    }

    this.projectService
      .updateCostBreakdown(this.projectId, event.productId, event.patch, this.currentFilters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.costData = this.normalizeCostData(data);
        }
      });
  }

  private fetchCostData(): void {
    if (!this.projectId) {
      return;
    }

    this.loading = true;
    forkJoin({
      costData: this.projectService.getCostData(this.projectId, this.currentFilters),
      stateCards: this.projectService.getStateCards(this.projectId).pipe(catchError(() => of([])))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ costData, stateCards }) => {
          this.costData = this.normalizeCostData(costData);
          this.stateCards = stateCards;
        },
        error: () => {
          this.costData = this.normalizeCostData(null);
          this.stateCards = [];
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private get currentFilters(): CostFilters {
    return {
      project: this.projectFilter || undefined,
      fy: this.fyFilter || undefined,
      pspProject: this.pspProjectFilter || undefined,
      breakdownMode: this.breakdownMode
    };
  }

  private normalizeCostData(raw: Partial<CostData> | null): CostData {
    const monthlyBase = Array.from({ length: 12 }, (_, index) => {
      const period = `P${String(index + 1).padStart(2, '0')}`;
      return {
        period,
        gross: 100 + index,
        chargingToBL: 80 + index,
        net: 70 + index
      };
    });

    return {
      projectCost: raw?.projectCost || 1345000,
      latestReportingPeriod: raw?.latestReportingPeriod || 'P01',
      project: raw?.project || this.projectFilter || 'Project A',
      fy: raw?.fy || this.fyFilter || 'FY26',
      fiscalYears: raw?.fiscalYears?.length
        ? raw.fiscalYears
        : Array.from(
            new Set([
              raw?.fy,
              this.fyFilter,
              'FY26',
              'FY25'
            ].filter((value): value is string => typeof value === 'string' && value.length > 0))
          ),
      pspProject: raw?.pspProject || this.pspProjectFilter || 'PSP-1',
      breakdownMode: raw?.breakdownMode || this.breakdownMode,
      overview: {
        actuals: raw?.overview?.actuals || { gross: 12345, chargingToBL: 10000, net: 9340 },
        budget: raw?.overview?.budget || { gross: 12000, chargingToBL: 9800, net: 9000 },
        forecasts: raw?.overview?.forecasts || { gross: 12600, chargingToBL: 10100, net: 9500 },
        forecastsPlusActuals:
          raw?.overview?.forecastsPlusActuals || { gross: 12800, chargingToBL: 10300, net: 9700 },
        barChart: raw?.overview?.barChart || {
          groups: ['Forecast', 'Budget', 'Actuals', 'FC + Actuals'],
          datasets: [
            { label: 'Charging to BL', data: [9200, 9000, 9400, 9800], color: 'rgb(0, 176, 80)' },
            { label: 'Gross', data: [11000, 10800, 11200, 11600], color: 'rgb(232, 119, 34)' },
            { label: 'NET', data: [8600, 8400, 8800, 9100], color: 'rgb(0, 112, 192)' }
          ]
        }
      },
      monthly: {
        actuals: raw?.monthly?.actuals || monthlyBase,
        budget: raw?.monthly?.budget || monthlyBase.map((row) => ({ ...row, gross: row.gross + 3 })),
        forecastsPlusActuals:
          raw?.monthly?.forecastsPlusActuals || monthlyBase.map((row) => ({ ...row, gross: row.gross + 6 }))
      },
      breakdown: {
        products: raw?.breakdown?.products || [
          {
            id: 'prod-1',
            name: 'Product 1',
            target: 12345,
            actual: 12020,
            calculationDate: '2025-05-10',
            trendDirection: 'up',
            trendPercent: 23
          },
          {
            id: 'prod-2',
            name: 'Product 2',
            target: 9800,
            actual: 10040,
            calculationDate: '2025-05-12',
            trendDirection: 'up',
            trendPercent: 12
          }
        ],
        lineChart: raw?.breakdown?.lineChart || {
          budget: Array.from({ length: 12 }, (_, index) => 95 + index),
          actualsAndForecasts: Array.from({ length: 12 }, (_, index) => 90 + index),
          chargingActualsAndForecasts: Array.from({ length: 12 }, (_, index) => 88 + index)
        },
        periodDetail:
          raw?.breakdown?.periodDetail ||
          monthlyBase.map((row) => ({
            period: row.period,
            gross: row.gross,
            chargingToInternal: 12,
            ctCosts: 7,
            externalMaterial: 15,
            internalMaterial: 8,
            chargingToBL: row.chargingToBL,
            net: row.net
          }))
      }
    };
  }

  private buildOptionList(primary: string, fallback: string[]): SelectOption[] {
    const values = [primary, ...fallback].filter((value) => !!value);
    const unique = Array.from(new Set(values));

    return unique.map((value) => ({ label: value, value }));
  }

  private toCostLabel(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(3)} Million €`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(3)} k€`;
    }

    return `${value}`;
  }

  private setSubViewByIndex(index: number): void {
    if (index === 1) {
      this.activeSubView = 'monthly';
      return;
    }

    if (index === 2) {
      this.activeSubView = 'breakdown';
      return;
    }

    this.activeSubView = 'overview';
  }

  private toSubViewIndex(view: CostSubView): number {
    if (view === 'monthly') {
      return 1;
    }

    if (view === 'breakdown') {
      return 2;
    }

    return 0;
  }
}