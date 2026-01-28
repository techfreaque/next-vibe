/**
 * Description Widget Logic
 * Shared data extraction and processing for DESCRIPTION widget
 * Used by both React and CLI implementations
 */

import type z from "zod";

import {
  isWidgetDataNullish,
  isWidgetDataString,
} from "../../../_shared/type-guards";

import type { DescriptionWidgetSchema } from "./types";

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
  value: z.output<DescriptionWidgetSchema>,
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
