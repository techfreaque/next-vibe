/**
 * Stat Widget Renderer
 *
 * Handles STAT widget type for CLI display.
 * Displays numeric statistics with labels, formatting, and trend indicators.
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction and formatting logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractStatData,
  formatStatValue,
  getStatVariantColor,
  getTrendIndicator,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/stat";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps } from "../core/types";

export class StatWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.STAT> {
  readonly widgetType = WidgetType.STAT;

  /**
   * Render stat with formatted value, label, and optional trend.
   *
   * Rendering Logic:
   * 1. Extract stat value (must be number)
   * 2. Format value according to format type (percentage, currency, etc.)
   * 3. Apply variant color styling
   * 4. Add trend indicator if configured
   * 5. Display label from UI config
   *
   * Visual Layout:
   * ```
   * Label
   * Value ↑ +12.5%
   * ```
   *
   * @param props Widget properties with stat data and config
   * @returns Formatted stat string
   */
  render(props: CLIWidgetProps<typeof WidgetType.STAT, string>): string {
    const { field, value, context } = props;
    const indent = this.createIndent(context.depth, context);
    const { label: labelKey, format, variant = "default", trend, trendValue } = field.ui;

    // Translate label from UI config
    const label = labelKey ? context.t(labelKey) : "—";

    // Extract data using shared logic
    const data = extractStatData(value);

    // Handle null case or non-numeric values
    if (!data) {
      return `${indent}${label}: —`;
    }

    // Format value using shared logic
    const formattedValue = formatStatValue(data.value, format, context.locale);

    // Apply variant color styling
    const color = getStatVariantColor(variant);
    const styledValue =
      color !== "default" ? this.styleText(formattedValue, color, context) : formattedValue;

    // Build result with label and value
    const parts: string[] = [this.styleText(label, "dim", context), styledValue];

    // Add trend indicator if configured
    if (trend && trendValue !== undefined) {
      const indicator = getTrendIndicator(trend, context.options.useEmojis);
      const trendColor = trend === "up" ? "green" : trend === "down" ? "red" : "dim";
      const trendText = `${indicator} ${trendValue > 0 ? "+" : ""}${trendValue}%`;
      const styledTrend = this.styleText(trendText, trendColor, context);
      parts.push(styledTrend);
    }

    return `${indent}${parts.join(" ")}`;
  }
}
