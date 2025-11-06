// src/services/api/services/pruebasService.ts

import { HttpClient } from '../core/httpClient';
import { Prueba, PruebaFormData } from '../../../types/prueba.types';

interface PruebasFilters {
  tipo?: string;
  nivel_dificultad?: string;
  edad_min?: number;
  edad_max?: number;
}

interface PruebasResponse {
  total: number;
  pruebas: Prueba[];
}

interface PruebaResponse {
  mensaje: string;
  prueba: Prueba;
}

interface BulkCreateResponse {
  mensaje: string;
  pruebas_creadas: Prueba[];
  errores: Array<{
    indice: number;
    nombre: string;
    error: string;
  }>;
  total_exitosas: number;
  total_errores: number;
}

interface TiposResponse {
  tipos: string[];
}

interface NivelesResponse {
  niveles: string[];
}

interface EstadisticasResponse {
  total_pruebas: number;
  por_tipo: Record<string, number>;
  por_nivel: Record<string, number>;
}

export class PruebasService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene todas las pruebas con filtros opcionales
   */
  async getPruebas(filters?: PruebasFilters): Promise<PruebasResponse> {
    const queryParams = new URLSearchParams();

    if (filters?.tipo) queryParams.append('tipo', filters.tipo);
    if (filters?.nivel_dificultad) queryParams.append('nivel_dificultad', filters.nivel_dificultad);
    if (filters?.edad_min) queryParams.append('edad_min', filters.edad_min.toString());
    if (filters?.edad_max) queryParams.append('edad_max', filters.edad_max.toString());

    const url = queryParams.toString() ? `/pruebas/?${queryParams.toString()}` : '/pruebas/';

    return this.httpClient.get<PruebasResponse>(url);
  }

  /**
   * Obtiene una prueba por ID
   */
  async getPruebaById(id: number): Promise<Prueba> {
    return this.httpClient.get<Prueba>(`/pruebas/${id}`);
  }

  /**
   * Crea una nueva prueba
   */
  async createPrueba(data: PruebaFormData): Promise<PruebaResponse> {
    return this.httpClient.post<PruebaResponse>('/pruebas/', data);
  }

  /**
   * Crea múltiples pruebas en masa
   */
  async createPruebasBulk(pruebas: PruebaFormData[]): Promise<BulkCreateResponse> {
    return this.httpClient.post<BulkCreateResponse>('/pruebas/bulk', { pruebas });
  }

  /**
   * Actualiza una prueba existente
   */
  async updatePrueba(id: number, data: Partial<PruebaFormData>): Promise<PruebaResponse> {
    return this.httpClient.put<PruebaResponse>(`/pruebas/${id}`, data);
  }

  /**
   * Elimina una prueba
   */
  async deletePrueba(id: number): Promise<{ mensaje: string }> {
    return this.httpClient.delete<{ mensaje: string }>(`/pruebas/${id}`);
  }

  /**
   * Obtiene la lista de tipos únicos de pruebas
   */
  async getTipos(): Promise<TiposResponse> {
    return this.httpClient.get<TiposResponse>('/pruebas/tipos');
  }

  /**
   * Obtiene la lista de niveles de dificultad únicos
   */
  async getNiveles(): Promise<NivelesResponse> {
    return this.httpClient.get<NivelesResponse>('/pruebas/niveles');
  }

  /**
   * Obtiene estadísticas generales de pruebas
   */
  async getEstadisticas(): Promise<EstadisticasResponse> {
    return this.httpClient.get<EstadisticasResponse>('/pruebas/estadisticas');
  }

  /**
   * Busca pruebas por texto en nombre o descripción
   */
  async searchPruebas(searchTerm: string): Promise<PruebasResponse> {
    return this.httpClient.get<PruebasResponse>(
      `/pruebas/?search=${encodeURIComponent(searchTerm)}`
    );
  }
}
