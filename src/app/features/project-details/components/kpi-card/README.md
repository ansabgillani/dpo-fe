# KpiCardComponent

Reusable KPI display card for Overview metrics and cost tiles.

## Inputs
- `label`: metric title.
- `value`: primary number/value to show.
- `trend`: `KpiTrendResult` from calculator layer.
- `iconName`: icon token rendered through `dpo-icon`.

## Behavior
- Shows trend direction and tier color (green/yellow/red) from `trend.tier`.
- Used across Overview KPI grid and FY/Prod cost cards.

## Data-cy
- Card root: `kpi-card-{normalized-label}`
