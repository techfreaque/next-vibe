"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type { JSX } from "react";

import type {
  MetricCardWidgetData,
  RenderableValue,
  WidgetComponentProps,
} from "../types";

/**
 * Type guard for MetricCardWidgetData
 */
function isMetricCardWidgetData(
  data: RenderableValue,
): data is MetricCardWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "value" in data &&
    "label" in data
  );
}

/**
 * Metric Card Widget Component
 * Displays a single metric with optional trend indicator
 */
export function MetricCardWidget({
  data,
  context,
  className,
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  if (!isMetricCardWidgetData(data)) {
    return (
      <div
        className={cn("text-muted-foreground italic", className)}
        style={style}
      >
        —
      </div>
    );
  }

  const { value, label, icon, color, trend, unit } = data;

  const displayValue =
    typeof value === "number"
      ? value.toLocaleString(context.locale)
      : String(value);

  /* eslint-disable i18next/no-literal-string */
  const trendColorClassName =
    trend?.direction === "up"
      ? "text-green-600 dark:text-green-400"
      : trend?.direction === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground";

  /* eslint-enable i18next/no-literal-string */
  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : null;

  return (
    <Card className={className} style={style}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon && (
          <span className="text-2xl" role="img" aria-label={label}>
            {icon}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div
            className="text-2xl font-bold"
            style={color ? { color } : undefined}
          >
            {displayValue}
            {unit && <span className="ml-1 text-sm font-normal">{unit}</span>}
          </div>
          {trend && TrendIcon && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                trendColorClassName,
              )}
            >
              <TrendIcon className="h-3 w-3" />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

MetricCardWidget.displayName = "MetricCardWidget";
