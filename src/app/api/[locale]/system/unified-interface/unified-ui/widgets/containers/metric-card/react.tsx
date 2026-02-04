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

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  extractMetricUnit,
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
  getTrendColorClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import { extractMetricCardData } from "./shared";
import type { MetricCardWidgetConfig } from "./types";

/**
 * Metric Card Widget - Displays a single metric in a card with trend indicators
 *
 * Renders a metric value with optional icon, custom color, unit, and trend direction.
 * Automatically translates label text and formats numbers according to locale.
 *
 * Features:
 * - Locale-aware number formatting with toLocaleString
 * - Optional emoji icon display
 * - Custom color support for metric value
 * - Trend indicators with color-coded arrows (up/down)
 * - Optional unit suffix (extracted from value or explicit)
 * - Responsive card layout with header and content sections
 *
 * Data Format:
 * - object: {
 *     value: number | string - The metric value to display
 *     label: string - Label text (translated via context.t)
 *     icon?: string - Optional emoji icon
 *     color?: string - Optional CSS color for the value
 *     unit?: string - Optional unit suffix (e.g., "%", "ms", "MB")
 *     trend?: {
 *       direction: "up" | "down" | "neutral"
 *       value: number - Percentage change (e.g., 12.5 for 12.5%)
 *     }
 *   }
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Metric data object with value, label, and optional trend
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 */
export function MetricCardWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  MetricCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const {
    headerGap,
    headerPadding,
    valueGap,
    unitSpacing,
    trendGap,
    titleSize,
    iconSize,
    valueSize,
    unitSize,
    trendSize,
    trendIconSize,
    className,
  } = field;

  // Get classes from config (no hardcoding!)
  const headerGapClass = getSpacingClassName("gap", headerGap);
  const headerPaddingClass = getSpacingClassName("padding", headerPadding);
  const valueGapClass = getSpacingClassName("gap", valueGap);
  const unitSpacingClass = getSpacingClassName("margin", unitSpacing);
  const trendGapClass = getSpacingClassName("gap", trendGap);
  const titleSizeClass = getTextSizeClassName(titleSize);
  const iconSizeClass = getTextSizeClassName(iconSize);
  const valueSizeClass = getTextSizeClassName(valueSize);
  const unitSizeClass = getTextSizeClassName(unitSize);
  const trendSizeClass = getTextSizeClassName(trendSize);
  const trendIconSizeClass = getIconSizeClassName(trendIconSize);

  const data = extractMetricCardData(field.value);

  if (!data) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>—</Div>
    );
  }

  const { value: metricValue, label, icon, color, trend } = data;
  const translatedLabel = t(label);
  const unit = extractMetricUnit(field.value);

  const displayValue = field.value.toLocaleString(locale) || metricValue;

  const trendDirection = trend?.direction;
  const trendValue = trend?.value;
  const trendColorClassName = getTrendColorClassName(trendDirection);

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
        ? TrendingDown
        : null;

  return (
    <Card className={className}>
      <CardHeader
        className={cn(
          "flex flex-col items-center justify-between",
          headerGapClass || "gap-0",
          headerPaddingClass || "pb-2",
        )}
      >
        <CardTitle
          className={cn(
            "font-medium text-muted-foreground",
            titleSizeClass || "text-sm",
          )}
        >
          {translatedLabel}
        </CardTitle>
        {icon && (
          <Span
            className={cn(iconSizeClass || "text-2xl")}
            role="img"
            aria-label={translatedLabel}
          >
            {icon}
          </Span>
        )}
      </CardHeader>
      <CardContent>
        <Div className={cn("flex items-baseline", valueGapClass || "gap-2")}>
          <Div style={color ? { color } : undefined}>
            <Div className={cn("font-bold", valueSizeClass || "text-2xl")}>
              {displayValue}
              {unit && (
                <Span
                  className={cn(
                    "font-normal",
                    unitSpacingClass || "ml-1",
                    unitSizeClass || "text-sm",
                  )}
                >
                  {unit}
                </Span>
              )}
            </Div>
          </Div>
          {trendValue !== undefined && TrendIcon && (
            <Div
              className={cn(
                "flex items-center",
                trendGapClass || "gap-1",
                trendSizeClass || "text-xs",
                trendColorClassName,
              )}
            >
              <TrendIcon className={cn(trendIconSizeClass)} />
              <Span>{Math.abs(trendValue)}%</Span>
            </Div>
          )}
        </Div>
      </CardContent>
    </Card>
  );
}

MetricCardWidget.displayName = "MetricCardWidget";

export default MetricCardWidget;
