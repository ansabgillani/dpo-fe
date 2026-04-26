import { ErrorHandler, Injectable } from '@angular/core';

import { ErrorLoggerService } from '../services/error-logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly errorLogger: ErrorLoggerService) {}

  handleError(error: unknown): void {
    this.errorLogger.log('error', 'ERR_UNKNOWN', 'Unhandled application exception', undefined, error);
  }
}
