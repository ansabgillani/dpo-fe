# BudgetChartComponent

Renders the Overview budget trend chart using `ng2-charts` + Chart.js.

## Inputs
- `datasets`: list of line series with `label` and numeric `data` for Jan-Dec.

## Behavior
- Uses a fixed 12-month X-axis (`Jan` to `Dec`).
- Displays legend above the chart.
- Keeps chart concerns isolated from container components.

## Data-cy
- Root chart container: `budget-chart`
