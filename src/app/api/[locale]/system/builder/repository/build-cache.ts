/**
 * Build Cache Service
 * Caches build results to avoid unnecessary recompilation
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { CACHE_FILE, CACHE_VERSION, ROOT_DIR } from "./constants";
import type {
  BuildCacheStorage,
  CacheEntry,
  CacheStats,
  FileToCompile,
} from "./types";

// ============================================================================
// Interface
// ============================================================================

export interface IBuildCache {
  /**
   * Load cache from disk
   */
  load(): void;

  /**
   * Save cache to disk
   */
  save(): void;

  /**
   * Clear the cache
   */
  clear(): void;

  /**
   * Generate a cache key for a file configuration
   */
  getCacheKey(fileConfig: FileToCompile): string;

  /**
   * Get the hash of a file's contents
   */
  getFileHash(filePath: string): string;

  /**
   * Check if a cached entry is still valid
   */
  checkCache(cacheKey: string, inputPath: string): CacheEntry | null;

  /**
   * Update the cache with a new entry
   */
  updateCache(cacheKey: string, hash: string, outputFiles: string[]): void;

  /**
   * Get current cache statistics
   */
  getStats(): CacheStats;

  /**
   * Reset cache statistics
   */
  resetStats(): void;

  /**
   * Record a cache hit
   */
  recordHit(): void;

  /**
   * Record a cache miss
   */
  recordMiss(): void;
}

// ============================================================================
// Implementation
// ============================================================================

export class BuildCache implements IBuildCache {
  private cache: BuildCacheStorage = { version: CACHE_VERSION, entries: {} };
  private stats: CacheStats = { hits: 0, misses: 0, timeSaved: 0 };

  load(): void {
    try {
      if (existsSync(CACHE_FILE)) {
        const content = readFileSync(CACHE_FILE, "utf-8");
        const parsed = JSON.parse(content) as BuildCacheStorage;
        if (parsed.version === CACHE_VERSION) {
          this.cache = parsed;
        } else {
          // Version mismatch, clear cache
          this.cache = { version: CACHE_VERSION, entries: {} };
        }
      }
    } catch {
      // Failed to load cache, start fresh
      this.cache = { version: CACHE_VERSION, entries: {} };
    }
  }

  save(): void {
    try {
      writeFileSync(CACHE_FILE, JSON.stringify(this.cache, null, 2), "utf-8");
    } catch {
      // Failed to save cache, ignore
    }
  }

  clear(): void {
    this.cache = { version: CACHE_VERSION, entries: {} };
    this.save();
  }

  getCacheKey(fileConfig: FileToCompile): string {
    const keyParts = [
      fileConfig.input,
      fileConfig.output,
      fileConfig.type,
      JSON.stringify(fileConfig.packageConfig || {}),
      JSON.stringify(fileConfig.viteOptions || {}),
      JSON.stringify(fileConfig.bunOptions || {}),
    ];
    return createHash("md5").update(keyParts.join("|")).digest("hex");
  }

  getFileHash(filePath: string): string {
    try {
      const content = readFileSync(filePath);
      return createHash("md5").update(content).digest("hex");
    } catch {
      return "";
    }
  }

  checkCache(cacheKey: string, inputPath: string): CacheEntry | null {
    const entry = this.cache.entries[cacheKey];
    if (!entry) {
      return null;
    }

    // Check if source file hash matches
    const currentHash = this.getFileHash(resolve(ROOT_DIR, inputPath));
    if (currentHash !== entry.hash) {
      return null;
    }

    // Check if all output files still exist
    for (const outputFile of entry.outputFiles) {
      if (!existsSync(resolve(ROOT_DIR, outputFile))) {
        return null;
      }
    }

    return entry;
  }

  updateCache(cacheKey: string, hash: string, outputFiles: string[]): void {
    this.cache.entries[cacheKey] = {
      hash,
      outputFiles,
      timestamp: Date.now(),
    };
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = { hits: 0, misses: 0, timeSaved: 0 };
  }

  recordHit(): void {
    this.stats.hits++;
  }

  recordMiss(): void {
    this.stats.misses++;
  }
}

// Singleton instance
export const buildCache = new BuildCache();
