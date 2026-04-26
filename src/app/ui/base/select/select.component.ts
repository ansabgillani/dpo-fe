import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'dpo-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnChanges {
  @Input() options: SelectOption[] = [];
  @Input()
  set value(nextValue: string) {
    this.currentValue = nextValue ?? '';
    this.resolvedValue = this.resolveValue();
  }
  @Input() disabled = false;
  @Input() dataCy = 'select-field';
  @Input() variant: 'outlined' | 'filled' = 'outlined';
  @Input() includeAllOption = false;
  @Input() allLabel = 'All';

  @Output() valueChange = new EventEmitter<string>();

  private currentValue = '';
  private resolvedValue = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] || changes['includeAllOption']) {
      this.resolvedValue = this.resolveValue();
    }
  }

  get selectedValue(): string {
    return this.resolvedValue;
  }

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const nextValue = target.value;

    if (nextValue === this.currentValue) {
      return;
    }

    this.currentValue = nextValue;
    this.resolvedValue = this.resolveValue();
    this.valueChange.emit(this.currentValue);
  }

  private resolveValue(): string {
    if (
      this.currentValue &&
      this.options.some((option) => option.value === this.currentValue)
    ) {
      return this.currentValue;
    }

    if (this.includeAllOption) {
      return '';
    }

    return this.options[0]?.value ?? '';
  }
}
