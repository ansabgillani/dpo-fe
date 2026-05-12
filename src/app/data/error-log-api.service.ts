import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UI_CONFIG } from '../ui-config';
import { ErrorLog } from '@core/models/error-log.model';

@Injectable({ providedIn: 'root' })
export class ErrorLogApiService {
  constructor(private readonly http: HttpClient) {}

  postLog(entry: ErrorLog): Observable<unknown> {
    return this.http.post(`${UI_CONFIG.api.baseUrl}/logs`, entry);
  }
}
