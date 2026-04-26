# MilestoneRowComponent

Renders one milestone row in the Milestone tab.

## Inputs
- `milestone`: milestone name, set, and start/end dates.

## Outputs
- `startDateChange({ milestoneId, date })`
- `endDateChange({ milestoneId, date })`

## Behavior
- Displays milestone name and two date pickers.
- Emits date changes so parent can perform confirm-then-refetch update.
- Shows a tier-colored trend icon for visual timing status.
