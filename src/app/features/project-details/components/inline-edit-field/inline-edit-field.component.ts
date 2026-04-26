import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { InputComponent } from '../../../../ui/base/input/input.component';

type EditState = 'display' | 'editing' | 'saving' | 'error';

@Component({
  selector: 'dpo-inline-edit-field',
  standalone: true,
  imports: [CommonModule, InputComponent, ButtonComponent, IconComponent],
  templateUrl: './inline-edit-field.component.html',
  styleUrl: './inline-edit-field.component.scss'
})
export class InlineEditFieldComponent implements OnChanges {
  @Input({ required: true }) fieldKey = '';
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = '';
  @Input() layout: 'stacked' | 'inline' = 'stacked';
  @Input() activeEditField: string | null = null;
  @Input() inputType: 'text' | 'textarea' = 'text';
  @Input() saveFn: (value: string) => Observable<void> = () => of(undefined);

  @Output() editStarted = new EventEmitter<string>();
  @Output() editCancelled = new EventEmitter<string>();
  @Output() saveFailed = new EventEmitter<string>();

  draftValue = '';
  state: EditState = 'display';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.state === 'display') {
      this.draftValue = this.value;
    }

    if (changes['activeEditField'] && this.activeEditField !== this.fieldKey && this.state === 'editing') {
      this.state = 'display';
      this.draftValue = this.value;
    }
  }

  onEditStart(): void {
    this.draftValue = this.value;
    this.state = 'editing';
    this.editStarted.emit(this.fieldKey);
  }

  onDraftChange(nextValue: string): void {
    this.draftValue = nextValue;
  }

  onCancel(): void {
    this.draftValue = this.value;
    this.state = 'display';
    this.editCancelled.emit(this.fieldKey);
  }

  onConfirm(): void {
    this.state = 'saving';

    this.saveFn(this.draftValue).subscribe({
      next: () => {
        this.value = this.draftValue;
        this.state = 'display';
      },
      error: () => {
        this.draftValue = this.value;
        this.state = 'error';
        this.saveFailed.emit(this.fieldKey);
      }
    });
  }

  onDismissError(): void {
    this.state = 'display';
  }
}
