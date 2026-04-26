import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-skeleton-kpi-grid',
  standalone: true,
  imports: [CommonModule, SkeletonBlockComponent],
  templateUrl: './skeleton-kpi-grid.component.html',
  styleUrl: './skeleton-kpi-grid.component.scss'
})
export class SkeletonKpiGridComponent {
  readonly items = Array.from({ length: 6 });
}
