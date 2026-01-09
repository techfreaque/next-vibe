"use client";

import { cn } from "next-vibe/shared/utils";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Area, Axis, Bar, Chart, Line, Pie } from "next-vibe-ui/ui/chart";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { WidgetType } from "../../../shared/types/enums";
import { type ChartDataPoint, extractChartData } from "../../../shared/widgets/logic/chart";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

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
export function ChartWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.CHART, TKey>): JSX.Element {
  const { t: globalT } = simpleT(context.locale);
  const {
    chartType = "line",
    label: labelKey,
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
  } = field.ui;

  // Get classes from config (no hardcoding!)
  const titleTextSizeClass = getTextSizeClassName(titleTextSize);
  const descriptionTextSizeClass = getTextSizeClassName(descriptionTextSize);
  const emptyTextSizeClass = getTextSizeClassName(emptyTextSize);
  const legendGapClass = getSpacingClassName("gap", legendGap);
  const legendItemGapClass = getSpacingClassName("gap", legendItemGap);
  const legendTextSizeClass = getTextSizeClassName(legendTextSize);
  const legendMarginTopClass = getSpacingClassName("margin", legendMarginTop);

  const title = labelKey ? context.t(labelKey) : undefined;
  const description = descriptionKey ? context.t(descriptionKey) : undefined;

  // Extract chart data using shared logic
  const chartData = extractChartData<TKey>(value);

  // No data - show empty state
  if (!chartData || chartData.data.length === 0) {
    return (
      <Card className={cn("h-full", className)}>
        {title && (
          <CardHeader className="pb-2">
            <CardTitle className={cn("font-medium", titleTextSizeClass || "text-sm")}>
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
              {globalT("app.api.system.unifiedInterface.widgets.chart.noDataAvailable")}
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
      const pieData =
        firstSeries?.data
          .filter((d: ChartDataPoint<TKey>) => d.y > 0) // Filter out zero values for pie chart
          .map((d: ChartDataPoint<TKey>) => {
            // Translate labels - context.t() returns original string if key not found
            const rawLabel = String(d.label ?? d.x ?? "Unknown");
            return {
              x: context.t(rawLabel as TranslationKey),
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
              {globalT("app.api.system.unifiedInterface.widgets.chart.noDataToDisplay")}
            </Span>
          </Div>
        );
      }

      return (
        <Pie
          data={pieData}
          colorScale={CHART_COLORS}
          innerRadius={chartType === "donut" ? 50 : 0}
          animate={animate}
          labels={(datum: Record<string, string | number>) =>
            datum.x && datum.y !== undefined ? `${datum.x}: ${datum.y}` : ""
          }
          style={{
            labels: { fontSize: 10, fill: "currentColor" },
          }}
        />
      );
    }

    // Line/Bar/Area charts
    // Collect all unique x values for categorical axis (with translation)
    const allXValues = chartData.data.flatMap((series) =>
      series.data.map((d) => context.t(String(d.label ?? d.x ?? "") as TranslationKey)),
    );
    const uniqueXValues = [...new Set(allXValues)];

    return (
      <Chart
        height={height}
        padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
        domainPadding={{ x: 20 }}
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
          tickValues={uniqueXValues}
          tickFormat={(t: string | number) => String(t)}
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
          // Use translated string labels for x values
          const data = series.data.map((d) => ({
            x: context.t(String(d.label ?? d.x ?? "") as TranslationKey),
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
            <CardTitle className={cn("font-medium", titleTextSizeClass || "text-sm")}>
              {title}
            </CardTitle>
          )}
          {description && (
            <Span className={cn("text-muted-foreground", descriptionTextSizeClass || "text-xs")}>
              {description}
            </Span>
          )}
        </CardHeader>
      )}
      <CardContent className="pt-0">
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
                className={cn("flex items-center", legendItemGapClass || "gap-2")}
              >
                <Div
                  style={{
                    backgroundColor: series.color || CHART_COLORS[i % CHART_COLORS.length],
                    height: 12,
                    width: 12,
                    borderRadius: 9999,
                  }}
                />
                <Span className={cn("text-muted-foreground", legendTextSizeClass || "text-xs")}>
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
