/**
 * Text Widget Logic
 * Shared data extraction and processing for TEXT widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed text data structure
 */
export interface ProcessedText {
  text: string;
  truncate?: number;
  format?: "plain" | "code" | "pre";
}

/**
 * Extract and validate text data from WidgetData
 */
export function extractTextData(value: WidgetData): ProcessedText | null {
  // Handle string value directly
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

  // Handle object value with text properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const text =
      "text" in value && typeof value.text === "string" ? value.text : "";
    const truncate =
      "truncate" in value && typeof value.truncate === "number"
        ? value.truncate
        : undefined;
    const format =
      "format" in value && typeof value.format === "string"
        ? value.format
        : "plain";

    if (!text) {
      return null;
    }

    return {
      text,
      truncate,
      format:
        format === "code" || format === "pre" || format === "plain"
          ? format
          : "plain",
    };
  }

  // Handle null/undefined
  if (value === null || value === undefined) {
    return null;
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
 * Format text value for display
 */
export function formatText(text: string, truncate?: number): string {
  return truncateText(text, truncate);
}
