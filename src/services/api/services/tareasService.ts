// src/services/api/services/tareasService.ts

import { HttpClient } from '../core/httpClient';

export interface Tarea {
  id: number;
  nombre: string;
  descripcion?: string;
  actividad_id: number;
  usuarios_asignados_ids: number[];
  fecha_vencimiento: string;
  estado: 'Por hacer' | 'En proceso' | 'Terminada' | 'Bloqueada';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  usuario_creador_id: number;
  creador?: {
    id: number;
    nombre: string;
  };
  fecha_creacion: string;
  fecha_modificacion: string;
  etiquetas: string[];
  dependencias_ids: number[];
  comentarios: Comentario[];
  archivos_adjuntos: any[];
  historial_estados: CambioEstado[];
}

export interface Comentario {
  id: string;
  usuario_id: number;
  texto: string;
  fecha: string;
  editado: boolean;
}

export interface CambioEstado {
  estado_anterior: string;
  estado_nuevo: string;
  fecha_cambio: string;
  usuario_id: number;
}

export interface CreateTareaDTO {
  nombre: string;
  descripcion?: string;
  actividad_id: number;
  usuarios_asignados_ids: number[];
  fecha_vencimiento: string;
  estado?: 'Por hacer' | 'En proceso' | 'Terminada' | 'Bloqueada';
  prioridad?: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  etiquetas?: string[];
  dependencias_ids?: number[];
  archivos_adjuntos?: any[];
}

export interface TareaFilters {
  estado?: string;
  prioridad?: string;
  actividad_id?: number;
  usuario_asignado?: number;
  etiquetas?: string;
  vencidas?: boolean;
}

export interface TareaStats {
  total: number;
  por_hacer: number;
  en_proceso: number;
  terminadas: number;
  bloqueadas: number;
  vencidas: number;
  alta_prioridad: number;
}

export class TareasService {
  constructor(private httpClient: HttpClient) {}

  async listar(filters?: TareaFilters): Promise<Tarea[]> {
    const params = new URLSearchParams();

    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.prioridad) params.append('prioridad', filters.prioridad);
    if (filters?.actividad_id) params.append('actividad_id', filters.actividad_id.toString());
    if (filters?.usuario_asignado)
      params.append('usuario_asignado', filters.usuario_asignado.toString());
    if (filters?.etiquetas) params.append('etiquetas', filters.etiquetas);
    if (filters?.vencidas !== undefined) params.append('vencidas', filters.vencidas.toString());

    const queryString = params.toString();
    const url = queryString ? `/tareas/list?${queryString}` : '/tareas/list';

    return this.httpClient.get<Tarea[]>(url);
  }

  async obtenerPorId(id: number): Promise<Tarea> {
    return this.httpClient.get<Tarea>(`/tareas/${id}`);
  }

  async crear(data: CreateTareaDTO): Promise<Tarea> {
    return this.httpClient.post<Tarea>('/tareas/create', data);
  }

  async actualizar(id: number, data: Partial<CreateTareaDTO>): Promise<Tarea> {
    return this.httpClient.put<Tarea>(`/tareas/${id}`, data);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    return this.httpClient.delete<{ mensaje: string }>(`/tareas/${id}`);
  }

  async cambiarEstado(
    id: number,
    estado: 'Por hacer' | 'En proceso' | 'Terminada' | 'Bloqueada'
  ): Promise<Tarea> {
    return this.httpClient.patch<Tarea>(`/tareas/${id}/estado`, { estado });
  }

  async obtenerMisTareas(filters?: { estado?: string; prioridad?: string }): Promise<Tarea[]> {
    const params = new URLSearchParams();

    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.prioridad) params.append('prioridad', filters.prioridad);

    const queryString = params.toString();
    const url = queryString ? `/tareas/mis-tareas?${queryString}` : '/tareas/mis-tareas';

    return this.httpClient.get<Tarea[]>(url);
  }

  async obtenerPorActividad(actividadId: number): Promise<Tarea[]> {
    return this.httpClient.get<Tarea[]>(`/tareas/actividad/${actividadId}`);
  }

  async anadirComentario(id: number, texto: string): Promise<Tarea> {
    return this.httpClient.post<Tarea>(`/tareas/${id}/comentarios`, { texto });
  }

  async obtenerEstadisticas(): Promise<TareaStats> {
    return this.httpClient.get<TareaStats>('/tareas/dashboard');
  }
}
