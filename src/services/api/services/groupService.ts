// src/services/api/services/groupService.ts
import { HttpClient } from '../core/httpClient';

export interface Group {
  id: number;
  nombre: string;
  descripcion?: string;
  miembros?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateGroupRequest {
  nombre: string;
  descripcion?: string;
  miembros?: number[];
}

export class GroupService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene todos los grupos
   */
  async getGroups(): Promise<Group[]> {
    return this.httpClient.get<Group[]>('/grupos');
  }

  /**
   * Obtiene un grupo por ID
   */
  async getGroupById(id: number): Promise<Group> {
    return this.httpClient.get<Group>(`/grupos/${id}`);
  }

  /**
   * Crea un nuevo grupo
   */
  async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    return this.httpClient.post<Group>('/grupos', groupData);
  }

  /**
   * Actualiza un grupo existente
   */
  async updateGroup(id: number, groupData: Partial<Group>): Promise<{ mensaje: string }> {
    return this.httpClient.put<{ mensaje: string }>(`/grupos/${id}`, groupData);
  }

  /**
   * Elimina un grupo
   */
  async deleteGroup(id: number): Promise<{ mensaje: string }> {
    return this.httpClient.delete<{ mensaje: string }>(`/grupos/${id}`);
  }
}
