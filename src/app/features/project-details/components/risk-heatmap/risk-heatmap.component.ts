import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { RiskHeatmap, RiskLevel } from '@core/models/risk.model';
import { IconComponent } from '../../../../ui/base/icon/icon.component';

type RiskRowKey = 'high' | 'medium' | 'low';
type HeatmapSide = 'before' | 'after';

@Component({
  selector: 'dpo-risk-heatmap',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './risk-heatmap.component.html',
  styleUrl: './risk-heatmap.component.scss'
})
export class RiskHeatmapComponent {
  @Input() heatmap: RiskHeatmap | null = null;

  readonly rows: Array<{ key: RiskRowKey; label: string }> = [
    { key: 'high', label: 'HIGH' },
    { key: 'medium', label: 'MEDIUM' },
    { key: 'low', label: 'LOW' }
  ];

  readonly columns: Array<{ key: RiskLevel; label: string }> = [
    { key: 'low', label: 'LOW' },
    { key: 'medium', label: 'MEDIUM' },
    { key: 'high', label: 'HIGH' },
    { key: 'block', label: 'BLOCK' }
  ];

  getCellValue(side: HeatmapSide, row: RiskRowKey, column: RiskLevel): number {
    return this.heatmap?.[side]?.[row]?.[column] ?? 0;
  }

  getCellClass(column: RiskLevel): string {
    return `cell-${column}`;
  }
}
