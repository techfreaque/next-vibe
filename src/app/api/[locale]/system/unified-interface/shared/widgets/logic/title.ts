/**
 * Title Widget Logic
 * Shared data extraction and processing for TITLE widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed title data structure
 */
export interface ProcessedTitle {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

/**
 * Extract and validate title data from WidgetData
 */
export function extractTitleData(value: WidgetData): ProcessedTitle | null {
  // Handle string value directly
  if (typeof value === "string") {
    return {
      text: value,
      level: 2,
      align: "left",
    };
  }

  // Handle object value with title properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const text =
      "text" in value && typeof value.text === "string" ? value.text : "";

    if (!text) {
      return null;
    }

    const level =
      "level" in value && typeof value.level === "number" ? value.level : 2;
    const subtitle =
      "subtitle" in value && typeof value.subtitle === "string"
        ? value.subtitle
        : undefined;
    const align =
      "align" in value && typeof value.align === "string"
        ? value.align
        : "left";

    return {
      text,
      level:
        level === 1 ||
        level === 2 ||
        level === 3 ||
        level === 4 ||
        level === 5 ||
        level === 6
          ? level
          : 2,
      subtitle,
      align:
        align === "center" || align === "right" || align === "left"
          ? align
          : "left",
    };
  }

  return null;
}
