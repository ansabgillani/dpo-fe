# Phase 1 Plan

- [x] Read `copilot-instructions.md`, `PLANNING.md`, `TASKS.md` in order
- [x] Audit scaffold and dependencies
- [x] Configure Jest + Cypress + aliases + style token pipeline
- [x] Implement atoms under `src/app/ui/base`
- [x] Implement core models/services/guard/interceptor/error handler
- [x] Implement root modal components and mount them in app root
- [x] Implement KPI calculators and risk field configs
- [x] Expand mock server routes/data/logging with `simulateError` support
- [x] Add required docs and ADRs for Phase 1
- [x] Run tests and verify Phase 1 exit criteria

## Review
- `npm test` passes (30 suites, 66 tests).
- `npm run mock:check` passes.
- Route smoke checks passed for filters/projects/state/milestones/cost/risks/files/logs.
- No hardcoded hex/px values remain in SCSS files outside `src/styles/_tokens.scss`.

# Phase 7 Verification + Phase 8 Plan (Mar 31, 2026)

- [x] Re-verify Phase 7 checklist status in TASKS + STATE
- [x] Run full Jest suite (`npm test`) and review failures
- [x] Run all Cypress suites (`npm run cypress:run`) and review failures
- [x] Address any regressions found during full-suite verification
- [x] Implement Phase 8 Risk tab components + services per TASKS
- [x] Add Phase 8 Jest specs + Cypress suite (E2E-063 to E2E-073)
- [x] Write Phase 8 ADR + READMEs and update docs/STATE
- [x] Re-run targeted Phase 8 tests and verify exit criteria

## Review
- `npm test` passes (60 suites, 136 tests). Noted jsdom canvas warnings from chart rendering.
- `npm run cypress:run` passes (62 tests).
- `npm test -- src/app/features/project-details/tabs/risk/risk-tab.component.spec.ts src/app/features/project-details/components/skeleton-risk/skeleton-risk.component.spec.ts src/app/features/project-details/components/risk-heatmap/risk-heatmap.component.spec.ts src/app/features/project-details/components/risk-card/risk-card.component.spec.ts` passes.
- `npm run cypress:run -- --spec cypress/e2e/project-details/risk.cy.ts` passes (11 tests).

# Phase 8 Doc Check + Phase 9 Plan (Mar 31, 2026)

- [x] Verify Phase 8 documentation + checklists (TASKS/STATE/ADRs/READMEs)
- [x] Implement Phase 9 Files tab components + wiring
- [x] Add Phase 9 Jest specs + Cypress suite (E2E-074 to E2E-083)
- [x] Write Phase 9 READMEs + update docs/STATE + docs/LESSONS
- [x] Re-run targeted Phase 9 tests and verify exit criteria

## Review
- `npm test -- src/app/ui/base/file-input/file-input.component.spec.ts src/app/features/project-details/components/file-row/file-row.component.spec.ts src/app/features/project-details/components/skeleton-file-list/skeleton-file-list.component.spec.ts src/app/features/project-details/tabs/files/files-tab.component.spec.ts src/app/core/services/project.service.spec.ts` passes (5 suites, 22 tests).
- `npm run cypress:run -- --spec cypress/e2e/project-details/files.cy.ts` passes (10 tests).

# Final Delivery Checklist (Mar 31, 2026)

- [x] Run full Jest suite (`npm test`) and record results
- [x] Run full Cypress suite (`npx cypress run`) and record results
- [x] Verify code quality checks (no hardcoded SCSS values, no console usage, no stray lucide imports, data-cy coverage)
- [x] Verify architecture checks (AuthGuard on routes, @defer on tabs, ProjectService re-fetch on route params)
- [x] Verify documentation checks (STATE, E2E-WORKFLOWS, LESSONS, ADRs, README coverage)
- [x] Update TASKS Final Delivery Checklist with verified items

## Review
- `npm test` passes (68 suites, 156 tests). Note: jsdom canvas warnings from chart rendering remain.
- `npx cypress run` passes (83 tests). Note: Cypress reported a non-fatal warning about trashing previous run results.
- `npm run lint` passes (note: Node warns about non-LTS version).

# ESLint Setup (Mar 31, 2026)

- [x] Install ESLint + Angular ESLint packages
- [x] Add ESLint config and ignore files
- [x] Add `npm run lint` script and Angular lint target
- [x] Run lint and record results

## Review
- `npm run lint` passes.

# Backend Follow-Up Integration Plan (Apr 26, 2026)

- [x] Align frontend contracts with backend follow-up APIs
- [x] Update mock server contracts for files, filters, trends, overview, and milestone id semantics
- [x] Refactor files tab to backend-driven file DTO and upload validation handling
- [x] Switch runtime API base URL resolution to `.env` / `.env.test` generated runtime config
- [x] Ensure Cypress test runs start and use mock server as source of truth
- [x] Update impacted unit tests and project docs (`STATE`, `README`)
- [x] Run verification (`npm test`, mock server check, targeted Cypress command)

## Review
- `npm test` passes (71 suites, 182 tests).
- `npm run mock:check` passes (health, auth, projects, filters/projects, status-trends, overview-chart, filters/milestone-sets, files all verified).
- Runtime env resolution via `.env` / `.env.test` → `public/env.js` → `window.__DPO_ENV__` confirmed complete.
- Cypress runner (`scripts/run-cypress-with-mock.mjs`) starts mock server + Angular app from `.env.test` before each run.
