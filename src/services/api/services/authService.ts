// src/services/api/services/authService.ts
import { HttpClient } from '../core/httpClient';
import { TokenManager } from '../../auth/tokenManager';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../../../types';

export class AuthService {
  constructor(private httpClient: HttpClient) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.httpClient.post<AuthResponse>('/auth/login', credentials);
    TokenManager.setToken(response.token);
    TokenManager.setUserData(response.usuario);
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.httpClient.post<AuthResponse>('/auth/register', userData);
    TokenManager.setToken(response.token);
    TokenManager.setUserData(response.usuario);
    return response;
  }

  logout(): void {
    TokenManager.removeToken();
    TokenManager.removeUserData();
  }

  getCurrentUser() {
    return TokenManager.getUserData();
  }

  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  }
}

const httpClient = new HttpClient();
const authService = new AuthService(httpClient);

export default authService;
