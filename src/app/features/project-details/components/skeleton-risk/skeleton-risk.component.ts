import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-skeleton-risk',
  standalone: true,
  imports: [CommonModule, SkeletonBlockComponent],
  templateUrl: './skeleton-risk.component.html',
  styleUrl: './skeleton-risk.component.scss'
})
export class SkeletonRiskComponent {
  readonly cardItems = Array.from({ length: 3 });
}
