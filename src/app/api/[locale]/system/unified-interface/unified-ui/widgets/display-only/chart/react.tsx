"use client";

import { cn } from "next-vibe/shared/utils";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Area, Axis, Bar, Chart, Line, Pie } from "next-vibe-ui/ui/chart";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import { type ChartDataPoint, extractChartData } from "./shared";
import type { ChartWidgetConfig, ChartWidgetSchema } from "./types";

// Color palette for charts
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
];

/**
 * Chart Widget - Renders various chart types from definition-driven data
 *
 * Supports multiple data formats:
 * - Array of data points: `[{x: "Jan", y: 100}, {x: "Feb", y: 200}]`
 * - Array of series: `[{name: "Series 1", data: [...]}, {name: "Series 2", data: [...]}]`
 * - Object with named series: `{series1: [{x, y}], series2: [{x, y}]}`
 *
 * UI Config options:
 * - chartType: "line" | "bar" | "area" | "pie" | "donut" | "scatter"
 * - label: Translation key for chart title
 * - description: Translation key for chart description
 * - xAxisLabel: X-axis label
 * - yAxisLabel: Y-axis label
 * - height: Chart height in pixels (default: 300)
 * - showLegend: Whether to show legend (default: true)
 * - showGrid: Whether to show grid lines (default: true)
 * - animate: Whether to animate (default: true)
 */
export function ChartWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends ChartWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  ChartWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const { t: globalT } = simpleT(context.locale);
  const {
    chartType = "line",
    label: labelKey,
    title: titleKey,
    description: descriptionKey,
    xAxisLabel,
    yAxisLabel,
    height = 300,
    showLegend = true,
    animate = true,
    titleTextSize,
    descriptionTextSize,
    emptyTextSize,
    legendGap,
    legendItemGap,
    legendTextSize,
    legendMarginTop,
    className,
  } = field;

  // Get classes from config (no hardcoding!)
  const titleTextSizeClass = getTextSizeClassName(titleTextSize);
  const descriptionTextSizeClass = getTextSizeClassName(descriptionTextSize);
  const emptyTextSizeClass = getTextSizeClassName(emptyTextSize);
  const legendGapClass = getSpacingClassName("gap", legendGap);
  const legendItemGapClass = getSpacingClassName("gap", legendItemGap);
  const legendTextSizeClass = getTextSizeClassName(legendTextSize);
  const legendMarginTopClass = getSpacingClassName("margin", legendMarginTop);

  // Support both 'label' and 'title' for backwards compatibility (label takes precedence)
  const chartTitleKey = labelKey || titleKey;
  const title = chartTitleKey ? context.t(chartTitleKey) : undefined;
  const description = descriptionKey ? context.t(descriptionKey) : undefined;

  // Extract chart data using shared logic
  const chartData = extractChartData<TKey>(field.value);

  // No data - show empty state
  if (!chartData || chartData.data.length === 0) {
    return (
      <Card className={cn("h-full", className)}>
        {title && (
          <CardHeader className="pb-2">
            <CardTitle
              className={cn("font-medium", titleTextSizeClass || "text-sm")}
            >
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center">
          <Div
            style={{
              height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Span className={cn("text-muted-foreground", emptyTextSizeClass)}>
              {globalT(
                "app.api.system.unifiedInterface.widgets.chart.noDataAvailable",
              )}
            </Span>
          </Div>
        </CardContent>
      </Card>
    );
  }

  // Render chart based on type
  const renderChart = (): JSX.Element => {
    const isPie = chartType === "pie" || chartType === "donut";

    if (isPie) {
      // Pie/Donut chart
      const firstSeries = chartData.data[0];

      // Extract colors from data points if available
      const dataColors: string[] = [];

      // Calculate total for percentage calculation
      const totalValue = firstSeries.data
        .filter((item: ChartDataPoint<TKey>) => item.y > 0)
        .reduce((sum: number, item: ChartDataPoint<TKey>) => sum + item.y, 0);

      const pieData =
        firstSeries?.data
          .filter((d: ChartDataPoint<TKey>) => d.y > 0) // Filter out zero values for pie chart
          .map((d: ChartDataPoint<TKey>) => {
            // Translate labels - context.t() returns original string if key not found
            const rawLabel = String(d.label ?? d.x ?? "Unknown");
            const translatedLabel = context.t(rawLabel as TranslationKey);

            // Store color if available
            if (typeof d.color === "string") {
              dataColors.push(d.color);
            }

            return {
              x: String(translatedLabel),
              y: d.y,
            };
          }) ?? [];

      // If all values are zero, show empty state
      if (pieData.length === 0) {
        return (
          <Div
            style={{
              height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Span className={cn("text-muted-foreground", emptyTextSizeClass)}>
              {globalT(
                "app.api.system.unifiedInterface.widgets.chart.noDataToDisplay",
              )}
            </Span>
          </Div>
        );
      }

      return (
        <Div style={{ width: "100%", height }}>
          <Pie
            data={pieData}
            colorScale={dataColors.length > 0 ? dataColors : CHART_COLORS}
            innerRadius={chartType === "donut" ? 50 : 0}
            padAngle={1}
            animate={animate}
            labels={(datum: Record<string, string | number>): string => {
              if (!datum || !datum.x || datum.y === undefined) {
                return "";
              }

              // Calculate percentage from y value and total
              const yValue = Number(datum.y);
              const percentage =
                totalValue > 0 ? (yValue / totalValue) * 100 : 0;

              // Format: "Label\nValue\n(Percentage%)"
              const percentageStr = `\n(${percentage.toFixed(1)}%)`;

              return `${String(datum.x)}\n${String(datum.y)}${percentageStr}`;
            }}
            style={{
              data: {
                fillOpacity: 0.9,
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              },
              labels: {
                fontSize: 14,
                fill: "hsl(var(--foreground))",
                fontWeight: 600,
                padding: 10,
              },
            }}
          />
        </Div>
      );
    }

    // Line/Bar/Area charts
    // Check if we're dealing with time-series data (ISO dates)
    const firstXValue = chartData.data[0]?.data[0]?.x ?? "";
    const isTimeSeries = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(
      String(firstXValue),
    );

    // For time series, use date indices; for categorical, format labels
    let xTickLabels: string[] = [];
    if (isTimeSeries) {
      // Use numeric indices for time series to avoid scaling issues
      const allDates = chartData.data[0]?.data.map((d) => String(d.x)) ?? [];
      xTickLabels = allDates.map((dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(context.locale, {
          month: "short",
          day: "numeric",
        });
      });
    } else {
      // Categorical data - translate labels
      const allXValues = chartData.data.flatMap((series) =>
        series.data.map((d) =>
          String(context.t(String(d.label ?? d.x ?? "") as TranslationKey)),
        ),
      );
      xTickLabels = [...new Set(allXValues)];
    }

    const uniqueXValues = xTickLabels;

    // Calculate y-domain from actual data
    const allYValues = chartData.data.flatMap((series) =>
      series.data.map((d) => d.y),
    );
    const minY = Math.min(...allYValues, 0); // Include 0 in domain
    const maxY = Math.max(...allYValues, 0);

    // Add 10% padding to y-domain
    const yPadding = (maxY - minY) * 0.1;
    const yDomain: [number, number] = [minY - yPadding, maxY + yPadding];

    // X domain for time series (numeric indices)
    const xDomain: [number, number] | undefined = isTimeSeries
      ? [0, (xTickLabels.length || 1) - 1]
      : undefined;

    return (
      <Chart
        height={height}
        padding={{ top: 20, bottom: 40, left: 60, right: 20 }}
        domainPadding={{ x: 20 }}
        {...(xDomain ? { domain: { x: xDomain, y: yDomain } } : {})}
      >
        <Axis
          dependentAxis
          label={yAxisLabel}
          style={{
            axisLabel: { padding: 40, fontSize: 12, fill: "currentColor" },
            tickLabels: { fontSize: 10, fill: "currentColor" },
            grid: { stroke: "hsl(var(--border))", strokeDasharray: "4" },
          }}
        />
        <Axis
          label={xAxisLabel}
          tickValues={
            isTimeSeries
              ? (() => {
                  // Show maximum 8-10 ticks to avoid overcrowding
                  const maxTicks = 8;
                  const dataLength = xTickLabels.length;
                  if (dataLength <= maxTicks) {
                    // oxlint-disable-next-line no-unused-vars
                    return xTickLabels.map((_, idx) => idx);
                  }
                  // Sample tick indices to show evenly distributed labels
                  const step = Math.ceil(dataLength / maxTicks);
                  const ticks: number[] = [];
                  for (let i = 0; i < dataLength; i += step) {
                    ticks.push(i);
                  }
                  // Always include the last tick
                  if (ticks[ticks.length - 1] !== dataLength - 1) {
                    ticks.push(dataLength - 1);
                  }
                  return ticks;
                })()
              : uniqueXValues
          }
          tickFormat={(t: string | number) => {
            if (isTimeSeries) {
              const index = typeof t === "number" ? t : parseInt(String(t));
              return xTickLabels[index] || "";
            }
            return String(t);
          }}
          style={{
            axisLabel: { padding: 30, fontSize: 12, fill: "currentColor" },
            tickLabels: {
              fontSize: 10,
              fill: "currentColor",
              angle: -45,
              textAnchor: "end",
            },
            grid: { stroke: "transparent" },
          }}
        />

        {chartData.data.map((series, i) => {
          const color = series.color || CHART_COLORS[i % CHART_COLORS.length];
          // For time series, use numeric indices; otherwise use formatted labels
          const data = isTimeSeries
            ? series.data.map((d, idx) => ({ x: idx, y: d.y }))
            : series.data.map((d) => ({
                x: String(
                  context.t(String(d.label ?? d.x ?? "") as TranslationKey),
                ),
                y: d.y,
              }));

          switch (chartType) {
            case "bar":
              return (
                <Bar
                  key={series.name}
                  data={data}
                  style={{ data: { fill: color } }}
                  animate={animate}
                />
              );
            case "area":
              return (
                <Area
                  key={series.name}
                  data={data}
                  style={{
                    data: { fill: color, fillOpacity: 0.3, stroke: color },
                  }}
                  interpolation="natural"
                  animate={animate}
                />
              );
            case "line":
            default:
              return (
                <Line
                  key={series.name}
                  data={data}
                  style={{ data: { stroke: color, strokeWidth: 2 } }}
                  interpolation="natural"
                  animate={animate}
                />
              );
          }
        })}
      </Chart>
    );
  };

  return (
    <Card className={cn("h-full", className)}>
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && (
            <CardTitle
              className={cn("font-medium", titleTextSizeClass || "text-sm")}
            >
              {title}
            </CardTitle>
          )}
          {description && (
            <Span
              className={cn(
                "text-muted-foreground",
                descriptionTextSizeClass || "text-xs",
              )}
            >
              {description}
            </Span>
          )}
        </CardHeader>
      )}
      <CardContent className="p-4 pt-0">
        <Div style={{ height, width: "100%" }}>{renderChart()}</Div>

        {/* Legend */}
        {showLegend && chartData.data.length > 1 && (
          <Div
            className={cn(
              "flex flex-wrap justify-center",
              legendGapClass || "gap-4",
              legendMarginTopClass || "mt-4",
            )}
          >
            {chartData.data.map((series, i) => (
              <Div
                key={series.name}
                className={cn(
                  "flex items-center",
                  legendItemGapClass || "gap-2",
                )}
              >
                <Div
                  style={{
                    backgroundColor:
                      series.color || CHART_COLORS[i % CHART_COLORS.length],
                    height: 12,
                    width: 12,
                    borderRadius: 9999,
                  }}
                />
                <Span
                  className={cn(
                    "text-muted-foreground",
                    legendTextSizeClass || "text-xs",
                  )}
                >
                  {series.name}
                </Span>
              </Div>
            ))}
          </Div>
        )}
      </CardContent>
    </Card>
  );
}

ChartWidget.displayName = "ChartWidget";

export default ChartWidget;
