/**
 * Utility functions for safely setting nested object paths
 */

// Interface for objects that can contain nested structures
interface NestedObject<TValue> {
  [key: string]: NestedObject<TValue> | TValue;
}

/**
 * Safely sets a value at a nested object path, creating intermediate objects as needed
 * @param obj - The target object
 * @param path - Array of path segments
 * @param value - The value to set
 */
export function setNestedPath<TValue, TObject>(
  obj: TObject,
  path: readonly string[],
  value: TValue,
): void {
  let current = obj as NestedObject<TValue>;

  // Create intermediate path segments
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    if (!segment) {
      continue;
    }

    if (!current[segment] || typeof current[segment] !== "object") {
      current[segment] = {};
    }
    current = current[segment] as NestedObject<TValue>;
  }

  // Set the final value
  const lastSegment = path[path.length - 1];
  if (lastSegment) {
    current[lastSegment] = value;
  }
}
