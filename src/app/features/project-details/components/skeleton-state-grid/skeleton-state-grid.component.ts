import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-skeleton-state-grid',
  standalone: true,
  imports: [CommonModule, SkeletonBlockComponent],
  templateUrl: './skeleton-state-grid.component.html',
  styleUrl: './skeleton-state-grid.component.scss'
})
export class SkeletonStateGridComponent {
  readonly items = Array.from({ length: 6 });
}
