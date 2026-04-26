import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dpo-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent implements OnChanges {
  @Input() avatarUrl = '';
  @Input() initials = 'SH';
  @Input() dataCy = 'avatar';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  hasImageError = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['avatarUrl']) {
      this.hasImageError = false;
    }
  }

  onImageError(): void {
    this.hasImageError = true;
  }

  get sizeClass(): string {
    return `avatar-size-${this.size}`;
  }

}
