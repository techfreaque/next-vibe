"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type {
  RenderableValue,
  StatsGridWidgetData,
  WidgetComponentProps,
} from "../types";
import { MetricCardWidget } from "./MetricCardWidget";

/**
 * Type guard for StatsGridWidgetData
 */
function isStatsGridWidgetData(
  data: RenderableValue,
): data is StatsGridWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "metrics" in data &&
    Array.isArray(data.metrics)
  );
}

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
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  if (!isStatsGridWidgetData(data)) {
    return (
      <Div
        className={cn("py-8 text-center text-muted-foreground", className)}
        style={style}
      >
        —
      </Div>
    );
  }

  const { metrics, columns = 3, layout = "grid" } = data;
  if (!metrics || metrics.length === 0) {
    return (
      <Div
        className={cn("py-8 text-center text-muted-foreground", className)}
        style={style}
      >
        —
      </Div>
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
    <Div
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
    </Div>
  );
}

StatsGridWidget.displayName = "StatsGridWidget";
