// src/hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { LoginRequest, RegisterRequest, AuthContextType, ApiError, User } from '../types';
import { authService } from '../services/api/index'; // ✅ Cambiar aquí
import { TokenManager } from '../services/auth/tokenManager';

// ===== CONTEXTO =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== PROVIDER =====
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = TokenManager.getToken();
      const userData = TokenManager.getUserData() as User | null;

      if (token && userData) {
        setUser(userData);
      }
    } catch (error) {
      TokenManager.clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ Cambiar esto
      const response = await authService.login(credentials);

      TokenManager.setToken(response.token);
      TokenManager.setUserData(response.usuario);
      setUser(response.usuario);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Credenciales inválidas';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ Cambiar esto
      const response = await authService.register(userData);

      TokenManager.setToken(response.token);
      TokenManager.setUserData(response.usuario);
      setUser(response.usuario);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error en el registro';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    TokenManager.clearAuth();
    setUser(null);
    setError(null);
    window.location.href = '/login';
  };

  const updateUser = (userData: User): void => {
    try {
      TokenManager.setUserData(userData);
      setUser(userData);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  // ===== HELPERS DE PERMISOS =====
  const roleLevel: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  };

  const hasPermission = (requiredLevel: number): boolean => {
    if (!user) {
      return false;
    }

    const current = roleLevel[user.rol_id] ?? 5;
    return current <= requiredLevel;
  };

  const canCreateUsers = () => {
    return hasPermission(3);
  };

  // ===== VALOR DEL CONTEXTO =====
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    hasPermission,
    canCreateUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ===== HOOK =====
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};
