// src/services/api/index.ts
import { HttpClient } from './core/httpClient';
import { AuthService } from './services/authService';
import { UserService } from './services/userService';
import { GroupService } from './services/groupService';

// Crear instancia única de HttpClient
const httpClient = new HttpClient();

// Crear y exportar servicios individuales
export const authService = new AuthService(httpClient);
export const userService = new UserService(httpClient);
export const groupService = new GroupService(httpClient);

// Exportar objeto API completo (opcional, para uso alternativo)
export const api = {
  auth: authService,
  user: userService,
  group: groupService,
};

// Exportar tipos para uso externo
export type { Group, CreateGroupRequest } from './services/groupService';
