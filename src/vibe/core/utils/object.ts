/**
 * Object utilities with type preservation
 */

/**
 * Type-safe Object.entries that preserves enum and key types
 *
 * @param obj - The object to get entries from
 * @returns Array of [key, value] tuples with preserved types
 *
 * @example
 * ```typescript
 * enum Color { RED = "red", BLUE = "blue" }
 * const colorCounts: Record<Color, number> = { [Color.RED]: 5, [Color.BLUE]: 3 };
 * const entries = objectEntries(colorCounts); // [Color, number][]
 * ```
 */
export function objectEntries<K extends string | number | symbol, V>(
  obj: Record<K, V>,
): Array<[K, V]>;

/**
 * Type-safe Object.entries for partial records (handles undefined values)
 *
 * @param obj - The partial object to get entries from
 * @returns Array of [key, value] tuples with preserved types, filtered for defined values
 */
export function objectEntries<K extends string | number | symbol, V>(
  obj: Partial<Record<K, V>>,
): Array<[K, V]>;

export function objectEntries<K extends string | number | symbol, V>(
  obj: Record<K, V> | Partial<Record<K, V>>,
): Array<[K, V]> {
  return Object.entries(obj).filter(
    ([, value]) => value !== undefined,
  ) as Array<[K, V]>;
}
