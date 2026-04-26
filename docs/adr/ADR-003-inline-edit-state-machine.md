# ADR-003: Inline Edit State Machine

## Context
Phase 4 requires reusable inline editing for project metadata and PSP names with consistent UX and predictable save/error behavior.

## Decision
Implement `InlineEditFieldComponent` as a four-state finite flow:
- `display`
- `editing`
- `saving`
- `error`

The parent component provides `saveFn: (value: string) => Observable<void>` and controls one-active-editor behavior with `activeEditField`.

## Rationale
- Centralizes edit UX into one reusable component.
- Reduces repeated logic across metadata and PSP rows.
- Makes save/error paths explicit and testable.
- Supports confirm-then-refetch by delegating save behavior to parent/service layer.

## Consequences
- Parent components must coordinate active-edit ownership.
- Error handling appears both globally (modal via interceptor) and locally (inline error state) for user clarity.
- Future field types can be added without changing existing call sites.
