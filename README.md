# DigitalProjectOffice

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.23.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

The frontend runtime API URL is read from `.env` and injected into `public/env.js` before startup.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Mock API server

This workspace includes a mock API server for local frontend development.

Start the server:

```bash
npm run mock:server
```

For test environment mode:

```bash
npm run mock:server:test
```

The API runs at `http://localhost:3001` with these endpoints:

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/tasks`
- `GET /api/tasks?projectId=1`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Quick validation:

```bash
npm run mock:check
```

Tip: add `?delay=500` to any request for a 500ms response delay.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
npm run cypress:run
```

`npm run cypress:run` always starts:

- the mock server using `.env.test`
- the frontend app using `.env.test`
- Cypress against the running app

Use `npm run cypress:run:raw` only when app and mock server are already running.

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
