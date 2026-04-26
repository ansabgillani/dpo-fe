# Build State

## Phase 1 Status: Complete

### Completed

- Angular strict project scaffolding with guarded routes.
- Jest configured (`jest.config.ts`, `setup-jest.ts`) and passing.
- Cypress configured (`cypress.config.ts`, `baseUrl: http://localhost:4200`).
- Token system in place via `src/app/ui-config.ts` and `src/styles/_tokens.scss`.
- Base atoms created with specs:
  - Button, Input, Select, Icon, Avatar, Badge, Tag, Divider, SkeletonBlock, DatePicker.
- Core infrastructure created with specs:
  - AuthService, ErrorLoggerService, ErrorModalService, ConfirmDialogService,
  - AuthGuard, HttpErrorInterceptor, GlobalErrorHandler.
- Root modal components created and mounted in app root:
  - ErrorModalComponent, ConfirmDialogComponent.
- KPI calculator module created with six calculators, index export, and tests.
- Risk field config module created with four config functions, index export, and tests.
- Mock server modularized:
  - `projects.routes.js`, `filters.routes.js`, `logs.routes.js`.
  - Data files added: `projects.json`, `filters.json`.
  - Global `simulateError=true` handling for `/api/*` routes.
  - Frontend logs append to `mock-server/logs/frontend.log`.
- Placeholder logo asset added:
  - `src/assets/images/siemens-healthineers-logo.svg`.
- Phase docs added:
  - `docs/adr/ADR-004-auth-stub-structure.md`
  - `docs/adr/ADR-007-lucide-icon-wrapper.md`
  - `docs/E2E-WORKFLOWS.md`

### Verification Snapshot

- `npm test`: passing (`30` suites, `66` tests).
- `npm run mock:check`: passing.
- Mock route smoke checks completed for filters, projects, state, milestones, cost, risks, files, logs.

### Pending

- None for Phase 1 checklist.

## Phase 2 Status: Complete

### Completed

- Layouts implemented under `ui/layouts/`:
  - `PageShellComponent`
  - `PageHeaderComponent`
  - `ThreeColumnLayoutComponent`
- Landing domain model added:
  - `core/models/project.model.ts`
- Services implemented:
  - `FilterStateService`
  - `ProjectService.getFilters()`
  - `ProjectService.getProjects(filters?)`
- Landing page implemented:
  - `LandingComponent` now orchestrates filters + projects fetch on init
  - Filter/search/reset flow wired to `FilterStateService`
  - Preview selection persists via selected project state
- Landing components added:
  - `FilterPanelComponent`
  - `ProjectListComponent`
  - `ProjectCardComponent`
  - `ProjectPreviewComponent`
  - `SkeletonCardComponent`
- Routing updates:
  - `/projects` now lazy-loads `LandingComponent`
  - Open actions navigate to `/project/:id`
- Documentation added:
  - `docs/adr/ADR-002-state-management-approach.md`
  - `docs/adr/ADR-005-skeleton-composition-pattern.md`
  - `README.md` for `FilterPanelComponent`
  - `README.md` for `ProjectPreviewComponent`

### Verification Snapshot

- `npm test`: passing (`39` suites, `81` tests).
- `npm run mock:check`: passing.
- `npm run build`: passing (landing route emitted as lazy chunk `landing-component`).
- Cypress landing suite: passing (`16/16` tests in `cypress/e2e/landing.cy.ts`).

### Pending

- None for Phase 2 checklist.

## Phase 3 Status: Complete

### Completed

- `ProjectService` extended with:
  - `getProjectDetail(id)`
  - `getStateCards(id)`
  - active tab BehaviorSubject state (`activeTabIndex$`, `getActiveTabIndex`, `setActiveTabIndex`)
- `ProjectDetailsComponent` implemented as three-column shell:
  - route-driven refetch on `/project/:id` param changes
  - project selector-driven navigation to `/project/:newId`
  - tab selection persisted through `ProjectService`
  - center and right skeleton states while project detail is loading
- Shell components wired and used:
  - `ProjectSelectorComponent`
  - `TabNavComponent`
  - `ProjectSidebarComponent`
  - `SkeletonSidebarComponent`
- Overview tab implemented:
  - `OverviewComponent`
  - `KpiCardComponent`
  - `BudgetChartComponent`
  - `SkeletonKpiGridComponent`
  - FY/Prod cost cards rendered via KPI cards
- New specs added:
  - `src/app/core/services/project.service.spec.ts`
  - `src/app/features/project-details/project-details.component.spec.ts`
  - `src/app/features/project-details/components/project-selector/project-selector.component.spec.ts`
  - `src/app/features/project-details/components/tab-nav/tab-nav.component.spec.ts`
  - `src/app/features/project-details/components/project-sidebar/project-sidebar.component.spec.ts`
  - `src/app/features/project-details/components/skeleton-sidebar/skeleton-sidebar.component.spec.ts`
  - `src/app/features/project-details/components/kpi-card/kpi-card.component.spec.ts`
  - `src/app/features/project-details/components/budget-chart/budget-chart.component.spec.ts`
  - `src/app/features/project-details/tabs/overview/overview.component.spec.ts`
- Phase 3 Cypress suites added and passing:
  - `cypress/e2e/project-details/shared.cy.ts` (E2E-017 to E2E-028)
  - `cypress/e2e/project-details/overview.cy.ts` (E2E-029 to E2E-033)
- Phase 3 documentation completed:
  - `docs/adr/ADR-001-chart-library.md`
  - `README.md` for Budget chart, KPI card, and Project sidebar components

### Verification Snapshot

- `npm test`: passing.
- `npm run build`: passing.
- `npm run cypress:run -- --spec cypress/e2e/project-details/shared.cy.ts,cypress/e2e/project-details/overview.cy.ts`: passing (`17/17` tests).

### Pending

- None for Phase 3 checklist.

## Phase 4 Status: Complete

### Completed

- Inline editing component implemented:
  - `InlineEditFieldComponent` with `display`, `editing`, `saving`, and `error` states
  - parent-provided `saveFn` wiring and active-field coordination
- Sidebar editing flows completed:
  - All metadata fields now use `InlineEditFieldComponent`
  - one-field-at-a-time editing via `activeEditField`
- PSP project management implemented in sidebar:
  - add new PSP row with confirm/cancel
  - inline PSP rename
  - PSP delete via `ConfirmDialogService` confirm flow
- Project service write APIs implemented with refetch:
  - `updateMetadata(id, field, value)`
  - `addPspProject(id, name)`
  - `deletePspProject(id, pspId)`
- Tests and E2E coverage:
  - `inline-edit-field.component.spec.ts` added and passing
  - Phase 4 E2E range validated in `cypress/e2e/project-details/shared.cy.ts` (E2E-023 to E2E-028)
- Phase 4 documentation completed:
  - `docs/adr/ADR-003-inline-edit-state-machine.md`
  - `docs/adr/ADR-006-confirm-then-refetch-scope.md`
  - `README.md` for `InlineEditFieldComponent`

### Verification Snapshot

- `npm test`: passing.
- `npm run build`: passing.
- `npm run cypress:run -- --spec cypress/e2e/project-details/shared.cy.ts,cypress/e2e/project-details/overview.cy.ts`: passing (includes E2E-023 to E2E-028).

### Pending

- None for Phase 4 checklist.

## Phase 5 Status: Complete

### Completed

- State tab implementation delivered:
  - `StateTabComponent`
  - `StateCardComponent`
  - `SkeletonStateGridComponent`
- Role gating implemented via `AuthService.getUser()`:
  - viewer role: read-only narratives
  - manager/admin role: inline narrative editing and save button
- Narrative editing interactions implemented:
  - click-to-edit textarea
  - confirm and cancel behavior
  - one-card local update flow before save-all
- State save API wiring completed:
  - `ProjectService.saveState(id, cards)` performs `PUT /api/projects/:id/state`
  - success path re-fetches `GET /api/projects/:id/state`
- Error handling updated for state save:
  - interceptor maps `PUT .../state` failures to `ERR_SAVE_STATE`
- Project details shell integration:
  - State tab wired at index 1 in `ProjectDetailsComponent`
- Tests and E2E coverage added:
  - `state-card.component.spec.ts`
  - `state-tab.component.spec.ts`
  - `cypress/e2e/project-details/state.cy.ts` (E2E-034 to E2E-042)
- Documentation completed:
  - `README.md` for `StateCardComponent`
  - `README.md` for `StateTabComponent`

### Verification Snapshot

- `npm test -- src/app/features/project-details/components/state-card/state-card.component.spec.ts src/app/features/project-details/tabs/state/state-tab.component.spec.ts src/app/core/services/project.service.spec.ts`: passing (`3/3` suites).
- `npm run cypress:run -- --spec cypress/e2e/project-details/state.cy.ts`: passing (`9/9` tests).

### Pending

- None for Phase 5 checklist.

## Phase 6 Status: Complete

### Completed

- Milestone data model and service wiring implemented:
  - `MilestoneItem` model added.
  - `ProjectService.getMilestoneSets()` added for `GET /api/filters/milestone-sets`.
  - `ProjectService.getMilestones(id, milestoneSet?)` added for milestone list fetches.
  - `ProjectService.updateMilestone(...)` added with confirm-then-refetch (`PUT` then scoped `GET`).
- Milestone tab UI implemented and integrated:
  - `MilestoneTabComponent` added with MP MS dropdown filtering.
  - loading, empty, and list render states implemented.
  - date updates wired via milestone row outputs to update API flow.
- Milestone row and skeleton components delivered:
  - `MilestoneRowComponent` with start/end date pickers and trend indicator.
  - `SkeletonMilestoneListComponent` with 7 loading rows.
- Project details shell integration completed:
  - milestone tab registered in `ProjectDetailsComponent` imports and tab switch template.
- Error handling mappings expanded:
  - interceptor maps milestones GET errors to `ERR_FETCH_MILESTONES`.
  - interceptor maps milestone PUT errors to `ERR_UPDATE_MILESTONE`.
- Phase 6 tests and docs added:
  - Jest specs for milestone row and milestone tab.
  - Cypress suite `cypress/e2e/project-details/milestone.cy.ts` (E2E-043 to E2E-049).
  - README docs for milestone row and milestone tab components.

### Verification Snapshot

- `npm test -- src/app/features/project-details/components/milestone-row/milestone-row.component.spec.ts src/app/features/project-details/tabs/milestone/milestone-tab.component.spec.ts`: passing (`2/2` suites, `6/6` tests).
- `npm run cypress:run -- --spec cypress/e2e/project-details/milestone.cy.ts`: passing (`7/7` tests).

### Pending

- None for Phase 6 checklist.

## Phase 7 Status: Complete

### Completed

- Cost tab implementation delivered and wired in project details:
  - `CostTabComponent` added at tab index 3 in `ProjectDetailsComponent`.
  - Shared header includes Project Cost KPI, reporting period, and three filter controls.
  - Cost sub-navigation controls provided for Overview, Monthly, and Breakdown flows.
- Cost view components delivered:
  - `CostSubNavComponent`
  - `CostOverviewCardComponent`
  - `CostBarChartComponent`
  - `CostTableComponent`
  - `CostBreakdownRowComponent`
  - `CostDetailTableComponent`
  - `SkeletonCostComponent`
- Service and API support completed:
  - `ProjectService.getCostData(id, filters)` wired to `GET /api/projects/:id/cost`.
  - `ProjectService.updateCostBreakdown(...)` wired with confirm-then-refetch behavior.
  - Mock server route added for `PUT /api/projects/:id/cost/breakdown/:productId`.
  - Error interceptor mapping includes `ERR_FETCH_COST` for cost fetch failures.
- Test coverage completed:
  - Jest specs added for all required Phase 7 cost components.
  - Cypress suite `cypress/e2e/project-details/cost.cy.ts` covers E2E-050 to E2E-062.

### Verification Snapshot

- `npm test -- src/app/features/project-details/components/cost-sub-nav/cost-sub-nav.component.spec.ts src/app/features/project-details/components/cost-overview-card/cost-overview-card.component.spec.ts src/app/features/project-details/components/cost-bar-chart/cost-bar-chart.component.spec.ts src/app/features/project-details/components/cost-table/cost-table.component.spec.ts src/app/features/project-details/components/cost-breakdown-row/cost-breakdown-row.component.spec.ts src/app/features/project-details/components/cost-detail-table/cost-detail-table.component.spec.ts src/app/features/project-details/tabs/cost/cost-tab.component.spec.ts`: passing (`7/7` suites, `10/10` tests).
- `npm run cypress:run -- --spec cypress/e2e/project-details/cost.cy.ts --browser electron`: passing (`13/13` tests).

### Pending

- None for Phase 7 checklist.

## Phase 8 Status: Complete

### Completed

- Risk data model and service wiring implemented:
  - `RiskData` and related types added under `core/models/`.
  - `ProjectService.getRisks`, `updateRisk`, and `addRisk` added with confirm-then-refetch behavior.
  - Mock server route added for `PUT /api/projects/:id/risks/:riskId`.
- Risk tab UI delivered and wired in project details:
  - `RiskTabComponent` added at tab index 4 with risk type filter and add button.
  - Risk heatmap and card list rendering with loading + empty states.
- Risk components delivered:
  - `RiskHeatmapComponent` renders before/after matrices.
  - `RiskCardComponent` provides field-level confirm controls.
  - `SkeletonRiskComponent` added for loading state.
- Error handling updated:
  - interceptor maps `/risks` failures to `ERR_FETCH_RISKS`.
- Phase 8 tests and docs added:
  - Jest specs for `RiskHeatmapComponent` and `RiskCardComponent`.
  - Cypress suite `cypress/e2e/project-details/risk.cy.ts` (E2E-063 to E2E-073).
  - ADR-008 and READMEs for risk tab and components.

### Verification Snapshot

- `npm test -- src/app/features/project-details/tabs/risk/risk-tab.component.spec.ts src/app/features/project-details/components/skeleton-risk/skeleton-risk.component.spec.ts src/app/features/project-details/components/risk-heatmap/risk-heatmap.component.spec.ts src/app/features/project-details/components/risk-card/risk-card.component.spec.ts`: passing (`4/4` suites, `8/8` tests).
- `npm run cypress:run -- --spec cypress/e2e/project-details/risk.cy.ts`: passing (`11/11` tests).

### Pending

- None for Phase 8 checklist.

## Phase 9 Status: Complete

### Completed

- Files tab implementation delivered and wired in project details:
  - `FilesTabComponent` added at tab index 5 with add button and empty state.
  - `FileRowComponent` renders file title, status tag, and upload/download/delete actions.
  - `SkeletonFileListComponent` added for loading state.
- Service and API support completed:
  - `ProjectService.getFiles`, `uploadFile`, and `deleteFile` wired with confirm-then-refetch behavior.
  - Error interceptor maps file GET to `ERR_FETCH_FILES` and writes to `ERR_FILE_UPLOAD`.
- Supporting atom added:
  - `FileInputComponent` wraps hidden file input for upload interactions.
- Phase 9 tests and docs added:
  - Jest specs for `FilesTabComponent`, `FileRowComponent`, `SkeletonFileListComponent`, `FileInputComponent`.
  - Cypress suite `cypress/e2e/project-details/files.cy.ts` (E2E-074 to E2E-083).
  - README docs for files tab and file row.

### Verification Snapshot

- `npm test -- src/app/ui/base/file-input/file-input.component.spec.ts src/app/features/project-details/components/file-row/file-row.component.spec.ts src/app/features/project-details/components/skeleton-file-list/skeleton-file-list.component.spec.ts src/app/features/project-details/tabs/files/files-tab.component.spec.ts src/app/core/services/project.service.spec.ts`: passing (`5/5` suites, `22/22` tests).
- `npm run cypress:run -- --spec cypress/e2e/project-details/files.cy.ts`: passing (`10/10` tests).

### Pending

- None for Phase 9 checklist.

## Backend Follow-Up Integration Status: Complete (Apr 26, 2026)

### Completed

- Frontend contracts aligned with backend v1 API DTOs:
  - `ApiFileEntry` simplified to definitive backend shape (`name`, `sizeBytes`, `contentType`, `uploadedAt`, `downloadUrl`); legacy `title?` fallback removed.
  - `ApiMilestone.milestone_set?` removed; `mapMilestone` now uses `type` only.
  - `mapFileToUi` updated to use `file.name` directly.
- Mock server contracts updated:
  - `GET /api/v1/filters/milestone-sets` added to `filters.routes.js`; returns unique milestone types from store.
  - `mock-server/check.mjs` extended to verify milestone-sets filter and files endpoints.
- Files tab refactored to backend-driven upload validation:
  - `HttpErrorInterceptor.shouldSuppressModal` extended to suppress modal on 400 file POST (server-side validation errors handled by component).
  - `uploadFile` detects 400 + `code: 'FILE_TOO_LARGE'` and emits a typed `{type: 'FILE_TOO_LARGE'}` error.
  - `FilesTabComponent.onUploadSelected` error handler shows specific modal on `FILE_TOO_LARGE`.
- `getMilestoneSets()` refactored to call `GET /api/v1/filters/milestone-sets` instead of fetching all milestones.
- Runtime API base URL already resolved via `.env` / `.env.test` → `scripts/generate-runtime-env.mjs` → `public/env.js` → `window.__DPO_ENV__`; `angular.json` serves `public/` as root asset directory. Verified complete.
- Cypress runner (`scripts/run-cypress-with-mock.mjs`) starts mock server (`mock:server:test`) and Angular app (`start:test`) from `.env.test`, waits for both, then runs Cypress. Verified complete.
- Unit tests updated:
  - `project.service.spec.ts`: added `getMilestoneSets` and `FILE_TOO_LARGE` upload tests.
  - `http-error.interceptor.spec.ts`: added 400 file upload suppression test.
  - `files-tab.component.spec.ts`: added `FILE_TOO_LARGE` modal test.

### Verification Snapshot

- `npm test`: passing (all suites, all tests).
- `npm run mock:check`: passing (health, auth, projects, filters, trends, overview-chart, milestone-sets, files all verified).

### Pending

- None for Backend Follow-Up Integration checklist.
