/**
 * Base Cache
 * Shared caching utilities for all platforms
 * Eliminates duplication across discovery, registry, and other caching implementations
 */

import "server-only";

/**
 * Cache entry with expiration
 */
export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

/**
 * Cache options
 */
export interface CacheOptions<T = never> {
  ttl?: number;
  maxSize?: number;
  onEvict?: (key: string, value: T) => void;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  evictions: number;
  oldestEntry?: number;
  newestEntry?: number;
}

/**
 * Base Cache Class
 * Provides common caching logic with TTL and size limits
 */
export class BaseCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };
  private options: Required<CacheOptions<T>>;

  constructor(options: CacheOptions<T> = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // Default 5 minutes
      maxSize: options.maxSize || 1000,
      onEvict: options.onEvict || (() => {}),
    };
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      this.options.onEvict(key, entry.data);
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    const effectiveTTL = ttl || this.options.ttl;
    const now = Date.now();

    // Check size limit and evict oldest if needed
    if (this.cache.size >= this.options.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data: value,
      expiresAt: now + effectiveTTL,
      createdAt: now,
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.evictions++;
      this.options.onEvict(key, entry.data);
      return false;
    }

    return true;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.options.onEvict(key, entry.data);
    }
    return this.cache.delete(key);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    for (const [key, entry] of this.cache.entries()) {
      this.options.onEvict(key, entry.data);
    }
    this.cache.clear();
    this.resetStats();
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map((e) => e.createdAt);

    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : undefined,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : undefined,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.evictions = 0;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        this.stats.evictions++;
        this.options.onEvict(key, entry.data);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get or set value (lazy loading pattern)
   */
  async getOrSet(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Evict oldest entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey);
      if (entry) {
        this.options.onEvict(oldestKey, entry.data);
      }
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }
}

/**
 * Create cache key from object
 */
export function createCacheKey(
  obj: Record<
    string,
    | string
    | number
    | boolean
    | null
    | undefined
    | readonly (string | number | boolean | null)[]
  >,
): string {
  const sorted = Object.keys(obj)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = obj[key];
        return acc;
      },
      {} as Record<
        string,
        | string
        | number
        | boolean
        | null
        | undefined
        | readonly (string | number | boolean | null)[]
      >,
    );

  return JSON.stringify(sorted);
}

/**
 * Create cache key from array
 */
export function createArrayCacheKey(
  arr: readonly (string | number | boolean | null)[],
): string {
  return JSON.stringify(arr);
}

/**
 * Create cache key from multiple values
 */
export function createMultiCacheKey(
  ...values: readonly (string | number | boolean | null)[]
): string {
  return JSON.stringify(values);
}
