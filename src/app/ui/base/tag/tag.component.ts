import { Component, Input } from '@angular/core';

@Component({
  selector: 'dpo-tag',
  standalone: true,
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  @Input() text = 'Active';

}
