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
  },
  {
    title: 'Administrador',
    path: 'administrador',
    loadComponent: () => import('./ui/administrador/navbar-admin/navbar-admin').then((c) => c.NavbarAdmin),
    children: [
      {
        path:'',
        loadComponent: () => import('./ui/administrador/dashboard-adm/dashboard-adm').then((c)=> c.DashboardAdm),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./ui/administrador/clientes/clienteslist/clienteslist').then(c => c.Clientes),
      },
      {
        path: 'crearcliente',
        loadComponent: () => import('./ui/administrador/clientes/createclientes/createclientes').then(c=> c.Createclientes),
      },
      {
        path: 'productos',
        loadComponent: () => import('./ui/administrador/productos/productoslist/productoslist').then(c => c.Productoslist),
      },
      {
        path: 'createproducts',
        loadComponent: () => import('./ui/administrador/productos/createproducts/createproducts').then(c => c.Createproducts),
      },

    ]
  }

];
