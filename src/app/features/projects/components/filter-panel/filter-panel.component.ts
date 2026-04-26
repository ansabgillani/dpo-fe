import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  DEFAULT_FILTER_VALUES,
  FilterOptions,
  FilterValues
} from '@core/models/project.model';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { SelectComponent, SelectOption } from '../../../../ui/base/select/select.component';
import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-filter-panel',
  standalone: true,
  imports: [CommonModule, SelectComponent, ButtonComponent, SkeletonBlockComponent],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss'
})
export class FilterPanelComponent {
  @Input() options: FilterOptions = {
    departments: [],
    businessLines: [],
    types: []
  };
  @Input() values: FilterValues = { ...DEFAULT_FILTER_VALUES };
  @Input() loading = false;

  @Output() valuesChange = new EventEmitter<FilterValues>();
  @Output() search = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  get departmentOptions(): SelectOption[] {
    return this.options.departments.map((value) => ({ label: value, value }));
  }

  get businessLineOptions(): SelectOption[] {
    return this.options.businessLines.map((value) => ({ label: value, value }));
  }

  get typeOptions(): SelectOption[] {
    return this.options.types.map((value) => ({ label: value, value }));
  }

  onDepartmentChange(value: string): void {
    this.emitValues({ ...this.values, department: value });
  }

  onBusinessLineChange(value: string): void {
    this.emitValues({ ...this.values, businessLine: value });
  }

  onTypeChange(value: string): void {
    this.emitValues({ ...this.values, type: value });
  }

  onSearch(): void {
    this.search.emit();
  }

  onReset(): void {
    this.reset.emit();
  }

  private emitValues(values: FilterValues): void {
    this.valuesChange.emit(values);
  }
}
