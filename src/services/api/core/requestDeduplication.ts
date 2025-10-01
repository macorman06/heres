type PendingRequest = {
  promise: Promise<unknown>;
  timestamp: number;
};

export class RequestDeduplication {
  private static instance: RequestDeduplication;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private readonly CACHE_DURATION = 1000; // 1 segundo

  private constructor() {
    // Singleton pattern
  }


  static getInstance(): RequestDeduplication {
    if (!RequestDeduplication.instance) {
      RequestDeduplication.instance = new RequestDeduplication();
    }
    return RequestDeduplication.instance;
  }


  private generateKey(method: string, url: string, data?: unknown): string {
    const dataString = data ? JSON.stringify(data) : '';
    return `${method.toUpperCase()}:${url}:${dataString}`;
  }


  private cleanupStaleRequests(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.pendingRequests.forEach((request, key) => {
      if (now - request.timestamp > this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.pendingRequests.delete(key));
  }


  async executeUniqueRequest<T, U>(
    method: string,
    url: string,
    data: U,
    requestFunction: () => Promise<T>
  ): Promise<T> {
    const key = this.generateKey(method, url, data);

    // Limpiar requests antiguos
    this.cleanupStaleRequests();

    // Si ya existe un request idéntico en curso, retornar su promise
    const existing = this.pendingRequests.get(key);
    if (existing) {
      console.log('🔄 Deduplicating request:', { method, url });
      return existing.promise as Promise<T>;
    }

    // Crear nuevo request
    const promise = requestFunction()
      .then((result) => {
        // Eliminar del caché después de completarse
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((error) => {
        // Eliminar del caché en caso de error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Guardar en caché
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }


  clearAll(): void {
    this.pendingRequests.clear();
  }


  getPendingCount(): number {
    this.cleanupStaleRequests();
    return this.pendingRequests.size;
  }
}
