import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { KpiTrendResult } from '@core/kpi-calculators';
import { StateCard } from '@core/models/state-card.model';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { InputComponent } from '../../../../ui/base/input/input.component';

@Component({
  selector: 'dpo-state-card',
  standalone: true,
  imports: [CommonModule, IconComponent, InputComponent, ButtonComponent],
  templateUrl: './state-card.component.html',
  styleUrl: './state-card.component.scss'
})
export class StateCardComponent {
  @Input({ required: true }) card!: StateCard;
  @Input({ required: true }) trend!: KpiTrendResult;
  @Input() canEdit = false;

  @Output() narrativeSaved = new EventEmitter<{ cardId: string; narrative: string }>();
  @Output() narrativeCancelled = new EventEmitter<string>();

  isEditing = false;
  draftNarrative = '';

  get tierClass(): string {
    return `tier-${this.trend.tier}`;
  }

  get statusLabel(): string {
    if (this.card.value >= 80) {
      return 'Healthy';
    }

    if (this.card.value >= 50) {
      return 'At Risk';
    }

    if (this.card.value > 0) {
      return 'Unhealthy';
    }

    return 'N/A';
  }

  get trendIconName(): string {
    if (this.trend.direction === 'up') {
      return 'trending-up';
    }

    if (this.trend.direction === 'down') {
      return 'trending-down';
    }

    return 'minus';
  }

  get metricIconName(): string {
    switch (this.card.key) {
      case 'quality':
        return 'shield-check';
      case 'budget':
      case 'target-cost':
        return 'circle-dollar-sign';
      case 'resources':
        return 'users';
      case 'timeline':
        return 'clock';
      case 'customer-satisfaction':
        return 'smile';
      default:
        return 'target';
    }
  }

  onStartEdit(): void {
    if (!this.canEdit) {
      return;
    }

    this.draftNarrative = this.card.narrative;
    this.isEditing = true;
  }

  onNarrativeChange(value: string): void {
    this.draftNarrative = value;
  }

  onConfirmNarrative(): void {
    this.isEditing = false;
    this.narrativeSaved.emit({ cardId: this.card.id, narrative: this.draftNarrative });
  }

  onCancelNarrative(): void {
    this.isEditing = false;
    this.draftNarrative = this.card.narrative;
    this.narrativeCancelled.emit(this.card.id);
  }
}
