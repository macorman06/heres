import { HttpClient } from '../core/httpClient';
import { Member, CreateMemberRequest } from '../../types/member.types';

export class MemberService {
  constructor(private httpClient: HttpClient) {}

  async getMembers(): Promise<Member[]> {
    return this.httpClient.get<Member[]>('/miembros/');
  }

  async createMember(memberData: CreateMemberRequest): Promise<Member> {
    return this.httpClient.post<Member>('/miembros/', memberData);
  }

  async updateMember(id: number, memberData: Partial<CreateMemberRequest>): Promise<Member> {
    return this.httpClient.put<Member>(`/miembros/${id}`, memberData);
  }

  async deleteMember(id: number): Promise<void> {
    return this.httpClient.delete<void>(`/miembros/${id}`);
  }

  async getMemberById(id: number): Promise<Member> {
    return this.httpClient.get<Member>(`/miembros/${id}`);
  }
}
