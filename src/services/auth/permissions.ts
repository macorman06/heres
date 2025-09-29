// Role hierarchy for permissions
export const ROLES = {
  SUPERUSER: 1,
  DIRECTOR: 2,
  COORDINADOR: 3,
  ANIMADOR: 4,
  MIEMBRO: 5
} as const;

export const ROLE_NAMES = {
  1: 'superuser',
  2: 'director',
  3: 'coordinador',
  4: 'animador',
  5: 'miembro'
} as const;

export class PermissionManager {
  static canCreateUsers(userRole: number): boolean {
    return userRole <= ROLES.COORDINADOR;
  }

  static canEditUsers(userRole: number): boolean {
    return userRole <= ROLES.ANIMADOR;
  }

  static canDeleteUsers(userRole: number): boolean {
    return userRole <= ROLES.COORDINADOR;
  }

  static canManageMembers(userRole: number): boolean {
    return userRole <= ROLES.ANIMADOR;
  }

  static hasAdminAccess(userRole: number): boolean {
    return userRole <= ROLES.DIRECTOR;
  }

  static getRoleName(roleId: number): string {
    return ROLE_NAMES[roleId as keyof typeof ROLE_NAMES] || 'unknown';
  }
}
