// src/utils/avatarUtils.ts

/**
 * Normaliza un string quitando tildes y caracteres especiales
 * Ej: "José María" -> "jose maria"
 */
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, '') // Elimina las tildes
    .replace(/[^a-z0-9_]/g, '_') // Reemplaza caracteres no alfanuméricos por _
    .replace(/_+/g, '_') // Elimina guiones bajos múltiples
    .replace(/^_|_$/g, ''); // Elimina guiones bajos al inicio/final
};

/**
 * Obtiene la URL del avatar del usuario
 * Prioridad: R2 presigned URL > Local file > Iniciales
 */
export const getUserAvatarUrl = (
  nombre: string,
  apellido: string,
  fotoPerfilUrl?: string
): string | null => {
  // 1. Si hay URL de R2, usar esa
  if (fotoPerfilUrl) {
    return fotoPerfilUrl;
  }

  // 2. Intentar con archivo local (normalizado)
  const nombreNorm = normalizeString(nombre);
  const apellidoNorm = normalizeString(apellido);
  const localFileName = `${nombreNorm}_${apellidoNorm}.png`;

  return `/users/${localFileName}`;
};

/**
 * Genera iniciales del usuario
 */
export const getInitials = (nombre: string, apellido: string): string => {
  const nombreInitial = nombre.charAt(0).toUpperCase();
  const apellidoInitial = apellido.charAt(0).toUpperCase();
  return `${nombreInitial}${apellidoInitial}`;
};

/**
 * Genera un color de avatar basado en el nombre
 */
export const getAvatarColor = (nombre: string): string => {
  const colors = [
    '#EF4444', // red-500
    '#F59E0B', // amber-500
    '#10B981', // emerald-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#14B8A6', // teal-500
    '#F97316', // orange-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
  ];

  // Usar el código del primer carácter para seleccionar un color
  const index = nombre.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Obtiene el nombre completo del usuario
 */
export const getFullName = (nombre: string, apellido1: string, apellido2?: string): string => {
  return apellido2 ? `${nombre} ${apellido1} ${apellido2}` : `${nombre} ${apellido1}`;
};

export const getAvatarUrl = (userId: number): string => {
  // URL de la API para obtener el avatar
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return `${API_BASE_URL}/usuarios/${userId}/avatar?t=${Date.now()}`;
};
