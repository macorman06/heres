import { HttpClient } from '../core/httpClient';
import { User, UserFormData } from '../../../types';

export class UserService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene todos los usuarios
   */
  async getUsers(): Promise<User[]> {
    return this.httpClient.get('/usuarios/list');
  }

  async getRanking(): Promise<any> {
    return this.httpClient.get('/usuarios/ranking');
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUserById(id: number): Promise<User> {
    return this.httpClient.get(`/usuarios/${id}`);
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(userData: UserFormData): Promise<User> {
    return this.httpClient.post('/usuarios/create', userData);
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

  /**
   * Retorna la URL del avatar de un usuario
   * Esta URL apunta al endpoint del backend que sirve la imagen
   */
  getUserAvatarUrl(userId: number): string {
    const baseUrl = this.httpClient.getBaseUrl();
    return `${baseUrl}/usuarios/${userId}/avatar`;
  }

  /**
   * Sube un nuevo avatar para un usuario
   */
  async uploadAvatar(userId: number, file: File): Promise<{ mensaje: string; url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await this.httpClient.post<{ mensaje: string; url: string }>(
      `/usuarios/${userId}/avatar`,
      formData
    );

    return response;
  }
}
