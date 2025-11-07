/**
 * Shared Translation Utilities
 * Core logic for navigating translation objects and processing values
 * Used by both global and scoped translation systems
 */

import { translationsKeyMode } from "@/config/debug";

import type { TParams } from "./static-types";

/**
 * Nested translation value type supporting deep nesting
 */
type NestedValue =
  | string
  | { [key: string]: string | { [key: string]: string } };

/**
 * Navigate through a translation object using an array of keys
 * This is the core navigation logic shared between global and scoped translations
 */
export function navigateTranslationObject(
  startValue: Record<string, NestedValue>,
  keys: string[],
): NestedValue | undefined {
  let value: NestedValue | undefined = startValue as NestedValue;

  for (const k of keys) {
    if (value === undefined || value === null) {
      break;
    }

    // Handle array access
    if (Array.isArray(value)) {
      const index = Number(k);
      if (!Number.isNaN(index) && index >= 0 && index < value.length) {
        value = value[index] as NestedValue;
      } else {
        value = undefined;
        break;
      }
    }
    // Handle object access
    else if (typeof value === "object" && k in value) {
      value = (value as Record<string, NestedValue>)[k];
    } else {
      value = undefined;
      break;
    }
  }

  return value;
}

/**
 * Process translation value and handle parameters
 * Shared logic for parameter replacement in translation strings
 */
export function processTranslationValue<K extends string>(
  value: NestedValue | undefined,
  key: K,
  params?: TParams,
  _context?: string,
): string {
  // If value is undefined, return the key as fallback
  if (value === undefined || value === null) {
    return `${key}${params ? ` (${JSON.stringify(params)})` : ""}`;
  }

  // If value is a string, process parameters
  if (typeof value === "string") {
    let translationValue: string = value;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translationValue = translationValue.replace(
          new RegExp(`{{${paramKey}}}`, "g"),
          String(paramValue),
        );
      });
    }

    // Handle translation key mode for debugging
    if (translationsKeyMode) {
      // Return URLs (remote and local) as-is
      if (
        translationValue.startsWith("http://") ||
        translationValue.startsWith("/") ||
        translationValue.startsWith("https://")
      ) {
        return translationValue;
      }

      return params ? `${key} (${Object.keys(params).join(", ")})` : `${key}`;
    }
    return translationValue;
  }

  // Handle non-string values - return the key as fallback
  return key;
}
