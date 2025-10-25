/**
 * Stats Grid Widget Renderer
 * Handles STATS_GRID widget type for displaying statistics in a grid layout
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type {
  MetricConfig,
  ResponseFieldMetadata,
  WidgetRenderContext,
} from "./types";

/**
 * Stats grid widget renderer for displaying statistics in a structured grid
 */
export class StatsGridWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.STATS_GRID;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const value = field.value;
    const indent = this.createIndent(context.depth, context);

    // Handle object with multiple stats
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return this.renderStatsGrid(value, context, indent);
    }

    // Handle single stat value
    const label = this.formatLabel(field, context);
    const formattedValue = this.formatStatValue(value, context);
    const icon = this.getStatIcon(value, context);

    return `${indent}${icon}${label}: ${formattedValue}`;
  }

  private renderStatsGrid(
    value: Record<string, any>,
    context: WidgetRenderContext,
    indent: string,
  ): string {
    const lines: string[] = [];
    const entries = Object.entries(value);

    // Group stats into rows for better display
    const columns = 3; // Display 3 stats per row
    const rows: Array<Array<[string, any]>> = [];

    for (let i = 0; i < entries.length; i += columns) {
      rows.push(entries.slice(i, i + columns));
    }

    for (const row of rows) {
      const rowItems = row.map(([key, val]) => {
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

  private formatStatValue(value: any, context: WidgetRenderContext): string {
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
      const itemsText = context.translate(
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.renderers.cliUi.widgets.common.items",
      );
      return `[${value.length} ${itemsText}]`;
    }

    if (typeof value === "object" && value !== null) {
      // eslint-disable-next-line i18next/no-literal-string
      return `{${Object.keys(value).length} keys}`;
    }

    return String(value);
  }

  private formatStatLabel(key: string): string {
    // Convert camelCase to readable format

    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  private getStatIcon(value: any, context: WidgetRenderContext): string {
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

  private getMetricConfig(field: ResponseFieldMetadata): MetricConfig {
    return {
      format: "number",
      showIcon: true,
      showLabel: true,
      precision: 0,
    };
  }
}
