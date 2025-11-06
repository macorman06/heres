// src/services/api/services/materialsService.ts

import { HttpClient } from '../core/httpClient';
import { MaterialFormData, Material, MaterialFilters } from '../../../types/material.types';

// ============ INTERFACES DE RESPUESTA ============
export interface DownloadResponse {
  download_url: string;
  filename: string;
  size_mb: number;
  expires_in: number;
}

export interface SearchResponse {
  total: number;
  materiales: Material[];
}

export interface MaterialUploadResponse {
  id: number;
  titulo: string;
  mensaje: string;
}

export interface MaterialResponse {
  mensaje: string;
  material: Material;
}

export interface MaterialsByUserResponse {
  materiales: Material[];
  count: number;
}

export interface StorageUsageResponse {
  total_objects: number;
  total_size_gb: number;
  limit_gb: number;
  usage_percentage: number;
  remaining_gb: number;
}

// ============ SERVICIO ============
export class MaterialsService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene todos los materiales con filtros opcionales
   */
  async getMateriales(filters: MaterialFilters = {}): Promise<Material[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    const queryString = params.toString();
    const endpoint = queryString ? `/materiales/list?${queryString}` : '/materiales/list';
    return this.httpClient.get<Material[]>(endpoint);
  }

  /**
   * Obtiene un material por ID
   */
  async getMaterialById(id: number): Promise<Material> {
    return this.httpClient.get<Material>(`/materiales/${id}`);
  }

  /**
   * Obtiene materiales subidos por un usuario específico
   */
  async getMaterialesByUser(userId: number): Promise<MaterialsByUserResponse> {
    return this.httpClient.get<MaterialsByUserResponse>(`/materiales/usuario/${userId}`);
  }

  /**
   * Busca materiales por término de búsqueda
   */
  async searchMateriales(searchTerm: string, centro_juvenil?: string): Promise<SearchResponse> {
    const params = new URLSearchParams({ q: searchTerm });
    if (centro_juvenil) {
      params.append('centro_juvenil', centro_juvenil);
    }
    return this.httpClient.get<SearchResponse>(`/materiales/search?${params.toString()}`);
  }

  /**
   * Sube un material con archivo
   */
  async uploadMaterial(data: MaterialFormData, userId: number): Promise<MaterialUploadResponse> {
    const formData = new FormData();

    // Añadir archivo
    if (data.file) {
      formData.append('file', data.file);
    }

    formData.append('user_id', userId.toString());

    // Añadir campos de texto
    formData.append('titulo', data.titulo);
    if (data.descripcion) formData.append('descripcion', data.descripcion);
    if (data.tipo) formData.append('tipo', data.tipo);
    if (data.grupo) formData.append('grupo', data.grupo);
    if (data.seccion) formData.append('seccion', data.seccion);
    if (data.categoria) formData.append('categoria', data.categoria);

    // Etiquetas y grupos visibles (arrays)
    if (data.etiquetas && data.etiquetas.length > 0) {
      formData.append('etiquetas', data.etiquetas.join(','));
    }

    if (data.visible_para_grupos && data.visible_para_grupos.length > 0) {
      formData.append('visible_para_grupos', data.visible_para_grupos.join(','));
    }

    return this.httpClient.post<MaterialUploadResponse>('/materiales/upload', formData);
  }

  /**
   * Obtiene URL firmada para descargar archivo
   */
  async downloadMaterial(id: number): Promise<DownloadResponse> {
    return this.httpClient.get<DownloadResponse>(`/materiales/${id}/download`);
  }

  /**
   * Actualiza un material existente
   */
  async updateMaterial(id: number, data: Partial<MaterialFormData>): Promise<MaterialResponse> {
    return this.httpClient.put<MaterialResponse>(`/materiales/${id}`, data);
  }

  /**
   * Elimina un material
   */
  async deleteMaterial(id: number): Promise<{ mensaje: string }> {
    return this.httpClient.delete<{ mensaje: string }>(`/materiales/${id}`);
  }

  /**
   * Obtiene uso de storage
   */
  async getStorageUsage(): Promise<StorageUsageResponse> {
    return this.httpClient.get<StorageUsageResponse>('/materiales/storage/usage');
  }
}

// Re-exportar tipos de material desde su ubicación original
export type { Material, MaterialFormData, MaterialFilters };
