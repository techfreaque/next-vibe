/**
 * Enum Helper Utilities
 *
 * These utilities help create type-safe enums with proper i18n integration
 * and Zod schema generation for the data-driven UI system.
 */

import type { TranslationKey } from "@/i18n/core/static-types";

export interface EnumOptions<T extends Record<string, TranslationKey>> {
  enum: { readonly [K in keyof T]: T[K] };
  options: Array<{ value: keyof T; label: T[keyof T] }>;
}

/**
 * Wrapper function that creates enum-like object where keys map to their values
 * This ensures the enum object maps keys to the values passed in (KEY -> enumMap[KEY])
 * For PostgreSQL enums, we handle this differently in the DB layer
 */
function createEnumObjectWithKeyValues<T extends Record<string, string>>(
  enumMap: T,
): { readonly [K in keyof T]: T[K] } {
  const result: { [K in keyof T]: T[K] } = {} as { [K in keyof T]: T[K] };
  for (const key in enumMap) {
    result[key] = enumMap[key];
  }
  Object.freeze(result);
  return result;
}

export function createEnumOptions<
  const T extends Record<string, TranslationKey>,
>(
  enumMap: T,
): {
  enum: { readonly [K in keyof T]: T[K] };
  options: Array<{ [K in keyof T]: { value: T[K]; label: T[K] } }[keyof T]>;
  Value: T[keyof T];
} {
  const enumObj = createEnumObjectWithKeyValues(enumMap);

  const optionsArray = Object.entries(enumMap).map(
    ([_key, translationValue]) => ({
      value: translationValue,
      label: translationValue,
    }),
  ) as Array<{ [K in keyof T]: { value: T[K]; label: T[K] } }[keyof T]>;

  return {
    enum: enumObj,
    options: optionsArray,
    // intentianally unsafe cast to get a enum value type
    // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Type placeholder for enum value extraction requires 'unknown' cast for type system compatibility
    Value: undefined as unknown as T[keyof T],
  };
}

/**
 * Extract enum values as array
 */
export function getEnumValues<T extends Record<string, string | number>>(
  enumObject: T,
): Array<T[keyof T]> {
  return Object.values(enumObject) as Array<T[keyof T]>;
}

/**
 * Extract enum keys as array
 */
export function getEnumKeys<T extends Record<string, string | number>>(
  enumObject: T,
): Array<keyof T> {
  return Object.keys(enumObject) as Array<keyof T>;
}

/**
 * Check if a value is a valid enum value
 */
export function isValidEnumValue<T extends Record<string, string | number>>(
  enumObject: T,
  value: string | number | boolean,
): value is T[keyof T] {
  const enumValues = Object.values(enumObject);
  return enumValues.includes(value as T[keyof T]);
}

/**
 * Get enum value by key with type safety
 */
export function getEnumValue<T extends Record<string, string | number>>(
  enumObject: T,
  key: keyof T,
): T[keyof T] {
  return enumObject[key];
}

/**
 * Convert enum to select options for UI components
 */
export function enumToSelectOptions<T extends Record<string, string>>(
  enumObject: T,
  labelPrefix?: string,
): Array<{ value: T[keyof T]; label: string }> {
  return Object.entries(enumObject).map(([key, value]) => ({
    value: value as T[keyof T],
    label: labelPrefix ? `${labelPrefix}.${key}` : key,
  }));
}
