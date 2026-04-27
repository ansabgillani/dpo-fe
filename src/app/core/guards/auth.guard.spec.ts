import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Router, UrlTree } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: { isAuthenticated: jest.Mock };
  let router: { parseUrl: jest.Mock };

  beforeEach(() => {
    authService = { isAuthenticated: jest.fn() };
    router = { parseUrl: jest.fn().mockReturnValue({} as UrlTree) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  const runGuard = () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    return isObservable(result) ? firstValueFrom(result as Observable<boolean | UrlTree>) : Promise.resolve(result);
  };

  it('allows activation when authenticated', async () => {
    authService.isAuthenticated.mockReturnValue(of(true));
    await expect(runGuard()).resolves.toBe(true);
  });

  it('redirects when not authenticated', async () => {
    authService.isAuthenticated.mockReturnValue(of(false));
    await runGuard();
    expect(router.parseUrl).toHaveBeenCalledTimes(1);
  });
});
