/**
 * Title Widget Shared Logic
 * Platform-agnostic data extraction and processing for title widget
 */

import type { z } from "zod";

import type { TitleWidgetSchema } from "./types";

/**
 * Processed title data structure
 * Note: level and align are configuration (from field.ui), not data
 */
export interface ProcessedTitle {
  text: string;
  subtitle?: string;
}

/**
 * Extract and validate title data
 */
export function extractTitleData(
  value: z.output<TitleWidgetSchema>,
  context?: { t: (key: string) => string },
): ProcessedTitle | null {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return null;
  }

  // Handle string value with translation
  if (typeof value === "string") {
    const text = context ? context.t(value) : value;
    return { text };
  }

  // Handle object value with title properties
  if (typeof value === "object" && "text" in value && "subtitle" in value) {
    const textValue = value["text"];
    const subtitleValue = value["subtitle"];

    const text = typeof textValue === "string" ? textValue : "";

    if (!text) {
      return null;
    }

    // Translate text if context provided
    const finalText = context ? context.t(text) : text;

    const subtitle =
      typeof subtitleValue === "string"
        ? context
          ? context.t(subtitleValue)
          : subtitleValue
        : undefined;

    return {
      text: finalText,
      subtitle,
    };
  }

  return null;
}
