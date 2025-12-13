/**
 * Stats Grid Widget Renderer
 * Handles STATS_GRID widget type for displaying statistics in a grid layout
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class StatsGridWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.STATS_GRID> {
  readonly widgetType = WidgetType.STATS_GRID;

  render(props: CLIWidgetProps<typeof WidgetType.STATS_GRID>): string {
    const { field, value, context } = props;
    const indent = this.createIndent(context.depth, context);

    // Handle object with multiple stats
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return this.renderStatsGrid(value, context, indent);
    }

    // Handle single stat value
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      const label = this.formatLabel(field, context);
      const formattedValue = this.formatStatValue(value, context);
      const icon = this.getStatIcon(value, context);

      return `${indent}${icon}${label}: ${formattedValue}`;
    }

    const stringValue =
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : String(value);
    return `${indent}${stringValue}`;
  }

  private renderStatsGrid(
    value: { [key: string]: WidgetData },
    context: WidgetRenderContext,
    indent: string,
  ): string {
    const lines: string[] = [];
    const entries = Object.entries(value);

    // Group stats into rows for better display
    const columns = 3; // Display 3 stats per row
    const rows: Array<Array<[string, WidgetData]>> = [];

    for (let i = 0; i < entries.length; i += columns) {
      rows.push(entries.slice(i, i + columns));
    }

    for (const row of rows) {
      const rowItems = row
        .filter(
          (entry) =>
            typeof entry[1] === "string" ||
            typeof entry[1] === "number" ||
            typeof entry[1] === "boolean",
        )
        .map(([key, val]) => {
          const formattedValue = this.formatStatValue(val, context);
          const icon = this.getStatIcon(val, context);
          const label = this.formatStatLabel(key);
          return `${icon}${label}: ${formattedValue}`;
        });

      // Pad items to ensure consistent spacing
      const paddedItems = rowItems.map((item) => item.padEnd(25));
      lines.push(`${indent}${paddedItems.join(" ")}`);
    }

    return lines.join("\n");
  }

  private formatStatValue(
    value: WidgetData,
    context: WidgetRenderContext,
  ): string {
    if (typeof value === "number") {
      // Format large numbers with commas
      if (value >= 1000) {
        return value.toLocaleString();
      }
      return value.toString();
    }

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      const itemsText = context.t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.items",
      );
      return `[${value.length} ${itemsText}]`;
    }

    if (typeof value === "object" && value !== null) {
      const keyCount = String(Object.keys(value).length);
      return `{${keyCount}}`;
    }

    return String(value);
  }

  private formatStatLabel(key: string): string {
    // Convert camelCase to readable format
    const spaced = key.replace(/([A-Z])/g, (match) => ` ${match}`);
    return spaced.replace(/^./, (str) => str.toUpperCase()).trim();
  }

  private getStatIcon(value: WidgetData, context: WidgetRenderContext): string {
    if (typeof value === "number") {
      if (value === 0) {
        // eslint-disable-next-line i18next/no-literal-string
        return context.options.useColors ? "⚪ " : "○ ";
      }
      if (value > 0) {
        // eslint-disable-next-line i18next/no-literal-string
        return context.options.useColors ? "🟢 " : "● ";
      }
      // eslint-disable-next-line i18next/no-literal-string
      return context.options.useColors ? "🔴 " : "● ";
    }

    if (Array.isArray(value)) {
      // eslint-disable-next-line i18next/no-literal-string
      return context.options.useColors ? "📋 " : "□ ";
    }

    if (typeof value === "object" && value !== null) {
      // eslint-disable-next-line i18next/no-literal-string
      return context.options.useColors ? "📊 " : "■ ";
    }

    // eslint-disable-next-line i18next/no-literal-string
    return context.options.useColors ? "ℹ️ " : "i ";
  }

}
