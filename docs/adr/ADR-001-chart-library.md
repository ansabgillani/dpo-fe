# ADR-001: Chart Library Selection

## Context
The Overview tab in project details requires a line chart with:
- Three datasets (Budget, Actuals + Forecasts, Charging Actuals + Forecasts)
- Angular component integration
- Predictable rendering in desktop layouts
- Testability with Jest/Cypress in the current workspace

## Decision
Use `ng2-charts` with `chart.js` for the Overview budget chart implementation.

## Rationale
- `ng2-charts` provides an Angular-first wrapper around Chart.js primitives.
- Chart.js covers required line chart features with minimal custom glue code.
- The ecosystem is mature and broadly documented.
- The implementation stays isolated in `BudgetChartComponent`, keeping future replacement scope small.

## Consequences
- Jest requires ESM transform allow-list updates for chart-related dependencies.
- Canvas APIs in jsdom can emit non-blocking warnings during tests.
- If Siemens internal charting standards change later, replacement can be localized to chart components.
