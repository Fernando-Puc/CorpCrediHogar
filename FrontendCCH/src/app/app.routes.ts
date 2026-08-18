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
        path:'catalogs',
        loadComponent: () => import('./ui/administrador/catalogos/catalogosmenu/catalogosmenu').then((c)=> c.Catalogosmenu),
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
      {
        path:'editproduct/:IDProducto',
        loadComponent: () => import('./ui/administrador/productos/editproduct/editproduct').then(c => c.Editproduct),
      },
      {
        path:'catalogs/empresas',
        loadComponent: () => import('./ui/administrador/catalogos/empresas/companieslist/companieslist').then(c => c.Companieslist)
      },
      {
        path:'catalogs/crearempresa',
        loadComponent: () => import('./ui/administrador/catalogos/empresas/createcompanie/createcompanie').then(c => c.Createcompanie)
      },
      {
        path:'catalogs/editarempresa/:IDEmpresa',
        loadComponent:() => import('./ui/administrador/catalogos/empresas/editcompanie/editcompanie').then(c => c.Editcompanie)
      },
      {
        path: 'catalogs/lineas',
        loadComponent:() => import('./ui/administrador/catalogos/lineas/lineaslist/lineaslist').then(c => c.Lineaslist)
      },
      {
        path: 'catalogs/umedidas',
        loadComponent:() => import('./ui/administrador/catalogos/unidadesmedida/umedidalist/umedidalist').then(c=> c.Umedidalist)
      },
      {
        path: 'catalogs/marcas',
        loadComponent:()=> import('./ui/administrador/catalogos/marcas/brandlist/brandlist').then(c=>c.Brandlist)
      }

    ]
  }

];
