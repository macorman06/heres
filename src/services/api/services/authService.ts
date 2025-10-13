// src/services/api/services/authService.ts
import { HttpClient } from '../core/httpClient';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../../../types';

export class AuthService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Inicia sesión
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/auth/login', credentials);
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/auth/register', userData);
  }

  /**
   * Cierra sesión (opcional, si tienes endpoint en backend)
   */
  async logout(): Promise<void> {
    // Si tienes endpoint de logout en backend, úsalo aquí
    // return this.httpClient.post('/auth/logout');

    // Si no hay endpoint, solo limpia localmente
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
