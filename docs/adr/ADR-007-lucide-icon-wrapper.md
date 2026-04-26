# ADR-007: Lucide Icon Wrapper

## Context

The UI must not leak direct third-party icon usage into feature components. Design system migration readiness requires a single abstraction point for icons.

## Decision

- Keep all Lucide imports isolated to the icon atom folder:
  - `ui/base/icon/icon-registry.module.ts` registers icon set.
  - `ui/base/icon/icon.component.ts` exposes the `dpo-icon` API (`name`, `size`, `dataCy`).
- All consumers render icons through `<dpo-icon>` only.

## Rationale

- Shields application layers from vendor-specific icon APIs.
- Simplifies future icon-library swap with minimal template churn.
- Enforces consistent sizing and selector behavior through a single atom.

## Consequences

- New icons require registration updates in one module.
- Feature and molecule components remain vendor-agnostic.
- Unit tests validate icon atom rendering contract once.
