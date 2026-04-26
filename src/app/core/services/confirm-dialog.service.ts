import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ConfirmDialogConfig } from '../models/confirm-dialog.model';

interface ActiveConfirmDialog {
  config: ConfirmDialogConfig;
  responder: Subject<boolean>;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly state = new BehaviorSubject<ActiveConfirmDialog | null>(null);
  readonly dialog$ = this.state.asObservable();

  open(config: ConfirmDialogConfig): Observable<boolean> {
    const responder = new Subject<boolean>();
    this.state.next({ config, responder });
    return responder.asObservable();
  }

  confirm(): void {
    const active = this.state.value;
    if (!active) {
      return;
    }

    active.responder.next(true);
    active.responder.complete();
    this.state.next(null);
  }

  cancel(): void {
    const active = this.state.value;
    if (!active) {
      return;
    }

    active.responder.next(false);
    active.responder.complete();
    this.state.next(null);
  }
}
