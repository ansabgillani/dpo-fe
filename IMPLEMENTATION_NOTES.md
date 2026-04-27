# Implementation Notes

## Temporary Auto-Authentication (v0 - No Login UI)

### Status
Active. The app force-authenticates with hardcoded credentials on every `/projects` page load.

### Why
- No login UI exists yet — users cannot manually authenticate
- The app is connected to a real backend at `http://localhost:8000/api/v1`
- Stale `mock-access-*` tokens from the old mock server era in localStorage cause 401s
  against the real backend, so we force-clear and re-auth on every `/projects` visit

### How It Works
1. User navigates to `/` → redirected to `/projects`
2. `AuthGuard.canActivate()` runs → `AuthService.isAuthenticated()` → `ensureAccessToken()`
3. If token exists in localStorage, guard allows access
4. `LandingComponent.ngOnInit()` calls `AuthService.forceAuthenticate()`:
   - Clears any stored access + refresh tokens from localStorage
   - Resets the in-flight login request deduplicator
   - POSTs to `POST /api/v1/auth/token/` with:
     - username: `testuser`
     - password: `dpobackenduser`
5. On success: real JWT stored in localStorage, `loadFilters()` and `loadProjects()` fire
6. `AuthInterceptor` picks up the stored JWT and adds `Authorization: Bearer <token>` to all API calls

### Key Locations
| What | Where |
|------|-------|
| Force auth method | `src/app/core/services/auth.service.ts` — `forceAuthenticate()` |
| Called from | `src/app/features/projects/landing.component.ts` — `ngOnInit()` |
| Credentials in auth call | `src/app/core/services/auth.service.ts` — `ensureAccessToken()` |
| Token added to requests | `src/app/core/interceptors/auth.interceptor.ts` |
| Backend URL config | `public/env.js` + `.env` — `DPO_API_BASE_URL=http://localhost:8000/api/v1` |

### Next Steps — Proper Login Implementation
When login infrastructure is ready:

1. **Remove `forceAuthenticate()` call** from `LandingComponent.ngOnInit()`
2. **Remove `forceAuthenticate()` method** from `AuthService`
3. **Update `ensureAccessToken()`** to NOT have hardcoded credentials — throw instead
4. **Create login UI** with username/password form
5. **Update `AuthGuard`** to redirect to `/login` on auth failure (already does this)
6. **Wire `LoginComponent`** to call `AuthService.login(username, password)` on submit
7. **Add token refresh** logic for when access tokens expire

### Credentials (development only)
- **Username:** `testuser`
- **Password:** `dpobackenduser`
- **Backend:** `http://localhost:8000/api/v1`
