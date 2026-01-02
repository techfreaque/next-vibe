"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { WidgetType } from "../../../shared/types/enums";
import { extractStatsGridData } from "../../../shared/widgets/logic/stats-grid";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { MetricCardWidget } from "./MetricCardWidget";

/**
 * Displays a grid of metric cards for statistical overviews.
 */
export function StatsGridWidget<const TKey extends string>({
  value,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.STATS_GRID, TKey>): JSX.Element {
  // Extract data using shared logic
  const data = extractStatsGridData(value);

  // Handle null case
  if (!data) {
    return <Div className={cn("py-8 text-center text-muted-foreground", className)}>—</Div>;
  }

  const { stats, columns } = data;

  // Extract additional widget-specific properties
  const isObject = typeof value === "object" && value !== null && !Array.isArray(value);
  const layout =
    isObject && "layout" in value && typeof value.layout === "string" ? value.layout : "grid";

  /* eslint-disable i18next/no-literal-string */
  const gridClassMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };
  const gridClass = gridClassMap[columns] ?? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  /* eslint-enable i18next/no-literal-string */

  return (
    <Div className={cn("grid gap-4", layout === "grid" ? gridClass : "flex flex-wrap", className)}>
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

        return (
          <MetricCardWidget
            key={stat.label ?? index}
            widgetType={WidgetType.METRIC_CARD}
            value={widgetData}
            context={context}
          />
        );
      })}
    </Div>
  );
}

StatsGridWidget.displayName = "StatsGridWidget";
