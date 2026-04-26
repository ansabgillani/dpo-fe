import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dpo-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'icon' | 'nav-item' | 'nav-active' = 'primary';
  @Input() stretch = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() label = '';
  @Input() dataCy = 'button-action';

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled || this.loading) {
      return;
    }

    this.clicked.emit();
  }
}
