import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UI_CONFIG } from '../../ui-config';
import { ErrorModalConfig } from '../models/error-modal.model';
import { ErrorLoggerService } from '../services/error-logger.service';
import { ErrorModalService } from '../services/error-modal.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly errorLogger: ErrorLoggerService,
    private readonly errorModalService: ErrorModalService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Log POSTs are fire-and-forget; intercepting them would cause an infinite
    // loop (failure → log → failure → log → …).
    if (req.url.includes('/logs')) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: unknown) => {
        const httpError = error as HttpErrorResponse;
        const errorCode = this.getErrorCode(req.url, req.method, httpError.status);

        this.errorLogger.log(
          'error',
          errorCode,
          'HTTP request failed',
          { url: req.url, method: req.method, status: httpError.status },
          error
        );

        if (!this.shouldSuppressModal(req.url, req.method, httpError.status)) {
          this.errorModalService.showError(this.toModalConfig(httpError.status, errorCode));
        }

        return throwError(() => error);
      })
    );
  }

  private shouldSuppressModal(url: string, method: string, status: number): boolean {
    if (method === 'GET' && url.includes('/projects/') && url.includes('/overview-chart')) {
      return true;
    }
    // 400 on file upload = server-side validation rejection (e.g. FILE_TOO_LARGE);
    // let the service/component show the specific message instead.
    if (method === 'POST' && url.includes('/files') && status === 400) {
      return true;
    }
    return false;
  }

  private toModalConfig(status: number, errorCode: string): ErrorModalConfig {
    if (status === 401 || status === 403) {
      return {
        level: 1,
        title: 'Access Denied',
        message: 'Your session has expired or you do not have permission to view this page.',
        errorCode,
        redirectUrl: UI_CONFIG.api.loginUrl
      };
    }

    return {
      level: 1,
      title: 'Something went wrong',
      message: 'We could not complete your request. Please try again.',
      errorCode
    };
  }

  private getErrorCode(url: string, method: string, status: number): string {
    if (status === 401) {
      return 'ERR_AUTH_401';
    }

    if (status === 403) {
      return 'ERR_AUTH_403';
    }

    if (url.includes('/statuses/') && method !== 'GET') {
      return 'ERR_SAVE_STATE';
    }

    if (url.includes('/statuses/') && method === 'GET') {
      return 'ERR_FETCH_STATE';
    }

    if (url.includes('/status-trends') && method === 'GET') {
      return 'ERR_FETCH_STATE';
    }

    if (url.includes('/projects/') && url.includes('/overview-chart') && method === 'GET') {
      return 'ERR_FETCH_PROJECT_DETAIL';
    }

    if (url.includes('/milestones/') && method === 'GET') {
      return 'ERR_FETCH_MILESTONES';
    }

    if (url.includes('/milestones/') && method !== 'GET') {
      return 'ERR_UPDATE_MILESTONE';
    }

    if (
      url.includes('/cost-projects/') ||
      url.includes('/cost-breakdowns/') ||
      url.includes('/products/') ||
      url.includes('/product-costs/')
    ) {
      return 'ERR_FETCH_COST';
    }

    if (url.includes('/risks/')) {
      return 'ERR_FETCH_RISKS';
    }

    if (url.endsWith('/projects') || url.endsWith('/projects/')) {
      return 'ERR_FETCH_PROJECTS';
    }

    if (url.includes('/filters')) {
      return 'ERR_FETCH_FILTERS';
    }

    if (url.includes('/files')) {
      return method === 'GET' ? 'ERR_FETCH_FILES' : 'ERR_FILE_UPLOAD';
    }

    if (/\/projects\/\d+\/?$/.test(url)) {
      return 'ERR_FETCH_PROJECT_DETAIL';
    }

    return 'ERR_UNKNOWN';
  }
}
