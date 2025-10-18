/**
 * Debounced localStorage utility
 *
 * Provides debounced, error-resilient localStorage operations
 * to prevent blocking the main thread during rapid state updates.
 *
 * Features:
 * - Debouncing to reduce write frequency
 * - Error handling and retry logic
 * - Write queue for ordered operations
 * - Graceful degradation if localStorage unavailable
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { TIMING } from "../config/constants";

interface StorageQueueItem {
  key: string;
  value: string;
  timestamp: number;
  retries: number;
}

interface DebouncedStorageOptions {
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Logger instance for error reporting */
  logger?: EndpointLogger;
}

// Simple console logger for when no logger is provided
/* eslint-disable no-console, i18next/no-literal-string, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
const consoleLogger: EndpointLogger = {
  info: (message: string, ...args: any[]) =>
    console.log(`[Storage] ${message}`, ...args),
  error: (message: string, error?: any, ...args: any[]) =>
    console.error(`[Storage] ${message}`, error, ...args),
  warn: (message: string, ...args: any[]) =>
    console.warn(`[Storage] ${message}`, ...args),
  debug: (message: string, ...args: any[]) =>
    console.log(`[Storage] ${message}`, ...args),
  vibe: (message: string, ...args: any[]) =>
    console.log(`[Storage] ${message}`, ...args),
  isDebugEnabled: false,
};
/* eslint-enable no-console, i18next/no-literal-string, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

const DEFAULT_OPTIONS: Required<DebouncedStorageOptions> = {
  debounceMs: TIMING.STORAGE_DEBOUNCE,
  maxRetries: 3,
  logger: consoleLogger,
};

/**
 * Debounced localStorage manager
 */
export class DebouncedStorage {
  private debounceMs: number;
  private maxRetries: number;
  private logger: EndpointLogger;
  private timers: Map<string, ReturnType<typeof setTimeout>>;
  private queue: Map<string, StorageQueueItem>;
  private isAvailable: boolean;

  constructor(options: DebouncedStorageOptions = {}) {
    this.debounceMs = options.debounceMs ?? DEFAULT_OPTIONS.debounceMs;
    this.maxRetries = options.maxRetries ?? DEFAULT_OPTIONS.maxRetries;
    this.logger = options.logger ?? DEFAULT_OPTIONS.logger;
    this.timers = new Map();
    this.queue = new Map();
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Check if localStorage is available
   */
  private checkAvailability(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      // eslint-disable-next-line i18next/no-literal-string -- Technical test key, not user-facing
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      this.logger.warn("Storage", "localStorage is not available", e);
      return false;
    }
  }

  /**
   * Set an item with debouncing
   */
  setItem(key: string, value: string): void {
    if (!this.isAvailable) {
      this.logger.warn(
        "Storage",
        `localStorage unavailable, skipping save for key: ${key}`,
      );
      return;
    }

    // Clear existing timer for this key
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Add to queue
    this.queue.set(key, {
      key,
      value,
      timestamp: Date.now(),
      retries: 0,
    });

    // Set new debounced timer
    const timer = setTimeout(() => {
      this.flush(key);
    }, this.debounceMs);

    this.timers.set(key, timer);
  }

  /**
   * Set an item as JSON with debouncing
   */
  setItemJSON<T>(key: string, value: T): void {
    try {
      const jsonString = JSON.stringify(value);
      this.setItem(key, jsonString);
    } catch (error) {
      this.logger.error(
        "Storage",
        `Failed to stringify value for key ${key}`,
        error,
      );
    }
  }

  /**
   * Get an item immediately (no debouncing)
   */
  getItem(key: string): string | null {
    if (!this.isAvailable) {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      this.logger.error("Storage", `Failed to get item for key ${key}`, error);
      return null;
    }
  }

  /**
   * Get an item as JSON immediately
   */
  getItemJSON<T>(key: string): T | null {
    const value = this.getItem(key);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(
        "Storage",
        `Failed to parse JSON for key ${key}`,
        error,
      );
      return null;
    }
  }

  /**
   * Remove an item immediately
   */
  removeItem(key: string): void {
    if (!this.isAvailable) {
      return;
    }

    // Clear any pending writes
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
    this.queue.delete(key);

    try {
      localStorage.removeItem(key);
    } catch (error) {
      this.logger.error(
        "Storage",
        `Failed to remove item for key ${key}`,
        error,
      );
    }
  }

  /**
   * Flush a specific key immediately
   */
  private flush(key: string): void {
    const item = this.queue.get(key);
    if (!item) {
      return;
    }

    try {
      localStorage.setItem(item.key, item.value);

      // Success - remove from queue
      this.queue.delete(key);
      this.timers.delete(key);
    } catch (error) {
      this.logger.error(
        "Storage",
        `Failed to save to localStorage for key ${key}`,
        error,
      );

      // Retry logic
      if (item.retries < this.maxRetries) {
        item.retries++;

        // Exponential backoff: 1s, 2s, 4s
        const retryDelay = 1000 * Math.pow(2, item.retries - 1);

        this.logger.info(
          "Storage",
          `Retrying save for key ${key} (attempt ${item.retries}/${this.maxRetries}) in ${retryDelay}ms`,
        );

        const timer = setTimeout(() => {
          this.flush(key);
        }, retryDelay);

        this.timers.set(key, timer);
      } else {
        // Max retries exceeded
        this.logger.error(
          "Storage",
          `Max retries exceeded for key ${key}, giving up. Data may be lost.`,
        );
        this.queue.delete(key);
        this.timers.delete(key);
      }
    }
  }

  /**
   * Flush all pending writes immediately
   */
  flushAll(): void {
    // Clear all timers
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();

    // Flush all items
    const keys = Array.from(this.queue.keys());
    keys.forEach((key) => this.flush(key));
  }

  /**
   * Clear all pending writes without saving
   */
  clearQueue(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.queue.clear();
  }

  /**
   * Get the number of pending writes
   */
  getPendingCount(): number {
    return this.queue.size;
  }

  /**
   * Check if a key has pending writes
   */
  hasPending(key: string): boolean {
    return this.queue.has(key);
  }
}

/**
 * Singleton instance for app-wide use
 * Note: For proper logging, create a new instance with a logger
 */
export const debouncedStorage = new DebouncedStorage({
  debounceMs: 500,
  maxRetries: 3,
});

/**
 * Hook for using debounced storage in React components
 */
export function useDebouncedStorage(): DebouncedStorage {
  // For now, return the singleton
  // In the future, could create per-component instances if needed
  return debouncedStorage;
}

/**
 * Flush all pending writes before page unload
 */
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    debouncedStorage.flushAll();
  });

  // Also flush on visibility change (tab switch, minimize)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      debouncedStorage.flushAll();
    }
  });
}
