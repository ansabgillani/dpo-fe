import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/landing.component').then((m) => m.LandingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'project/:id',
    loadComponent: () =>
      import('./features/project-details/project-details.component').then(
        (m) => m.ProjectDetailsComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects'
  },
  {
    path: '**',
    redirectTo: 'projects'
  }
];
