import type { QueryKey } from "@tanstack/react-query";

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
