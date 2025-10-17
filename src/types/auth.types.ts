import { User } from './user.types.ts';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario: User;
}

export interface AuthContextType {
  user: User | null;
  foto_perfil: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  hasPermission: (level: number) => boolean;
  canCreateUsers: () => boolean;
}
