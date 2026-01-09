/**
 * Stats Grid Widget Renderer
 * Handles STATS_GRID widget type for displaying statistics in a grid layout
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All type guards imported from shared.
 *
 * Note: CLI version supports ad-hoc key-value stats format for simpler use cases.
 * For structured stats with metadata, use the React version with extractStatsGridData.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  isWidgetDataObject,
  isWidgetDataPrimitive,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class StatsGridWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.STATS_GRID> {
  readonly widgetType = WidgetType.STATS_GRID;

  render(props: CLIWidgetProps<typeof WidgetType.STATS_GRID, string>): string {
    const { field, value, context } = props;
    const indent = this.createIndent(context.depth, context);

    // Handle object with multiple stats - use type guard
    if (isWidgetDataObject(value)) {
      return this.renderStatsGrid(value, context, indent);
    }

    // Handle single stat value - use type guard
    if (isWidgetDataPrimitive(value) && value !== null && value !== undefined) {
      const label = this.formatLabel(field, context);
      // Use centralized renderValue for consistent formatting
      const formattedValue = this.renderValue(value, context);
      // Use centralized getValueIcon for consistent icons
      const icon = this.getValueIcon(value, context);

      return `${indent}${icon}${label}: ${formattedValue}`;
    }

    const stringValue = isWidgetDataObject(value) ? JSON.stringify(value) : String(value);
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
          (entry) => isWidgetDataPrimitive(entry[1]) && entry[1] !== null && entry[1] !== undefined,
        )
        .map(([key, val]) => {
          // Use centralized renderValue for consistent formatting
          const formattedValue = this.renderValue(val, context);
          // Use centralized getValueIcon for consistent icons
          const icon = this.getValueIcon(val, context);
          const label = this.formatStatLabel(key);
          return `${icon}${label}: ${formattedValue}`;
        });

      // Pad items to ensure consistent spacing
      const paddedItems = rowItems.map((item) => item.padEnd(25));
      lines.push(`${indent}${paddedItems.join(" ")}`);
    }

    return lines.join("\n");
  }

  private formatStatLabel(key: string): string {
    // Convert camelCase to readable format
    const spaced = key.replaceAll(/([A-Z])/g, (match) => ` ${match}`);
    return spaced.replace(/^./, (str) => str.toUpperCase()).trim();
  }
}
