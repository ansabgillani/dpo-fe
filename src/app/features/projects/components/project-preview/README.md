# ProjectPreviewComponent

## Purpose
Displays landing-page preview details for the currently selected project and provides Open navigation action.

## Inputs
- `project`: selected project summary or null.
- `loading`: toggles skeleton state while project list is loading.

## Outputs
- `openProject`: emits selected project id when Open is clicked.

## Rendering States
- `loading = true`: renders skeleton placeholders.
- `loading = false` and `project != null`: renders project metadata and PSP list.
- `loading = false` and `project == null`: renders empty-state message.

## Notes
- Uses atom primitives and tokenized styling.
- Open action is parent-controlled for routing.
