import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { LoginRequest, RegisterRequest, AuthContextType } from '../types';
import type { ApiError } from '../types';
import type { User } from '../types';

import { apiService } from '../services/api/index.ts';

// ===== CONTEXTO =====

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== PROVIDER =====

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('currentUser');

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('👤 Usuario cargado desde localStorage:', userData.nombre);
      }
    } catch (error) {
      console.error('❌ Error cargando usuario desde localStorage:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
    }
  }, []);


  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.login(credentials);

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.usuario));
      setUser(response.usuario);

      console.log('✅ Login exitoso:', response.usuario.nombre);
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Credenciales inválidas';
      setError(errorMessage);
      console.error('❌ Error en login:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.register(userData);

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.usuario));
      setUser(response.usuario);

      console.log('✅ Registro exitoso:', response.usuario.nombre);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error en el registro';
      setError(errorMessage);
      console.error('❌ Error en registro:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
    setError(null);
    console.log('👋 Usuario deslogueado');
    window.location.href = '/login';
  };


  const updateUser = (userData: User): void => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      console.log('📝 Usuario actualizado:', userData.nombre);
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
    }
  };


  const clearError = (): void => setError(null);

  // ===== HELPERS DE PERMISOS =====

  const roleLevel: Record<number, number> = {
    1: 1, // superuser
    2: 2, // director
    3: 3, // coordinator
    4: 4, // animator
    5: 5, // member
  };


  const hasPermission = (requiredLevel: number): boolean => {
    if (!user) return false;
    const current = roleLevel[user.rol_id] ?? 5;
    return current <= requiredLevel;
  };


  const canCreateUsers = () => hasPermission(3);

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
