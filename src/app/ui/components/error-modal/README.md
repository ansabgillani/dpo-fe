# Error Modal Component

`dpo-error-modal` is the root-mounted blocking modal for runtime and HTTP failures.

## Responsibilities

- Subscribes to `ErrorModalService.error$`.
- Renders a Level 1 style error dialog with title and message.
- Supports retry-first behavior via `retryFn`.
- Supports redirect behavior (for auth failures) via `redirectUrl`.
- Falls back to closing the modal when no action handlers exist.

## Interaction Contract

- Host: `AppComponent`
- State owner: `ErrorModalService`
- Triggered by: `HttpErrorInterceptor` and global error handler workflow

## Data-Cy Selectors

- `error-modal-overlay`
- `error-modal-card`
- `error-modal-primary`
