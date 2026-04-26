import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CostPeriodRow, MonthlyDataType } from '@core/models/cost.model';
import { ButtonComponent } from '../../../../ui/base/button/button.component';

@Component({
  selector: 'dpo-cost-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './cost-table.component.html',
  styleUrl: './cost-table.component.scss'
})
export class CostTableComponent {
  @Input() rows: CostPeriodRow[] = [];
  @Input() dataType: MonthlyDataType = 'actuals';

  @Output() dataTypeChange = new EventEmitter<MonthlyDataType>();

  onToggle(type: MonthlyDataType): void {
    this.dataTypeChange.emit(type);
  }
}