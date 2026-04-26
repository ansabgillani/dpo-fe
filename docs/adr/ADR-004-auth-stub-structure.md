# ADR-004: Auth Stub Structure

## Context

Phase 1 requires route protection and role-aware rendering before real SSO integration. Feature components must not depend directly on identity provider details.

## Decision

- Introduce `AuthService` with stubbed implementations:
  - `isAuthenticated()` returns `of(true)`.
  - `getUser()` returns a mock manager user.
  - `logout()` remains a no-op.
- Protect all app routes with `AuthGuard`.
- On unauthenticated state, `AuthGuard` redirects using `UI_CONFIG.api.loginUrl`.
- Keep role checks at parent-feature level and pass `canEdit` via inputs.

## Rationale

- Preserves a stable API for feature code while auth backend evolves.
- Enables early implementation of role-gated UX and route protection.
- Reduces future SSO migration blast radius to the auth layer.

## Consequences

- Current behavior is permissive by default for development.
- Real auth integration later should only change `AuthService` internals.
- Guard and role-driven tests remain valid during SSO rollout.
