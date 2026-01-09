/**
 * Icon Widget Logic
 * Shared data extraction and processing for ICON widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";
import { isWidgetDataNullish } from "../utils/field-type-guards";

/**
 * Processed icon data structure
 */
export interface ProcessedIcon {
  icon: string;
}

/**
 * Extract and validate icon data from WidgetData
 * Handles string icon keys with proper translation support
 *
 * @param value - WidgetData to extract from
 * @param context - Optional translation context for string values
 * @returns Processed icon data or null if invalid
 */
export function extractIconData(value: WidgetData): ProcessedIcon | null {
  // Handle null/undefined
  if (isWidgetDataNullish(value)) {
    return null;
  }

  // Handle string value (icon key)
  if (typeof value === "string") {
    return {
      icon: value,
    };
  }

  return null;
}
