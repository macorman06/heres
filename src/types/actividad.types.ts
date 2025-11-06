// src/types/actividad.types.ts (o src/services/api/index.ts)

export interface Tarea {
  id?: number;
  titulo?: string;
  nombre?: string;
  descripcion?: string;
  completada?: boolean;
  asignado_a?:
    | {
        id: number;
        nombre: string;
      }
    | string;
}

export interface Subactividad {
  id?: number;
  nombre?: string;
  titulo?: string;
  descripcion?: string;
  hora?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface Actividad {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo_actividad: string;
  seccion: string;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  es_recurrente: boolean;
  responsable?: {
    id: number;
    nombre: string;
  };
  animadores_ids?: number[];
  participantes_ids?: number[];
  tareas?: Tarea[]; // ✅ Añadido
  subactividades?: Subactividad[]; // ✅ Añadido
}
