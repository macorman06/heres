// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// ✅ TIPOS DE DATOS
export interface User {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email?: string;
  rol_id: number;
  rol?: string;
  centro_juvenil?: string;
  seccion?: string[];
  edad?: number;
  birthday?: string;
  sexo?: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: string;
  can_login?: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  apellido1?: string;
  apellido2?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// ✅ FUNCIÓN HELPER PARA REQUESTS
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('authToken');

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        details: errorData,
      } as ApiError;
    }

    return await response.json();
  } catch (error: any) {
    if (error.message && error.status) {
      throw error; // Ya es un ApiError
    }
    throw {
      message: 'Error de conexión con el servidor',
      status: 0,
      details: error,
    } as ApiError;
  }
};

// ✅ FUNCIONES DE AUTENTICACIÓN
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerApi = async (userData: RegisterData): Promise<AuthResponse> => {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// ✅ FUNCIONES DE USUARIOS
export const fetchUsers = async (): Promise<User[]> => {
  return await apiRequest('/usuarios/');
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  return await apiRequest('/usuarios/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  return await apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (id: number): Promise<{ message: string }> => {
  return await apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  });
};

// ✅ FUNCIONES AUXILIARES
export const uploadProfileImage = async (
  userId: number,
  imageFile: File
): Promise<{ filename: string; path: string }> => {
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('profileImage', imageFile);

  const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/upload-image`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.message || 'Error subiendo imagen',
      status: response.status,
      details: errorData,
    } as ApiError;
  }

  return await response.json();
};

// ✅ EXPORT DEFAULT (para compatibilidad con useApi.ts)
export const apiService = {
  loginApi,
  registerApi,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
};

export default apiService;
