import { HttpClient } from '../core/httpClient';
import { User, CreateUserRequest } from '../../../types';

export class UserService {
  constructor(private httpClient: HttpClient) {
    console.log('🔧 [UserService] Instancia creada');
  }

  async getUsers(): Promise<User[]> {
    console.log('👥 [UserService] getUsers() llamado');
    const result = await this.httpClient.get<User[]>('/usuarios');
    console.log('👥 [UserService] getUsers() completado. Total usuarios:', result.length);
    return result;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    console.log('➕ [UserService] createUser() llamado con:', userData);
    const result = await this.httpClient.post<User, CreateUserRequest>('/usuarios', userData);
    console.log('➕ [UserService] createUser() completado:', result);
    return result;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    console.log('🔄 [UserService] updateUser() llamado para id:', id, 'con:', userData);
    const result = await this.httpClient.put<User, Partial<User>>(`/usuarios/${id}`, userData);
    console.log('🔄 [UserService] updateUser() completado:', result);
    return result;
  }

  async deleteUser(id: number): Promise<void> {
    console.log('🗑️ [UserService] deleteUser() llamado para id:', id);
    await this.httpClient.delete<void>(`/usuarios/${id}`);
    console.log('🗑️ [UserService] deleteUser() completado');
  }

  async getUserById(id: number): Promise<User> {
    console.log('🔍 [UserService] getUserById() llamado para id:', id);
    const result = await this.httpClient.get<User>(`/usuarios/${id}`);
    console.log('🔍 [UserService] getUserById() completado:', result);
    return result;
  }
}

const httpClient = new HttpClient();
const userService = new UserService(httpClient);

export default userService;
