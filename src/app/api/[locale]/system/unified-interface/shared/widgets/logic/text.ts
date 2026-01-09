/**
 * Text Widget Logic
 * Shared data extraction and processing for TEXT widget
 * Used by both React and CLI implementations
 */

import type { FieldDataType } from "../../types/enums";
import type { WidgetData } from "../types";
import {
  isWidgetDataBoolean,
  isWidgetDataNullish,
  isWidgetDataNumber,
  isWidgetDataObject,
  isWidgetDataString,
} from "../utils/field-type-guards";

/**
 * Text format types
 */
export type TextFormat = "plain" | "code" | "pre" | "link";

/**
 * Text emphasis types from UI config
 */
export type TextEmphasis = "bold" | "italic" | "underline";

/**
 * Text variant types from UI config (for styling)
 */
export type TextVariant = "default" | "error" | "info" | "success" | "warning" | "muted";

/**
 * Processed text data structure
 */
export interface ProcessedText {
  text: string;
  truncate?: number;
  format?: TextFormat;
}

/**
 * Extract and validate text data from WidgetData
 * Handles various data types with proper translation support
 *
 * @param value - WidgetData to extract from
 * @param context - Optional translation context for string values
 * @returns Processed text data or null if invalid
 */
export function extractTextData(
  value: WidgetData,
  context?: { t: (key: string) => string },
): ProcessedText | null {
  // Handle null/undefined
  if (isWidgetDataNullish(value)) {
    return null;
  }

  // Handle string value with translation
  const stringValue = context ? isWidgetDataString(value, context) : null;
  if (stringValue) {
    return {
      text: stringValue,
      format: "plain",
    };
  }

  // Handle plain string without translation context
  if (typeof value === "string") {
    return {
      text: value,
      format: "plain",
    };
  }

  // Handle number value
  if (isWidgetDataNumber(value)) {
    return {
      text: String(value),
      format: "plain",
    };
  }

  // Handle boolean value
  if (isWidgetDataBoolean(value)) {
    return {
      text: value ? "true" : "false",
      format: "plain",
    };
  }

  // Handle object value with text properties
  if (isWidgetDataObject(value)) {
    const text = "text" in value && typeof value.text === "string" ? value.text : "";
    const truncate =
      "truncate" in value && typeof value.truncate === "number" ? value.truncate : undefined;
    const format = "format" in value && typeof value.format === "string" ? value.format : "plain";

    if (!text) {
      return null;
    }

    // Translate text if context provided
    const finalText = context ? context.t(text) : text;

    return {
      text: finalText,
      truncate,
      format:
        format === "code" || format === "pre" || format === "plain" || format === "link"
          ? (format as TextFormat)
          : "plain",
    };
  }

  // Handle array by converting to JSON
  if (Array.isArray(value)) {
    return {
      text: JSON.stringify(value),
      format: "code",
    };
  }

  return null;
}

/**
 * Format date value for display
 * Handles both Date objects and date strings
 *
 * @param value - Date value to format
 * @param locale - Locale for date formatting
 * @param includeTime - Whether to include time in the formatted output
 * @returns Formatted date string or original value if formatting fails
 */
export function formatDateValue(
  value: WidgetData,
  locale: string,
  includeTime = true,
): string | null {
  if (isWidgetDataNullish(value)) {
    return null;
  }

  try {
    const dateValue = typeof value === "string" || value instanceof Date ? value : String(value);
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

    if (isNaN(date.getTime())) {
      return String(value);
    }

    const options: Intl.DateTimeFormatOptions = includeTime
      ? {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          year: "numeric",
          month: "short",
          day: "numeric",
        };

    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return String(value);
  }
}

/**
 * Check if value should be formatted as a date
 * Determines date formatting based on fieldType
 *
 * @param value - Value to check
 * @param fieldType - Field data type from UI config
 * @param locale - Locale for date formatting
 * @returns Formatted date string or null if not a date
 */
export function formatIfDate(
  value: WidgetData,
  fieldType: FieldDataType | undefined,
  locale: string,
): string | null {
  if (!fieldType || isWidgetDataNullish(value)) {
    return null;
  }

  // Check for DATE field type
  if (fieldType.toString().includes("DATE")) {
    const includeTime = fieldType.toString().includes("DATETIME");
    return formatDateValue(value, locale, includeTime);
  }

  return null;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength?: number): string {
  if (!maxLength || text.length <= maxLength) {
    return text;
  }
  // oxlint-disable-next-line prefer-template
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format text value for display with truncation
 */
export function formatText(text: string, truncate?: number): string {
  return truncateText(text, truncate);
}

/**
 * Get color for text variant (used in CLI rendering)
 */
export function getTextVariantColor(
  variant: TextVariant,
): "red" | "green" | "yellow" | "blue" | "gray" | "default" {
  switch (variant) {
    case "error":
      return "red";
    case "success":
      return "green";
    case "warning":
      return "yellow";
    case "info":
      return "blue";
    case "muted":
      return "gray";
    default:
      return "default";
  }
}
