import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UI_CONFIG } from '../../ui-config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isApiRequest(req.url) || this.isAuthRoute(req.url)) {
      return next.handle(req);
    }

    return this.authService.getAccessTokenForRequest().pipe(
      switchMap((accessToken) =>
        next.handle(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`
            }
          })
        )
      )
    );
  }

  private isApiRequest(url: string): boolean {
    return url.includes(UI_CONFIG.api.baseUrl);
  }

  private isAuthRoute(url: string): boolean {
    // /auth/token/ also covers /auth/token/refresh/ and /auth/token/verify/ by substring match
    return url.includes('/auth/token/') || url.includes('/logs');
  }
}
