/**
 * Editable Text Widget Logic
 * Shared data extraction and processing for EDITABLE_TEXT widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Processed editable text data structure
 */
export interface ProcessedEditableText {
  value: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  readonly?: boolean;
}

/**
 * Extract and validate editable text data from WidgetData
 */
export function extractEditableTextData(value: WidgetData): ProcessedEditableText | null {
  // Handle string value directly
  if (typeof value === "string") {
    return {
      value,
      multiline: false,
      readonly: false,
    };
  }

  // Handle number value
  if (typeof value === "number") {
    return {
      value: String(value),
      multiline: false,
      readonly: false,
    };
  }

  // Handle object value with editable text properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const textValue =
      "value" in value && typeof value.value === "string"
        ? value.value
        : "value" in value && typeof value.value === "number"
          ? String(value.value)
          : "";
    const placeholder =
      "placeholder" in value && typeof value.placeholder === "string"
        ? value.placeholder
        : undefined;
    const multiline =
      "multiline" in value && typeof value.multiline === "boolean" ? value.multiline : false;
    const maxLength =
      "maxLength" in value && typeof value.maxLength === "number" ? value.maxLength : undefined;
    const readonly =
      "readonly" in value && typeof value.readonly === "boolean" ? value.readonly : false;

    return {
      value: textValue,
      placeholder,
      multiline,
      maxLength,
      readonly,
    };
  }

  return null;
}

/**
 * Validate text length
 */
export function isValidTextLength(text: string, maxLength?: number): boolean {
  if (!maxLength) {
    return true;
  }
  return text.length <= maxLength;
}
