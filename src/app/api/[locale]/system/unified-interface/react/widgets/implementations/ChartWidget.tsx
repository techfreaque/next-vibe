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
import type {
  ReactWidgetProps,
  WidgetData,
} from "../../../shared/widgets/types";

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

// Type for chart data
interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

// Check if value looks like a ChartDataPoint
function looksLikeChartDataPoint(item: WidgetData): boolean {
  return (
    typeof item === "object" &&
    item !== null &&
    !Array.isArray(item) &&
    "x" in item &&
    "y" in item &&
    typeof (item as { y: WidgetData }).y === "number"
  );
}

// Check if value looks like a ChartSeries
function looksLikeChartSeries(item: WidgetData): boolean {
  return (
    typeof item === "object" &&
    item !== null &&
    !Array.isArray(item) &&
    "name" in item &&
    "data" in item &&
    typeof (item as { name: WidgetData }).name === "string" &&
    Array.isArray((item as { data: WidgetData }).data)
  );
}

// Convert validated WidgetData to ChartDataPoint
function toChartDataPoint(item: WidgetData): ChartDataPoint {
  const obj = item as { x: WidgetData; y: number; label?: WidgetData };
  return {
    x: String(obj.x),
    y: obj.y,
    label: obj.label !== undefined ? String(obj.label) : undefined,
  };
}

// Convert validated WidgetData to ChartSeries
function toChartSeries(item: WidgetData): ChartSeries {
  const obj = item as { name: string; data: WidgetData[]; color?: string };
  return {
    name: obj.name,
    data: obj.data.filter(looksLikeChartDataPoint).map(toChartDataPoint),
    color: obj.color,
  };
}

/**
 * Extract chart data from various value formats
 * Supports: array of points, object with series, raw numbers
 */
function extractChartData(value: WidgetData): {
  type: "single" | "series" | "pie";
  data: ChartSeries[];
} | null {
  if (!value) {
    return null;
  }

  // Array of data points: [{x: "Jan", y: 100}, ...]
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }

    // Check if it's array of series: [{name: "Series1", data: [...]}, ...]
    if (value[0] && looksLikeChartSeries(value[0])) {
      // Filter and convert to ChartSeries
      const validSeries = value.filter(looksLikeChartSeries).map(toChartSeries);
      return {
        type: "series",
        data: validSeries,
      };
    }

    // Single series of points - filter and convert to ChartDataPoint
    const validPoints = value
      .filter(looksLikeChartDataPoint)
      .map(toChartDataPoint);
    if (validPoints.length > 0) {
      return {
        type: "single",
        data: [{ name: "Value", data: validPoints }],
      };
    }
  }

  // Object with named series: {series1: [...], series2: [...]}
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as { [key: string]: WidgetData };
    const series: ChartSeries[] = [];

    for (const [key, val] of Object.entries(obj)) {
      if (Array.isArray(val)) {
        // Filter and convert to ChartDataPoint
        const validPoints = val
          .filter(looksLikeChartDataPoint)
          .map(toChartDataPoint);
        if (validPoints.length > 0) {
          series.push({
            name: key,
            data: validPoints,
          });
        }
      }
    }

    if (series.length > 0) {
      return { type: "series", data: series };
    }
  }

  return null;
}

/**
 * Chart Widget - Renders various chart types from definition-driven data
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
export function ChartWidget({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.CHART>): JSX.Element {
  const { t } = simpleT(context.locale);
  const {
    chartType = "line",
    label: labelKey,
    description: descriptionKey,
    xAxisLabel,
    yAxisLabel,
    height = 300,
    showLegend = true,
    animate = true,
  } = field.ui;

  const title = labelKey ? t(labelKey as TranslationKey) : undefined;
  const description = descriptionKey
    ? t(descriptionKey as TranslationKey)
    : undefined;

  // Extract chart data
  const chartData = extractChartData(value);

  // No data - show empty state
  if (!chartData || chartData.data.length === 0) {
    return (
      <Card className={cn("h-full", className)}>
        {title && (
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
            <Span className="text-muted-foreground">
              {t(
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
      const pieData =
        firstSeries?.data
          .filter((d: ChartDataPoint) => d.y > 0) // Filter out zero values for pie chart
          .map((d: ChartDataPoint) => {
            // Translate labels - t() returns original string if key not found
            const rawLabel = String(d.label ?? d.x ?? "Unknown");
            return {
              x: t(rawLabel as TranslationKey),
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
            <Span className="text-muted-foreground">
              {t(
                "app.api.system.unifiedInterface.widgets.chart.noDataToDisplay",
              )}
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
      series.data.map((d) => t(String(d.label ?? d.x ?? "") as TranslationKey)),
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
            x: t(String(d.label ?? d.x ?? "") as TranslationKey),
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
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          )}
          {description && (
            <Span className="text-xs text-muted-foreground">{description}</Span>
          )}
        </CardHeader>
      )}
      <CardContent className="pt-0">
        <Div style={{ height, width: "100%" }}>{renderChart()}</Div>

        {/* Legend */}
        {showLegend && chartData.data.length > 1 && (
          <Div className="flex flex-wrap justify-center gap-4 mt-4">
            {chartData.data.map((series, i) => (
              <Div key={series.name} className="flex items-center gap-2">
                <Div
                  style={{
                    backgroundColor:
                      series.color || CHART_COLORS[i % CHART_COLORS.length],
                    height: 12,
                    width: 12,
                    borderRadius: 9999,
                  }}
                />
                <Span className="text-xs text-muted-foreground">
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
