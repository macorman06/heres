// src/services/api/services/materialsService.ts
import { HttpClient } from '../core/httpClient';
import { MaterialFormData, Material, MaterialFilters } from '../../../types/material.types';

export interface DownloadResponse {
  download_url: string;
  filename: string;
  size_mb: number;
  expires_in: number;
}

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
  async getMaterialesByUser(userId: number): Promise<{ materiales: Material[]; count: number }> {
    return this.httpClient.get<{ materiales: Material[]; count: number }>(
      `/materiales/usuario/${userId}`
    );
  }

  /**
   * Busca materiales por término de búsqueda
   */
  async searchMateriales(searchTerm: string, centro_juvenil?: string): Promise<Material[]> {
    const params = new URLSearchParams({ q: searchTerm });
    if (centro_juvenil) {
      params.append('centro_juvenil', centro_juvenil);
    }
    return this.httpClient.get<Material[]>(`/materiales/search?${params.toString()}`);
  }

  /**
   * Sube un material con archivo a R2
   */
  async uploadMaterial(
    data: MaterialFormData,
    userId: number // <-- AÑADIR ESTE PARÁMETRO
  ): Promise<{ id: number; titulo: string; mensaje: string }> {
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

    return this.httpClient.post<{ id: number; titulo: string; mensaje: string }>(
      '/materiales/upload',
      formData
    );
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
  async updateMaterial(
    id: number,
    data: Partial<MaterialFormData>
  ): Promise<{ mensaje: string; material: Material }> {
    return this.httpClient.put<{ mensaje: string; material: Material }>(`/materiales/${id}`, data);
  }

  /**
   * Elimina un material
   */
  async deleteMaterial(id: number): Promise<{ mensaje: string }> {
    return this.httpClient.delete<{ mensaje: string }>(`/materiales/${id}`);
  }

  /**
   * Obtiene uso de storage R2
   */
  async getStorageUsage(): Promise<{
    total_objects: number;
    total_size_gb: number;
    limit_gb: number;
    usage_percentage: number;
    remaining_gb: number;
  }> {
    return this.httpClient.get('/materiales/storage/usage');
  }
}
