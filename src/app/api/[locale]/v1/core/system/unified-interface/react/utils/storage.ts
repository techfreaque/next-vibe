/**
 * Storage utilities for form persistence
 * Provides type-safe platform-agnostic storage operations
 */

import { storage } from "next-vibe-ui/lib/storage";

export async function getStorageItem<T>(key: string): Promise<T | null> {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const item = await storage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

export async function setStorageItem<T>(
  key: string,
  value: T,
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await storage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if storage is not available
  }
}

export async function removeStorageItem(key: string): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await storage.removeItem(key);
  } catch {
    // Silently fail if storage is not available
  }
}
