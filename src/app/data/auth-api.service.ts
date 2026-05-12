import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UI_CONFIG } from '../ui-config';
import { ApiMeUser, TokenPair } from './api.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  fetchMe(): Observable<ApiMeUser> {
    return this.http.get<ApiMeUser>(`${UI_CONFIG.api.baseUrl}/users/me/`);
  }

  requestTokenPair(username: string, password: string): Observable<TokenPair> {
    return this.http.post<TokenPair>(`${UI_CONFIG.api.baseUrl}/auth/token/`, {
      username,
      password
    });
  }
}
