// src/hooks/useApi.ts

import { useCallback, useState } from 'react';
import { api } from '../services/api/index';
import type { ApiError, Grupo, User } from '../types';

console.log('🔧 [useApi.ts] Hook cargado');

// ===== HOOK GENÉRICO =====
export const useApi = <T>(apiFunction: (...args: unknown[]) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T> => {
      console.log('🔄 [useApi] Execute llamado con args:', args);
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 [useApi] Ejecutando función API...');
        const result = await apiFunction(...args);
        console.log('✅ [useApi] Resultado obtenido');
        setData(result);
        return result;
      } catch (err: unknown) {
        const errorMessage = (err as ApiError).message || 'Error desconocido';
        console.error('❌ [useApi] Error:', errorMessage, err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
        console.log('🔄 [useApi] Execute finalizado');
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    console.log('🔄 [useApi] Reset llamado');
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

// ===== HOOK ESPECIALIZADO PARA USUARIOS =====
export const useUsers = () => {
  console.log('👥 [useUsers] Hook inicializado');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = useCallback(async (): Promise<User[]> => {
    console.log('👥 [useUsers] fetchAllUsers llamado');
    const token = localStorage.getItem('authToken');
    console.log('👥 [useUsers] Token presente:', !!token);

    if (!token) {
      console.log('⚠️ [useUsers] No hay token, retornando array vacío');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      console.log('👥 [useUsers] Llamando a api.getUsers()...');
      const userData = await api.getUsers();
      console.log('✅ [useUsers] Usuarios obtenidos:', userData.length);
      setUsers(userData);
      return userData;
    } catch (err: unknown) {
      console.error('❌ [useUsers] Error obteniendo usuarios:', err);
      if ((err as ApiError).status === 401) {
        console.log('🔴 [useUsers] Error 401, retornando array vacío');
        return [];
      }
      const errorMessage = (err as ApiError).message || 'Error cargando usuarios';
      setError(errorMessage);
      throw err;
    } finally {
      if (localStorage.getItem('authToken')) {
        setLoading(false);
      }
      console.log('👥 [useUsers] fetchAllUsers finalizado');
    }
  }, []);

  return { users, loading, error, fetchAllUsers };
};

// ===== HOOK ESPECIALIZADO PARA GRUPOS =====
export const useGroups = () => {
  console.log('📚 [useGroups] Hook inicializado');
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllGroups = useCallback(async (): Promise<Grupo[]> => {
    console.log('📚 [useGroups] fetchAllGroups llamado');
    try {
      setLoading(true);
      setError(null);
      const groupsData = await api.getGroups();
      console.log('✅ [useGroups] Grupos obtenidos:', groupsData.length);
      setGroups(groupsData);
      return groupsData;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error cargando grupos';
      console.error('❌ [useGroups] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroupById = useCallback(async (id: number): Promise<Grupo> => {
    console.log('📚 [useGroups] fetchGroupById llamado para id:', id);
    try {
      setLoading(true);
      setError(null);
      const group = await api.getGroupById(id);
      console.log('✅ [useGroups] Grupo obtenido:', group);
      return group;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error cargando grupo';
      console.error('❌ [useGroups] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (groupData: Partial<Grupo>): Promise<Grupo> => {
    console.log('➕ [useGroups] createGroup llamado');
    try {
      setLoading(true);
      setError(null);
      const newGroup = await api.createGroup(groupData);
      console.log('✅ [useGroups] Grupo creado:', newGroup);
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      return newGroup;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error creando grupo';
      console.error('❌ [useGroups] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGroup = useCallback(async (id: number, groupData: Partial<Grupo>): Promise<Grupo> => {
    console.log('🔄 [useGroups] updateGroup llamado para id:', id);
    try {
      setLoading(true);
      setError(null);
      const updatedGroup = await api.updateGroup(id, groupData);
      console.log('✅ [useGroups] Grupo actualizado:', updatedGroup);
      setGroups((prevGroups) =>
        prevGroups.map((group) => (group.id === id ? updatedGroup : group))
      );
      return updatedGroup;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error actualizando grupo';
      console.error('❌ [useGroups] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteGroup = useCallback(async (id: number): Promise<void> => {
    console.log('🗑️ [useGroups] deleteGroup llamado para id:', id);
    try {
      setLoading(true);
      setError(null);
      await api.deleteGroup(id);
      console.log('✅ [useGroups] Grupo eliminado');
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).message || 'Error eliminando grupo';
      console.error('❌ [useGroups] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    console.log('🧹 [useGroups] clearError llamado');
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
