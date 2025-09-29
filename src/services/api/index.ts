import { HttpClient } from './core/httpClient';
import { AuthService } from './services/authService';
import { UserService } from './services/userService';
import { MemberService } from './services/memberService';
import { PermissionManager } from '../auth/permissions';

// Create HTTP client instance
const httpClient = new HttpClient();

// Create service instances
export const authService = new AuthService(httpClient);
export const userService = new UserService(httpClient);
export const memberService = new MemberService(httpClient);

// Export permission manager
export { PermissionManager };

// Export types for components
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types/auth.types';

export type {
  CreateUserRequest,
  UpdateUserRequest,
} from '../types/user.types';

export type {
  Member,
  CreateMemberRequest,
  UpdateMemberRequest,
} from '../types/member.types';

export type { ApiError } from '../types/api.types';

// Export roles and constants
export { ROLES, ROLE_NAMES } from '../auth/permissions';

// Main API service for backward compatibility and ease of use
export class ApiService {
  auth = authService;
  users = userService;
  members = memberService;
  permissions = PermissionManager;

  // Environment info
  getEnvironmentInfo = () => httpClient.getEnvironmentInfo();

  // Convenience methods for backward compatibility
  login = (credentials: any) => this.auth.login(credentials);
  register = (userData: any) => this.auth.register(userData);
  logout = () => this.auth.logout();
  getCurrentUser = () => this.auth.getCurrentUser();
  isAuthenticated = () => this.auth.isAuthenticated();

  getUsers = () => this.users.getUsers();
  createUser = (userData: any) => this.users.createUser(userData);
  updateUser = (id: number, userData: any) => this.users.updateUser(id, userData);
  deleteUser = (id: number) => this.users.deleteUser(id);

  getMembers = () => this.members.getMembers();
  createMember = (memberData: any) => this.members.createMember(memberData);
  updateMember = (id: number, memberData: any) => this.members.updateMember(id, memberData);
  deleteMember = (id: number) => this.members.deleteMember(id);

  // Permission methods
  canCreateUsers = (userRole: number) => this.permissions.canCreateUsers(userRole);
  canEditUsers = (userRole: number) => this.permissions.canEditUsers(userRole);
  canDeleteUsers = (userRole: number) => this.permissions.canDeleteUsers(userRole);
  canManageMembers = (userRole: number) => this.permissions.canManageMembers(userRole);
  hasAdminAccess = (userRole: number) => this.permissions.hasAdminAccess(userRole);
}

export const apiService = new ApiService();
export default apiService;
