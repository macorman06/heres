// src/services/api/index.ts
import authService from './services/authService';
import userService from './services/userService';
import groupService from './services/groupService';

// === IMPORTAR TIPOS CORRECTOS ===
import type { User } from '../../types';
import type { Grupo } from '../../types';
import type { LoginRequest, RegisterRequest } from '../../types';
import type { CreateUserRequest } from '../../types';

export const api = {
  // === AUTENTICACIÓN ===
  login: (credentials: LoginRequest) => authService.login(credentials),
  register: (userData: RegisterRequest) => authService.register(userData),
  logout: () => authService.logout(),
  getCurrentUser: () => authService.getCurrentUser(),
  isAuthenticated: () => authService.isAuthenticated(),

  // === USUARIOS ===
  getUsers: () => userService.getUsers(),
  createUser: (userData: CreateUserRequest) => userService.createUser(userData),
  updateUser: (id: number, userData: Partial<User>) => userService.updateUser(id, userData),
  deleteUser: (id: number) => userService.deleteUser(id),

  // === GRUPOS ===
  getGroups: () => groupService.getGroups(),
  getGroupById: (id: number) => groupService.getGroupById(id),
  createGroup: (groupData: Partial<Grupo>) => groupService.createGroup(groupData),
  updateGroup: (id: number, groupData: Partial<Grupo>) => groupService.updateGroup(id, groupData),
  deleteGroup: (id: number) => groupService.deleteGroup(id),
};

export default api;
