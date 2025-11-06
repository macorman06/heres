// src/services/api/services/actividadesService.ts

import { HttpClient } from '../core/httpClient';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Actividad {
  id: number;
  nombre: string;
  descripcion?: string;
  usuario_responsable_id: number;
  responsable?: {
    id: number;
    nombre: string;
  };
  animadores_ids: number[];
  participantes_ids: number[];
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  tipo_actividad:
    | 'Programación'
    | 'Oración'
    | 'Comisión'
    | 'Actividad normal'
    | 'Reunión'
    | 'Formación';
  seccion: 'CJ' | 'Chiqui' | 'Ambas';
  actividad_padre_id?: number;
  usuario_creador_id: number;
  creador?: {
    id: number;
    nombre: string;
  };
  fecha_creacion: string;
  fecha_modificacion: string;
  recordatorios: any[];
  archivos_adjuntos: any[];
  es_recurrente: boolean;
  patron_recurrencia?: any;
  visibilidad_roles: string[];
  subactividades?: Actividad[];
  tareas?: any[];
}

export interface CreateActividadDTO {
  nombre: string;
  descripcion: string;
  usuario_responsable_id: number;
  animadores_ids?: number[];
  participantes_ids?: number[];
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  tipo_actividad:
    | 'Programación'
    | 'Oración'
    | 'Comisión'
    | 'Actividad normal'
    | 'Reunión'
    | 'Formación';
  seccion: 'CJ' | 'Chiqui' | 'Ambas';
  actividad_padre_id?: number;
  recordatorios?: any[];
  archivos_adjuntos?: any[];
  es_recurrente?: boolean;
  patron_recurrencia?: any;
  visibilidad_roles?: string[];
}

export interface ActividadFilters {
  tipo?: string;
  seccion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  responsable_id?: number;
  solo_principales?: boolean;
  incluir_subactividades?: boolean;
  incluir_tareas?: boolean;
}

export class ActividadesService {
  constructor(private httpClient: HttpClient) {}

  async listar(filters?: ActividadFilters): Promise<Actividad[]> {
    const params = new URLSearchParams();

    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.seccion) params.append('seccion', filters.seccion);
    if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);
    if (filters?.responsable_id) params.append('responsable_id', filters.responsable_id.toString());
    if (filters?.solo_principales !== undefined)
      params.append('solo_principales', filters.solo_principales.toString());
    if (filters?.incluir_subactividades !== undefined)
      params.append('incluir_subactividades', filters.incluir_subactividades.toString());
    if (filters?.incluir_tareas !== undefined)
      params.append('incluir_tareas', filters.incluir_tareas.toString());

    const queryString = params.toString();
    const url = queryString ? `/actividades/list?${queryString}` : '/actividades/list';

    return this.httpClient.get<Actividad[]>(url);
  }

  async obtenerPorId(id: number): Promise<Actividad> {
    return this.httpClient.get<Actividad>(`/actividades/${id}`);
  }

  async crear(data: CreateActividadDTO): Promise<Actividad> {
    return this.httpClient.post<Actividad>('/actividades/create', data);
  }

  async actualizar(id: number, data: Partial<CreateActividadDTO>): Promise<Actividad> {
    return this.httpClient.put<Actividad>(`/actividades/${id}`, data);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    return this.httpClient.delete<{ mensaje: string }>(`/actividades/${id}`);
  }

  async obtenerSubactividades(id: number): Promise<Actividad[]> {
    return this.httpClient.get<Actividad[]>(`/actividades/${id}/subactividades`);
  }

  async obtenerCalendario(mes: number, año: number): Promise<Actividad[]> {
    return this.httpClient.get<Actividad[]>(`/actividades/calendario?mes=${mes}&año=${año}`);
  }

  async obtenerProximas(dias: number = 30): Promise<Actividad[]> {
    return this.httpClient.get<Actividad[]>(`/actividades/proximas?dias=${dias}`);
  }
}
