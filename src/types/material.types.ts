// src/types/material.types.ts

export interface Material {
  id: number;
  titulo: string;
  descripcion?: string;
  tipo: string;
  grupo?: string;
  seccion: string;
  centro_juvenil?: string;
  categoria?: string;

  // Nuevos campos R2
  r2_key?: string;
  r2_url?: string;
  file_size?: number;
  original_filename?: string;

  // Campos antiguos Drive (mantener para compatibilidad)
  url_drive?: string;
  url_descarga_directa?: string;

  // Metadata
  etiquetas?: string[];
  visible_para_grupos?: string[];

  // Auditoría
  fecha_subida: string;
  subido_por: number;
  usuario_nombre?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialFormData {
  titulo: string;
  descripcion?: string;
  tipo?: string;
  grupo?: string;
  seccion?: string;
  categoria?: string;
  etiquetas?: string[];
  visible_para_grupos?: string[];
  file?: File; // Nuevo: archivo a subir

  // Campos opcionales para compatibilidad
  url_drive?: string;
  url_descarga_directa?: string;
}

export interface MaterialFilters {
  centro_juvenil?: string;
  seccion?: string;
  grupo?: string;
  categoria?: string;
  limit?: number;
  offset?: number;
}

export interface DownloadResponse {
  download_url: string;
  filename: string;
  size_mb: number;
  expires_in: number;
}

export interface SearchResponse {
  materiales: Material[];
  total: number;
}
