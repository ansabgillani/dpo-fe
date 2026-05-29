# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Digital Project Office (DPO)** — a Siemens Healthineers Angular 19 SPA for internal project management. Desktop-only (1280px minimum). Two primary routes: `/projects` (landing with filter/list) and `/project/:id` (detail view with 6 tabs: Overview, State, Milestone, Cost, Risk, Files).

## Commands

```bash
# Development
npm start                  # Dev server at http://localhost:4200 (uses .env)
npm run mock:server        # Mock Express API server on port 3001

# Testing
npm test                   # Jest unit tests (--runInBand)
npm test:watch             # Jest watch mode
npm run cypress:open       # Cypress interactive runner
npm run cypress:run        # Headless Cypress (auto-starts mock server + frontend)

# Build & Lint
npm run build              # Production build to dist/
npm run lint               # ESLint (@angular-eslint)
```

**Environment**: Runtime config is injected from `.env` into `public/env.js` via `scripts/generate-runtime-env.mjs` before startup. Key vars: `DPO_API_BASE_URL`, `DPO_AUTO_AUTH_USERNAME`, `DPO_AUTO_AUTH_PASSWORD`. Test env uses `.env.test` with mock server at `http://localhost:3001/api/v1`.

## Architecture

```
src/app/
├── core/
│   ├── services/          ProjectService, FilterStateService, AuthService,
│   │                      ErrorModalService, ConfirmDialogService, ErrorLoggerService
│   ├── interceptors/      AuthInterceptor (headers), HttpErrorInterceptor (→ ErrorModalService)
│   ├── guards/            authGuard (all routes except /login)
│   ├── models/            TypeScript interfaces
│   ├── kpi-calculators/   trend calculation functions (use these, never inline)
│   └── risk-field-configs/ risk dropdown option functions (use these, never inline)
├── data/
│   └── project-api.service.ts   All HTTP calls to backend
├── features/
│   ├── projects/          LandingComponent (lazy-loaded)
│   ├── project-details/   ProjectDetailsComponent + 6 tab components (lazy-loaded)
│   └── login/
└── ui/
    ├── base/              Atoms — primitives, @Input/@Output only
    ├── components/        Molecules + Organisms (modals, dialogs)
    └── layouts/           Page shells (structure only, no data fetching)
```

**State management**: RxJS BehaviorSubjects, no NgRx. `ProjectService` owns active tab index and project data. `FilterStateService` owns filter values and selected project (persists across navigation). `ErrorModalService` / `ConfirmDialogService` dispatch root-level overlay events.

**Write pattern**: Every mutation follows confirm-then-refetch — UI sets saving state → API call → scoped GET refetch → clear saving state. No optimistic updates.

**Path alias**: `@core/*` → `src/app/core/*`

**Runtime config**: Read from `globalThis.__DPO_ENV__` via `ui-config.ts`, which also exports centralized colors, typography, spacing, and sizes.

## Hard Rules (Never Violate)

1. No hardcoded SCSS values — use CSS custom properties from `_tokens.scss` (defined in `ui-config.ts`)
2. No `@media` queries (desktop-only app)
3. All icons via `<dpo-icon name="...">` — never raw SVG or Lucide directly
4. No `console.*` — use `ErrorLoggerService.log()`
5. No optimistic updates — always confirm-then-refetch
6. No inline trend logic — use functions from `core/kpi-calculators/`
7. No inline risk option arrays — use functions from `core/risk-field-configs/`
8. Only `HttpErrorInterceptor` calls `ErrorModalService.showError()`
9. No raw HTML in feature components — compose from `ui/base/` atoms
10. Every interactive element must have a `data-cy` attribute (Cypress selectors only — never class/tag selectors in tests)

## Testing

- **Unit**: Jest co-located `.spec.ts` files. Run single test: `npm test -- --testPathPattern=<filename>`
- **E2E**: Cypress, one file per tab in `cypress/e2e/`. Use `data-cy` selectors exclusively.
- **Mock server**: `mock-server/server.js` (Express). All endpoints support `?simulateError=true`.

## API Endpoints (via ProjectApiService)

Base: `DPO_API_BASE_URL` (default `http://localhost:8000/api/v1`)

Key resources: `/projects/`, `/statuses/`, `/milestones/`, `/cost-projects/`, `/product-costs/`, `/risks/`, `/psp-mappings/`, `/files`, `/filters/projects`. Error logging: `POST /api/logs`.
