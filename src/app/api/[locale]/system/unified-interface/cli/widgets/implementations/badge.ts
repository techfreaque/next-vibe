/**
 * Badge Widget Renderer
 * Handles BADGE widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  extractBadgeData,
  getBadgeColor,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/badge";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class BadgeWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.BADGE;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { field, value } = input;
    const indent = this.createIndent(context.depth, context);
    const label = this.formatLabel(field, context);

    // Extract data using shared logic
    const data = extractBadgeData(value);

    // Handle null case
    if (!data) {
      return `${indent}${label}: —`;
    }

    // Get color based on variant
    const color = getBadgeColor(data.variant);

    // Style the badge text
    let badgeText = data.text;
    if (data.icon && context.options.useEmojis) {
      badgeText = `${data.icon} ${badgeText}`;
    }

    const styledBadge = this.styleText(
      badgeText,
      color as "red" | "green" | "yellow" | "blue",
      context,
    );

    if (label) {
      return `${indent}${label}: ${styledBadge}`;
    }

    return `${indent}${styledBadge}`;
  }
}
