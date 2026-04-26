import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ErrorLoggerService } from '../services/error-logger.service';
import { ErrorModalService } from '../services/error-modal.service';
import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let logger: { log: jest.Mock };
  let errorModal: { showError: jest.Mock };

  beforeEach(() => {
    logger = { log: jest.fn() };
    errorModal = { showError: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        },
        { provide: ErrorLoggerService, useValue: logger },
        { provide: ErrorModalService, useValue: errorModal }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps /filters failures to ERR_FETCH_FILTERS and shows modal', (done) => {
    http.get('/api/filters').subscribe({
      next: () => done(new Error('expected error')),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(logger.log).toHaveBeenCalledWith(
          'error',
          'ERR_FETCH_FILTERS',
          'HTTP request failed',
          expect.objectContaining({ url: '/api/filters', method: 'GET', status: 500 }),
          expect.anything()
        );
        expect(errorModal.showError).toHaveBeenCalledTimes(1);
        done();
      }
    });

    const request = httpMock.expectOne('/api/filters');
    request.flush({ message: 'fail' }, { status: 500, statusText: 'Server Error' });
  });

  it('maps 401 failures to auth error and redirect modal', (done) => {
    http.get('/api/projects').subscribe({
      next: () => done(new Error('expected error')),
      error: () => {
        expect(logger.log).toHaveBeenCalledWith(
          'error',
          'ERR_AUTH_401',
          'HTTP request failed',
          expect.objectContaining({ status: 401 }),
          expect.anything()
        );
        expect(errorModal.showError).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Access Denied',
            redirectUrl: expect.any(String)
          })
        );
        done();
      }
    });

    const request = httpMock.expectOne('/api/projects');
    request.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('suppresses modal for overview chart fetch failures', (done) => {
    http.get('/api/projects/1/overview-chart').subscribe({
      next: () => done(new Error('expected error')),
      error: () => {
        expect(logger.log).toHaveBeenCalledWith(
          'error',
          'ERR_FETCH_PROJECT_DETAIL',
          'HTTP request failed',
          expect.objectContaining({ url: '/api/projects/1/overview-chart', method: 'GET', status: 404 }),
          expect.anything()
        );
        expect(errorModal.showError).not.toHaveBeenCalled();
        done();
      }
    });

    const request = httpMock.expectOne('/api/projects/1/overview-chart');
    request.flush({ message: 'not found' }, { status: 404, statusText: 'Not Found' });
  });

  it('passes log requests through without logging or showing modal', (done) => {
    http.post('/api/v1/logs', {}).subscribe({
      next: () => {
        expect(logger.log).not.toHaveBeenCalled();
        expect(errorModal.showError).not.toHaveBeenCalled();
        done();
      },
      error: done
    });

    const request = httpMock.expectOne('/api/v1/logs');
    request.flush({ ok: true });
  });

  it('suppresses modal for 400 file upload validation errors', (done) => {
    http.post('/api/v1/projects/1/files', new FormData()).subscribe({
      next: () => done(new Error('expected error')),
      error: () => {
        expect(logger.log).toHaveBeenCalledWith(
          'error',
          'ERR_FILE_UPLOAD',
          'HTTP request failed',
          expect.objectContaining({ method: 'POST', status: 400 }),
          expect.anything()
        );
        expect(errorModal.showError).not.toHaveBeenCalled();
        done();
      }
    });

    const request = httpMock.expectOne('/api/v1/projects/1/files');
    request.flush(
      { error: 'File exceeds maximum size of 50 MB', code: 'FILE_TOO_LARGE', maxBytes: 52428800 },
      { status: 400, statusText: 'Bad Request' }
    );
  });
});
