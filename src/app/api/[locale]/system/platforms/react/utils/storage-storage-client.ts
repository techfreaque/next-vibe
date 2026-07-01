import type { QueryKey } from "@tanstack/react-query";
import { storage } from "next-vibe-ui/lib/storage";

import { platform } from "@/config/env-client";

/**
 * Initialize storage (no-op for compatibility)
 * Storage is now handled by next-vibe-ui package
 */
export async function initializeStorage(): Promise<void> {
  // No initialization needed - storage is platform-aware
}

/**
 * Generate a consistent storage key from a query key
 * @param key - The query key to generate a storage key from
 * @returns A consistent string key for storage
 */
export function generateStorageKey(key: QueryKey): string {
  try {
    // eslint-disable-next-line i18next/no-literal-string
    return `cache-${typeof key === "object" ? JSON.stringify(key) : key}`;
  } catch {
    // Silent error handling - logging should be handled by calling context
    // Fallback for non-serializable keys
    // eslint-disable-next-line i18next/no-literal-string
    return `cache-${String(key)}`;
  }
}

/**
 * Storage item with timestamp for cache control
 */
interface StoredItem<T> {
  data: T;
  _timestamp: number;
}

/**
 * Get item from storage (works in both browser and React Native)
 * @param key - The storage key
 * @returns The stored value or null if not found
 */
export async function getStorageItem<T>(key: string): Promise<T | null> {
  try {
    if (platform.isServer) {
      return null;
    }

    const value = await storage.getItem(key);

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value) as StoredItem<T> | T;

    // Add timestamp check for cache expiry if needed
    if (parsed && typeof parsed === "object" && "_timestamp" in parsed) {
      const storedItem = parsed;
      const now = Date.now();
      const cacheAge = now - storedItem._timestamp;

      // Default cache expiry of 1 hour
      const maxAge = 60 * 60 * 1000;

      if (cacheAge > maxAge) {
        await removeStorageItem(key);
        return null;
      }

      return storedItem.data;
    }

    return parsed;
  } catch {
    // Silent error handling - logging should be handled by calling context
    return null;
  }
}

/**
 * Set item in storage (works in both browser and React Native)
 * @param key - The storage key
 * @param value - The value to store
 * @returns Promise that resolves when storage is complete
 */
export async function setStorageItem<T>(key: string, value: T): Promise<void> {
  try {
    if (platform.isServer) {
      return;
    }

    // Wrap with timestamp for cache expiry
    const wrappedValue: StoredItem<T> = {
      data: value,
      _timestamp: Date.now(),
    };

    const serialized = JSON.stringify(wrappedValue);
    await storage.setItem(key, serialized);
  } catch {
    // Silent error handling - logging should be handled by calling context
  }
}

/**
 * Remove item from storage (works in both browser and React Native)
 * @param key - The storage key to remove
 * @returns Promise that resolves when removal is complete
 */
export async function removeStorageItem(key: string): Promise<void> {
  try {
    if (platform.isServer) {
      return;
    }

    await storage.removeItem(key);
  } catch {
    // Silent error handling - logging should be handled by calling context
  }
}

/**
 * Clear all items from storage (works in both browser and React Native)
 * @returns Promise that resolves when clearing is complete
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function clearStorageItems(): Promise<void> {
  try {
    if (platform.isServer) {
      return;
    }

    // Note: storage from next-vibe-ui doesn't have a clear() method
    // This is intentional as clearing all storage could affect other app data
    // If needed, implement selective clearing based on key patterns
  } catch {
    // Silent error handling - logging should be handled by calling context
  }
}
