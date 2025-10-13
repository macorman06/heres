const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8000';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: {
    development: 10000, // 10 segundos en desarrollo
    production: 60000, // 60 segundos en producción
  },
  RETRY: {
    maxAttempts: 3, // Número máximo de reintentos
    delay: 1000, // Delay base entre reintentos (ms)
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export const IS_DEVELOPMENT = import.meta.env.VITE_DEBUG === 'true';
