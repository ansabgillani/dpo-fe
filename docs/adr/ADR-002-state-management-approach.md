# ADR-002: State Management Approach

## Context
The landing page needs filter selections and selected project preview to persist when users navigate to project details and back. The app rules require service-owned state and route-driven navigation.

## Decision
Use a focused service-based state container:
- FilterStateService stores filter values and selected project id in BehaviorSubjects.
- LandingComponent reads from FilterStateService on init and writes updates on user actions.
- Project list and preview are rendered from state snapshots hydrated by ProjectService fetches.

## Rationale
This keeps state local to app behavior without introducing a global state library, matches Phase 2 scope, and satisfies persistence requirements across route changes.

## Consequences
- Positive: predictable state ownership and easy unit testing.
- Positive: minimal abstraction cost for current app size.
- Tradeoff: later phases with heavier cross-tab coordination may require additional service composition.
