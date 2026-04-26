# RiskCardComponent

Editable risk card with confirm-then-refetch field controls.

## Inputs
- `risk`: risk entry data.
- `disabled`: disables inputs and save actions.

## Outputs
- `fieldSaved({ riskId, field, value })`

## Behavior
- Loads risk select options from config functions on init.
- Emits a save event per field confirmation.
- Uses text inputs, selects, date picker, and textareas per field type.
