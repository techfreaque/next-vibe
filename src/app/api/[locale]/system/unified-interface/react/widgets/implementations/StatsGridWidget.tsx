"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { WidgetType } from "../../../shared/types/enums";
import type { MetricCardWidgetConfig } from "../../../shared/widgets/configs";
import { extractStatsGridData } from "../../../shared/widgets/logic/stats-grid";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getSpacingClassName } from "../../../shared/widgets/utils/widget-helpers";
import { MetricCardWidget } from "./MetricCardWidget";

/**
 * Stats Grid Widget - Displays a responsive grid of metric cards for statistical overviews
 *
 * Supports flexible layouts with configurable columns and automatic metric card rendering.
 * Each metric card shows a value, label, optional description, trend indicator, icon, and color.
 *
 * Data Format:
 * ```json
 * {
 *   "stats": [
 *     {"value": 1234, "label": "Total Users", "trend": 12.5, "icon": "👥"},
 *     {"value": 567, "label": "Active Sessions", "trend": -3.2, "icon": "🔥"}
 *   ],
 *   "columns": 3,
 *   "layout": "grid",
 *   "title": "Dashboard Overview"
 * }
 * ```
 *
 * Configuration Options:
 * - columns: Number of columns (1-4, default: 3)
 * - layout: "grid" (responsive grid) or "flex" (flexible wrap)
 * - title: Optional title for the stats section
 */
export function StatsGridWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
  endpoint,
}: ReactWidgetProps<typeof WidgetType.STATS_GRID, TKey>): JSX.Element {
  const { gap, padding } = field.ui;

  // Get classes from config (no hardcoding!)
  const gapClass = getSpacingClassName("gap", gap);
  const paddingClass = getSpacingClassName("padding", padding);

  const data = extractStatsGridData(value);

  if (!data) {
    return (
      <Div
        className={cn(
          "text-center text-muted-foreground",
          paddingClass || "py-8",
          className,
        )}
      >
        —
      </Div>
    );
  }

  const { stats, columns, layout = "grid" } = data;

  /* eslint-disable i18next/no-literal-string */
  const gridClassMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };
  const gridClass =
    gridClassMap[columns] ?? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  /* eslint-enable i18next/no-literal-string */

  return (
    <Div
      className={cn(
        "grid",
        gapClass || "gap-4",
        layout === "grid" ? gridClass : "flex flex-wrap",
        className,
      )}
    >
      {stats.map((stat, index: number) => {
        // Convert ProcessedMetricCard back to WidgetData format
        const widgetData = {
          value: stat.value,
          label: stat.label,
          description: stat.description,
          trend: stat.trend,
          icon: stat.icon,
          color: stat.color,
        };

        // Create a mock field for MetricCardWidget with default config
        const metricField: MetricCardWidgetConfig<TKey> = {
          type: WidgetType.METRIC_CARD,
          title: stat.label as TKey,
          value: stat.value,
        };

        return (
          <MetricCardWidget
            key={stat.label ?? index}
            widgetType={WidgetType.METRIC_CARD}
            value={widgetData}
            field={{ ui: metricField } as never}
            context={context}
            endpoint={endpoint}
          />
        );
      })}
    </Div>
  );
}

StatsGridWidget.displayName = "StatsGridWidget";
