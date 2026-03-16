import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/pages/events/events.component').then(
        (m) => m.EventsComponent
      )
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      )
  }
];
