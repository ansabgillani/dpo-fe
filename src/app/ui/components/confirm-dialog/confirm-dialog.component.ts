import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { ButtonComponent } from '../../base/button/button.component';

@Component({
  selector: 'dpo-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  readonly dialog$;

  constructor(private readonly confirmDialogService: ConfirmDialogService) {
    this.dialog$ = this.confirmDialogService.dialog$;
  }

  onConfirm(): void {
    this.confirmDialogService.confirm();
  }

  onCancel(): void {
    this.confirmDialogService.cancel();
  }

}
