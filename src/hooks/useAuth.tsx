// src/hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginApi, registerApi, User, LoginCredentials, RegisterData, ApiError } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ CARGAR USUARIO AL INICIALIZAR
  useEffect(() => {
    const loadUserFromStorage = () => {
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
    };

    loadUserFromStorage();
  }, []);

  // ✅ FUNCIÓN LOGIN
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginApi(credentials);

      // Guardar en localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));

      // Actualizar estado
      setUser(response.user);

      console.log('✅ Login exitoso:', response.user.nombre);

    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Credenciales inválidas';
      setError(errorMessage);
      console.error('❌ Error en login:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FUNCIÓN REGISTER
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await registerApi(userData);

      // Guardar en localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));

      // Actualizar estado
      setUser(response.user);

      console.log('✅ Registro exitoso:', response.user.nombre);

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
    clearError
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
