import { ROLES, RoleId } from './user.types.ts';

export interface MenuItemWithRoles {
  label: string;
  icon: string;
  route: string;
  subtitle?: string;
  badge?: string | number;
  allowedRoles?: RoleId[];
}

export const MENU_ITEMS: MenuItemWithRoles[] = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    route: '/',
    subtitle: 'Inicio',
    allowedRoles: [ROLES.SUPERUSER, ROLES.DIRECTOR, ROLES.COORDINADOR, ROLES.ANIMADOR],
  },
  {
    label: 'Grupos',
    icon: 'pi pi-users',
    route: '/grupos',
    subtitle: 'Gestión de usuarios y grupos',
    allowedRoles: [ROLES.SUPERUSER, ROLES.DIRECTOR, ROLES.COORDINADOR],
  },
  {
    label: 'Actividades',
    icon: 'pi pi-calendar',
    route: '/actividades',
    subtitle: 'Eventos y talleres',
    allowedRoles: [ROLES.SUPERUSER, ROLES.DIRECTOR, ROLES.COORDINADOR, ROLES.ANIMADOR],
  },
  {
    label: 'Materiales',
    icon: 'pi pi-folder',
    route: '/materiales',
    subtitle: 'Recursos y documentos',
    allowedRoles: [ROLES.SUPERUSER, ROLES.DIRECTOR, ROLES.COORDINADOR, ROLES.ANIMADOR],
  },
  {
    label: 'Contacto',
    icon: 'pi pi-phone',
    route: '/contacto',
    subtitle: 'Información de contacto',
    allowedRoles: [ROLES.SUPERUSER, ROLES.DIRECTOR, ROLES.COORDINADOR, ROLES.ANIMADOR],
  },
  {
    label: 'Acerca de HERES',
    icon: 'pi pi-info-circle',
    route: '/about',
    subtitle: 'Conoce el proyecto',
    allowedRoles: [ROLES.SUPERUSER, ROLES.DIRECTOR, ROLES.COORDINADOR, ROLES.ANIMADOR],
  },
  {
    label: 'Ranking',
    icon: 'pi pi-trophy',
    route: '/ranking',
    subtitle: 'Puntuación',
    allowedRoles: [
      ROLES.SUPERUSER,
      ROLES.DIRECTOR,
      ROLES.COORDINADOR,
      ROLES.ANIMADOR,
      ROLES.MIEMBRO,
    ],
  },
];

export const getMenuItemsByRole = (userRole?: RoleId): MenuItemWithRoles[] => {
  if (!userRole) return MENU_ITEMS;

  return MENU_ITEMS.filter((item) => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }
    return item.allowedRoles.includes(userRole);
  });
};
