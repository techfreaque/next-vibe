/**
 * Email Stats Chart Component
 * Chart component specifically for email statistics
 */

"use client";

import type { ChartDataType } from "next-vibe/shared/types/stats-filtering.schema";
import { ChartType } from "next-vibe/shared/types/stats-filtering.schema";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart3Icon,
  LineChartIcon,
  TrendingUpIcon,
} from "next-vibe-ui/ui/icons";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import {
  Chart,
  Line,
  Bar,
  Area,
  Axis,
} from "next-vibe-ui/ui/chart";

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
          <Div style={{ height }}>
            <Skeleton className="w-full h-full" />
          </Div>
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
          <Div style={{ height }}>
            <Div className="flex items-center justify-center h-full">
              <P className="text-muted-foreground">
                {t("app.admin.emails.stats.common.noResults")}
              </P>
            </Div>
          </Div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for Victory charts format
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
      height,
      width: 600,
      padding: { top: 5, right: 30, left: 50, bottom: 40 },
    };

    // For all chart types, map each series to separate chart components
    const chartComponents = data.series.map((series, index) => {
      const color = getSeriesColor(series, index);

      switch (chartType) {
        case ChartType.BAR:
          return (
            <Bar
              key={index}
              data={chartData}
              x="date"
              y={series.name}
              style={{ data: { fill: color } }}
            />
          );
        case ChartType.AREA:
          return (
            <Area
              key={index}
              data={chartData}
              x="date"
              y={series.name}
              interpolation="monotoneX"
              style={{
                data: { fill: color, fillOpacity: 0.6, stroke: color },
              }}
            />
          );
        default:
          return (
            <Line
              key={index}
              data={chartData}
              x="date"
              y={series.name}
              interpolation="monotoneX"
              style={{ data: { stroke: color, strokeWidth: 2 } }}
            />
          );
      }
    });

    return (
      <Chart {...commonProps}>
        <Axis
          tickFormat={(t: number | string) => {
            return typeof t === "string"
              ? formatDateForChart(t, locale)
              : String(t);
          }}
        />
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getChartIcon()}
          {data.title || t("app.admin.emails.stats.admin.stats.chart.title")}
        </CardTitle>
        {data.subtitle && (
          <P className="text-sm text-muted-foreground">{data.subtitle}</P>
        )}
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
 * Transform chart data for Victory charts format
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

  // Transform to Victory charts format
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

