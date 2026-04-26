# ADR-006: Confirm-Then-Refetch Scope For Sidebar Writes

## Context
Sidebar metadata and PSP project operations mutate server state. The rulebook requires deterministic post-write UI with no optimistic updates.

## Decision
For sidebar write operations:
- Execute write request (`PUT`/`POST`/`DELETE`)
- On success, immediately re-fetch `GET /api/projects/:id`
- Render UI from re-fetched server response only

Delete operations require user confirmation before issuing the write request.

## Rationale
- Ensures view state always reflects backend source of truth.
- Prevents drift between client assumptions and persisted data.
- Keeps update logic consistent across metadata and PSP actions.

## Consequences
- Additional GET request after successful writes.
- Slightly higher latency, but clearer consistency guarantees.
- E2E tests should assert both write and follow-up refetch behavior.
