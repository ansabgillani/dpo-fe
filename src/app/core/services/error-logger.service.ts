import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UI_CONFIG } from '../../ui-config';
import { ErrorLog } from '../models/error-log.model';

type RemoteTransport = (entry: ErrorLog) => void;

@Injectable({ providedIn: 'root' })
export class ErrorLoggerService {
  private remoteTransport?: RemoteTransport;

  constructor(private readonly http: HttpClient) {}

  setRemoteTransport(fn: RemoteTransport): void {
    this.remoteTransport = fn;
  }

  log(
    level: ErrorLog['level'],
    errorCode: string,
    message: string,
    context?: Record<string, unknown>,
    originalError?: unknown
  ): void {
    const entry: ErrorLog = {
      timestamp: new Date().toISOString(),
      level,
      errorCode,
      message,
      context,
      originalError
    };

    if (level === 'error') {
      console.error(entry);
    } else if (level === 'warn') {
      console.warn(entry);
    } else {
      console.log(entry);
    }

    this.http.post(`${UI_CONFIG.api.baseUrl}/logs`, entry).subscribe({
      error: () => {
        // Remote log failures are intentionally ignored.
      }
    });

    if (this.remoteTransport) {
      this.remoteTransport(entry);
    }
  }
}
