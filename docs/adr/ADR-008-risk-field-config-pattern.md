# ADR-008: Risk Field Config Pattern

## Context
Risk card selects must use consistent option lists for type, probability, severity, and status. The rulebook forbids inline option arrays in components.

## Decision
- Centralize risk select options in `core/risk-field-configs/` functions.
- Components call these functions in `ngOnInit` to populate select inputs.

## Rationale
- Keeps option values consistent across tabs and tests.
- Allows easy updates without editing component templates.
- Complies with the no-inline-option rule.

## Consequences
- Risk-related components depend on config helpers.
- Tests should assert config functions are called in component init.
