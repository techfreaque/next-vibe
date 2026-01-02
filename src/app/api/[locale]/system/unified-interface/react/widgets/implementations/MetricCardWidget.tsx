"use client";

import { cn } from "next-vibe/shared/utils";
import { Card } from "next-vibe-ui/ui/card";
import { CardContent } from "next-vibe-ui/ui/card";
import { CardHeader } from "next-vibe-ui/ui/card";
import { CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { TrendingDown, TrendingUp } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractMetricCardData } from "../../../shared/widgets/logic/metric-card";
import type { ValueOnlyReactWidgetProps } from "../../../shared/widgets/types";
import {
  extractMetricUnit,
  getTrendColorClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Displays a single metric with optional trend indicator.
 */
export function MetricCardWidget({
  value,
  context,
  className,
}: ValueOnlyReactWidgetProps<typeof WidgetType.METRIC_CARD>): JSX.Element {
  const data = extractMetricCardData(value);

  if (!data) {
    return <Div className={cn("text-muted-foreground italic", className)}>—</Div>;
  }

  const { value: metricValue, label, icon, color, trend } = data;
  const unit = extractMetricUnit(value);

  const displayValue =
    typeof metricValue === "number"
      ? metricValue.toLocaleString(context.locale)
      : String(metricValue);

  const trendDirection = trend?.direction;
  const trendValue = trend?.value;
  const trendColorClassName = getTrendColorClassName(trendDirection);

  const TrendIcon =
    trendDirection === "up" ? TrendingUp : trendDirection === "down" ? TrendingDown : null;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col items-center justify-between gap-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
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
          {trendValue !== undefined && TrendIcon && (
            <Div className={cn("flex items-center gap-1 text-xs", trendColorClassName)}>
              <TrendIcon className="h-3 w-3" />
              <Span>{Math.abs(trendValue)}%</Span>
            </Div>
          )}
        </Div>
      </CardContent>
    </Card>
  );
}

MetricCardWidget.displayName = "MetricCardWidget";
