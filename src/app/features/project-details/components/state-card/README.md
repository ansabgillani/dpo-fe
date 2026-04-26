# StateCardComponent

State metric card used in the State tab.

## Inputs
- `card`: state metric data item.
- `trend`: precomputed `KpiTrendResult` from calculator layer.
- `canEdit`: controls narrative edit affordance.

## Outputs
- `narrativeSaved({ cardId, narrative })`
- `narrativeCancelled(cardId)`

## Behavior
- Renders icon, label, value, and trend indicator.
- Applies tier-colored left border (`green/yellow/red`).
- For editable roles, supports inline narrative edit with confirm/cancel.
