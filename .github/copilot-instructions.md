# DPO Agent Rulebook

> Read this before writing any code. For full specs, data models, and component details, read `PLANNING.md`. This file is about **how to behave**, not what to build.

---

## The Application

Siemens Healthineers **Digital Project Office** — Angular SPA, desktop-only (`1280px` min), custom SASS, Lucide icons, Jest + Cypress, Express mock server on port `3001` (`npm run mock:server`).

Two routes: `/projects` (landing) and `/project/:id` (details, 6 tabs: Overview → State → Milestone → Cost → Risk → Files).

---

## Hard Rules — Never Violate

1. **No hardcoded values in SCSS.** Every color, size, spacing, and radius must use a CSS custom property from `_tokens.scss`. Source of truth: `src/app/ui-config.ts` + `src/styles/_tokens.scss`.

2. **No `@media` queries.** Desktop-only. None. Ever.

3. **No direct icon imports.** All icons go through `<dpo-icon name="...">`. Only `ui/base/icon/icon.component.ts` imports from `lucide-angular`.

4. **No `console.*` in components or services.** All logging via `ErrorLoggerService.log()`. It handles both console output and `POST /api/logs`.

5. **No optimistic updates.** Every write follows confirm-then-refetch (see below).

6. **No inline trend calculations.** Call functions from `core/kpi-calculators/index.ts`. Components receive `KpiTrendResult` as `@Input()`.

7. **No risk option arrays in components.** Call functions from `core/risk-field-configs/index.ts` in `ngOnInit`.

8. **No `showError()` calls in services.** Only `HttpErrorInterceptor` calls `ErrorModalService.showError()`. Services log + rethrow.

9. **No raw HTML elements in feature components.** Use atoms from `ui/base/`. No bare `<button>`, `<input>`, `<select>`, `<svg>` in `features/`.

10. **No missing `data-cy` attributes.** Every interactive element needs one before the component is done. Format: `data-cy="[component]-[element]"`. Cypress uses `data-cy` only — never class or tag selectors.

11. **Never edit `PLANNING.md`.** Deviations go in `docs/adr/`.

---

## Component Tiers

```
ui/base/          ← Atoms: primitives, no business logic
ui/components/    ← Molecules + Organisms: composed from atoms
ui/layouts/       ← Page shells: structure only, no data fetching
features/         ← Pages: orchestrate services + atoms, never style raw HTML
```

Every atom exposes only `@Input()` / `@Output()`. No library-specific code leaks out. When the internal Siemens UI library arrives, only atom templates change — all consumers stay untouched.

---

## Confirm-Then-Refetch (every write operation)

```
user confirms → UI enters saving state (spinner, inputs disabled)
             → fire PUT / POST / DELETE
             → success: fire scoped GET → re-render → exit saving state
             → failure: Level 1 error modal (correct ERR_ code) → revert UI
```

Re-fetch scope per operation is in `PLANNING.md` Section 6.8 Decision 8. Deletes always show `ConfirmDialogComponent` first.

---

## State Ownership

| State | Owner |
|---|---|
| Filter values + selected project | `FilterStateService` — persists across navigation |
| Current project detail | `ProjectService` — re-fetches on `ActivatedRoute.params` change |
| Active tab + cost sub-nav index | `ProjectService` — preserved on project switch |
| Error modal | `ErrorModalService` — lives at `AppComponent` root |
| Confirm dialog | `ConfirmDialogService` — lives at `AppComponent` root |
| Auth user | `AuthService` — `isAuthenticated()` returns `of(true)`, role `'manager'` by default |

Project selector navigates via `Router.navigate(['/project', newId])` — never manually swaps state.

---

## API Rules

- Base URL always from `UI_CONFIG.api.baseUrl` — never hardcoded
- All mock routes support `?simulateError=true` → returns `500` (used by Cypress)
- Every `catchError` uses one of the exact error codes in `PLANNING.md` Section 4.15
- `ErrorLoggerService` POSTs every log to `POST /api/logs` — fire-and-forget, failure silently swallowed

---

## Auth Stub

- `AuthService` returns `of(true)` + mock manager user — all users pre-authenticated
- `AuthGuard` on every route — when SSO arrives, only `AuthService` changes
- Role-gated UI: parent component reads role once, passes `canEdit: boolean` as `@Input()` to children — children never call `AuthService` directly

---

## Testing

**Jest:** Every component, service, guard, interceptor, calculator, and config function has a co-located `.spec.ts`. A component is not complete without it.

**Cypress:** One file per tab (see `PLANNING.md` Section 7.2). `data-cy` selectors only. Use `cy.intercept()` for all mocking. `res.setDelay(1500)` to test skeletons. `?simulateError=true` to test error modals.

---

## Documentation (mandatory — not optional)

| When | What to write |
|---|---|
| End of every phase | Update `docs/STATE.md` (what's built, stubbed, pending, test counts) |
| Any architectural decision | `docs/adr/ADR-NNN-title.md` (Context / Decision / Rationale / Consequences) |
| Any deviation from `PLANNING.md` | ADR required — no undocumented deviations |
| Any lesson learned mid-build | Append to `docs/LESSONS.md` immediately — never batch |
| Every organism component | `[component]/README.md` committed with the component |
| Phase 1 | Create `docs/E2E-WORKFLOWS.md` — keep it executable throughout |

**Do not start the next phase until `STATE.md` is updated and all phase ADRs are written.**

---

## Done Checklist (run before marking any component complete)

- [ ] Renders correctly for all valid input combinations
- [ ] Skeleton shown when `isLoading = true`; empty/error state when data is null
- [ ] All interactive elements have `data-cy="..."` attributes
- [ ] No hardcoded values in `.scss`
- [ ] No direct `lucide-angular` imports — all icons via `<dpo-icon>`
- [ ] No `console.*` calls — `ErrorLoggerService` used instead
- [ ] `.spec.ts` exists and all tests pass
- [ ] `README.md` written (organisms required, non-obvious atoms too)
- [ ] Write operations use confirm-then-refetch
- [ ] Role-gated UI receives `canEdit` as `@Input()`, not computed internally

## Workflow Orchestration
### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity
## 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution 
### 3. Self-Improvement Loop
- After ANY correction from the user: update tasks/lessons.md with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project 
### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness 
### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes -- don't over-engineer
- Challenge your own work before presenting it 
### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -- then resolve them
- Zero context switching required from the user
- Go fix failing Cl tests without being told how
## Task Management
1. Plan First: Write plan to tasks/todo.md with checkable items
2. Verify Plan: Check in before starting implementation
3. Track Progress: Mark items complete as you go
4. Explain Changes: High-level summary at each step
5. Document Results: Add review section to tasks/todo.md
6. Capture Lessons: Update tasks/lessons.md after corrections
## Core Principles
- Simplicity First: Make every change as simple as possible. Impact minimal code.
- No Laziness: Find root causes. No temporary fixes. Senior developer standards.
- Minimal Impact: Only touch what's necessary. No side effects with new bugs.