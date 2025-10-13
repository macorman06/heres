// src/utils/formatters.ts
/**
 * Formatea el nombre completo de un usuario, omitiendo campos vacíos
 */
export const formatFullName = (nombre?: string, apellido1?: string, apellido2?: string): string => {
  const parts = [nombre, apellido1, apellido2]
    .map((part) => part?.trim()) // Elimina espacios
    .filter((part) => {
      // Excluye valores vacíos, null, undefined, o "nan"
      if (!part || part.length === 0) return false;
      if (part.toLowerCase() === 'nan') return false;
      if (part.toLowerCase() === 'null') return false;
      if (part.toLowerCase() === 'undefined') return false;
      return true;
    });

  return parts.join(' ') || 'Usuario';
};

/**
 * Obtiene las iniciales de un usuario
 */
export const getUserInitials = (nombre?: string, apellido1?: string): string => {
  const firstName = nombre?.trim()?.charAt(0)?.toUpperCase() || '';
  const lastName = apellido1?.trim()?.charAt(0)?.toUpperCase() || '';

  return firstName + lastName || 'U';
};
