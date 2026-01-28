/**
 * Badge Widget Shared Logic
 * Platform-agnostic data extraction and processing for badge widget
 */

import type z from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type {
  BadgeEnumOption,
  BadgeSemanticVariant,
  BadgeWidgetSchema,
} from "./types";

/**
 * Badge variants for component rendering
 * Must match the actual Badge component variants
 */
export type BadgeVariant =
  | "default"
  | "destructive"
  | "notification"
  | "outline"
  | "secondary";

/**
 * Processed badge data structure
 */
export interface ProcessedBadge {
  text: string;
  variant: BadgeVariant;
  icon?: IconKey;
}

/**
 * Maps semantic widget variants to Badge component variants
 */
export function mapSemanticVariantToBadgeVariant(
  variant: BadgeSemanticVariant,
): BadgeVariant {
  switch (variant) {
    case "error":
      return "destructive";
    case "info":
      return "notification";
    case "success":
      return "secondary"; // Use secondary for success (closest match)
    case "warning":
      return "outline";
    case "default":
    default:
      return "default";
  }
}

/**
 * Extract and validate badge data
 */
export function extractBadgeData(
  value: z.output<BadgeWidgetSchema>,
  context?: { t: (key: string) => string },
): ProcessedBadge | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    const text = context ? context.t(value) : value;
    return {
      text,
      variant: "outline",
    };
  }

  if (typeof value === "number") {
    return {
      text: String(value),
      variant: "outline",
    };
  }

  if (typeof value === "object") {
    const obj = value;
    const text = obj.text ? (context ? context.t(obj.text) : obj.text) : "";
    const variant = obj.variant
      ? mapSemanticVariantToBadgeVariant(obj.variant)
      : "outline";
    const icon = obj.icon;

    return {
      text,
      variant,
      icon,
    };
  }

  return null;
}

/**
 * Find matching enum option label for a value
 */
export function findEnumLabel(
  value: z.output<BadgeWidgetSchema>,
  enumOptions: BadgeEnumOption<string>[],
  context: { t: (key: string) => string },
): string | null {
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
export function getBadgeColor(
  variant: BadgeVariant,
): "blue" | "dim" | "green" | "yellow" | "red" {
  switch (variant) {
    case "notification":
      return "blue";
    case "secondary":
      return "green";
    case "outline":
      return "yellow";
    case "destructive":
      return "red";
    case "default":
    default:
      return "dim";
  }
}
