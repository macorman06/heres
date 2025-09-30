// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
  User,
  ApiError,
} from '../services/api';

// ✅ HOOK GENÉRICO useApi (para compatibilidad hacia atrás)
export const useApi = <T>(apiFunction: (...args: any[]) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFunction(...args);
      setData(result);
      return result;

    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error desconocido';
      setError(errorMessage);
      console.error('Error en useApi:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

// ✅ HOOK ESPECIALIZADO PARA USUARIOS
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los usuarios
  const fetchAllUsers = useCallback(async (): Promise<User[]> => {
    try {
      setLoading(true);
      setError(null);
      const userData = await fetchUsers();
      setUsers(userData);
      return userData;
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error cargando usuarios';
      setError(errorMessage);
      console.error('❌ Error cargando usuarios:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo usuario
  const createNewUser = useCallback(async (userData: Partial<User>): Promise<User> => {
    try {
      setError(null);
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error creando usuario';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Actualizar usuario existente
  const updateExistingUser = useCallback(async (id: number, userData: Partial<User>): Promise<User> => {
    try {
      setError(null);
      const updatedUser = await updateUser(id, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error actualizando usuario';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Eliminar usuario
  const deleteExistingUser = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error eliminando usuario';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Subir imagen de perfil
  const uploadUserImage = useCallback(async (userId: number, imageFile: File): Promise<string> => {
    try {
      setError(null);
      const result = await uploadProfileImage(userId, imageFile);
      return result.path;
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error subiendo imagen';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar inicial (opcional - puedes activarlo o desactivarlo)
  useEffect(() => {
    // fetchAllUsers(); // Descomenta si quieres carga automática
  }, []);

  return {
    users,
    loading,
    error,
    fetchAllUsers,
    createNewUser,
    updateExistingUser,
    deleteExistingUser,
    uploadUserImage,
    clearError,
    refreshUsers: fetchAllUsers // Alias para compatibilidad
  };
};

// ✅ ALIAS PARA COMPATIBILIDAD
export const useApiCall = useApi;

// ✅ RE-EXPORTS PARA COMPATIBILIDAD
export {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage
} from '../services/api';

export type { User, ApiError } from '../services/api';
