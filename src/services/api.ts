import axios, { AxiosInstance, AxiosError } from 'axios';

// Environment Configuration
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

const API_BASE_URL = getApiBaseUrl();
const TOKEN_KEY = 'gecos_token';
const USER_KEY = 'gecos_user';
const IS_DEVELOPMENT = import.meta.env.VITE_DEBUG === 'true';
const IS_LOCALHOST = API_BASE_URL.includes('localhost');

if (IS_DEVELOPMENT) {
  console.log('🚀 HERES Frontend Environment:', {
    mode: import.meta.env.MODE,
    apiUrl: API_BASE_URL,
    debug: IS_DEVELOPMENT,
    isLocalhost: IS_LOCALHOST
  });
}

// Types - Updated for Users Only
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface User {
  birthday?: Date;
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email?: string; // Optional for users without login
  rol_id: number;
  rol: string;
  centro_juvenil?: string;
  seccion?: string[];
  sexo?: 'M' | 'F';
  edad?: number;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  fecha_creacion?: string;
  fecha_modificacion?: string;
  can_login?: boolean; // Indicates if user can login
}

export interface CreateUserRequest {
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email?: string; // Optional - only for users who can login
  password?: string; // Optional - only for users who can login
  rol_id: number;
  centro_juvenil?: string;
  seccion?: string[];
  sexo?: 'M' | 'F';
  edad?: number;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
}

export type UpdateUserRequest = Partial<CreateUserRequest>

// Backend Response Types
export interface BackendLoginResponse {
  mensaje: string;
  token: string;
  usuario: User;
}

export interface BackendRegisterResponse {
  mensaje: string;
  id: number;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export interface ApiError {
  message: string;
  status: number;
  details?: never;
}

// Role hierarchy
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

class ApiService {
  private api: AxiosInstance;
  private pendingRequests = new Map<string, Promise<any>>();
  private retryCount = 0;
  private maxRetries = IS_LOCALHOST ? 1 : 3;
  private isRequestInProgress = false;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: IS_LOCALHOST ? 10000 : 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();

    if (IS_DEVELOPMENT) {
      console.log('🔧 API Service initialized:', {
        baseURL: API_BASE_URL,
        timeout: IS_LOCALHOST ? 10000 : 60000,
        isLocalhost: IS_LOCALHOST
      });
    }
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (IS_DEVELOPMENT) {
          console.log('📤 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            hasToken: !!token
          });
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => {
        this.retryCount = 0;
        this.isRequestInProgress = false;

        if (IS_DEVELOPMENT) {
          console.log('📥 API Response:', {
            status: response.status,
            url: response.config.url,
            method: response.config.method?.toUpperCase()
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        this.isRequestInProgress = false;
        const originalRequest = error.config as any;

        if (IS_DEVELOPMENT) {
          console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            isLocalhost: IS_LOCALHOST
          });
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          this.clearAuth();
          if (!IS_LOCALHOST) {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        if (!error.response && this.retryCount < this.maxRetries) {
          this.retryCount++;

          if (IS_LOCALHOST) {
            console.log(`🔄 Retrying localhost request... Attempt ${this.retryCount}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            console.log(`🔄 Retrying deployed API request... Attempt ${this.retryCount}`);
            await new Promise(resolve => setTimeout(resolve, 2000 * this.retryCount));
          }

          return this.api.request(originalRequest);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getRequestKey(method: string, url: string, data?: any): string {
    const timestamp = Math.floor(Date.now() / 5000);
    return `${method.toUpperCase()}:${url}:${JSON.stringify(data || {})}:${timestamp}`;
  }

  private async makeUniqueRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any
  ): Promise<T> {
    if (this.isRequestInProgress && method === 'POST' && url.includes('/auth/login')) {
      throw new Error('Login request already in progress');
    }

    const requestKey = this.getRequestKey(method, url, data);

    if (this.pendingRequests.has(requestKey)) {
      if (IS_DEVELOPMENT) {
        console.log('🔄 Reusing pending request:', requestKey);
      }
      return this.pendingRequests.get(requestKey)!;
    }

    this.isRequestInProgress = method === 'POST' && url.includes('/auth/login');
    const requestPromise = this.executeRequest<T>(method, url, data);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(requestKey);
      this.isRequestInProgress = false;
    }
  }

  private async executeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any
  ): Promise<T> {
    switch (method) {
      case 'GET':
        const getResponse = await this.api.get(url);
        return getResponse.data;
      case 'POST':
        const postResponse = await this.api.post(url, data);
        return postResponse.data;
      case 'PUT':
        const putResponse = await this.api.put(url, data);
        return putResponse.data;
      case 'DELETE':
        await this.api.delete(url);
        return {} as T;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  private handleError(error: AxiosError): ApiError {
    if (!error.response) {
      if (IS_LOCALHOST) {
        return {
          message: 'Error de conexión local. ¿Está ejecutándose la API en localhost:5000?',
          status: 0,
          details: `${error.message} - Verifica que la API local esté ejecutándose con 'python run.py'`
        };
      } else {
        return {
          message: 'Error de conexión. La API puede estar iniciándose (cold start). Inténtalo en unos segundos.',
          status: 0,
          details: error.message
        };
      }
    }

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 400:
        return {
          message: data?.error || data?.message || 'Datos inválidos',
          status,
          details: data
        };
      case 401:
        return {
          message: data?.error || 'Email o contraseña incorrectos.',
          status,
          details: data
        };
      case 403:
        return {
          message: 'No tienes permisos para realizar esta acción.',
          status,
          details: data
        };
      case 404:
        return {
          message: 'Recurso no encontrado.',
          status,
          details: data
        };
      case 500:
        const errorMsg = IS_LOCALHOST
          ? 'Error interno del servidor local. Revisa los logs de la consola de Flask.'
          : 'Error interno del servidor. Por favor, inténtalo más tarde.';
        return {
          message: errorMsg,
          status,
          details: data
        };
      default:
        return {
          message: data?.error || data?.message || 'Error desconocido',
          status,
          details: data
        };
    }
  }

  // Token management
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Environment info
  getEnvironmentInfo() {
    return {
      apiUrl: API_BASE_URL,
      environment: import.meta.env.MODE,
      isDevelopment: IS_DEVELOPMENT,
      isLocalhost: IS_LOCALHOST,
      version: '1.0.0'
    };
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      if (IS_DEVELOPMENT) {
        console.log('🔐 Attempting login for:', credentials.email, `(${IS_LOCALHOST ? 'localhost' : 'deployed'})`);
      }

      const response = await this.makeUniqueRequest<BackendLoginResponse>(
        'POST',
        '/auth/login',
        credentials
      );

      const token = response.token;
      const usuario = response.usuario;

      this.setToken(token);
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));

      if (IS_DEVELOPMENT) {
        console.log('✅ Login successful for:', usuario.nombre);
        console.log('🎫 Token received:', token.substring(0, 20) + '...');
      }

      return {
        token,
        usuario
      };
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.error('❌ Login failed:', error);
      }
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      if (IS_DEVELOPMENT) {
        console.log('📝 Attempting registration for:', userData.email);
      }

      const backendResponse = await this.makeUniqueRequest<BackendRegisterResponse>(
        'POST',
        '/auth/register',
        userData
      );

      if (IS_DEVELOPMENT) {
        console.log('✅ Registration successful, ID:', backendResponse.id);
      }

      return await this.login({
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.error('❌ Registration failed:', error);
      }
      throw error;
    }
  }

  logout(): void {
    if (IS_DEVELOPMENT) {
      console.log('👋 Logging out user');
    }
    this.clearAuth();
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // User management methods (Updated - removed member methods)
  async getUsers(): Promise<User[]> {
    try {
      return await this.makeUniqueRequest<User[]>('GET', '/usuarios/');
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      return await this.makeUniqueRequest<User>('POST', '/usuarios/', userData);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      return await this.makeUniqueRequest<User>('PUT', `/usuarios/${id}`, userData);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.makeUniqueRequest<void>('DELETE', `/usuarios/${id}`);
    } catch (error) {
      throw error;
    }
  }

  // Permission helpers
  canCreateUsers(userRole: number): boolean {
    return userRole <= ROLES.COORDINADOR;
  }

  canEditUsers(userRole: number): boolean {
    return userRole <= ROLES.ANIMADOR;
  }

  canDeleteUsers(userRole: number): boolean {
    return userRole <= ROLES.COORDINADOR;
  }

  hasAdminAccess(userRole: number): boolean {
    return userRole <= ROLES.DIRECTOR;
  }
}

export const apiService = new ApiService();
export default apiService;
