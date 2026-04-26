# ADR-005: Skeleton Composition Pattern

## Context
Landing page requires loading placeholders for filter fetch and project list fetch while preserving layout stability.

## Decision
Compose loading placeholders using existing atom `dpo-skeleton-block` and a dedicated `SkeletonCardComponent` molecule for list rows.

## Rationale
- Reuses existing atom and tokenized styling.
- Keeps loading UIs visually aligned with final card dimensions.
- Avoids duplicating shimmer CSS per feature component.

## Consequences
- Positive: consistent loading UX and reusable skeleton structure.
- Positive: easier to extend in future tabs by composing additional skeleton molecules.
- Tradeoff: requires maintaining skeleton molecule dimensions alongside card layout changes.
