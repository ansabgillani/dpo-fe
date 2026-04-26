import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from '../../../../ui/base/button/button.component';

@Component({
  selector: 'dpo-tab-nav',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './tab-nav.component.html',
  styleUrl: './tab-nav.component.scss'
})
export class TabNavComponent {
  @Input() tabs: string[] = [];
  @Input() activeTabIndex = 0;

  @Output() tabSelected = new EventEmitter<number>();

  onSelect(index: number): void {
    this.tabSelected.emit(index);
  }
}
