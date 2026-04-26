# StateTabComponent

State tab container for six KPI state cards.

## Responsibilities
- Fetches state cards for current project.
- Resolves role once from `AuthService` and passes `canEdit` to child cards.
- Computes trend results using calculator functions.
- Saves all narrative updates via confirm-then-refetch (`ProjectService.saveState`).

## Data-cy
- Root: `state-tab`
- Grid: `state-tab-grid`
- Save button: `state-tab-save`
- Loading skeleton: `skeleton-state-grid`
