/**
 * Cron Stats Chart Component
 * Comprehensive chart visualization for cron statistics with historical data
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type { JSX } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CronStatsResponseType } from "@/app/api/[locale]/v1/core/system/tasks/cron/stats/definition";
import type { CountryLanguage } from "@/i18n/core/config";

// Chart constants
const CHART_CONSTANTS = {
  FULL_WIDTH: "100%",
  PIE_CENTER_X: "50%",
  PIE_CENTER_Y: "50%",
  CELL_PREFIX: "cell-",
  STROKE_DASHARRAY: "3 3",
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
  locale: CountryLanguage;
  data: Partial<CronStatsResponseType["historicalData"]>;
  title: string;
  type?: "line" | "area" | "bar";
  height?: number;
}

interface CronStatsDistributionChartProps {
  locale: CountryLanguage;
  data: Array<{ name: string; value: number; color?: string }>;
  title: string;
  type?: "pie" | "bar";
  height?: number;
}

/**
 * Main chart component for historical cron stats data
 */
export function CronStatsChart({
  locale,
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
    [] as Array<Record<string, string | number | Date>>,
  );

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Custom tooltip
  interface TooltipPayload {
    color: string;
    dataKey: string;
    value: string | number;
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }): JSX.Element | null => {
    if (active && payload?.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDate(label || "")}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = (): JSX.Element => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(data).map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={getSeriesColor({ color: undefined }, index)}
                fill={getSeriesColor({ color: undefined }, index)}
                fillOpacity={0.6}
                name={key}
              />
            ))}
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              scale="log"
              domain={["dataMin", "dataMax"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(data).map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={getSeriesColor({ color: undefined }, index)}
                name={key}
              />
            ))}
          </BarChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              scale="log"
              domain={["dataMin", "dataMax"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(data).map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={getSeriesColor({ color: undefined }, index)}
                strokeWidth={2}
                dot={{ r: 4 }}
                name={key}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width={CHART_CONSTANTS.FULL_WIDTH} height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Distribution chart component for categorical data
 */
export function CronStatsDistributionChart({
  locale,
  data,
  title,
  type = "pie",
  height = 300,
}: CronStatsDistributionChartProps): JSX.Element {
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  interface DistributionTooltipPayload {
    color: string;
    value: string | number;
    name: string;
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: DistributionTooltipPayload[];
  }): JSX.Element | null => {
    if (active && payload?.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.color }}>{data.value}</p>
        </div>
      );
    }
    return null;
  };

  const renderChart = (): JSX.Element => {
    if (type === "bar") {
      return (
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            scale="log"
            domain={["dataMin", "dataMax"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="hsl(var(--chart-1))" />
        </BarChart>
      );
    }

    return (
      <PieChart>
        <Pie
          data={data}
          cx={CHART_CONSTANTS.PIE_CENTER_X}
          cy={CHART_CONSTANTS.PIE_CENTER_Y}
          labelLine={false}
          label={({ name, percent }: { name: string; percent?: number }) =>
            `${name} ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={CHART_CONSTANTS.CELL_PREFIX + index.toString()}
              fill={entry.color || COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width={CHART_CONSTANTS.FULL_WIDTH} height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
