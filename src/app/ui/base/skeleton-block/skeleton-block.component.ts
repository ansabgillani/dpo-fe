import { Component, Input } from '@angular/core';

@Component({
  selector: 'dpo-skeleton-block',
  standalone: true,
  imports: [],
  templateUrl: './skeleton-block.component.html',
  styleUrl: './skeleton-block.component.scss'
})
export class SkeletonBlockComponent {
  @Input() width = '100%';
  @Input() height = '16px';
  @Input() borderRadius = '6px';

}
