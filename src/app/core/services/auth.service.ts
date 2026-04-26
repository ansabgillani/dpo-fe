import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { UI_CONFIG } from '../../ui-config';
import { AuthUser } from '../models/auth.model';

interface TokenPair {
  access: string;
  refresh: string;
}

interface ApiMeUser {
  id: number;
  username: string;
  full_name?: string;
  roles?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'dpo-access-token';
  private static readonly REFRESH_TOKEN_KEY = 'dpo-refresh-token';
  private static readonly ROLE_OVERRIDE_KEY = 'dpo-user-role';

  private loginRequest$?: Observable<string>;

  constructor(private readonly http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.ensureAccessToken().pipe(
      map((token) => !!token),
      catchError(() => of(false))
    );
  }

  getUser(): Observable<AuthUser> {
    const roleOverride = this.getRoleOverride();

    return this.ensureAccessToken().pipe(
      switchMap(() => this.http.get<ApiMeUser>(`${UI_CONFIG.api.baseUrl}/users/me/`)),
      map((user) => ({
        id: String(user.id),
        name: user.full_name || user.username,
        role: roleOverride || this.mapBackendRole(user.roles)
      })),
      catchError(() =>
        of({
          id: '1',
          name: 'Mock Manager',
          role: roleOverride || 'manager'
        })
      )
    );
  }

  getAccessTokenForRequest(): Observable<string> {
    return this.ensureAccessToken();
  }

  getStoredAccessToken(): string | null {
    return this.getAccessToken();
  }

  logout(): void {
    globalThis.localStorage?.removeItem(AuthService.ACCESS_TOKEN_KEY);
    globalThis.localStorage?.removeItem(AuthService.REFRESH_TOKEN_KEY);
  }

  private ensureAccessToken(): Observable<string> {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      return of(accessToken);
    }

    if (this.loginRequest$) {
      return this.loginRequest$;
    }

    // FIXME: Temporary auto-authentication on app startup.
    // Since no login UI exists yet, the app auto-authenticates with hardcoded
    // testuser credentials. Remove this and implement proper login flow when
    // login infrastructure is ready. See IMPLEMENTATION_NOTES.md for context.
    this.loginRequest$ = this.http
      .post<TokenPair>(`${UI_CONFIG.api.baseUrl}/auth/token/`, {
        username: 'testuser',
        password: 'dpobackenduser'
      })
      .pipe(
        tap((tokens) => {
          globalThis.localStorage?.setItem(AuthService.ACCESS_TOKEN_KEY, tokens.access);
          globalThis.localStorage?.setItem(AuthService.REFRESH_TOKEN_KEY, tokens.refresh);
        }),
        map((tokens) => tokens.access),
        finalize(() => {
          this.loginRequest$ = undefined;
        }),
        shareReplay(1)
      );

    return this.loginRequest$;
  }

  private getAccessToken(): string | null {
    return globalThis.localStorage?.getItem(AuthService.ACCESS_TOKEN_KEY) || null;
  }

  private getRoleOverride(): AuthUser['role'] | null {
    const override = globalThis.localStorage?.getItem(AuthService.ROLE_OVERRIDE_KEY);
    if (override === 'viewer' || override === 'manager' || override === 'admin') {
      return override;
    }
    return null;
  }

  private mapBackendRole(rawRoles?: string): AuthUser['role'] {
    const value = (rawRoles || '').toLowerCase();
    if (value.includes('admin')) {
      return 'admin';
    }
    if (value.includes('viewer')) {
      return 'viewer';
    }
    return 'manager';
  }
}
