import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-skeleton-milestone-list',
  standalone: true,
  imports: [CommonModule, SkeletonBlockComponent],
  templateUrl: './skeleton-milestone-list.component.html',
  styleUrl: './skeleton-milestone-list.component.scss'
})
export class SkeletonMilestoneListComponent {
  readonly items = Array.from({ length: 7 });
}
