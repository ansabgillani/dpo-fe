# E2E Workflows

## Run Instructions

1. Start mock API server:
   - `npm run mock:server`
2. Start Angular app:
   - `npm start`
3. Run Cypress headed:
   - `npm run cypress:open`
4. Run Cypress headless:
   - `npm run cypress:run`

## File Map

- Cypress config: `cypress.config.ts`
- E2E specs root: `cypress/e2e/`
- Mock server entry: `mock-server/server.js`
- Mock routes:
  - `mock-server/routes/projects.routes.js`
  - `mock-server/routes/filters.routes.js`
  - `mock-server/routes/logs.routes.js`

## Selector Convention

- Interactive elements must use `data-cy`.
- Format: `[component]-[element]`.
- Cypress selectors must use `data-cy` only (no class or tag selectors).

## Error Simulation

- Any API route supports `?simulateError=true`.
- Example:
  - `GET /api/projects?simulateError=true` returns HTTP 500 with mock error payload.

## Role Switching Guide

- Auth is currently stubbed in `src/app/core/services/auth.service.ts`.
- Default role is `manager`.
- For role-based E2E checks, update the mock user role in `getUser()` and rerun specs.
- Supported roles: `viewer`, `manager`, `admin`.
