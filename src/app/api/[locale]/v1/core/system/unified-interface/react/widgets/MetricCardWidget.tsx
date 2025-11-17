"use client";

import { TrendingDown, TrendingUp } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Card } from "next-vibe-ui/ui/card";
import { CardContent } from "next-vibe-ui/ui/card";
import { CardHeader } from "next-vibe-ui/ui/card";
import { CardTitle } from "next-vibe-ui/ui/card";
import type { JSX } from "react";

import {
  type MetricCardWidgetData,
  type WidgetComponentProps,
  type RenderableValue,
} from "../../shared/ui/types";

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
  metadata: _metadata,
  context,
  className,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  if (!isMetricCardWidgetData(data)) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>—</Div>
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
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon && (
          <Span className="text-2xl" role="img" aria-label={label}>
            {icon}
          </Span>
        )}
      </CardHeader>
      <CardContent>
        <Div className="flex items-baseline gap-2">
          <Div style={color ? { color } : undefined}>
            <Div className="text-2xl font-bold">
              {displayValue}
              {unit && <Span className="ml-1 text-sm font-normal">{unit}</Span>}
            </Div>
          </Div>
          {trend && TrendIcon && (
            <Div
              className={cn(
                "flex items-center gap-1 text-xs",
                trendColorClassName,
              )}
            >
              <TrendIcon className="h-3 w-3" />
              <Span>{Math.abs(trend.value)}%</Span>
            </Div>
          )}
        </Div>
      </CardContent>
    </Card>
  );
}

MetricCardWidget.displayName = "MetricCardWidget";
