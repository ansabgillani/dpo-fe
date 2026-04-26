import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { UI_CONFIG } from '../../ui-config';
import { ErrorLoggerService } from './error-logger.service';

describe('ErrorLoggerService', () => {
  let service: ErrorLoggerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ErrorLoggerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('logs error and posts to remote endpoint', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    service.log('error', 'ERR_TEST', 'test message', { test: true });

    const request = httpMock.expectOne(`${UI_CONFIG.api.baseUrl}/logs`);
    expect(request.request.method).toBe('POST');
    request.flush({ ok: true });
    expect(errorSpy).toHaveBeenCalledTimes(1);

    errorSpy.mockRestore();
  });

  it('uses custom remote transport when configured', () => {
    const transport = jest.fn();
    const infoSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    service.setRemoteTransport(transport);
    service.log('info', 'ERR_TEST', 'test message');

    const request = httpMock.expectOne(`${UI_CONFIG.api.baseUrl}/logs`);
    request.flush({ ok: true });
    expect(transport).toHaveBeenCalledTimes(1);

    infoSpy.mockRestore();
  });
});
