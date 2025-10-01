import { HttpClient } from '../core/httpClient';
import type { Grupo } from '../../../types';

export class GroupService {
  constructor(private httpClient: HttpClient) {}

  async getGroups(): Promise<Grupo[]> {
    return this.httpClient.get<Grupo[]>('/grupos');
  }

  async getGroupById(id: number): Promise<Grupo> {
    return this.httpClient.get<Grupo>(`/grupos/${id}`);
  }

  async createGroup(groupData: Partial<Grupo>): Promise<Grupo> {
    return this.httpClient.post<Grupo>('/grupos', groupData);
  }

  async updateGroup(id: number, groupData: Partial<Grupo>): Promise<Grupo> {
    return this.httpClient.put<Grupo>(`/grupos/${id}`, groupData);
  }

  async deleteGroup(id: number): Promise<void> {
    return this.httpClient.delete<void>(`/grupos/${id}`);
  }
}
