// Diccionario de traducciones de roles
export const roleTranslations: Record<string, string> = {
  'director': 'Director',
  'coordinador': 'Coordinador',
  'animador': 'Animador',
  'voluntario': 'Voluntario',
  'colaborador': 'Colaborador',
};

// Diccionario de traducciones de estados
export const statusTranslations: Record<string, string> = {
  'active': 'Activo',
  'inactive': 'Inactivo',
  'pending': 'Pendiente',
};

// Función para formatear y traducir roles
export const formatRole = (role: string): string => {
  const normalizedRole = role.toLowerCase().trim();
  return roleTranslations[normalizedRole] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

// Función para formatear y traducir estados
export const formatStatus = (status: string): string => {
  const normalizedStatus = status.toLowerCase().trim();
  return statusTranslations[normalizedStatus] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Función para obtener todos los roles disponibles (para dropdowns)
export const getAvailableRoles = () => {
  return Object.keys(roleTranslations).map(key => ({
    value: key,
    label: roleTranslations[key]
  }));
};

// Función para obtener todos los estados disponibles (para dropdowns)
export const getAvailableStatuses = () => {
  return Object.keys(statusTranslations).map(key => ({
    value: key,
    label: statusTranslations[key]
  }));
};
