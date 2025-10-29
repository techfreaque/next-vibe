/**
 * Enum Helper Utilities
 *
 * These utilities help create type-safe enums with proper i18n integration
 * and Zod schema generation for the data-driven UI system.
 */

import { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

export interface EnumOptions<T extends Record<string, TranslationKey>> {
  enum: { readonly [K in keyof T]: T[K] };
  options: Array<{ value: keyof T; label: T[keyof T] }>;
}

/**
 * Wrapper function that creates enum-like object where keys map to themselves as string values
 * This ensures proper enum behavior like TypeScript enums (KEY -> "KEY")
 * This is required for PostgreSQL enum compatibility (63-byte limit on enum labels)
 */
function createEnumObjectWithKeyValues<T extends Record<string, string>>(
  enumMap: T,
): { readonly [K in keyof T]: K } {
  const result: { [K in keyof T]: K } = {} as { [K in keyof T]: K };
  for (const key in enumMap) {
    result[key] = key;
  }
  Object.freeze(result);
  return result;
}

export function createEnumOptions<
  const T extends Record<string, TranslationKey>,
>(
  enumMap: T,
): {
  enum: { readonly [K in keyof T]: K };
  options: Array<{ [K in keyof T]: { value: K; label: T[K] } }[keyof T]>;
  Value: keyof T;
} {
  // Create enum object where keys map to themselves as string values
  // This makes EmailCampaignStage.NOT_STARTED === "NOT_STARTED" (not the translation key)
  // This is required for PostgreSQL enum compatibility (63-byte limit)
  const enumObj = createEnumObjectWithKeyValues(enumMap);

  const optionsArray = Object.entries(enumMap).map(
    ([key, translationValue]) => ({
      value: key,
      label: translationValue,
    }),
  ) as Array<{ [K in keyof T]: { value: K; label: T[K] } }[keyof T]>;

  return {
    enum: enumObj,
    options: optionsArray,
    Value: "" satisfies keyof T as keyof T,
  };
}

/**
 * Create enum options from a simple array of values
 * Useful when you have simple string enums without i18n
 */
export function createSimpleEnumOptions<T extends string>(
  values: readonly T[],
  labelPrefix?: string,
): {
  enum: { readonly [K in T]: K };
  options: Array<{ value: T; label: string }>;
  schema: z.ZodString;
} {
  const enumObj: { [K in T]: K } = {} as { [K in T]: K };
  const optionsArray: Array<{ value: T; label: string }> = [];

  for (const value of values) {
    // Make enum behave like a real enum
    Object.defineProperty(enumObj, value, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    // Generate label with optional prefix
    const labelValue: string = labelPrefix ? `${labelPrefix}.${value}` : value;
    const label: string = labelValue;

    const optionItem = {
      value,
      label: label,
    };
    optionsArray.push(optionItem);
  }

  // Freeze the enum object
  Object.freeze(enumObj);

  const schema = z
    .string()
    .refine((value): value is T => values.includes(value as T), {
      message: "validation.enum.invalid",
    });

  return { enum: enumObj, options: optionsArray, schema };
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
