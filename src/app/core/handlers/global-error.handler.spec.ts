import { TestBed } from '@angular/core/testing';
import { describe, expect, it, jest } from '@jest/globals';

import { GlobalErrorHandler } from './global-error.handler';
import { ErrorLoggerService } from '../services/error-logger.service';

describe('GlobalErrorHandler', () => {
  it('logs unhandled errors through ErrorLoggerService', () => {
    const logger = {
      log: jest.fn()
    } as unknown as ErrorLoggerService;

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: ErrorLoggerService, useValue: logger }
      ]
    });

    const handler = TestBed.inject(GlobalErrorHandler);
    const error = new Error('boom');

    handler.handleError(error);

    expect(logger.log).toHaveBeenCalledWith(
      'error',
      'ERR_UNKNOWN',
      'Unhandled application exception',
      undefined,
      error
    );
  });
});
