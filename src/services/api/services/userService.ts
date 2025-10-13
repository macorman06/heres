// src/services/api/services/userService.ts
import { HttpClient } from '../core/httpClient';
import { User, UserFormData } from '../../../types';

export class UserService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene todos los usuarios
   */
  async getUsers(): Promise<User[]> {
    return this.httpClient.get<User[]>('/usuarios/list');
  }

  /**
   * Obtiene el ranking de miembros (solo usuarios con rol_id = 5)
   */
  async getRanking(): Promise<User[]> {
    return this.httpClient.get<User[]>('/usuarios/ranking');
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUserById(id: number): Promise<User> {
    return this.httpClient.get<User>(`/usuarios/${id}`);
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(userData: UserFormData): Promise<User> {
    return this.httpClient.post<User>('/usuarios/create', userData);
  }

  /**
   * Actualiza un usuario existente
   */
  async updateUser(id: number, userData: Partial<User>): Promise<{ mensaje: string }> {
    return this.httpClient.put<{ mensaje: string }>(`/usuarios/${id}`, userData);
  }

  /**
   * Elimina un usuario
   */
  async deleteUser(id: number): Promise<{ mensaje: string }> {
    return this.httpClient.delete<{ mensaje: string }>(`/usuarios/${id}`);
  }
}
