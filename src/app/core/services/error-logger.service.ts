import { Injectable } from '@angular/core';

import { ErrorLogApiService } from '../../data/error-log-api.service';
import { ErrorLog } from '../models/error-log.model';

type RemoteTransport = (entry: ErrorLog) => void;

@Injectable({ providedIn: 'root' })
export class ErrorLoggerService {
  private remoteTransport?: RemoteTransport;

  constructor(private readonly errorLogApi: ErrorLogApiService) {}

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

    this.errorLogApi.postLog(entry).subscribe({
      error: () => {
        // Remote log failures are intentionally ignored.
      }
    });

    if (this.remoteTransport) {
      this.remoteTransport(entry);
    }
  }
}
