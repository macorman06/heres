import { useState, useEffect, useCallback } from 'react';
import { apiService, User, CreateUserRequest, UpdateUserRequest } from '../services/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = () => {
  // Users management (replaces members)
  const [users, setUsers] = useState<UseApiState<User[]>>({
    data: null,
    loading: false,
    error: null
  });

  const fetchUsers = useCallback(async () => {
    setUsers(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiService.getUsers();
      setUsers({ data, loading: false, error: null });
      console.log('✅ Users fetched:', data.length);
    } catch (error: any) {
      const errorMessage = error.message || 'Error fetching users';
      setUsers({ data: null, loading: false, error: errorMessage });
      console.error('❌ Error fetching users:', errorMessage);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<User> => {
    try {
      console.log('📝 Creating user:', userData.nombre);
      const newUser = await apiService.createUser(userData);

      // Refresh users list
      await fetchUsers();

      console.log('✅ User created:', newUser.nombre);
      return newUser;
    } catch (error: any) {
      const errorMessage = error.message || 'Error creating user';
      console.error('❌ Error creating user:', errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, userData: UpdateUserRequest): Promise<User> => {
    try {
      console.log('🔄 Updating user:', id);
      const updatedUser = await apiService.updateUser(id, userData);

      // Refresh users list
      await fetchUsers();

      console.log('✅ User updated:', updatedUser.nombre);
      return updatedUser;
    } catch (error: any) {
      const errorMessage = error.message || 'Error updating user';
      console.error('❌ Error updating user:', errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: number): Promise<void> => {
    try {
      console.log('🗑️ Deleting user:', id);
      await apiService.deleteUser(id);

      // Refresh users list
      await fetchUsers();

      console.log('✅ User deleted');
    } catch (error: any) {
      const errorMessage = error.message || 'Error deleting user';
      console.error('❌ Error deleting user:', errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  // Auto-fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // Users data
    users: users.data,
    usersLoading: users.loading,
    usersError: users.error,

    // Users actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,

    // Utility
    refreshUsers: fetchUsers,
  };
};
