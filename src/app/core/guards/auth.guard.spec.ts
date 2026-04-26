import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Router, UrlTree } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: { isAuthenticated: jest.Mock };
  let router: { parseUrl: jest.Mock };

  beforeEach(() => {
    authService = {
      isAuthenticated: jest.fn()
    };

    router = {
      parseUrl: jest.fn().mockReturnValue({} as UrlTree)
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('allows activation when authenticated', async () => {
    authService.isAuthenticated.mockReturnValue(of(true));
    await expect(firstValueFrom(guard.canActivate())).resolves.toBe(true);
  });

  it('redirects when not authenticated', async () => {
    authService.isAuthenticated.mockReturnValue(of(false));

    await firstValueFrom(guard.canActivate());

    expect(router.parseUrl).toHaveBeenCalledTimes(1);
  });
});
