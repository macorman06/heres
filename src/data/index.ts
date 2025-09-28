// Centralizamos las exportaciones para facilitar los imports
export { salesianEphemerides, getDefaultSalesianInfo } from './Efemerides';
export { catholicSaints, getDefaultCatholicInfo } from './Santoral';
export { getDashboardStats, mockDashboardStats } from './StatsDashboard';
export { mockCalendarEvents, getEventTypeColor, FILTER_OPTIONS  } from './CalendarEvents';
export { mockRecentMembers, getRecentMembers, getRoleColor, getSectionColor } from './RecentMembers';

export type { DailyInfo } from './Efemerides';
export type { DashboardStat } from './StatsDashboard';
export type { CalendarEvent, FilterOption  } from './CalendarEvents';
export type { RecentMember } from './RecentMembers';
