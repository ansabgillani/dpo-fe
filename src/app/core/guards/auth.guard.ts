import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { UI_CONFIG } from '../../ui-config';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) =>
      isAuthenticated ? true : router.parseUrl(UI_CONFIG.api.loginUrl)
    )
  );
};
