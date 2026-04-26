import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CostSection } from '@core/models/cost.model';

@Component({
  selector: 'dpo-cost-overview-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cost-overview-card.component.html',
  styleUrl: './cost-overview-card.component.scss'
})
export class CostOverviewCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) section!: CostSection;

  toKiloEuro(value: number): string {
    return `${value}k€`;
  }

  get dataCyId(): string {
    return this.title.toLowerCase().replaceAll(' ', '-').replaceAll('+', 'plus');
  }
}