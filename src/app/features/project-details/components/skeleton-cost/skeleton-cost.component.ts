import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-skeleton-cost',
  standalone: true,
  imports: [CommonModule, SkeletonBlockComponent],
  templateUrl: './skeleton-cost.component.html',
  styleUrl: './skeleton-cost.component.scss'
})
export class SkeletonCostComponent {
  readonly cardItems = Array.from({ length: 4 });
}