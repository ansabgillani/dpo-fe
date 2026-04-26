import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { of } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: { getAccessTokenForRequest: jest.Mock };

  beforeEach(() => {
    authService = {
      getAccessTokenForRequest: jest.fn(() => of('mock-access-admin'))
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: AuthService, useValue: authService }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('adds Authorization header for protected api requests', () => {
    http.get('http://localhost:3001/api/v1/projects/').subscribe();

    const request = httpMock.expectOne('http://localhost:3001/api/v1/projects/');
    expect(request.request.headers.get('Authorization')).toBe('Bearer mock-access-admin');
    request.flush({});
  });

  it('skips auth header for token request', () => {
    http.post('http://localhost:3001/api/v1/auth/token/', {}).subscribe();

    const request = httpMock.expectOne('http://localhost:3001/api/v1/auth/token/');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ access: 'a', refresh: 'b' });
  });

  it('skips auth header for log requests to prevent infinite loop on log failure', () => {
    http.post('http://localhost:3001/api/v1/logs', {}).subscribe();

    const request = httpMock.expectOne('http://localhost:3001/api/v1/logs');
    expect(request.request.headers.has('Authorization')).toBe(false);
    expect(authService.getAccessTokenForRequest).not.toHaveBeenCalled();
    request.flush({});
  });
});
