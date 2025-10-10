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
    console.log('🔧 [HttpClient] Constructor iniciado');
    console.log('🔧 [HttpClient] API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    console.log('🔧 [HttpClient] import.meta.env:', import.meta.env);

    // Crear instancia de Axios con configuración base
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: IS_DEVELOPMENT ? API_CONFIG.TIMEOUT.development : API_CONFIG.TIMEOUT.production,
      headers: API_CONFIG.HEADERS,
    });

    console.log('🔧 [HttpClient] Axios instance creada con baseURL:', this.api.defaults.baseURL);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de Request - Añade token de autenticación + logs de diagnóstico
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 [REQUEST INTERCEPTOR] Iniciando');

        // === DIAGNÓSTICO: Log de URLs antes de enviar ===
        const base = config.baseURL ?? '';
        const url = config.url ?? '';

        console.log('📍 [REQUEST] Valores originales:', {
          baseURL: base,
          url: url,
          method: config.method?.toUpperCase(),
        });

        // Intentar resolver la URL completa
        try {
          const resolved = new URL(url, base);

          console.log('🔍 [REQUEST] URL resuelta:', {
            method: config.method?.toUpperCase(),
            baseURL: base,
            url,
            resolvedURL: resolved.href,
            protocol: resolved.protocol,
            hostname: resolved.hostname,
            pathname: resolved.pathname,
          });

          // === PROTECCIÓN: Forzar HTTPS si detecta HTTP ===
          if (resolved.protocol === 'http:') {
            console.warn('⚠️ [HTTP → HTTPS] Detectado http://, forzando https://');
            resolved.protocol = 'https:';

            // Actualizar la URL en config
            if (config.url?.startsWith('http://')) {
              config.url = config.url.replace(/^http:\/\//, 'https://');
              console.log('✅ [FIX] config.url actualizada a:', config.url);
            }

            if (config.baseURL?.startsWith('http://')) {
              config.baseURL = config.baseURL.replace(/^http:\/\//, 'https://');
              console.log('✅ [FIX] config.baseURL actualizada a:', config.baseURL);
            }
          } else {
            console.log('✅ [PROTOCOL OK] Ya usa HTTPS');
          }
        } catch (error) {
          console.error('❌ [HTTP Debug] Error al resolver URL:', {
            baseURL: base,
            url,
            error,
          });
        }

        // Añadir token de autenticación
        const token = TokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔑 [AUTH] Token añadido');
        } else {
          console.log('⚠️ [AUTH] No hay token disponible');
        }

        console.log('📤 [REQUEST FINAL] Configuración que se enviará:', {
          method: config.method,
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
        });

        return config;
      },
      (error) => {
        console.error('❌ [REQUEST INTERCEPTOR ERROR]', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de Response - Maneja errores y reintentos
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ [RESPONSE SUCCESS]', {
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          baseURL: response.config.baseURL,
          status: response.status,
          statusText: response.statusText,
        });
        this.retryCount = 0;
        return response;
      },
      async (error: AxiosError) => {
        console.error('❌ [RESPONSE ERROR] Detalles completos:', {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          code: error.code,
          fullError: error,
        });

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Manejar error 401 (No autorizado)
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('🔴 [401 UNAUTHORIZED] Limpiando auth y redirigiendo a login');
          originalRequest._retry = true;
          TokenManager.clearAuth();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Lógica de reintentos para errores de red
        if (!error.response && this.retryCount < API_CONFIG.RETRY.maxAttempts && !IS_DEVELOPMENT) {
          this.retryCount++;
          console.log(`🔄 [RETRY] Intento ${this.retryCount}/${API_CONFIG.RETRY.maxAttempts}`);
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
    console.log('📥 [GET] Llamando a:', url);
    return this.deduplication.executeUniqueRequest('GET', url, null, async () => {
      console.log('📥 [GET EXEC] Ejecutando petición a:', url);
      const response: AxiosResponse<T> = await this.api.get(url);
      console.log('📥 [GET SUCCESS] Respuesta recibida de:', url);
      return response.data;
    });
  }

  async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    console.log('📤 [POST] Llamando a:', url, 'con data:', data);
    return this.deduplication.executeUniqueRequest('POST', url, data, async () => {
      console.log('📤 [POST EXEC] Ejecutando petición a:', url);
      const response: AxiosResponse<T> = await this.api.post(url, data);
      console.log('📤 [POST SUCCESS] Respuesta recibida de:', url);
      return response.data;
    });
  }

  async put<T, D = unknown>(url: string, data?: D): Promise<T> {
    console.log('🔄 [PUT] Llamando a:', url, 'con data:', data);
    return this.deduplication.executeUniqueRequest('PUT', url, data, async () => {
      console.log('🔄 [PUT EXEC] Ejecutando petición a:', url);
      const response: AxiosResponse<T> = await this.api.put(url, data);
      console.log('🔄 [PUT SUCCESS] Respuesta recibida de:', url);
      return response.data;
    });
  }

  async delete<T>(url: string): Promise<T> {
    console.log('🗑️ [DELETE] Llamando a:', url);
    return this.deduplication.executeUniqueRequest('DELETE', url, null, async () => {
      console.log('🗑️ [DELETE EXEC] Ejecutando petición a:', url);
      const response: AxiosResponse<T> = await this.api.delete(url);
      console.log('🗑️ [DELETE SUCCESS] Respuesta recibida de:', url);
      return response.data;
    });
  }

  getEnvironmentInfo() {
    const info = {
      apiUrl: API_CONFIG.BASE_URL,
      environment: import.meta.env.MODE,
      isDevelopment: IS_DEVELOPMENT,
      version: '1.0.0',
    };
    console.log('ℹ️ [ENV INFO]', info);
    return info;
  }
}
