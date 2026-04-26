import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { getRiskTypeOptions } from '@core/risk-field-configs';
import { RiskData, RiskEntry, RiskFieldKey, RiskHeatmap, RiskHeatmapGrid, RiskHeatmapRow } from '@core/models/risk.model';
import { ProjectService } from '@core/services/project.service';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { SelectComponent, SelectOption } from '../../../../ui/base/select/select.component';
import { RiskCardComponent } from '../../components/risk-card/risk-card.component';
import { RiskHeatmapComponent } from '../../components/risk-heatmap/risk-heatmap.component';
import { SkeletonRiskComponent } from '../../components/skeleton-risk/skeleton-risk.component';

@Component({
  selector: 'dpo-risk-tab',
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent,
    ButtonComponent,
    IconComponent,
    RiskHeatmapComponent,
    RiskCardComponent,
    SkeletonRiskComponent
  ],
  templateUrl: './risk-tab.component.html',
  styleUrl: './risk-tab.component.scss'
})
export class RiskTabComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  @Input() projectId: number | null = null;

  loading = false;
  saving = false;
  private loadingTimer: ReturnType<typeof setTimeout> | null = null;

  selectedRiskType = '';
  riskTypeOptions: SelectOption[] = [];

  riskData: RiskData = this.buildEmptyRiskData();

  constructor(private readonly projectService: ProjectService) {
    this.destroyRef.onDestroy(() => {
      if (this.loadingTimer) {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = null;
      }
    });
  }

  ngOnInit(): void {
    this.riskTypeOptions = getRiskTypeOptions();

    if (this.projectId && !this.loading && this.riskData.risks.length === 0) {
      this.fetchRisks();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['projectId']) {
      return;
    }

    if (!this.projectId) {
      this.riskData = this.buildEmptyRiskData();
      return;
    }

    this.fetchRisks();
  }

  onRiskTypeChange(value: string): void {
    this.selectedRiskType = value;
    this.fetchRisks();
  }

  onAddRisk(): void {
    if (!this.projectId || this.saving) {
      return;
    }

    const riskType = this.activeRiskType || this.riskTypeOptions[0]?.value || '';
    const newRisk = this.buildEmptyRisk(riskType);

    this.saving = true;
    this.projectService.addRisk(this.projectId, newRisk, this.activeRiskType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.riskData = this.normalizeRiskData(data);
      },
      error: () => {
        this.saving = false;
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  onRiskFieldSaved(event: { riskId: number; field: RiskFieldKey; value: string }): void {
    if (!this.projectId || this.saving) {
      return;
    }

    this.saving = true;
    this.projectService
      .updateRisk(this.projectId, event.riskId, event.field, event.value, this.activeRiskType)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.riskData = this.normalizeRiskData(data);
        },
        error: () => {
          this.saving = false;
        },
        complete: () => {
          this.saving = false;
        }
      });
  }

  private fetchRisks(): void {
    if (!this.projectId) {
      return;
    }

    this.loading = true;
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
    this.projectService.getRisks(this.projectId, this.activeRiskType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.riskData = this.normalizeRiskData(data);
      },
      error: () => {
        this.riskData = this.buildEmptyRiskData();
        this.finalizeLoading();
      },
      complete: () => {
        this.finalizeLoading();
      }
    });
  }

  private get activeRiskType(): string | undefined {
    return this.selectedRiskType || undefined;
  }

  private normalizeRiskData(data: RiskData | null): RiskData {
    return {
      heatmap: this.normalizeHeatmap(data?.heatmap || null),
      risks: (data?.risks || []).map((risk) => this.normalizeRiskEntry(risk))
    };
  }

  private normalizeHeatmap(raw: RiskHeatmap | null): RiskHeatmap {
    const emptyRow: RiskHeatmapRow = { low: 0, medium: 0, high: 0, block: 0 };
    const emptyGrid: RiskHeatmapGrid = {
      high: { ...emptyRow },
      medium: { ...emptyRow },
      low: { ...emptyRow }
    };

    if (!raw) {
      return { before: emptyGrid, after: emptyGrid };
    }

    const beforeLegacy = raw.before as unknown as { high?: number; medium?: number; low?: number };
    const afterLegacy = raw.after as unknown as { high?: number; medium?: number; low?: number };

    if (typeof beforeLegacy?.high === 'number' || typeof beforeLegacy?.medium === 'number' || typeof beforeLegacy?.low === 'number') {
      return {
        before: {
          high: { ...emptyRow, high: this.toNumber(beforeLegacy.high) },
          medium: { ...emptyRow, medium: this.toNumber(beforeLegacy.medium) },
          low: { ...emptyRow, low: this.toNumber(beforeLegacy.low) }
        },
        after: {
          high: { ...emptyRow, high: this.toNumber(afterLegacy.high) },
          medium: { ...emptyRow, medium: this.toNumber(afterLegacy.medium) },
          low: { ...emptyRow, low: this.toNumber(afterLegacy.low) }
        }
      };
    }

    return {
      before: this.normalizeGrid(raw.before),
      after: this.normalizeGrid(raw.after)
    };
  }

  private normalizeGrid(grid: Partial<RiskHeatmapGrid> | null | undefined): RiskHeatmapGrid {
    return {
      high: this.normalizeRow(grid?.high),
      medium: this.normalizeRow(grid?.medium),
      low: this.normalizeRow(grid?.low)
    };
  }

  private normalizeRow(row: Partial<RiskHeatmapRow> | null | undefined): RiskHeatmapRow {
    return {
      low: this.toNumber(row?.low),
      medium: this.toNumber(row?.medium),
      high: this.toNumber(row?.high),
      block: this.toNumber(row?.block)
    };
  }

  private normalizeRiskEntry(entry: Partial<RiskEntry>): RiskEntry {
    return {
      id: Number(entry.id || 0),
      title: entry.title || '',
      riskType: entry.riskType || '',
      potentialFinancialLoss: entry.potentialFinancialLoss || '',
      actionDueDate: entry.actionDueDate || '',
      probability: entry.probability || '',
      severity: entry.severity || '',
      status: entry.status || '',
      riskDescription: entry.riskDescription || '',
      action: entry.action || '',
      potentialFinancialLossAfter: entry.potentialFinancialLossAfter || '',
      probabilityAfter: entry.probabilityAfter || '',
      severityAfter: entry.severityAfter || '',
      statusAfter: entry.statusAfter || ''
    };
  }

  private buildEmptyRiskData(): RiskData {
    return {
      heatmap: this.normalizeHeatmap(null),
      risks: []
    };
  }

  private buildEmptyRisk(riskType: string): RiskEntry {
    return {
      id: 0,
      title: 'New Risk',
      riskType,
      potentialFinancialLoss: '',
      actionDueDate: '',
      probability: '',
      severity: '',
      status: '',
      riskDescription: '',
      action: '',
      potentialFinancialLossAfter: '',
      probabilityAfter: '',
      severityAfter: '',
      statusAfter: ''
    };
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private finalizeLoading(): void {
    this.loadingTimer = setTimeout(() => {
      this.loading = false;
      this.loadingTimer = null;
    }, 200);
  }
}
