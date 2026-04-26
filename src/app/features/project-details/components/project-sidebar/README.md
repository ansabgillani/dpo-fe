# ProjectSidebarComponent

Right-hand project details panel for metadata and PSP project entries.

## Responsibilities
- Shows avatar and project title.
- Renders editable metadata fields through `InlineEditFieldComponent`.
- Supports PSP add, inline rename, and delete (with confirmation).

## Write Flow
All writes follow confirm-then-refetch via `ProjectService`:
- metadata update -> `PUT /metadata` -> `GET /projects/:id`
- PSP add -> `POST /psp` -> `GET /projects/:id`
- PSP delete -> confirm dialog -> `DELETE /psp/:id` -> `GET /projects/:id`

## Data-cy
- Sidebar root: `project-sidebar`
- PSP list: `project-sidebar-psp-list`
- Add button: `project-sidebar-psp-add`
