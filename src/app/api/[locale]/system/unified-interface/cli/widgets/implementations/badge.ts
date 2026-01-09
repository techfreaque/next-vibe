/**
 * Badge Widget Renderer
 *
 * Handles BADGE widget type for CLI display.
 * Displays status badges with color-coded styling based on variant.
 *
 * Supports:
 * - Static text via field.ui.text
 * - Enum value mapping via field.ui.enumOptions
 * - Semantic variant styling via field.ui.variant
 * - Optional icons when emoji mode is enabled
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction and logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractBadgeData,
  findEnumLabel,
  getBadgeColor,
  mapSemanticVariantToBadgeVariant,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/badge";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class BadgeWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.BADGE> {
  readonly widgetType = WidgetType.BADGE;

  /**
   * Render badge with variant-based color styling.
   *
   * Rendering Logic:
   * 1. Check for static text in field.ui.text
   * 2. If enumOptions provided, find matching label for value
   * 3. Otherwise, extract badge data from value
   * 4. Apply semantic variant styling if configured
   * 5. Apply icon prefix if available and emojis enabled
   *
   * @param props Widget properties with badge data and config
   * @returns Formatted badge string with ANSI styling
   */
  render(props: CLIWidgetProps<typeof WidgetType.BADGE, string>): string {
    const { field, value, context } = props;
    const indent = this.createIndent(context.depth, context);
    const label = this.formatLabel(field, context);
    const { text: staticText, enumOptions, variant: semanticVariant } = field.ui;

    // Handle static text from UI config
    if (staticText) {
      const translatedText = context.t(staticText);
      const variant = semanticVariant
        ? mapSemanticVariantToBadgeVariant(semanticVariant)
        : "default";
      const color = getBadgeColor(variant);
      const styledBadge = this.styleText(translatedText, color, context);
      return label ? `${indent}${label}: ${styledBadge}` : `${indent}${styledBadge}`;
    }

    // Handle enum options - find matching label for value
    if (enumOptions) {
      const enumLabel = findEnumLabel(value, enumOptions, context);
      if (enumLabel) {
        const variant = semanticVariant
          ? mapSemanticVariantToBadgeVariant(semanticVariant)
          : "default";
        const color = getBadgeColor(variant);
        const styledBadge = this.styleText(enumLabel, color, context);
        return label ? `${indent}${label}: ${styledBadge}` : `${indent}${styledBadge}`;
      }
    }

    // Extract data using shared logic with translation context
    const data = extractBadgeData(value, context);

    // Handle null case
    if (!data) {
      return `${indent}${label}: —`;
    }

    // Apply semantic variant if configured
    const variant = semanticVariant
      ? mapSemanticVariantToBadgeVariant(semanticVariant)
      : data.variant;

    // Get color based on variant
    const color = getBadgeColor(variant);

    // Style the badge text
    let badgeText = data.text;
    if (data.icon && context.options.useEmojis) {
      badgeText = `${data.icon} ${badgeText}`;
    }

    const styledBadge = this.styleText(badgeText, color, context);

    if (label) {
      return `${indent}${label}: ${styledBadge}`;
    }

    return `${indent}${styledBadge}`;
  }
}
