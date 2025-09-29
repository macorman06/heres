import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService, User, LoginRequest, RegisterRequest, ApiError } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  isAuthenticated: boolean;
  hasPermission: (action: 'create' | 'edit' | 'delete', resource: 'users' | 'members') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing authentication on app start
    const initAuth = () => {
      try {
        if (apiService.isAuthenticated()) {
          const currentUser = apiService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        apiService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login(credentials);
      setUser(response.usuario);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.register(userData);
      setUser(response.usuario);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const hasPermission = (action: 'create' | 'edit' | 'delete', resource: 'users' | 'members'): boolean => {
    if (!user) return false;

    const userRole = user.rol_id;

    if (resource === 'users') {
      switch (action) {
        case 'create':
          return apiService.canCreateUsers(userRole);
        case 'edit':
          return apiService.canEditUsers(userRole);
        case 'delete':
          return apiService.canDeleteUsers(userRole);
        default:
          return false;
      }
    } else if (resource === 'members') {
      return apiService.canManageMembers(userRole);
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      error,
      clearError,
      isAuthenticated: !!user,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};