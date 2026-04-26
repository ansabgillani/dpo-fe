# Confirm Dialog Component

`dpo-confirm-dialog` is the root-mounted confirmation dialog for destructive actions.

## Responsibilities

- Subscribes to `ConfirmDialogService.dialog$`.
- Renders title and message from `ConfirmDialogConfig`.
- Emits confirm and cancel actions through the service.
- Uses default labels when custom labels are not provided.

## Interaction Contract

- Host: `AppComponent`
- State owner: `ConfirmDialogService`
- Used by feature flows before DELETE or other destructive writes

## Data-Cy Selectors

- `confirm-dialog-overlay`
- `confirm-dialog-card`
- `confirm-dialog-cancel`
- `confirm-dialog-confirm`
