/**
 * Title Widget Logic
 * Shared data extraction and processing for TITLE widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";
import {
  isWidgetDataNullish,
  isWidgetDataObject,
  isWidgetDataString,
} from "../utils/field-type-guards";

/**
 * Processed title data structure
 * Note: level and align are configuration (from field.ui), not data
 */
export interface ProcessedTitle {
  text: string;
  subtitle?: string;
}

/**
 * Extract and validate title data from WidgetData
 * Handles various data types with proper translation support
 *
 * @param value - WidgetData to extract from
 * @param context - Optional translation context for string values
 * @returns Processed title data or null if invalid
 */
export function extractTitleData(
  value: WidgetData,
  context?: { t: (key: string) => string },
): ProcessedTitle | null {
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

  // Handle object value with title properties
  if (isWidgetDataObject(value)) {
    const text = "text" in value && typeof value.text === "string" ? value.text : "";

    if (!text) {
      return null;
    }

    // Translate text if context provided
    const finalText = context ? context.t(text) : text;

    const subtitle =
      "subtitle" in value && typeof value.subtitle === "string"
        ? context
          ? context.t(value.subtitle)
          : value.subtitle
        : undefined;

    return {
      text: finalText,
      subtitle,
    };
  }

  return null;
}
