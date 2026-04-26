import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { CostBreakdownProduct } from '@core/models/cost.model';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { DatePickerComponent } from '../../../../ui/base/date-picker/date-picker.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { InputComponent } from '../../../../ui/base/input/input.component';

@Component({
  selector: 'dpo-cost-breakdown-row',
  standalone: true,
  imports: [CommonModule, InputComponent, DatePickerComponent, ButtonComponent, IconComponent],
  templateUrl: './cost-breakdown-row.component.html',
  styleUrl: './cost-breakdown-row.component.scss'
})
export class CostBreakdownRowComponent implements OnChanges {
  @Input({ required: true }) product!: CostBreakdownProduct;

  @Output() saveChange = new EventEmitter<{
    productId: string;
    patch: { target?: number; actual?: number; calculationDate?: string };
  }>();

  targetValue = '';
  actualValue = '';
  calculationDate = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['product']) {
      return;
    }

    this.targetValue = String(this.product.target);
    this.actualValue = String(this.product.actual);
    this.calculationDate = this.product.calculationDate;
  }

  onSaveTarget(): void {
    this.saveChange.emit({ productId: this.product.id, patch: { target: Number(this.targetValue) || 0 } });
  }

  onSaveActual(): void {
    this.saveChange.emit({ productId: this.product.id, patch: { actual: Number(this.actualValue) || 0 } });
  }

  onDateSelected(date: string): void {
    this.calculationDate = date;
  }

  onSaveDate(): void {
    this.saveChange.emit({ productId: this.product.id, patch: { calculationDate: this.calculationDate } });
  }

  get trendIconName(): string {
    if (this.product.trendDirection === 'up') {
      return 'trending-up';
    }

    if (this.product.trendDirection === 'down') {
      return 'trending-down';
    }

    return 'minus';
  }
}