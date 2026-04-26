import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SkeletonBlockComponent } from '../../../../ui/base/skeleton-block/skeleton-block.component';

@Component({
  selector: 'dpo-skeleton-file-list',
  standalone: true,
  imports: [CommonModule, SkeletonBlockComponent],
  templateUrl: './skeleton-file-list.component.html',
  styleUrl: './skeleton-file-list.component.scss'
})
export class SkeletonFileListComponent {
  readonly rowItems = Array.from({ length: 6 });
}
