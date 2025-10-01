
import { HttpClient } from './core/httpClient';
import { AuthService } from './services/authService';
import { UserService } from './services/userService';
import { GroupService } from './services/groupService';

// ===== CREAR INSTANCIAS =====

// Crear instancia del cliente HTTP
const httpClient = new HttpClient();

// Crear instancias de servicios
export const authService = new AuthService(httpClient);
export const userService = new UserService(httpClient);
export const groupService = new GroupService(httpClient);

// ===== EXPORTAR TIPOS =====
// Tipos de autenticación, usuario, grupo y error.
export type { LoginRequest, RegisterRequest, AuthResponse, AuthContextType} from '../../types/auth.types.ts';
export type { User, CreateUserRequest, UpdateUserRequest} from '../../types/user.types.ts';
export type { Grupo } from '../../types/group.types.ts';
export type { ApiError } from '../../types/api.types.ts';

// ===== EXPORTAR UTILIDADES =====

export { API_CONFIG, IS_DEVELOPMENT } from './config/apiConfig';
export { ErrorHandler } from './core/errorHandler';

// ===== CLASE APISERVICE (AGRUPACIÓN DE SERVICIOS) =====


export class ApiService {
  // Referencias a los servicios
  auth = authService;
  users = userService;
  groups = groupService;

  // === MÉTODOS DE AUTENTICACIÓN ===

  login = (credentials: any) => authService.login(credentials);
  register = (userData: any) => authService.register(userData);
  logout = () => authService.logout();
  getCurrentUser = () => authService.getCurrentUser();
  isAuthenticated = () => authService.isAuthenticated();

  // === MÉTODOS DE USUARIOS ===

  getUsers = () => userService.getUsers();
  createUser = (userData: any) => userService.createUser(userData);
  updateUser = (id: number, userData: any) => userService.updateUser(id, userData);
  deleteUser = (id: number) => userService.deleteUser(id);
  getUserById = (id: number) => userService.getUserById(id);

  // === MÉTODOS DE GRUPOS ===

  getGroups = () => groupService.getGroups();
  getGroupById = (id: number) => groupService.getGroupById(id);
  createGroup = (groupData: any) => groupService.createGroup(groupData);
  updateGroup = (id: number, groupData: any) =>
    groupService.updateGroup(id, groupData);
  deleteGroup = (id: number) => groupService.deleteGroup(id);

  // === UTILIDADES ===

  /**
   * Obtiene información del entorno actual
   */
  getEnvironmentInfo = () => httpClient.getEnvironmentInfo();
}

// ===== EXPORTAR INSTANCIA DE APISERVICE =====

export const apiService = new ApiService();
export default apiService;
