import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorModalService } from '@core/services/error-modal.service';
import { ButtonComponent } from '../../base/button/button.component';
import { IconComponent } from '../../base/icon/icon.component';

@Component({
  selector: 'dpo-error-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent {
  readonly error$;

  constructor(
    private readonly errorModalService: ErrorModalService,
    private readonly router: Router
  ) {
    this.error$ = this.errorModalService.error$;
  }

  onPrimaryAction(redirectUrl?: string, retryFn?: () => void): void {
    if (retryFn) {
      retryFn();
      return;
    }

    if (redirectUrl) {
      void this.router.navigateByUrl(redirectUrl);
      return;
    }

    this.errorModalService.hide();
  }

}
