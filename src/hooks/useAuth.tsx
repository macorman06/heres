import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User, LoginRequest, RegisterRequest, ROLES } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<any>;
  register: (userData: RegisterRequest) => Promise<any>;
  logout: () => void;
  clearError: () => void;
  // ✅ SOLO PERMISOS DE USUARIOS (sin miembros)
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

  // ✅ FIXED: Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (apiService.isAuthenticated()) {
          const currentUser = apiService.getCurrentUser();

          // ✅ FIXED: Verificar que el usuario existe y tiene propiedades básicas
          if (currentUser && currentUser.id && currentUser.nombre) {
            setUser(currentUser);
            console.log('✅ Usuario autenticado encontrado:', currentUser.nombre);
          } else {
            console.warn('⚠️ Usuario encontrado pero sin datos válidos:', currentUser);
            apiService.logout(); // Limpiar datos inválidos
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

  // ✅ FIXED: Login function with better error handling
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Iniciando login para:', credentials.email);
      const response = await apiService.login(credentials);

      // ✅ FIXED: Verificar que la respuesta tiene estructura correcta
      if (!response) {
        throw new Error('Respuesta de login vacía del servidor');
      }

      if (!response.usuario) {
        throw new Error('No se recibieron datos de usuario del servidor');
      }

      const usuario = response.usuario;

      // ✅ FIXED: Verificar que el usuario tiene propiedades requeridas
      if (!usuario.id || !usuario.nombre || !usuario.email) {
        console.error('❌ Usuario recibido tiene datos incompletos:', usuario);
        throw new Error('Los datos del usuario están incompletos');
      }

      setUser(usuario);
      console.log('✅ Login exitoso:', usuario.nombre);
      return response;

    } catch (err: any) {
      const errorMessage = err?.message || 'Error de autenticación desconocido';
      setError(errorMessage);
      console.error('❌ Error de login:', errorMessage);

      // ✅ FIXED: Log detallado para debugging en producción
      if (err?.response?.data) {
        console.error('❌ Detalles del error del servidor:', err.response.data);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: Register function with better error handling
  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📝 Iniciando registro para:', userData.email);
      const response = await apiService.register(userData);

      // ✅ FIXED: Verificar que la respuesta tiene estructura correcta
      if (!response?.usuario) {
        throw new Error('No se recibieron datos de usuario del servidor');
      }

      const usuario = response.usuario;

      // ✅ FIXED: Verificar que el usuario tiene propiedades requeridas
      if (!usuario.nombre) {
        console.error('❌ Usuario registrado tiene datos incompletos:', usuario);
        throw new Error('Los datos del usuario registrado están incompletos');
      }

      setUser(usuario);
      console.log('✅ Registro exitoso:', usuario.nombre);
      return response;

    } catch (err: any) {
      const errorMessage = err?.message || 'Error de registro desconocido';
      setError(errorMessage);
      console.error('❌ Error de registro:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: Logout function
  const logout = () => {
    try {
      console.log('👋 Cerrando sesión para:', user?.nombre || 'usuario desconocido');
      apiService.logout();
      setUser(null);
      setError(null);
      console.log('✅ Sesión cerrada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      setUser(null); // Limpiar estado incluso si hay error
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // ✅ FUNCIONES DE PERMISOS - SOLO USUARIOS
  const hasPermission = (requiredRole: number): boolean => {
    if (!user || typeof user.rol_id !== 'number') return false;
    return user.rol_id <= requiredRole;
  };

  // ✅ SOLO PERMISOS DE USUARIOS
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
