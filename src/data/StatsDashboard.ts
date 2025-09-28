export interface DashboardStat {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  change: string;
}

// Función que calcula las estadísticas dinámicamente
export const getDashboardStats = (
  totalMembers: number,
  activeActivities: number,
  activeGroups: number
): DashboardStat[] => [
  {
    title: 'Total Miembros',
    value: totalMembers,
    icon: 'pi pi-users',
    color: 'bg-blue-500',
    change: '+2 este mes'
  },
  {
    title: 'Actividades Activas',
    value: activeActivities,
    icon: 'pi pi-calendar',
    color: 'bg-green-500',
    change: '3 programadas'
  },
  {
    title: 'Grupos Activos',
    value: activeGroups,
    icon: 'pi pi-sitemap',
    color: 'bg-purple-500',
    change: 'Todos activos'
  },
  {
    title: 'Participación',
    value: '89%',
    icon: 'pi pi-chart-line',
    color: 'bg-red-500',
    change: '+5% vs mes anterior'
  }
];

// Datos mockeados estaticos (por si no tienes datos dinámicos)
export const mockDashboardStats: DashboardStat[] = [
  {
    title: 'Total Miembros',
    value: 45,
    icon: 'pi pi-users',
    color: 'bg-blue-500',
    change: '+2 este mes'
  },
  {
    title: 'Actividades Activas',
    value: 8,
    icon: 'pi pi-calendar',
    color: 'bg-green-500',
    change: '3 programadas'
  },
  {
    title: 'Grupos Activos',
    value: 6,
    icon: 'pi pi-sitemap',
    color: 'bg-purple-500',
    change: 'Todos activos'
  },
  {
    title: 'Participación',
    value: '89%',
    icon: 'pi pi-chart-line',
    color: 'bg-red-500',
    change: '+5% vs mes anterior'
  }
];
