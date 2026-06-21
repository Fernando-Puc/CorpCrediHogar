import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    title: 'CrediHogar',
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'login',
    title: 'login',
    loadComponent: () => import('./ui/login/login').then((c) => c.Login),

  }
];
