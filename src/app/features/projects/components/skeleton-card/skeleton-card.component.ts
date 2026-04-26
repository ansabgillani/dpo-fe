import { Component } from '@angular/core';

import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-skeleton-card',
  standalone: true,
  imports: [SkeletonBlockComponent],
  templateUrl: './skeleton-card.component.html',
  styleUrl: './skeleton-card.component.scss'
})
export class SkeletonCardComponent {}
