import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = 'https://gecos.onrender.com';
const TOKEN_KEY = 'gecos_token';
const USER_KEY = 'gecos_user';

// Types
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
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email: string;
  rol_id: number;
  rol: string;
  seccion?: string[];
  sexo?: 'M' | 'F';
  edad?: number;
  direccion?: string;
  localidad?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  telefono?: string;
}

export interface CreateUserRequest {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  email: string;
  password: string;
  rol_id: number;
  seccion?: string[];
  sexo: 'M' | 'F';
  edad: number;
  direccion?: string;
  localidad?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  telefono?: string;
}

export interface Member {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  centro_juvenil: string;
  seccion: string;
  edad: number;
  sexo: 'M' | 'F';
  direccion?: string;
  localidad?: string;
  telefono?: string;
  email_contacto?: string;
  alergias?: string[];
  talla?: string;
}

export interface CreateMemberRequest {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  centro_juvenil: string;
  seccion: string;
  edad: number;
  sexo: 'M' | 'F';
  direccion?: string;
  localidad?: string;
  telefono?: string;
  email_contacto?: string;
  alergias?: string[];
  talla?: string;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Role hierarchy for permissions
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
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000, // 60 seconds for cold starts
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        this.retryCount = 0; // Reset retry count on success
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          this.clearAuth();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Handle network errors with retry logic
        if (!error.response && this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying request... Attempt ${this.retryCount}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
          return this.api.request(originalRequest);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (!error.response) {
      return {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
        details: error.message
      };
    }

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 400:
        return {
          message: data?.message || 'Datos inválidos',
          status,
          details: data
        };
      case 401:
        return {
          message: 'No autorizado. Por favor, inicia sesión nuevamente.',
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
        return {
          message: 'Error interno del servidor. Inténtalo más tarde.',
          status,
          details: data
        };
      default:
        return {
          message: data?.message || 'Error desconocido',
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

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
      const { token, usuario } = response.data;
      
      this.setToken(token);
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
      const { token, usuario } = response.data;
      
      this.setToken(token);
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.clearAuth();
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // User management methods
  async getUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await this.api.get('/usuarios/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.post('/usuarios/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<CreateUserRequest>): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.api.delete(`/usuarios/${id}`);
    } catch (error) {
      throw error;
    }
  }

  // Member management methods
  async getMembers(): Promise<Member[]> {
    try {
      const response: AxiosResponse<Member[]> = await this.api.get('/miembros/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createMember(memberData: CreateMemberRequest): Promise<Member> {
    try {
      const response: AxiosResponse<Member> = await this.api.post('/miembros/', memberData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateMember(id: number, memberData: Partial<CreateMemberRequest>): Promise<Member> {
    try {
      const response: AxiosResponse<Member> = await this.api.put(`/miembros/${id}`, memberData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteMember(id: number): Promise<void> {
    try {
      await this.api.delete(`/miembros/${id}`);
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

  canManageMembers(userRole: number): boolean {
    return userRole <= ROLES.ANIMADOR;
  }

  hasAdminAccess(userRole: number): boolean {
    return userRole <= ROLES.DIRECTOR;
  }
}

export const apiService = new ApiService();
export default apiService;