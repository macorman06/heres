/**
 * Configuración centralizada de la API
 * Gestiona URLs base, timeouts, headers y configuración según el entorno
 */

/**
 * Determina la URL base de la API según el entorno
 */
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const mode = import.meta.env.MODE;

  // Si hay una URL definida en variables de entorno, usarla
  if (envUrl) return envUrl;

  // Configurar según el modo de ejecución
  switch (mode) {
    case 'localhost':
      return 'http://localhost:5000';
    case 'development':
      return 'https://gecos.onrender.com';
    case 'production':
      return 'https://gecos.onrender.com';
    default:
      return 'https://gecos.onrender.com';
  }
};

/**
 * Configuración principal de la API
 */
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: {
    development: 10000,  // 10 segundos en desarrollo
    production: 60000,   // 60 segundos en producción
  },
  RETRY: {
    maxAttempts: 3,      // Número máximo de reintentos
    delay: 1000,         // Delay base entre reintentos (ms)
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Flag para determinar si estamos en modo desarrollo
 */
export const IS_DEVELOPMENT = import.meta.env.VITE_DEBUG === 'true';

// Logging de información del entorno en desarrollo
if (IS_DEVELOPMENT) {
  console.log('🚀 HERES API Environment:', {
    mode: import.meta.env.MODE,
    apiUrl: API_CONFIG.BASE_URL,
    debug: IS_DEVELOPMENT,
  });
}
