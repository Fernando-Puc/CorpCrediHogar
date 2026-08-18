export interface SidebarOption {
  optionName: string;
  route: string;
  icon: string;
}

export const SIDEBAR_OPTIONS: SidebarOption[] = [
  {
    optionName: 'Dashboard',
    route: '/administrador',
    icon: 'dashboard'
  },
    {
    optionName: 'Ventas',
    route: '/Dashboard/Ventas',
    icon: 'sell'
  },
  {
    optionName: 'Clientes',
    route: '/administrador/clientes',
    icon: 'person'
  },
  {
    optionName: 'Catalogos',
    route: '/administrador/catalogs',
    icon: 'view_list'
  },
  {
    optionName: 'Productos',
    route: '/administrador/productos',
    icon: 'inventory_2'
  },
  {
    optionName: 'Contabilidad',
    route: '/administrador/contabilidad',
    icon: 'show_chart'
  },
  {
  optionName: 'Inventario',
  route: '/administrador/inventario',
  icon: 'inventory'
  },
  {
  optionName: 'Reportes',
  route: '/administrador/reportes',
  icon: 'assignment'
  },
];
