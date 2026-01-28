/**
 * Editable Text Widget Logic
 * Shared data extraction and processing for EDITABLE_TEXT widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../../../../shared/widgets/widget-data";

/**
 * Processed editable text data structure
 */
interface ProcessedEditableText {
  value: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  readonly?: boolean;
}

/**
 * Extract and validate editable text data from WidgetData
 */
export function extractEditableTextData(
  value: WidgetData,
): ProcessedEditableText | null {
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
    const textValueProperty = value["value"];
    const textValue =
      typeof textValueProperty === "string"
        ? textValueProperty
        : typeof textValueProperty === "number"
          ? String(textValueProperty)
          : "";
    const placeholder =
      typeof value["placeholder"] === "string"
        ? value["placeholder"]
        : undefined;
    const multiline =
      typeof value["multiline"] === "boolean" ? value["multiline"] : false;
    const maxLength =
      typeof value["maxLength"] === "number" ? value["maxLength"] : undefined;
    const readonly =
      typeof value["readonly"] === "boolean" ? value["readonly"] : false;

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
