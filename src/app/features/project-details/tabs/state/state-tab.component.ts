import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  calculateBudgetTrend,
  calculateCustomerSatisfactionTrend,
  calculateQualityTrend,
  calculateResourcesTrend,
  calculateTargetCostTrend,
  calculateTimelineTrend,
  KpiTrendResult
} from '@core/kpi-calculators';
import { StateCard } from '@core/models/state-card.model';
import { AuthService } from '@core/services/auth.service';
import { ProjectService } from '@core/services/project.service';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { SkeletonStateGridComponent } from '../../components/skeleton-state-grid/skeleton-state-grid.component';
import { StateCardComponent } from '../../components/state-card/state-card.component';

@Component({
  selector: 'dpo-state-tab',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconComponent,
    StateCardComponent,
    SkeletonStateGridComponent
  ],
  templateUrl: './state-tab.component.html',
  styleUrl: './state-tab.component.scss'
})
export class StateTabComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  @Input() projectId: number | null = null;

  cards: StateCard[] = [];
  loading = false;
  saving = false;
  canEdit = false;

  constructor(
    private readonly projectService: ProjectService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUser().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.canEdit = user.role !== 'viewer';
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['projectId']) {
      return;
    }

    if (!this.projectId) {
      this.cards = [];
      return;
    }

    this.loadStateCards(this.projectId);
  }

  onNarrativeSaved(event: { cardId: string; narrative: string }): void {
    this.cards = this.cards.map((card) =>
      card.id === event.cardId ? { ...card, narrative: event.narrative } : card
    );
  }

  onSaveState(): void {
    if (!this.projectId || this.saving || !this.canEdit) {
      return;
    }

    this.saving = true;
    this.projectService.saveState(this.projectId, this.cards).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (cards) => {
        this.cards = cards;
      },
      error: () => {
        this.saving = false;
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  getTrend(card: StateCard): KpiTrendResult {
    switch (card.key) {
      case 'quality':
        return calculateQualityTrend(card.value, card.previousValue);
      case 'budget':
        return calculateBudgetTrend(card.value, 100, card.previousValue, 100);
      case 'target-cost':
        return calculateTargetCostTrend(card.value, 100, card.previousValue, 100);
      case 'resources':
        return calculateResourcesTrend(card.value, card.previousValue);
      case 'timeline':
        return calculateTimelineTrend(card.value, card.previousValue);
      case 'customer-satisfaction':
        return calculateCustomerSatisfactionTrend(card.value, card.previousValue);
      default:
        return calculateQualityTrend(card.value, card.previousValue);
    }
  }

  private loadStateCards(projectId: number): void {
    this.loading = true;
    this.projectService.getStateCards(projectId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (cards) => {
        this.cards = cards;
      },
      error: () => {
        this.cards = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
