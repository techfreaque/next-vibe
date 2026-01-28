/**
 * Badge Widget - Platform-agnostic React implementation
 * Displays badges with variant-based styling
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import { findEnumLabel, mapSemanticVariantToBadgeVariant } from "./shared";
import type { BadgeWidgetConfig, BadgeWidgetSchema } from "./types";

/**
 * Badge Widget - Displays badges with variant-based styling
 *
 * Renders a badge with color-coded styling based on semantic meaning or custom variants.
 * Supports multiple data sources with consistent rendering across platforms.
 *
 * UI Config Options:
 * - text: Static translation key for fixed badge text
 * - enumOptions: Array of { value, label } for enum value mapping (labels are translation keys)
 * - variant: "default" | "success" | "warning" | "error" | "info" (semantic styling)
 *
 * Data Sources (priority order):
 * 1. Static text from field.text
 * 2. Enum label from field.enumOptions matched by value
 * 3. Badge data from value (string, number, or { text, variant, icon })
 *
 * Variant Mapping:
 * - error → destructive (red)
 * - info → secondary (blue/gray)
 * - success → success (green)
 * - warning → outline (bordered yellow)
 * - default → default (standard badge)
 *
 * Data Formats Supported:
 * - string: Direct text (translated if translation key exists)
 * - number: Numeric display (converted to string)
 * - { text: string, variant?: string, icon?: string }: Full badge object
 * - null/undefined: Shows "—" placeholder
 */
export function BadgeWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | ReactWidgetProps<
        TEndpoint,
        BadgeWidgetConfig<TKey, never, TUsage, "widget">
      >
    | ReactWidgetProps<
        TEndpoint,
        BadgeWidgetConfig<TKey, BadgeWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field, context } = props;
  const {
    text: staticText,
    enumOptions,
    variant: semanticVariant,
    className,
  } = field;

  // Handle static text from UI config
  if (staticText) {
    const translatedText = context.t(staticText);
    const badgeVariant = semanticVariant
      ? mapSemanticVariantToBadgeVariant(semanticVariant)
      : "default";

    return (
      <Badge variant={badgeVariant} className={className}>
        {translatedText}
      </Badge>
    );
  }

  // value is properly typed from schema - no assertions needed
  // Handle enum options - find matching label for value
  if (enumOptions) {
    const enumLabel = findEnumLabel(field.value, enumOptions, context);
    if (enumLabel) {
      const badgeVariant = semanticVariant
        ? mapSemanticVariantToBadgeVariant(semanticVariant)
        : "default";

      return (
        <Badge variant={badgeVariant} className={className}>
          {enumLabel}
        </Badge>
      );
    }
  }

  // Handle null/empty case
  if (!field.value) {
    return (
      <Badge
        variant="outline"
        className={cn("text-muted-foreground", className)}
      >
        —
      </Badge>
    );
  }

  // Apply semantic variant if configured, otherwise use data variant
  const badgeVariant = semanticVariant
    ? mapSemanticVariantToBadgeVariant(semanticVariant)
    : field.value.variant;

  return (
    <Badge variant={badgeVariant} className={className}>
      {field.value.text}
    </Badge>
  );
}

BadgeWidget.displayName = "BadgeWidget";

export default BadgeWidget;
