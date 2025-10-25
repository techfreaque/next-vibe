"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { StatsGridWidgetData, WidgetComponentProps } from "../types";
import { MetricCardWidget } from "./MetricCardWidget";

/**
 * Stats Grid Widget Component
 * Displays a grid of metric cards
 */
export function StatsGridWidget({
  data,
  metadata,
  context,
  className,
  style,
}: WidgetComponentProps<StatsGridWidgetData>): JSX.Element {
  const { metrics, columns = 3, layout = "grid" } = data;

  if (!metrics || metrics.length === 0) {
    return (
      <div
        className={cn("py-8 text-center text-muted-foreground", className)}
        style={style}
      >
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <p>No metrics available</p>
      </div>
    );
  }

  /* eslint-disable i18next/no-literal-string */
  const gridClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[columns] ?? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  /* eslint-enable i18next/no-literal-string */

  return (
    <div
      className={cn(
        "grid gap-4",
        layout === "grid" ? gridClass : "flex flex-wrap",
        className,
      )}
      style={style}
    >
      {metrics.map((metric, index) => (
        <MetricCardWidget
          key={metric.label ?? index}
          data={metric}
          metadata={metadata}
          context={context}
        />
      ))}
    </div>
  );
}

StatsGridWidget.displayName = "StatsGridWidget";
