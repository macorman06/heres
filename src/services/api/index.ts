// src/services/api/index.ts

import authService from './services/authService';
import userService from './services/userService';
import groupService from './services/groupService';

// === IMPORTAR TIPOS CORRECTOS ===
import type { User } from '../../types';
import type { Grupo } from '../../types';
import type { LoginRequest, RegisterRequest } from '../../types';
import type { CreateUserRequest } from '../../types';

console.log('🔧 [API Index] Inicializando servicios de API');

export const api = {
  // === AUTENTICACIÓN ===
  login: (credentials: LoginRequest) => {
    console.log('🔐 [API] login() llamado');
    return authService.login(credentials);
  },
  register: (userData: RegisterRequest) => {
    console.log('📝 [API] register() llamado');
    return authService.register(userData);
  },
  logout: () => {
    console.log('🚪 [API] logout() llamado');
    return authService.logout();
  },
  getCurrentUser: () => {
    console.log('👤 [API] getCurrentUser() llamado');
    return authService.getCurrentUser();
  },
  isAuthenticated: () => {
    console.log('🔍 [API] isAuthenticated() llamado');
    return authService.isAuthenticated();
  },

  // === USUARIOS ===
  getUsers: () => {
    console.log('👥 [API] getUsers() llamado');
    return userService.getUsers();
  },
  createUser: (userData: CreateUserRequest) => {
    console.log('➕ [API] createUser() llamado');
    return userService.createUser(userData);
  },
  updateUser: (id: number, userData: Partial<User>) => {
    console.log('🔄 [API] updateUser() llamado para id:', id);
    return userService.updateUser(id, userData);
  },
  deleteUser: (id: number) => {
    console.log('🗑️ [API] deleteUser() llamado para id:', id);
    return userService.deleteUser(id);
  },

  // === GRUPOS ===
  getGroups: () => {
    console.log('📚 [API] getGroups() llamado');
    return groupService.getGroups();
  },
  getGroupById: (id: number) => {
    console.log('🔍 [API] getGroupById() llamado para id:', id);
    return groupService.getGroupById(id);
  },
  createGroup: (groupData: Partial<Grupo>) => {
    console.log('➕ [API] createGroup() llamado');
    return groupService.createGroup(groupData);
  },
  updateGroup: (id: number, groupData: Partial<Grupo>) => {
    console.log('🔄 [API] updateGroup() llamado para id:', id);
    return groupService.updateGroup(id, groupData);
  },
  deleteGroup: (id: number) => {
    console.log('🗑️ [API] deleteGroup() llamado para id:', id);
    return groupService.deleteGroup(id);
  },
};

export default api;
