import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'dpo-file-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent {
  @Input() disabled = false;
  @Input() dataCy = 'file-input';

  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  open(): void {
    if (this.disabled) {
      return;
    }

    this.fileInput?.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.fileSelected.emit(file);
    }

    if (input) {
      input.value = '';
    }
  }
}
