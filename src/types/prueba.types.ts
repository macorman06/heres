// src/types/prueba.types.ts

export interface Prueba {
  id: number;
  nombre: string;
  descripcion: string;
  lugar: string;
  tipo: string;
  edad_recomendada_min?: number;
  edad_recomendada_max?: number;
  duracion_estimada?: number;
  nivel_dificultad: string;
  materiales_necesarios: string[];
  objetivos_pedagogicos: string[];
  desarrollo: string;
  criterios_evaluacion: string[];
  variantes?: string;
  observaciones?: string;
  usuario_creador?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}

export interface PruebaFormData {
  nombre: string;
  descripcion: string;
  lugar: string;
  tipo: string;
  edad_recomendada_min?: number;
  edad_recomendada_max?: number;
  duracion_estimada?: number;
  nivel_dificultad: string;
  materiales_necesarios: string[];
  objetivos_pedagogicos: string[];
  desarrollo: string;
  criterios_evaluacion: string[];
  variantes?: string;
  observaciones?: string;
}
