import { useState, useCallback } from 'react';
import { apiService } from '../services/api/index.ts';

import type { User } from '../types'
import type { Grupo } from '../types'
import type { ApiError } from '../types'

// ===== HOOK GENÉRICO =====

export const useApi = <T>(apiFunction: (...args: unknown[]) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err: unknown) {
        const errorMessage = (err as ApiError).message || 'Error desconocido';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );


  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

// ===== HOOK ESPECIALIZADO PARA USUARIOS =====

/**
 * Hook para gestionar operaciones CRUD de usuarios
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = useCallback(async (): Promise<User[]> => {
    // ⚠️ Verificar si hay token antes de continuar
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No token available, skipping fetch');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const userData = await apiService.getUsers();
      setUsers(userData);
      return userData;
    } catch (err: unknown) {
      // Si es 401, NO actualizar estado (ya estamos redirigiendo)
      if ((err as ApiError).status === 401) {
        console.log('401 error - redirecting, not updating state');
        return [];
      }

      const errorMessage = (err as ApiError).message || 'Error cargando usuarios';
      setError(errorMessage);
      throw err;
    } finally {
      // Solo actualizar loading si no es 401
      if (localStorage.getItem('authToken')) {
        setLoading(false);
      }
    }
  }, []); // Sin dependencias

  return { users, loading, error, fetchAllUsers };
};

// ===== HOOK ESPECIALIZADO PARA GRUPOS =====

/**
 * Hook para gestionar operaciones de grupos
 */
export const useGroups = () => {
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchAllGroups = useCallback(async (): Promise<Grupo[]> => {
    try {
      setLoading(true);
      setError(null);
      const groupsData = await apiService.getGroups();
      setGroups(groupsData);
      return groupsData;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error cargando grupos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const clearError = useCallback(() => setError(null), []);

  return {
    groups,
    loading,
    error,
    fetchAllGroups,
    clearError,
    refreshGroups: fetchAllGroups,
  };
};
