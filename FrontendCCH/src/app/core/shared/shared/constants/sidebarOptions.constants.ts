import { calendarIcon, customerIcon, metricsIcon, operatorIcon, requestIcon, routeIcon, settingsIcon, trailerIcon} from "./icons.constants";

interface SidebarOption {
  icon: string;
  route: string;
  optionName: string;
}

export const SIDEBAR_OPTIONS: SidebarOption[] = [
  {
    optionName: 'Inicio',
    route: 'inicio',
    icon: metricsIcon,
  },
  {
    optionName: 'Operadores',
    route: 'operators',
    icon: operatorIcon,
  },
  {
    optionName: 'Unidades',
    route: 'units',
    icon: trailerIcon,
  },
  {
    optionName: 'Clientes',
    route: 'customers',
    icon: customerIcon,
  },
  {
    optionName: 'Rutas',
    route: 'routes',
    icon: routeIcon,
  },
  {
    optionName: 'Solicitudes',
    route: 'requests',
    icon: requestIcon,
  },
  {
    optionName: 'Programación',
    route: 'travels',
    icon: requestIcon,
  },
  {
    optionName: 'Ajustes',
    route: 'settings',
    icon: settingsIcon,
  },
]
