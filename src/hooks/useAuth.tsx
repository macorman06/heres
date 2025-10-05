// src/hooks/useAuth.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { LoginRequest, RegisterRequest, AuthContextType, ApiError, User } from '../types';
import { api } from '../services/api/index';
import { TokenManager } from '../services/auth/tokenManager';

console.log('🔧 [useAuth.tsx] Hook cargado');

// ===== CONTEXTO =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== PROVIDER =====
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🔧 [AuthProvider] Inicializando');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 [AuthProvider] useEffect - Cargando usuario desde localStorage');
    try {
      const token = TokenManager.getToken();
      const userData = TokenManager.getUserData() as User | null;
      console.log('🔍 [AuthProvider] Token encontrado:', !!token);
      console.log('🔍 [AuthProvider] UserData encontrado:', !!userData);

      if (token && userData) {
        console.log('✅ [AuthProvider] Usuario restaurado:', userData.email);
        setUser(userData);
      } else {
        console.log('⚠️ [AuthProvider] No hay usuario guardado');
      }
    } catch (error) {
      console.error('❌ [AuthProvider] Error cargando usuario desde localStorage:', error);
      TokenManager.clearAuth();
    } finally {
      setIsLoading(false);
      console.log('✅ [AuthProvider] Inicialización completada');
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    console.log('🔐 [AuthProvider] login() llamado para:', credentials.email);
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔐 [AuthProvider] Llamando a api.login()...');
      const response = await api.login(credentials);
      console.log('✅ [AuthProvider] Login exitoso, token recibido');

      TokenManager.setToken(response.token);
      TokenManager.setUserData(response.usuario);
      setUser(response.usuario);
      console.log('✅ [AuthProvider] Usuario autenticado:', response.usuario.email);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Credenciales inválidas';
      setError(errorMessage);
      console.error('❌ [AuthProvider] Error en login:', errorMessage, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    console.log('📝 [AuthProvider] register() llamado');
    try {
      setIsLoading(true);
      setError(null);
      console.log('📝 [AuthProvider] Llamando a api.register()...');
      const response = await api.register(userData);
      console.log('✅ [AuthProvider] Registro exitoso');

      TokenManager.setToken(response.token);
      TokenManager.setUserData(response.usuario);
      setUser(response.usuario);
      console.log('✅ [AuthProvider] Usuario registrado:', response.usuario.email);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error en el registro';
      setError(errorMessage);
      console.error('❌ [AuthProvider] Error en registro:', errorMessage, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    console.log('🚪 [AuthProvider] logout() llamado');
    TokenManager.clearAuth();
    setUser(null);
    setError(null);
    console.log('✅ [AuthProvider] Usuario deslogueado, redirigiendo...');
    window.location.href = '/login';
  };

  const updateUser = (userData: User): void => {
    console.log('🔄 [AuthProvider] updateUser() llamado');
    try {
      TokenManager.setUserData(userData);
      setUser(userData);
      console.log('✅ [AuthProvider] Usuario actualizado:', userData.email);
    } catch (error) {
      console.error('❌ [AuthProvider] Error actualizando usuario:', error);
    }
  };

  const clearError = (): void => {
    console.log('🧹 [AuthProvider] clearError() llamado');
    setError(null);
  };

  // ===== HELPERS DE PERMISOS =====
  const roleLevel: Record<number, number> = {
    1: 1, // superuser
    2: 2, // director
    3: 3, // coordinator
    4: 4, // animator
    5: 5, // member
  };

  const hasPermission = (requiredLevel: number): boolean => {
    if (!user) {
      console.log('⚠️ [AuthProvider] hasPermission: No hay usuario');
      return false;
    }
    const current = roleLevel[user.rol_id] ?? 5;
    const result = current <= requiredLevel;
    console.log(`🔍 [AuthProvider] hasPermission(${requiredLevel}):`, result);
    return result;
  };

  const canCreateUsers = () => {
    const result = hasPermission(3);
    console.log('🔍 [AuthProvider] canCreateUsers:', result);
    return result;
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
