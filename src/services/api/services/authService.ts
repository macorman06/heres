import { HttpClient } from '../core/httpClient';
import { TokenManager } from '../../auth/tokenManager';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../types/auth.types';
import { IS_DEVELOPMENT } from '../config/apiConfig';

export class AuthService {
  constructor(private httpClient: HttpClient) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      if (IS_DEVELOPMENT) {
        console.log('🔐 Attempting login for:', credentials.email);
      }

      const response = await this.httpClient.post<AuthResponse>('/auth/login', credentials);

      TokenManager.setToken(response.token);
      TokenManager.setUserData(response.usuario);

      if (IS_DEVELOPMENT) {
        console.log('✅ Login successful for:', response.usuario.nombre);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.httpClient.post<AuthResponse>('/auth/register', userData);

      TokenManager.setToken(response.token);
      TokenManager.setUserData(response.usuario);

      return response;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    TokenManager.clearAuth();
  }

  getCurrentUser(): User | null {
    return TokenManager.getUserData();
  }

  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  }
}
