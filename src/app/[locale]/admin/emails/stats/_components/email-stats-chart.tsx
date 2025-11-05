/**
 * Email Stats Chart Component
 * Chart component specifically for email statistics
 */

"use client";

import { BarChart3Icon, LineChartIcon, TrendingUpIcon } from 'next-vibe-ui/ui/icons';
import type { ChartDataType } from "next-vibe/shared/types/stats-filtering.schema";
import { ChartType } from "next-vibe/shared/types/stats-filtering.schema";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// Chart constants
const CHART_CONSTANTS = {
  FULL_WIDTH: "100%",
  STROKE_DASHARRAY: "3 3",
  DEFAULT_COLORS: [
    "#3b82f6", // Blue - Total Emails
    "#10b981", // Green - Sent Emails
    "#f59e0b", // Amber - Opened Emails
    "#8b5cf6", // Purple - Clicked Emails
    "#ef4444", // Red - Bounced Emails
    "#6b7280", // Gray - Unsubscribed
  ],
} as const;

interface EmailStatsChartProps {
  locale: CountryLanguage;
  data: ChartDataType;
  isLoading?: boolean;
  height?: number;
  className?: string;
}

/**
 * Email Stats Chart Component
 * Displays historical email data in various chart formats
 */
export function EmailStatsChart({
  locale,
  data,
  isLoading = false,
  height = 400,
  className,
}: EmailStatsChartProps): JSX.Element {
  const { t } = simpleT(locale);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    );
  }

  if (!data.series || data.series.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t("app.admin.emails.stats.common.noResults")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center" style={{ height }}>
            <p className="text-muted-foreground">
              {t("app.admin.emails.stats.common.noResults")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for recharts format
  const chartData = transformDataForChart(data);
  const chartType = data.series[0]?.type || ChartType.LINE;

  const getChartIcon = (): JSX.Element => {
    switch (chartType) {
      case ChartType.BAR:
        return <BarChart3Icon className="h-5 w-5" />;
      case ChartType.AREA:
        return <TrendingUpIcon className="h-5 w-5" />;
      case ChartType.LINE:
      default:
        return <LineChartIcon className="h-5 w-5" />;
    }
  };

  const renderChart = (): JSX.Element => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case ChartType.BAR:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray={CHART_CONSTANTS.STROKE_DASHARRAY} />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) =>
                formatDateForChart(value, locale)
              }
            />
            <YAxis scale="log" domain={["dataMin", "dataMax"]} />
            <Tooltip
              labelFormatter={(value: string) =>
                formatDateForTooltip(value, locale)
              }
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name,
              ]}
            />
            {data.series.map((series, index) => (
              <Bar
                key={index}
                dataKey={series.name}
                fill={getSeriesColor(series, index)}
              />
            ))}
          </BarChart>
        );

      case ChartType.AREA:
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray={CHART_CONSTANTS.STROKE_DASHARRAY} />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) =>
                formatDateForChart(value, locale)
              }
            />
            <YAxis scale="log" domain={["dataMin", "dataMax"]} />
            <Tooltip
              labelFormatter={(value: string) =>
                formatDateForTooltip(value, locale)
              }
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name,
              ]}
            />
            {data.series.map((series, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={series.name}
                stackId="1"
                stroke={getSeriesColor(series, index)}
                fill={getSeriesColor(series, index)}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray={CHART_CONSTANTS.STROKE_DASHARRAY} />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) =>
                formatDateForChart(value, locale)
              }
            />
            <YAxis scale="log" domain={["dataMin", "dataMax"]} />
            <Tooltip
              labelFormatter={(value: string) =>
                formatDateForTooltip(value, locale)
              }
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name,
              ]}
            />
            {data.series.map((series, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={series.name}
                stroke={getSeriesColor(series, index)}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getChartIcon()}
          {data.title || t("app.admin.emails.stats.admin.stats.chart.title")}
        </CardTitle>
        {data.subtitle && (
          <p className="text-sm text-muted-foreground">{data.subtitle}</p>
        )}
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
 * Transform chart data for recharts format
 */
interface ChartDataPoint {
  date: string;
  [seriesName: string]: string | number;
}

function transformDataForChart(data: ChartDataType): ChartDataPoint[] {
  if (!data.series || data.series.length === 0) {
    return [];
  }

  // Get all unique dates from all series
  const allDates = new Set<string>();
  data.series.forEach((series) => {
    series.data.forEach((point) => {
      const dateString =
        typeof point.date === "string"
          ? point.date
          : point.date instanceof Date
            ? point.date.toISOString()
            : point.date.toString();
      allDates.add(dateString);
    });
  });

  // Sort dates
  const sortedDates = [...allDates].toSorted();

  // Transform to recharts format
  return sortedDates.map((date) => {
    const dataPoint: ChartDataPoint = { date };

    data.series.forEach((series) => {
      const point = series.data.find((p) => p.date === date);
      dataPoint[series.name] = point?.value || 0;
    });

    return dataPoint;
  });
}

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

/**
 * Format date for chart display
 */
function formatDateForChart(
  dateString: string,
  locale: CountryLanguage,
): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Format date for tooltip display
 */
function formatDateForTooltip(
  dateString: string,
  locale: CountryLanguage,
): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
