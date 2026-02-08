/**
 * Text Widget Shared Logic
 * Data extraction and processing for TEXT widget
 * Used by both React and CLI implementations
 */

import type z from "zod";

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { BaseWidgetContext } from "../../_shared/types";
import type { TextFormat, TextWidgetSchema } from "./types";

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
  value: z.output<TextWidgetSchema>,
  t: BaseWidgetContext<CreateApiEndpointAny>["t"],
): ProcessedText | null {
  // Handle string value with translation
  if (typeof value === "string") {
    return {
      text: t(value),
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
  if (typeof value === "number") {
    return {
      text: String(value),
      format: "plain",
    };
  }

  // Handle boolean value
  if (typeof value === "boolean") {
    return {
      text: value ? "true" : "false",
      format: "plain",
    };
  }
  // Handle null/undefined
  if (!value) {
    return null;
  }

  // Handle array by converting to JSON
  if (Array.isArray(value)) {
    return {
      text: JSON.stringify(value),
      format: "code",
    };
  }

  // Handle object value with text properties
  if (typeof value === "object") {
    const text = value.text;
    const truncate = value.truncate;
    const format = value.format;

    if (!text) {
      return null;
    }

    // Translate text if context provided
    const finalText = t(text);

    return {
      text: finalText,
      truncate,
      format:
        format === "code" ||
        format === "pre" ||
        format === "plain" ||
        format === "link"
          ? (format as TextFormat)
          : "plain",
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
function formatDateValue(
  value: z.output<TextWidgetSchema>,
  locale: string,
  includeTime = true,
): string | null {
  if (!value) {
    return null;
  }

  try {
    const dateValue =
      typeof value === "string" || value instanceof Date
        ? value
        : String(value);
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;

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
  value: z.output<TextWidgetSchema>,
  fieldType: FieldDataType | undefined,
  locale: string,
): string | null {
  if (!fieldType || !value) {
    return null;
  }

  // Check for DATE field type
  if (fieldType.includes("DATE")) {
    const includeTime = fieldType.includes("DATETIME");
    return formatDateValue(value, locale, includeTime);
  }

  return null;
}

/**
 * Truncate text to specified length
 */
function truncateText(text: string, maxLength?: number): string {
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
