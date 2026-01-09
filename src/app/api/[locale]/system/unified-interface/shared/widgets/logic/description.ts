/**
 * Description Widget Logic
 * Shared data extraction and processing for DESCRIPTION widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";
import { isWidgetDataNullish, isWidgetDataString } from "../utils/field-type-guards";

/**
 * Processed description data structure
 */
export interface ProcessedDescription {
  text: string;
}

/**
 * Extract and validate description data from WidgetData
 * Handles various data types with proper translation support
 *
 * @param value - WidgetData to extract from
 * @param context - Optional translation context for string values
 * @returns Processed description data or null if invalid
 */
export function extractDescriptionData(
  value: WidgetData,
  context?: { t: (key: string) => string },
): ProcessedDescription | null {
  // Handle null/undefined
  if (isWidgetDataNullish(value)) {
    return null;
  }

  // Handle string value with translation
  const stringValue = context ? isWidgetDataString(value, context) : null;
  if (stringValue) {
    return {
      text: stringValue,
    };
  }

  // Handle plain string without translation context
  if (typeof value === "string") {
    return {
      text: value,
    };
  }

  // Convert other types to string
  return {
    text: String(value),
  };
}
