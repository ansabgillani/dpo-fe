import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CostSubView } from '@core/models/cost.model';
import { ButtonComponent } from '../../../../ui/base/button/button.component';

@Component({
  selector: 'dpo-cost-sub-nav',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './cost-sub-nav.component.html',
  styleUrl: './cost-sub-nav.component.scss'
})
export class CostSubNavComponent {
  @Input() activeView: CostSubView = 'overview';

  @Output() viewChange = new EventEmitter<CostSubView>();

  readonly views: Array<{ key: CostSubView; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'breakdown', label: 'Breakdown' }
  ];

  onSelect(view: CostSubView): void {
    this.viewChange.emit(view);
  }
}