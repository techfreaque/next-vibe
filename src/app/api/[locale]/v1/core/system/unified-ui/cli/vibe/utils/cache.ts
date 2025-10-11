/* eslint-disable node/no-process-env */
/**
 * Production-ready caching system for Vibe CLI
 */

/**
 * Route discovery result type
 */
export interface RouteDiscoveryResult {
  alias: string;
  path: string[];
  method: string;
  routePath: string;
  description?: string;
}

/**
 * Route execution result type
 */
export interface RouteExecutionResult {
  success: boolean;
  data?: Record<string, string | number | boolean | string[]>;
  error?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Cache constants
 */
const CACHE_KEYS = {
  ROUTES_PREFIX: "routes:",
  EXECUTION_PREFIX: "execution:",
} as const;

const CACHE_TAGS = {
  ROUTES: "routes",
  DISCOVERY: "discovery",
  EXECUTION: "execution",
} as const;

const CACHE_TTL = {
  ROUTES: 600000, // 10 minutes
  EXECUTION: 300000, // 5 minutes
} as const;

/**
 * Cache entry with metadata
 */
export interface CacheEntry<
  T = Record<string, string | number | boolean | string[]>,
> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  tags?: string[];
}

/**
 * Cache statistics
 */
export interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
  oldestEntry?: number;
  newestEntry?: number;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
  cleanupInterval: number;
  enableStats: boolean;
}

/**
 * Production cache implementation with TTL, LRU eviction, and statistics
 */
export class Cache<T = Record<string, string | number | boolean | string[]>> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>();
  private config: CacheConfig;
  private stats = {
    hits: 0,
    misses: 0,
  };
  private cleanupTimer?: ReturnType<typeof setTimeout>;
  private accessCounter = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTtl: 300000, // 5 minutes
      cleanupInterval: 60000, // 1 minute
      enableStats: true,
      ...config,
    };

    // Start cleanup timer
    if (this.config.cleanupInterval > 0) {
      this.startCleanupTimer();
    }
  }

  /**
   * Get value from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      if (this.config.enableStats) {
        this.stats.misses++;
      }
      return undefined;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      if (this.config.enableStats) {
        this.stats.misses++;
      }
      return undefined;
    }

    // Update access tracking
    entry.hits++;
    this.accessOrder.set(key, ++this.accessCounter);

    if (this.config.enableStats) {
      this.stats.hits++;
    }

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const entryTtl = ttl ?? this.config.defaultTtl;

    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      ttl: entryTtl,
      hits: 0,
    };

    // Check if we need to evict entries
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.accessOrder.delete(key);
    return deleted;
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Get or set with factory function
   */
  async getOrSet<R = T>(
    key: string,
    factory: () => Promise<R>,
    ttl?: number,
  ): Promise<R> {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached as R;
    }

    const value = await factory();
    this.set(key, value as T, ttl);
    return value;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map((e) => e.timestamp);

    return {
      totalEntries: this.cache.size,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      memoryUsage: this.estimateMemoryUsage(),
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : undefined,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : undefined,
    };
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
   * Invalidate entries by tag
   */
  invalidateByTag(tag: string): number {
    let invalidated = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags?.includes(tag)) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Set tags for a cache entry
   */
  setTags(key: string, tags: string[]): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    entry.tags = tags;
    return true;
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | undefined;
    let lruAccess = Infinity;

    for (const [key, access] of this.accessOrder.entries()) {
      if (access < lruAccess) {
        lruAccess = access;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.accessOrder.delete(lruKey);
    }
  }

  /**
   * Start cleanup timer for expired entries
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, this.config.cleanupInterval);
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key);
      }
    }

    for (const key of toDelete) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
    }
  }

  /**
   * Estimate memory usage (rough calculation)
   */
  private estimateMemoryUsage(): number {
    let size = 0;

    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // UTF-16 characters
      size += JSON.stringify(entry.value).length * 2;
      size += 64; // Overhead for entry metadata
    }

    return size;
  }

  /**
   * Destroy cache and cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }

    this.clear();
  }
}

/**
 * Route cache for CLI route discovery
 */
export class RouteCache extends Cache<
  RouteDiscoveryResult[] | RouteExecutionResult
> {
  constructor() {
    // In CLI mode, disable cleanup interval to prevent hanging processes
    const isCliMode = process.env.VIBE_CLI_GLOBAL === "true";

    super({
      maxSize: 500,
      defaultTtl: 600000, // 10 minutes
      cleanupInterval: isCliMode ? 0 : 120000, // Disable timer in CLI mode
      enableStats: true,
    });
  }

  /**
   * Cache route discovery results
   */
  cacheRouteDiscovery(baseDir: string, routes: RouteDiscoveryResult[]): void {
    const key = `${CACHE_KEYS.ROUTES_PREFIX}${baseDir}`;
    const tags = [CACHE_TAGS.ROUTES, CACHE_TAGS.DISCOVERY];
    this.set(key, routes, CACHE_TTL.ROUTES);
    this.setTags(key, tags);
  }

  /**
   * Get cached route discovery results
   */
  getCachedRoutes(baseDir: string): RouteDiscoveryResult[] | undefined {
    const key = `${CACHE_KEYS.ROUTES_PREFIX}${baseDir}`;
    const result = this.get(key);
    return Array.isArray(result) ? result : undefined;
  }

  /**
   * Cache route execution result
   */
  cacheRouteExecution(
    routePath: string,
    method: string,
    result: RouteExecutionResult,
  ): void {
    const key = `${CACHE_KEYS.EXECUTION_PREFIX}${routePath}:${method}`;
    const tags = [CACHE_TAGS.EXECUTION, routePath];
    this.set(key, result, CACHE_TTL.EXECUTION);
    this.setTags(key, tags);
  }

  /**
   * Get cached route execution result
   */
  getCachedExecution(
    routePath: string,
    method: string,
  ): RouteExecutionResult | undefined {
    const key = `${CACHE_KEYS.EXECUTION_PREFIX}${routePath}:${method}`;
    const result = this.get(key);
    return !Array.isArray(result) ? result : undefined;
  }

  /**
   * Invalidate all route caches
   */
  invalidateRoutes(): number {
    return this.invalidateByTag("routes");
  }

  /**
   * Invalidate execution cache for a specific route
   */
  invalidateRoute(routePath: string): number {
    return this.invalidateByTag(routePath);
  }
}

/**
 * Default route cache instance
 */
export const routeCache = new RouteCache();
