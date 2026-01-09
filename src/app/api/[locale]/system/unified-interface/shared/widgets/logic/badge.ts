/**
 * Badge Widget Logic
 * Shared data extraction and processing for BADGE widget
 * Used by both React and CLI implementations
 */

import type { IconKey } from "../../../react/icons";
import type { WidgetData } from "../types";
import {
  isWidgetDataNullish,
  isWidgetDataObject,
  isWidgetDataString,
} from "../utils/field-type-guards";

/**
 * Semantic variants from UI config
 * Used in BadgeWidgetConfig
 */
export type SemanticVariant = "default" | "success" | "warning" | "error" | "info";

/**
 * Badge variants for component rendering
 * Maps to actual badge component variants
 */
export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "destructive"
  | "outline";

/**
 * Processed badge data structure
 */
export interface ProcessedBadge {
  text: string;
  variant: BadgeVariant;
  icon?: IconKey;
}

/**
 * Badge enum option structure from UI config
 */
export interface BadgeEnumOption {
  label: string;
  value: string | number;
}

/**
 * Maps semantic widget variants to Badge component variants
 * Used to convert UI config variant to component variant
 */
export function mapSemanticVariantToBadgeVariant(variant: SemanticVariant): BadgeVariant {
  switch (variant) {
    case "error":
      return "destructive";
    case "info":
      return "secondary";
    case "success":
      return "success";
    case "warning":
      return "outline";
    case "default":
    default:
      return "default";
  }
}

/**
 * Extract and validate badge data from WidgetData
 * Handles both simple string values and complex object structures
 *
 * @param value - WidgetData to extract from
 * @param context - Optional translation context for string values
 * @returns Processed badge data or null if invalid
 */
export function extractBadgeData(
  value: WidgetData,
  context?: { t: (key: string) => string },
): ProcessedBadge | null {
  // Handle null/undefined
  if (isWidgetDataNullish(value)) {
    return null;
  }

  // Handle string value directly
  const stringValue = context ? isWidgetDataString(value, context) : null;
  if (stringValue) {
    return {
      text: stringValue,
      variant: "outline",
    };
  }

  // Handle plain string without translation context
  if (typeof value === "string") {
    return {
      text: value,
      variant: "outline",
    };
  }

  // Handle number value
  if (typeof value === "number") {
    return {
      text: String(value),
      variant: "outline",
    };
  }

  // Handle object value with badge properties
  if (isWidgetDataObject(value)) {
    const text = "text" in value && typeof value.text === "string" ? value.text : "";
    const variant =
      "variant" in value && typeof value.variant === "string"
        ? (value.variant as BadgeVariant)
        : "default";
    const icon = "icon" in value && typeof value.icon === "string" ? value.icon : undefined;

    if (!text) {
      return null;
    }

    return {
      text,
      variant,
      icon: icon as IconKey | undefined,
    };
  }

  // Invalid type
  return null;
}

/**
 * Find matching enum option label for a value
 * Used when badge displays enum values with custom labels
 *
 * @param value - Value to match against enum options
 * @param enumOptions - Array of enum options with value/label pairs
 * @param context - Translation context
 * @returns Translated label if found, null otherwise
 */
export function findEnumLabel(
  value: WidgetData,
  enumOptions: BadgeEnumOption[] | undefined,
  context: { t: (key: string) => string },
): string | null {
  if (!enumOptions || isWidgetDataNullish(value)) {
    return null;
  }

  for (const option of enumOptions) {
    if (option.value === value) {
      return context.t(option.label);
    }
  }

  return null;
}

/**
 * Get color for badge variant (used in CLI rendering)
 */
export function getBadgeColor(variant: BadgeVariant): "blue" | "dim" | "green" | "yellow" | "red" {
  switch (variant) {
    case "primary":
      return "blue";
    case "secondary":
      return "dim";
    case "success":
      return "green";
    case "warning":
    case "outline":
      return "yellow";
    case "error":
    case "destructive":
      return "red";
    default:
      return "dim";
  }
}
