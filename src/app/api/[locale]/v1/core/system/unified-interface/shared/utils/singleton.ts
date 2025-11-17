/**
 * Singleton Factory
 * Shared singleton pattern implementation
 * Eliminates duplication across registries, services, and repositories
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Singleton factory options
 */
export interface SingletonOptions<T> {
  /** Factory function to create instance */
  create: () => T;
  /** Optional key for multiple instances */
  key?: string;
  /** Optional cleanup function */
  onDestroy?: (instance: T) => void;
}

/**
 * Singleton Factory Class
 * Manages singleton instances with optional multi-instance support
 */
export class SingletonFactory<T> {
  private instances = new Map<string, T>();
  private defaultKey = "default";

  /**
   * Get or create singleton instance
   */
  getInstance(options: SingletonOptions<T>): T {
    const key = options.key || this.defaultKey;

    if (!this.instances.has(key)) {
      const instance = options.create();
      this.instances.set(key, instance);
    }

    return this.instances.get(key)!;
  }

  /**
   * Check if instance exists
   */
  hasInstance(key?: string): boolean {
    return this.instances.has(key || this.defaultKey);
  }

  /**
   * Clear specific instance
   */
  clearInstance(key?: string, onDestroy?: (instance: T) => void): void {
    const instanceKey = key || this.defaultKey;
    const instance = this.instances.get(instanceKey);

    if (instance && onDestroy) {
      onDestroy(instance);
    }

    this.instances.delete(instanceKey);
  }

  /**
   * Clear all instances
   */
  clearAll(onDestroy?: (instance: T) => void): void {
    if (onDestroy) {
      for (const instance of this.instances.values()) {
        onDestroy(instance);
      }
    }

    this.instances.clear();
  }

  /**
   * Get all instance keys
   */
  getKeys(): string[] {
    return [...this.instances.keys()];
  }

  /**
   * Get instance count
   */
  getCount(): number {
    return this.instances.size;
  }
}

/**
 * Create singleton getter function
 * Simplifies singleton pattern implementation
 */
export function createSingletonGetter<T>(factory: () => T): () => T {
  let instance: T | null = null;

  return () => {
    if (!instance) {
      instance = factory();
    }
    return instance;
  };
}

/**
 * Create keyed singleton getter function
 * For singletons that need multiple instances by key
 */
export function createKeyedSingletonGetter<T>(
  factory: (key: string, locale: CountryLanguage) => T,
): (key: string, locale: CountryLanguage) => T {
  const instances = new Map<string, T>();
  const defaultKey = "default";

  return (key: string, locale: CountryLanguage) => {
    const instanceKey = key || defaultKey;

    if (!instances.has(instanceKey)) {
      instances.set(instanceKey, factory(instanceKey, locale));
    }

    return instances.get(instanceKey)!;
  };
}

/**
 * Lazy singleton decorator
 * Ensures instance is created only when first accessed
 */
export class LazySingleton<T> {
  private instance: T | null = null;
  private factory: () => T;

  constructor(factory: () => T) {
    this.factory = factory;
  }

  /**
   * Get instance (creates if needed)
   */
  get(): T {
    if (!this.instance) {
      this.instance = this.factory();
    }
    return this.instance;
  }

  /**
   * Check if instance exists
   */
  isInitialized(): boolean {
    return this.instance !== null;
  }

  /**
   * Reset instance
   */
  reset(): void {
    this.instance = null;
  }
}

/**
 * Create lazy singleton
 */
export function createLazySingleton<T>(factory: () => T): LazySingleton<T> {
  return new LazySingleton(factory);
}
