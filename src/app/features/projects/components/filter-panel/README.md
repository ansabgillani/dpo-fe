# FilterPanelComponent

## Purpose
Provides landing page filters for Department, Business Line, and Type using shared atoms.

## Inputs
- `options`: dropdown option sets from API.
- `values`: current selected filter values.
- `loading`: disables controls and renders skeleton placeholders.

## Outputs
- `valuesChange`: emitted whenever a filter value changes.
- `search`: emitted when user clicks Search.
- `reset`: emitted when user clicks Reset.

## Notes
- Uses only atom primitives (`dpo-select`, `dpo-button`, `dpo-skeleton-block`).
- All interactive controls include `data-cy` hooks.
