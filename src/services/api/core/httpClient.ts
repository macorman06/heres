import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

import { API_CONFIG, IS_DEVELOPMENT } from '../config/apiConfig';

import { TokenManager } from '../../auth/tokenManager';

import { ErrorHandler } from './errorHandler';

import { RequestDeduplication } from './requestDeduplication';

export class HttpClient {
  private api: AxiosInstance;

  private retryCount = 0;

  private deduplication = RequestDeduplication.getInstance();

  constructor() {
    // Crear instancia de Axios con configuración base
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: IS_DEVELOPMENT ? API_CONFIG.TIMEOUT.development : API_CONFIG.TIMEOUT.production,
      headers: API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de Request - Añade token de autenticación + logs de diagnóstico
    this.api.interceptors.request.use(
      (config) => {
        // === DIAGNÓSTICO: Log de URLs antes de enviar ===
        const base = config.baseURL ?? '';
        const url = config.url ?? '';

        // Intentar resolver la URL completa
        try {
          const resolved = new URL(url, base);
          // eslint-disable-next-line no-console
          console.log('[HTTP Debug]', {
            method: config.method?.toUpperCase(),
            baseURL: base,
            url,
            resolvedURL: resolved.href,
            protocol: resolved.protocol,
          });

          // === PROTECCIÓN: Forzar HTTPS si detecta HTTP ===
          if (resolved.protocol === 'http:') {
            console.warn('⚠️ [HTTP → HTTPS] Detectado http://, forzando https://');
            resolved.protocol = 'https:';

            // Actualizar la URL en config
            if (config.url?.startsWith('http://')) {
              config.url = config.url.replace(/^http:\/\//, 'https://');
            }
            if (config.baseURL?.startsWith('http://')) {
              config.baseURL = config.baseURL.replace(/^http:\/\//, 'https://');
            }
          }
        } catch (error) {
          console.error('[HTTP Debug] Error al resolver URL:', {
            baseURL: base,
            url,
            error,
          });
        }

        // Añadir token de autenticación
        const token = TokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de Response - Maneja errores y reintentos
    this.api.interceptors.response.use(
      (response) => {
        // eslint-disable-next-line no-console
        console.log('[HTTP Success]', {
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          status: response.status,
        });
        this.retryCount = 0;
        return response;
      },
      async (error: AxiosError) => {
        console.error('[HTTP Error]', {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          status: error.response?.status,
          message: error.message,
        });

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Manejar error 401 (No autorizado)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          TokenManager.clearAuth();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Lógica de reintentos para errores de red
        if (!error.response && this.retryCount < API_CONFIG.RETRY.maxAttempts && !IS_DEVELOPMENT) {
          this.retryCount++;
          // eslint-disable-next-line no-console
          console.log(`[HTTP Retry] Intento ${this.retryCount}/${API_CONFIG.RETRY.maxAttempts}`);
          await new Promise((resolve) =>
            setTimeout(resolve, API_CONFIG.RETRY.delay * this.retryCount)
          );
          return this.api.request(originalRequest);
        }

        return Promise.reject(ErrorHandler.handleError(error));
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    return this.deduplication.executeUniqueRequest('GET', url, null, async () => {
      const response: AxiosResponse<T> = await this.api.get(url);
      return response.data;
    });
  }

  async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    return this.deduplication.executeUniqueRequest('POST', url, data, async () => {
      const response: AxiosResponse<T> = await this.api.post(url, data);
      return response.data;
    });
  }

  async put<T, D = unknown>(url: string, data?: D): Promise<T> {
    return this.deduplication.executeUniqueRequest('PUT', url, data, async () => {
      const response: AxiosResponse<T> = await this.api.put(url, data);
      return response.data;
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.deduplication.executeUniqueRequest('DELETE', url, null, async () => {
      const response: AxiosResponse<T> = await this.api.delete(url);
      return response.data;
    });
  }

  getEnvironmentInfo() {
    return {
      apiUrl: API_CONFIG.BASE_URL,
      environment: import.meta.env.MODE,
      isDevelopment: IS_DEVELOPMENT,
      version: '1.0.0',
    };
  }
}
