const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import type { User } from '../types';
import type { ApiError } from '../types';
import type { AuthResponse } from '../types';

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

// api.ts
let isRedirecting = false;

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  // 🔴 BLOQUEAR inmediatamente si ya estamos redirigiendo
  if (isRedirecting) {
    return new Promise(() => {}); // Promise que nunca se resuelve
  }

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

      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        if (!isRedirecting) {
          isRedirecting = true;

          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');

          // Redirect síncrono
          window.location.replace('/login');
        }

        // Retornar una promesa que nunca se resuelve
        return new Promise(() => {});
      }

      throw {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        details: errorData,
      } as ApiError;
    }

    return await response.json();
  } catch (error: unknown) {
    // Si ya estamos redirigiendo, no propagar el error
    if (isRedirecting) {
      return new Promise(() => {});
    }

    if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
      throw error;
    }

    throw {
      message: 'Error de conexión con el servidor',
      status: 0,
      details: error,
    } as ApiError;
  }
};

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return {
    mensaje: response.mensaje,
    token: response.token,
    usuario: response.usuario,
  };
};

export const registerApi = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  return {
    mensaje: response.mensaje,
    token: response.token,
    usuario: response.usuario,
  };
};

export const fetchUsers = async (): Promise<User[]> => {
  return await apiRequest('/usuarios');
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  return await apiRequest('/usuarios', {
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
