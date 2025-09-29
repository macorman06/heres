const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const mode = import.meta.env.MODE;

  if (envUrl) {
    return envUrl;
  }

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

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: {
    development: 10000,
    production: 60000,
  },
  RETRY: {
    maxAttempts: 3,
    delay: 1000,
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export const IS_DEVELOPMENT = import.meta.env.VITE_DEBUG === 'true';

// Log environment info in development
if (IS_DEVELOPMENT) {
  console.log('🚀 HERES Frontend Environment:', {
    mode: import.meta.env.MODE,
    apiUrl: API_CONFIG.BASE_URL,
    debug: IS_DEVELOPMENT
  });
}
