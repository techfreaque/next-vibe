/**
 * Badge Widget Logic
 * Shared data extraction and processing for BADGE widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Badge variants for styling
 */
export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "destructive";

/**
 * Processed badge data structure
 */
export interface ProcessedBadge {
  text: string;
  variant: BadgeVariant;
  icon?: string;
}

/**
 * Extract and validate badge data from WidgetData
 */
export function extractBadgeData(value: WidgetData): ProcessedBadge | null {
  // Handle string value directly
  if (typeof value === "string") {
    return {
      text: value,
      variant: "default",
    };
  }

  // Handle object value with badge properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const text =
      "text" in value && typeof value.text === "string" ? value.text : "";
    const variant =
      "variant" in value && typeof value.variant === "string"
        ? (value.variant as BadgeVariant)
        : "default";
    const icon =
      "icon" in value && typeof value.icon === "string"
        ? value.icon
        : undefined;

    if (!text) {
      return null;
    }

    return {
      text,
      variant,
      icon,
    };
  }

  // Invalid type
  return null;
}

/**
 * Get color for badge variant
 */
export function getBadgeColor(variant: BadgeVariant): string {
  switch (variant) {
    case "primary":
      return "blue";
    case "secondary":
      return "gray";
    case "success":
      return "green";
    case "warning":
      return "yellow";
    case "error":
    case "destructive":
      return "red";
    default:
      return "gray";
  }
}
