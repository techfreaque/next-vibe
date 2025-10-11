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

/**
 * Type-safe Object.keys that preserves key types
 *
 * @param obj - The object to get keys from
 * @returns Array of keys with preserved types
 */
export function objectKeys<K extends string | number | symbol, V>(
  obj: Record<K, V> | Partial<Record<K, V>>,
): K[] {
  return Object.keys(obj) as K[];
}

/**
 * Type-safe Object.values that preserves value types
 *
 * @param obj - The object to get values from
 * @returns Array of values with preserved types
 */
export function objectValues<V>(obj: Record<string | number | symbol, V>): V[] {
  return Object.values(obj);
}

/**
 * Special handling for enum-based records where keys might be numeric
 * This is useful for JSWeekday and other numeric enums
 *
 * @param obj - The object with potentially numeric enum keys
 * @returns Array of [enum, value] tuples with proper enum type conversion
 */
export function objectEntriesNumericEnum<E extends number, V>(
  obj: Partial<Record<E, V>>,
): Array<[E, V]> {
  return Object.entries(obj)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [parseInt(key, 10) as E, value as V]);
}
