# Implementation Notes

## Temporary Auto-Authentication (v0 - No Login UI)

### Status
Currently implemented and active. The application auto-authenticates on startup using hardcoded testuser credentials.

### Why
Since no login UI infrastructure exists yet, users cannot manually log in. To enable the app to function, auto-authentication was implemented as a temporary measure.

### How It Works
1. On app startup, the `AuthGuard` checks if the user is authenticated
2. `AuthGuard` calls `AuthService.isAuthenticated()`
3. `AuthService.isAuthenticated()` calls `ensureAccessToken()`
4. `ensureAccessToken()` checks localStorage for a stored access token
5. If no token exists, it posts to `/api/v1/auth/token/` with:
   - username: `testuser`
   - password: `dpobackenduser`
6. The returned access token is stored in localStorage and used for all subsequent API requests

### Location
**File:** `src/app/core/services/auth.service.ts` (lines 71-99)  
**FIXME marker:** Line 81 (explains the temporary nature)

### Next Steps - Proper Login Implementation
When login infrastructure is ready:

1. **Remove auto-auth** from `AuthService.ensureAccessToken()`
2. **Create login UI** component with username/password fields
3. **Update routing** to redirect unauthenticated users to `/login` instead of auto-authenticating
4. **Add manual login flow** so users can input their own credentials
5. **Test logout flow** and session expiration handling

### Related Code
- `src/app/features/login/login.component.ts` - Future login form implementation
- `src/app/core/guards/auth.guard.ts` - Route protection (triggers auto-auth)
- `src/app/core/interceptors/auth.interceptor.ts` - Adds Bearer token to requests
- Mock server: `mock-server/routes/v1/auth.routes.js` - Authenticates /auth/token/ requests

### Credentials
- **Username:** testuser
- **Password:** dpobackenduser
- These are test credentials on the mock backend for development only
