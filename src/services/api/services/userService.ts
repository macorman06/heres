import { HttpClient } from '../core/httpClient';
import { User, CreateUserRequest } from '../../../types';

export class UserService {
  constructor(private httpClient: HttpClient) {}

  async getUsers(): Promise<User[]> {
    return this.httpClient.get<User[]>('/usuarios/');
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return this.httpClient.post<User>('/usuarios/', userData);
  }

  async updateUser(id: number, userData: Partial<CreateUserRequest>): Promise<User> {
    return this.httpClient.put<User>(`/usuarios/${id}`, userData);
  }

  async deleteUser(id: number): Promise<void> {
    return this.httpClient.delete<void>(`/usuarios/${id}`);
  }

  async getUserById(id: number): Promise<User> {
    return this.httpClient.get<User>(`/usuarios/${id}`);
  }
}

const httpClient = new HttpClient();
const userService = new UserService(httpClient);

export default userService;
