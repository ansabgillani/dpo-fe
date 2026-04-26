import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { format } from 'date-fns';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'dpo-date-picker',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  @Input() value = '';
  @Input() disabled = false;
  @Input() dataCy = 'date-picker';

  @Output() dateSelected = new EventEmitter<string>();

  get displayValue(): string {
    if (!this.value) {
      return '';
    }

    return format(new Date(this.value), 'MM/dd/yyyy');
  }

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dateSelected.emit(target.value);
  }

}
