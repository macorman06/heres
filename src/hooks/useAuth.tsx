import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User, LoginRequest, RegisterRequest, ROLES } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // Permission functions for users only
  hasPermission: (requiredRole: number) => boolean;
  canCreateUsers: () => boolean;
  canEditUsers: () => boolean;
  canDeleteUsers: () => boolean;
  hasAdminAccess: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (apiService.isAuthenticated()) {
          const currentUser = apiService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            console.log('✅ Usuario autenticado encontrado:', currentUser.nombre);
          }
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error);
        apiService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Iniciando login para:', credentials.email);
      const response = await apiService.login(credentials);

      setUser(response.usuario);
      console.log('✅ Login exitoso:', response.usuario.nombre);

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Error de autenticación';
      setError(errorMessage);
      console.error('❌ Error de login:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📝 Iniciando registro para:', userData.email);
      const response = await apiService.register(userData);

      setUser(response.usuario);
      console.log('✅ Registro exitoso:', response.usuario.nombre);

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Error de registro';
      setError(errorMessage);
      console.error('❌ Error de registro:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      console.log('👋 Cerrando sesión para:', user?.nombre);
      apiService.logout();
      setUser(null);
      setError(null);
      console.log('✅ Sesión cerrada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      setUser(null);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Permission functions - users only
  const hasPermission = (requiredRole: number): boolean => {
    if (!user || !user.rol_id) return false;
    return user.rol_id <= requiredRole;
  };

  const canCreateUsers = () => hasPermission(ROLES.COORDINADOR);
  const canEditUsers = () => hasPermission(ROLES.ANIMADOR);
  const canDeleteUsers = () => hasPermission(ROLES.COORDINADOR);
  const hasAdminAccess = () => hasPermission(ROLES.DIRECTOR);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    hasPermission,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    hasAdminAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
