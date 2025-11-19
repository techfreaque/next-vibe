/**
 * Type guard utilities
 * Common type checking functions to eliminate duplication
 */

/**
 * Check if value is a plain object (not array, not null)
 * Used in widget type guards and validation
 */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Check if object has a specific property
 */
export function hasProperty<K extends string>(
  obj: unknown,
  prop: K,
): obj is Record<K, unknown> {
  return isPlainObject(obj) && prop in obj;
}

/**
 * Check if object has a string property
 */
export function hasStringProperty<K extends string>(
  obj: unknown,
  prop: K,
): obj is Record<K, string> {
  return (
    isPlainObject(obj) &&
    prop in obj &&
    typeof obj[prop] === "string"
  );
}
