import { Routes } from '@angular/router';

import { AuthGuard } from '@core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { ProjectDetailsComponent } from './features/project-details/project-details.component';

export const routes: Routes = [
	{
		path: 'projects',
		loadComponent: () =>
			import('./features/projects/landing.component').then((module) => module.LandingComponent),
		canActivate: [AuthGuard]
	},
	{
		path: 'project/:id',
		component: ProjectDetailsComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [AuthGuard]
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
