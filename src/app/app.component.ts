import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ConfirmDialogComponent } from './ui/components/confirm-dialog/confirm-dialog.component';
import { ErrorModalComponent } from './ui/components/error-modal/error-modal.component';

@Component({
  selector: 'dpo-root',
  imports: [RouterOutlet, ErrorModalComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
