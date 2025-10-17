// src/hooks/useApi.ts
import { useCallback, useState } from 'react';
import { userService, groupService } from '../services/api/index';
import type { ApiError, Grupo, User } from '../types';

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
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = useCallback(async (): Promise<User[]> => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUsers();
      setUsers(userData);
      return userData;
    } catch (err: unknown) {
      if ((err as ApiError).status === 401) {
        return [];
      }

      const errorMessage = (err as ApiError).message || 'Error cargando usuarios';
      setError(errorMessage);
      throw err;
    } finally {
      if (localStorage.getItem('authToken')) {
        setLoading(false);
      }
    }
  }, []);

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
      const groupsData = await groupService.getGroups();
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

  const fetchGroupById = useCallback(async (id: number): Promise<Grupo> => {
    try {
      setLoading(true);
      setError(null);
      const group = await groupService.getGroupById(id);
      return group;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error cargando grupo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (groupData: Partial<Grupo>): Promise<Grupo> => {
    try {
      setLoading(true);
      setError(null);
      const newGroup = await groupService.createGroup(groupData);
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

  const updateGroup = useCallback(async (id: number, groupData: Partial<Grupo>): Promise<Grupo> => {
    try {
      setLoading(true);
      setError(null);
      const updatedGroup = await groupService.updateGroup(id, groupData);
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

  const deleteGroup = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await groupService.deleteGroup(id);
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error eliminando grupo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
