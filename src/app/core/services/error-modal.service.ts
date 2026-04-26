import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ErrorModalConfig } from '../models/error-modal.model';

@Injectable({ providedIn: 'root' })
export class ErrorModalService {
  private readonly state = new BehaviorSubject<ErrorModalConfig | null>(null);
  readonly error$ = this.state.asObservable();

  showError(config: ErrorModalConfig): void {
    this.state.next(config);
  }

  hide(): void {
    this.state.next(null);
  }
}
