// src/services/api/services/groupService.ts
import { HttpClient } from '../core/httpClient';
import { Grupo, GrupoFormData, UpdateGrupoRequest } from '../../../types/group.types';

export class GroupService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene todos los grupos
   */
  async getGroups(): Promise<Grupo[]> {
    return this.httpClient.get<Grupo[]>('/grupos');
  }

  /**
   * Obtiene grupos filtrados por centro del usuario actual
   */
  async getGroupsByCentro(): Promise<Grupo[]> {
    return this.httpClient.get<Grupo[]>('/grupos/por-centro');
  }

  /**
   * Obtiene un grupo por ID
   */
  async getGroupById(id: number): Promise<Grupo> {
    return this.httpClient.get<Grupo>(`/grupos/${id}`);
  }

  /**
   * Crea un nuevo grupo
   */
  async createGroup(groupData: GrupoFormData): Promise<Grupo> {
    return this.httpClient.post<Grupo>('/grupos', groupData);
  }

  /**
   * Actualiza un grupo existente
   */
  async updateGroup(id: number, groupData: UpdateGrupoRequest): Promise<{ mensaje: string }> {
    return this.httpClient.put<{ mensaje: string }>(`/grupos/${id}`, groupData);
  }

  /**
   * Elimina un grupo
   */
  async deleteGroup(id: number): Promise<{ mensaje: string }> {
    return this.httpClient.delete<{ mensaje: string }>(`/grupos/${id}`);
  }

  /**
   * Actualiza responsables de un grupo
   */
  async updateResponsables(id: number, responsables: number[]): Promise<{ mensaje: string }> {
    return this.httpClient.put<{ mensaje: string }>(`/grupos/${id}/responsables`, { responsables });
  }

  /**
   * Actualiza la lista de miembros de un grupo
   */
  async updateGroupMembers(id: number, usuarios_ids: number[]): Promise<{ mensaje: string }> {
    return this.httpClient.put<{ mensaje: string }>(`/grupos/${id}/miembros`, { usuarios_ids });
  }
}
