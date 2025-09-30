// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
  User,
  ApiError
} from '../services/api';

// ✅ HOOK PARA GESTIÓN DE USUARIOS
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ CARGAR USUARIOS
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await fetchUsers();
      setUsers(userData);
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error cargando usuarios';
      setError(errorMessage);
      console.error('❌ Error cargando usuarios:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ CREAR USUARIO
  const addUser = useCallback(async (userData: Partial<User>): Promise<User | null> => {
    try {
      setError(null);
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
      console.log('✅ Usuario creado:', newUser.nombre);
      return newUser;
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error creando usuario';
      setError(errorMessage);
      console.error('❌ Error creando usuario:', err);
      return null;
    }
  }, []);

  // ✅ ACTUALIZAR USUARIO
  const modifyUser = useCallback(async (id: number, userData: Partial<User>): Promise<User | null> => {
    try {
      setError(null);
      const updatedUser = await updateUser(id, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      console.log('✅ Usuario actualizado:', updatedUser.nombre);
      return updatedUser;
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error actualizando usuario';
      setError(errorMessage);
      console.error('❌ Error actualizando usuario:', err);
      return null;
    }
  }, []);

  // ✅ ELIMINAR USUARIO
  const removeUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      console.log('✅ Usuario eliminado:', id);
      return true;
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error eliminando usuario';
      setError(errorMessage);
      console.error('❌ Error eliminando usuario:', err);
      return false;
    }
  }, []);

  // ✅ SUBIR IMAGEN DE PERFIL
  const uploadUserImage = useCallback(async (userId: number, imageFile: File): Promise<string | null> => {
    try {
      setError(null);
      const result = await uploadProfileImage(userId, imageFile);
      console.log('✅ Imagen subida:', result.filename);
      return result.path;
    } catch (err: any) {
      const errorMessage = (err as ApiError).message || 'Error subiendo imagen';
      setError(errorMessage);
      console.error('❌ Error subiendo imagen:', err);
      return null;
    }
  }, []);

  // ✅ LIMPIAR ERROR
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ REFRESCAR DATOS
  const refreshUsers = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  // ✅ CARGAR USUARIOS AL MONTAR EL COMPONENTE
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    // Estado
    users,
    isLoading,
    error,

    // Acciones
    addUser,
    modifyUser,
    removeUser,
    uploadUserImage,
    refreshUsers,
    clearError,

    // Utilidades
    totalUsers: users.length,
    hasError: !!error,
  };
};

// ✅ HOOK PARA FILTRADO DE USUARIOS
export const useUserFilters = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedCentro, setSelectedCentro] = useState<string | null>(null);

  // ✅ USUARIOS FILTRADOS
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm ||
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !selectedRole || user.rol_id === selectedRole;

    const matchesCentro = !selectedCentro || user.centro_juvenil === selectedCentro;

    return matchesSearch && matchesRole && matchesCentro;
  });

  // ✅ OPCIONES DISPONIBLES
  const availableRoles = [...new Set(users.map(user => user.rol_id))].filter(Boolean);
  const availableCentros = [...new Set(users.map(user => user.centro_juvenil))].filter(Boolean);

  // ✅ LIMPIAR FILTROS
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedRole(null);
    setSelectedCentro(null);
  }, []);

  // ✅ VERIFICAR SI HAY FILTROS ACTIVOS
  const hasActiveFilters = searchTerm || selectedRole || selectedCentro;

  return {
    // Estado de filtros
    searchTerm,
    selectedRole,
    selectedCentro,

    // Setters
    setSearchTerm,
    setSelectedRole,
    setSelectedCentro,

    // Resultados
    filteredUsers,
    availableRoles,
    availableCentros,

    // Utilidades
    clearFilters,
    hasActiveFilters,
    resultsCount: filteredUsers.length,
  };
};

// ✅ HOOK PARA PAGINACIÓN
export const usePagination = <T>(items: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // ✅ RESETEAR PÁGINA CUANDO CAMBIEN LOS ITEMS
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, totalPages, currentPage]);

  return {
    // Estado
    currentPage,
    totalPages,
    itemsPerPage,

    // Datos paginados
    paginatedItems,

    // Navegación
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPagination,

    // Información
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, items.length),
    totalItems: items.length,
  };
};

// ✅ HOOK COMBINADO PARA GESTIÓN COMPLETA DE USUARIOS
export const useUserManagement = (itemsPerPage?: number) => {
  const userHooks = useUsers();
  const filterHooks = useUserFilters(userHooks.users);
  const paginationHooks = usePagination(filterHooks.filteredUsers, itemsPerPage);

  return {
    // Datos de usuarios
    ...userHooks,

    // Filtrado
    ...filterHooks,

    // Paginación
    ...paginationHooks,

    // Estado combinado
    isReady: !userHooks.isLoading && userHooks.users.length > 0,
    isEmpty: !userHooks.isLoading && userHooks.users.length === 0,
  };
};

// ✅ EXPORT COMPATIBILITY (para compatibilidad con imports existentes)
export const apiService = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
};

export default useUserManagement;
