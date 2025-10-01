import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
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
      timeout: IS_DEVELOPMENT
        ? API_CONFIG.TIMEOUT.development
        : API_CONFIG.TIMEOUT.production,
      headers: API_CONFIG.HEADERS,
    });

    this.setupInterceptors();

    if (IS_DEVELOPMENT) {
      console.log('🔧 HTTP Client initialized:', {
        baseURL: API_CONFIG.BASE_URL,
        timeout: IS_DEVELOPMENT
          ? API_CONFIG.TIMEOUT.development
          : API_CONFIG.TIMEOUT.production,
      });
    }
  }

  private setupInterceptors(): void {
    // Interceptor de Request - Añade token de autenticación
    this.api.interceptors.request.use(
      (config) => {
        const token = TokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (IS_DEVELOPMENT) {
          console.log('📤 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasToken: !!token,
          });
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de Response - Maneja errores y reintentos
    this.api.interceptors.response.use(
      (response) => {
        this.retryCount = 0;

        if (IS_DEVELOPMENT) {
          console.log('📥 API Response:', {
            status: response.status,
            url: response.config.url,
            method: response.config.method?.toUpperCase(),
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (IS_DEVELOPMENT) {
          console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
          });
        }

        // Manejar error 401 (No autorizado)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          TokenManager.clearAuth();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Lógica de reintentos para errores de red
        if (
          !error.response &&
          this.retryCount < API_CONFIG.RETRY.maxAttempts &&
          !IS_DEVELOPMENT
        ) {
          this.retryCount++;
          console.log(`Retrying request... Attempt ${this.retryCount}`);
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
    return this.deduplication.executeUniqueRequest(
      'GET',
      url,
      null,
      async () => {
        const response: AxiosResponse<T> = await this.api.get(url);
        return response.data;
      }
    );
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.deduplication.executeUniqueRequest(
      'POST',
      url,
      data,
      async () => {
        const response: AxiosResponse<T> = await this.api.post(url, data);
        return response.data;
      }
    );
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.deduplication.executeUniqueRequest(
      'PUT',
      url,
      data,
      async () => {
        const response: AxiosResponse<T> = await this.api.put(url, data);
        return response.data;
      }
    );
  }

  async delete<T>(url: string): Promise<T> {
    return this.deduplication.executeUniqueRequest(
      'DELETE',
      url,
      null,
      async () => {
        const response: AxiosResponse<T> = await this.api.delete(url);
        return response.data;
      }
    );
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
