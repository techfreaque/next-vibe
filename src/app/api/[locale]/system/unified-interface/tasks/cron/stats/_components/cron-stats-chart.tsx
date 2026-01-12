/**
 * Cron Stats Chart Component
 * Comprehensive chart visualization for cron statistics with historical data
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Area, Axis, Bar, Chart, Line, Pie } from "next-vibe-ui/ui/chart";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CronStatsResponseType } from "@/app/api/[locale]/system/unified-interface/tasks/cron/stats/definition";

// Chart constants
const CHART_CONSTANTS = {
  FULL_WIDTH: "100%",
  DEFAULT_COLORS: [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#ef4444", // Red
    "#6b7280", // Gray
    "#ec4899", // Pink
    "#14b8a6", // Teal
  ],
} as const;

/**
 * Get color for a series
 */
function getSeriesColor(series: { color?: string }, index: number): string {
  return (
    series.color ||
    CHART_CONSTANTS.DEFAULT_COLORS[
      index % CHART_CONSTANTS.DEFAULT_COLORS.length
    ]
  );
}

interface CronStatsChartProps {
  data: Partial<NonNullable<CronStatsResponseType["data"]["historicalData"]>>;
  title: string;
  type?: "line" | "area" | "bar";
  height?: number;
}

/**
 * Main chart component for historical cron stats data
 */
export function CronStatsChart({
  data,
  title,
  type = "line",
  height = 300,
}: CronStatsChartProps): JSX.Element {
  // Transform data for chart consumption
  const chartData = Object.entries(data).reduce(
    (acc, [key, series]) => {
      if (Array.isArray(series) && series.length > 0) {
        series.forEach(
          (point: { date: string; value: number }, index: number) => {
            if (!acc[index]) {
              acc[index] = { date: point.date };
            }
            acc[index][key] = point.value;
          },
        );
      }
      return acc;
    },
    [] as Array<Record<string, string | number>>,
  );

  const renderChart = (): JSX.Element => {
    const commonProps = {
      height,
      width: 600,
      padding: { top: 5, right: 30, left: 50, bottom: 40 },
    };

    const dataKeys = Object.keys(data);
    const chartComponents = dataKeys.map((key, index) => {
      const color = getSeriesColor({ color: undefined }, index);

      switch (type) {
        case "area":
          return (
            <Area
              key={key}
              data={chartData}
              x="date"
              y={key}
              interpolation="monotoneX"
              style={{
                data: { fill: color, fillOpacity: 0.6, stroke: color },
              }}
            />
          );
        case "bar":
          return (
            <Bar
              key={key}
              data={chartData}
              x="date"
              y={key}
              style={{ data: { fill: color } }}
            />
          );
        default:
          return (
            <Line
              key={key}
              data={chartData}
              x="date"
              y={key}
              interpolation="monotoneX"
              style={{ data: { stroke: color, strokeWidth: 2 } }}
            />
          );
      }
    });

    return (
      <Chart {...commonProps}>
        <Axis />
        <Axis
          dependentAxis
          tickFormat={(value: number | string) => {
            const val =
              typeof value === "string" ? Number.parseFloat(value) : value;
            if (val >= 1000) {
              return `${(val / 1000).toFixed(1)}K`;
            }
            return val.toString();
          }}
        />
        {chartComponents}
      </Chart>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Div style={{ width: CHART_CONSTANTS.FULL_WIDTH, height }}>
          {renderChart()}
        </Div>
      </CardContent>
    </Card>
  );
}

/**
 * Distribution chart component for categorical data
 */

export function CronStatsDistributionChart({
  data,
  title,
  type = "pie",
  height = 300,
}: {
  data: Array<{ name: string; value: number; color?: string }>;
  title: string;
  type?: "pie" | "bar";
  height?: number;
}): JSX.Element {
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const renderChart = (): JSX.Element => {
    if (type === "bar") {
      return (
        <Chart
          height={height}
          width={600}
          padding={{ top: 5, right: 30, left: 50, bottom: 40 }}
        >
          <Axis />
          <Axis
            dependentAxis
            tickFormat={(value: number | string) => {
              const val =
                typeof value === "string" ? Number.parseFloat(value) : value;
              if (val >= 1000) {
                return `${(val / 1000).toFixed(1)}K`;
              }
              return val.toString();
            }}
          />
          <Bar
            data={data}
            x="name"
            y="value"
            style={{ data: { fill: "hsl(var(--chart-1))" } }}
          />
        </Chart>
      );
    }

    return (
      <Chart
        height={height}
        width={600}
        padding={{ top: 5, right: 30, left: 50, bottom: 40 }}
      >
        <Pie
          data={data.map((entry) => ({ x: entry.name, y: entry.value }))}
          colorScale={data.map(
            (entry, index) => entry.color || COLORS[index % COLORS.length],
          )}
          innerRadius={0}
        />
      </Chart>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Div style={{ width: CHART_CONSTANTS.FULL_WIDTH, height }}>
          {renderChart()}
        </Div>
      </CardContent>
    </Card>
  );
}
