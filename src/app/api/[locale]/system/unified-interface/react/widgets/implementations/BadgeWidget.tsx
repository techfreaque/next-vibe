"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge, type BadgeVariant } from "next-vibe-ui/ui/badge";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import {
  extractBadgeData,
  findEnumLabel,
  mapSemanticVariantToBadgeVariant,
} from "../../../shared/widgets/logic/badge";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

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
 * 1. Static text from field.ui.text
 * 2. Enum label from field.ui.enumOptions matched by value
 * 3. Badge data from value (string or { text, variant, icon })
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
 * - { text: string, variant?: BadgeVariant, icon?: string }: Full badge object
 * - enum value (string/number): Matched against enumOptions
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Badge data to display
 * @param field - Field definition with UI config
 * @param context - Rendering context with translator
 * @param className - Optional CSS classes
 */
export function BadgeWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.BADGE, TKey>): JSX.Element {
  const { text: staticText, enumOptions, variant: semanticVariant } = field.ui;

  // Handle static text from UI config
  if (staticText) {
    const translatedText = context.t(staticText);
    const badgeVariant = semanticVariant
      ? (mapSemanticVariantToBadgeVariant(semanticVariant) as BadgeVariant)
      : "default";

    return (
      <Badge variant={badgeVariant} className={className}>
        {translatedText}
      </Badge>
    );
  }

  // Handle enum options - find matching label for value
  if (enumOptions) {
    const enumLabel = findEnumLabel(value, enumOptions, context);
    if (enumLabel) {
      const badgeVariant = semanticVariant
        ? (mapSemanticVariantToBadgeVariant(semanticVariant) as BadgeVariant)
        : "default";

      return (
        <Badge variant={badgeVariant} className={className}>
          {enumLabel}
        </Badge>
      );
    }
  }

  // Extract data using shared logic with translation context
  const data = extractBadgeData(value, context);

  // Handle null/empty case
  if (!data) {
    return (
      <Badge variant="outline" className={cn("text-muted-foreground", className)}>
        —
      </Badge>
    );
  }

  // Apply semantic variant if configured, otherwise use data variant
  const badgeVariant = semanticVariant
    ? (mapSemanticVariantToBadgeVariant(semanticVariant) as BadgeVariant)
    : (data.variant as BadgeVariant);

  return (
    <Badge variant={badgeVariant} className={className}>
      {data.text}
    </Badge>
  );
}

BadgeWidget.displayName = "BadgeWidget";
