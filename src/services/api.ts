console.log('🔧 [api.ts] Cargando módulo API');
console.log('🔧 [api.ts] import.meta.env:', import.meta.env);
console.log('🔧 [api.ts] VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🔧 [api.ts] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 [api.ts] API_BASE_URL final:', API_BASE_URL);
console.log('🌐 [api.ts] Protocolo:', API_BASE_URL.startsWith('https://') ? 'HTTPS ✅' : 'HTTP ⚠️');

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
  console.log('📡 [apiRequest] Iniciando petición');
  console.log('📡 [apiRequest] Endpoint:', endpoint);
  console.log('📡 [apiRequest] API_BASE_URL:', API_BASE_URL);

  // 🔴 BLOQUEAR inmediatamente si ya estamos redirigiendo
  if (isRedirecting) {
    console.log('🔴 [apiRequest] Ya redirigiendo, bloqueando petición');
    return new Promise(() => {}); // Promise que nunca se resuelve
  }

  const token = localStorage.getItem('authToken');
  console.log('🔑 [apiRequest] Token presente:', !!token);

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // 🔍 CONSTRUIR URL COMPLETA
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('🌐 [apiRequest] URL completa construida:', fullUrl);
  console.log('🌐 [apiRequest] Método:', options.method || 'GET');

  // 🔍 VERIFICAR PROTOCOLO
  try {
    const urlObj = new URL(fullUrl);
    console.log('🔍 [apiRequest] URL parseada:', {
      href: urlObj.href,
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
    });

    if (urlObj.protocol === 'http:') {
      console.error('❌ [apiRequest] ¡DETECTADO HTTP! Debería ser HTTPS');
      console.error('❌ [apiRequest] API_BASE_URL:', API_BASE_URL);
      console.error('❌ [apiRequest] endpoint:', endpoint);
    } else {
      console.log('✅ [apiRequest] Protocolo correcto (HTTPS)');
    }
  } catch (e) {
    console.error('❌ [apiRequest] Error parseando URL:', e);
  }

  try {
    console.log('🚀 [apiRequest] Ejecutando fetch...');
    const response = await fetch(fullUrl, config);
    console.log('📥 [apiRequest] Respuesta recibida:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });

    if (!response.ok) {
      console.error('❌ [apiRequest] Respuesta no OK:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [apiRequest] Error data:', errorData);

      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        console.log('🔴 [apiRequest] 401 Unauthorized detectado');
        if (!isRedirecting) {
          isRedirecting = true;
          console.log('🔴 [apiRequest] Limpiando auth y redirigiendo...');
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          window.location.replace('/login');
        }
        return new Promise(() => {});
      }

      throw {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        details: errorData,
      } as ApiError;
    }

    const data = await response.json();
    console.log('✅ [apiRequest] Petición exitosa, datos recibidos');
    return data;
  } catch (error: unknown) {
    console.error('❌ [apiRequest] Error en try/catch:', error);

    if (isRedirecting) {
      console.log('🔴 [apiRequest] Bloqueando error porque ya estamos redirigiendo');
      return new Promise(() => {});
    }

    if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
      console.error('❌ [apiRequest] Re-throwing ApiError:', error);
      throw error;
    }

    console.error('❌ [apiRequest] Error de conexión:', error);
    throw {
      message: 'Error de conexión con el servidor',
      status: 0,
      details: error,
    } as ApiError;
  }
};

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log('🔐 [loginApi] Llamando a login con:', credentials.email);
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  console.log('✅ [loginApi] Login exitoso');
  return {
    mensaje: response.mensaje,
    token: response.token,
    usuario: response.usuario,
  };
};

export const registerApi = async (userData: RegisterData): Promise<AuthResponse> => {
  console.log('📝 [registerApi] Llamando a register');
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  console.log('✅ [registerApi] Registro exitoso');
  return {
    mensaje: response.mensaje,
    token: response.token,
    usuario: response.usuario,
  };
};

export const fetchUsers = async (): Promise<User[]> => {
  console.log('👥 [fetchUsers] Obteniendo lista de usuarios');
  const users = await apiRequest<User[]>('/usuarios/');
  console.log('✅ [fetchUsers] Usuarios obtenidos:', users.length);
  return users;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  console.log('➕ [createUser] Creando usuario:', userData);
  const user = await apiRequest<User>('/usuarios/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  console.log('✅ [createUser] Usuario creado:', user);
  return user;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  console.log('🔄 [updateUser] Actualizando usuario:', id);
  const user = await apiRequest<User>(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
  console.log('✅ [updateUser] Usuario actualizado');
  return user;
};

export const deleteUser = async (id: number): Promise<{ message: string }> => {
  console.log('🗑️ [deleteUser] Eliminando usuario:', id);
  const response = await apiRequest<{ message: string }>(`/usuarios/${id}`, {
    method: 'DELETE',
  });
  console.log('✅ [deleteUser] Usuario eliminado');
  return response;
};

export const uploadProfileImage = async (
  userId: number,
  imageFile: File
): Promise<{ filename: string; path: string }> => {
  console.log('📷 [uploadProfileImage] Subiendo imagen para usuario:', userId);
  console.log('📷 [uploadProfileImage] API_BASE_URL:', API_BASE_URL);

  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('profileImage', imageFile);

  const uploadUrl = `${API_BASE_URL}/usuarios/${userId}/upload-image`;
  console.log('📷 [uploadProfileImage] URL completa:', uploadUrl);

  // Verificar protocolo
  try {
    const urlObj = new URL(uploadUrl);
    console.log('🔍 [uploadProfileImage] Protocolo:', urlObj.protocol);
    if (urlObj.protocol === 'http:') {
      console.error('❌ [uploadProfileImage] ¡DETECTADO HTTP! Debería ser HTTPS');
    }
  } catch (e) {
    console.error('❌ [uploadProfileImage] Error parseando URL:', e);
  }

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    console.error('❌ [uploadProfileImage] Error:', response.status);
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.message || 'Error subiendo imagen',
      status: response.status,
      details: errorData,
    } as ApiError;
  }

  console.log('✅ [uploadProfileImage] Imagen subida exitosamente');
  return await response.json();
};
