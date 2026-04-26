# CostTabComponent

Cost tab container for Overview, Monthly, and Breakdown sub-views.

## Responsibilities
- Fetches cost data with Project/FY/PSP filters and breakdown mode.
- Renders shared header KPI, reporting period, and sub-nav toggle.
- Switches sub-views between Overview, Monthly table, and Breakdown layouts.
- Handles Product mode edits via confirm-then-refetch.
- Persists active sub-view index via `ProjectService`.

## Data-cy
- Root: `cost-tab`
- Sub-nav: `cost-sub-nav`
- Project filter: `cost-filter-project`
- FY filter: `cost-filter-fy`
- PSP filter: `cost-filter-psp-project`
- Period label: `cost-reporting-period`