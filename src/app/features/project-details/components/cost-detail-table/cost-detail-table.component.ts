import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CostPeriodDetail } from '@core/models/cost.model';

@Component({
  selector: 'dpo-cost-detail-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cost-detail-table.component.html',
  styleUrl: './cost-detail-table.component.scss'
})
export class CostDetailTableComponent {
  @Input() rows: CostPeriodDetail[] = [];
}