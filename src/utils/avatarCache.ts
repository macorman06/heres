// src/utils/avatarCache.ts

interface CacheEntry {
  url: string;
  timestamp: number;
  blob?: Blob; // ✅ Guardar el blob también
}

class AvatarCache {
  private cache: Map<number, CacheEntry> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  set(userId: number, url: string, blob?: Blob): void {
    // Revocar URL anterior si existe
    const existing = this.cache.get(userId);
    if (existing?.url.startsWith('blob:')) {
      URL.revokeObjectURL(existing.url);
    }

    this.cache.set(userId, {
      url,
      timestamp: Date.now(),
      blob,
    });

    console.log(`✅ [AvatarCache] Avatar de usuario ${userId} guardado en caché`);
  }

  get(userId: number): string | null {
    const entry = this.cache.get(userId);

    if (!entry) {
      return null;
    }

    // Verificar si ha caducado
    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      console.log(`⏰ [AvatarCache] Avatar de usuario ${userId} ha caducado`);
      this.delete(userId);
      return null;
    }

    // ✅ Si es blob URL, verificar que aún sea válido
    if (entry.url.startsWith('blob:') && entry.blob) {
      // Recrear el blob URL si es necesario
      try {
        const testImg = new Image();
        testImg.src = entry.url;
        // Si el blob URL está roto, recrearlo
        testImg.onerror = () => {
          console.log(`🔄 [AvatarCache] Recreando blob URL para usuario ${userId}`);
          const newUrl = URL.createObjectURL(entry.blob!);
          entry.url = newUrl;
          entry.timestamp = Date.now();
        };
      } catch (e) {
        console.error(`❌ [AvatarCache] Error verificando blob URL para usuario ${userId}`, e);
        return null;
      }
    }

    console.log(`✅ [AvatarCache] Avatar de usuario ${userId} encontrado en caché`);
    return entry.url;
  }

  delete(userId: number): void {
    const entry = this.cache.get(userId);
    if (entry?.url.startsWith('blob:')) {
      URL.revokeObjectURL(entry.url);
    }
    this.cache.delete(userId);
    console.log(`🗑️ [AvatarCache] Avatar de usuario ${userId} eliminado del caché`);
  }

  clear(): void {
    // Revocar todos los blob URLs
    this.cache.forEach((entry) => {
      if (entry.url.startsWith('blob:')) {
        URL.revokeObjectURL(entry.url);
      }
    });
    this.cache.clear();
    console.log('🧹 [AvatarCache] Caché de avatares limpiado');
  }

  has(userId: number): boolean {
    const entry = this.cache.get(userId);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      this.delete(userId);
      return false;
    }

    return true;
  }
}

export const avatarCache = new AvatarCache();
