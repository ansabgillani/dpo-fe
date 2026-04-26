# InlineEditFieldComponent

Reusable inline editor used by project sidebar metadata and PSP item names.

## Inputs
- `fieldKey`: unique key used for state coordination and selector suffixes.
- `label`: display label.
- `value`: current field value.
- `saveFn`: save callback returning `Observable<void>`.
- `activeEditField`: currently active field key (from parent).

## Outputs
- `editStarted(fieldKey)`
- `editCancelled(fieldKey)`

## Internal States
- `display`
- `editing`
- `saving`
- `error`

## Notes
Parent enforces one-active-editor behavior by controlling `activeEditField`.
