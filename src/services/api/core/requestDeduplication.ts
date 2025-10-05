type PendingRequest = {
  promise: Promise<unknown>;
  timestamp: number;
};

export class RequestDeduplication {
  private static instance: RequestDeduplication;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private readonly CACHE_DURATION = 1000; // 1 segundo

  private constructor() {
    console.log('🔧 [RequestDeduplication] Instancia creada');
  }

  static getInstance(): RequestDeduplication {
    if (!RequestDeduplication.instance) {
      RequestDeduplication.instance = new RequestDeduplication();
    }
    return RequestDeduplication.instance;
  }

  private generateKey(method: string, url: string, data?: unknown): string {
    const dataString = data ? JSON.stringify(data) : '';
    const key = `${method.toUpperCase()}:${url}:${dataString}`;
    console.log('🔑 [DEDUP] Clave generada:', key);
    return key;
  }

  private cleanupStaleRequests(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.pendingRequests.forEach((request, key) => {
      if (now - request.timestamp > this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });

    if (keysToDelete.length > 0) {
      console.log('🧹 [DEDUP] Limpiando', keysToDelete.length, 'requests antiguos');
      keysToDelete.forEach((key) => this.pendingRequests.delete(key));
    }
  }

  async executeUniqueRequest<T, U = unknown>(
    method: string,
    url: string,
    data: U,
    requestFunction: () => Promise<T>
  ): Promise<T> {
    const key = this.generateKey(method, url, data);

    console.log('🔍 [DEDUP] Ejecutando request único para:', { method, url, key });

    // Limpiar requests antiguos
    this.cleanupStaleRequests();

    // Si ya existe un request idéntico en curso, retornar su promise
    const existing = this.pendingRequests.get(key);
    if (existing) {
      console.log('♻️ [DEDUP] Request duplicado detectado, reutilizando promise existente');
      return existing.promise as Promise<T>;
    }

    console.log('🆕 [DEDUP] Creando nuevo request');

    // Crear nuevo request
    const promise = requestFunction()
      .then((result) => {
        console.log('✅ [DEDUP] Request completado exitosamente:', key);
        // Eliminar del caché después de completarse
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((error) => {
        console.error('❌ [DEDUP] Request falló:', key, error);
        // Eliminar del caché en caso de error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Guardar en caché
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    console.log(
      '💾 [DEDUP] Request guardado en caché. Total pendientes:',
      this.pendingRequests.size
    );

    return promise;
  }

  clearAll(): void {
    console.log('🧹 [DEDUP] Limpiando todos los requests. Total:', this.pendingRequests.size);
    this.pendingRequests.clear();
  }

  getPendingCount(): number {
    this.cleanupStaleRequests();
    const count = this.pendingRequests.size;
    console.log('📊 [DEDUP] Requests pendientes:', count);
    return count;
  }
}
