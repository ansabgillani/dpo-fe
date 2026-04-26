import { Component } from '@angular/core';

import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-skeleton-sidebar',
  standalone: true,
  imports: [SkeletonBlockComponent],
  templateUrl: './skeleton-sidebar.component.html',
  styleUrl: './skeleton-sidebar.component.scss'
})
export class SkeletonSidebarComponent {}