// src/services/auth/tokenManager.ts
const TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';

export class TokenManager {
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  static getUserData(): unknown | null {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setUserData(userData: unknown): void {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  static removeUserData(): void {
    localStorage.removeItem(USER_KEY);
  }

  static clearAuth(): void {
    this.removeToken();
    this.removeUserData();
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
