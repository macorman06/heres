// src/hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  loginApi,
  registerApi,
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiError,
} from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (u: User) => void;
  clearError: () => void;
  hasPermission: (level: number) => boolean;
  canCreateUsers: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ CARGAR USUARIO AL INICIALIZAR
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

  // ✅ FUNCIÓN LOGIN AJUSTADA
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginApi(credentials);

      // ✅ USAR response.usuario EN LUGAR DE response.user
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.usuario));

      // ✅ SETEAR response.usuario
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

  // ✅ FUNCIÓN REGISTER AJUSTADA
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await registerApi(userData);

      // ✅ USAR response.usuario
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.usuario));

      setUser(response.usuario);

      console.log('✅ Registro exitoso:', response.usuario.nombre);

    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error en el registro';
      setError(errorMessage);
      console.error('❌ Error en registro:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FUNCIÓN LOGOUT
  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
    setError(null);
    console.log('👋 Usuario deslogueado');
  };

  // ✅ FUNCIÓN ACTUALIZAR USUARIO
  const updateUser = (userData: User): void => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      console.log('📝 Usuario actualizado:', userData.nombre);
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
    }
  };

  /* ----------  helpers de permisos ---------- */
  const roleLevel: Record<number, number> = {
    1: 1, // superuser
    2: 2, // director
    3: 3, // coordinator
    4: 4, // animator
    5: 5  // member
  };

  /** true si el usuario actual tiene un nivel <= al requerido */
  const hasPermission = (requiredLevel: number): boolean => {
    if (!user) return false;
    const current = roleLevel[user.rol_id] ?? 5;
    return current <= requiredLevel;
  };

  /** true si el usuario puede crear / administrar usuarios (coordinador↑) */
  const canCreateUsers = () => hasPermission(3); // 1-superuser, 2-director, 3-coordinator


  // ✅ LIMPIAR ERROR
  const clearError = (): void => {
    setError(null);
  };

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
    canCreateUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ HOOK PERSONALIZADO
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
