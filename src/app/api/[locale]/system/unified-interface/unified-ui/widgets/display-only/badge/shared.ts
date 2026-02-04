/**
 * Badge Widget Shared Logic
 * Platform-agnostic data extraction and processing for badge widget
 */

import type { BadgeVariant } from "next-vibe-ui/ui/badge";
import type z from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

import type { BadgeEnumOption, BadgeWidgetSchema } from "./types";

/**
 * Processed badge data structure
 */
export interface ProcessedBadge {
  text: string;
  variant: BadgeVariant;
  icon?: IconKey;
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
    const variant = obj.variant || "outline";
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
  t: <K extends string>(key: K, params?: TParams) => TranslatedKeyType,
): string | null {
  for (const option of enumOptions) {
    if (option.value === value) {
      return t(option.label);
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
