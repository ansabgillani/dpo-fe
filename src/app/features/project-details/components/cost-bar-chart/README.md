# CostBarChartComponent

Grouped bar chart used in the Cost tab Overview sub-view.

## Inputs
- `groups`: x-axis labels (`Forecast`, `Budget`, `Actuals`, `FC + Actuals`).
- `datasets`: bar series entries with `label`, `data`, and `color`.

## Behavior
- Renders a responsive `ng2-charts` bar chart.
- Keeps legend visible above chart.
- Uses tokenized card-style chart container.

## Data-cy
- Chart container: `cost-bar-chart`