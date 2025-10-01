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

  // Obtener un grupo por ID
  const fetchGroupById = useCallback(async (id: number): Promise<Grupo> => {
    try {
      setLoading(true);
      setError(null);
      const group = await apiService.getGroupById(id);
      return group;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error cargando grupo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un nuevo grupo
  const createGroup = useCallback(async (groupData: Partial<Grupo>): Promise<Grupo> => {
    try {
      setLoading(true);
      setError(null);
      const newGroup = await apiService.createGroup(groupData);
      // Actualizar la lista de grupos localmente
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      return newGroup;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error creando grupo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar un grupo existente
  const updateGroup = useCallback(async (id: number, groupData: Partial<Grupo>): Promise<Grupo> => {
    try {
      setLoading(true);
      setError(null);
      const updatedGroup = await apiService.updateGroup(id, groupData);
      // Actualizar la lista de grupos localmente
      setGroups((prevGroups) =>
        prevGroups.map((group) => (group.id === id ? updatedGroup : group))
      );
      return updatedGroup;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error actualizando grupo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar un grupo
  const deleteGroup = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await apiService.deleteGroup(id);
      // Eliminar el grupo de la lista localmente
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error eliminando grupo';
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
    fetchGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    clearError,
    refreshGroups: fetchAllGroups,
  };
};