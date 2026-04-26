import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    globalThis.localStorage?.clear();
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('returns true for isAuthenticated after silent login', async () => {
    const promise = firstValueFrom(service.isAuthenticated());

    const tokenRequest = httpMock.expectOne('http://localhost:3001/api/v1/auth/token/');
    expect(tokenRequest.request.method).toBe('POST');
    tokenRequest.flush({ access: 'mock-access-admin', refresh: 'mock-refresh-admin' });

    await expect(promise).resolves.toBe(true);
    httpMock.verify();
  });

  it('returns mapped user from /users/me', async () => {
    const promise = firstValueFrom(service.getUser());

    httpMock.expectOne('http://localhost:3001/api/v1/auth/token/').flush({
      access: 'mock-access-admin',
      refresh: 'mock-refresh-admin'
    });

    httpMock.expectOne('http://localhost:3001/api/v1/users/me/').flush({
      id: 1,
      username: 'admin',
      full_name: 'Admin User',
      roles: 'Admin'
    });

    await expect(promise).resolves.toEqual(
      expect.objectContaining({
        id: '1',
        name: 'Admin User',
        role: 'admin'
      })
    );
    httpMock.verify();
  });

  it('logout clears stored tokens', () => {
    globalThis.localStorage?.setItem('dpo-access-token', 'x');
    globalThis.localStorage?.setItem('dpo-refresh-token', 'y');

    service.logout();

    expect(globalThis.localStorage?.getItem('dpo-access-token')).toBeNull();
    expect(globalThis.localStorage?.getItem('dpo-refresh-token')).toBeNull();
    httpMock.verify();
  });
});
