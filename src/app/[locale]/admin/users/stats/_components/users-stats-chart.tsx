/**
 * Users Stats Chart Component
 * Displays users statistics in chart format following leads stats pattern
 */

"use client";

import type { ChartDataType } from "next-vibe/shared/types/stats-filtering.schema";
import { ChartType } from "next-vibe/shared/types/stats-filtering.schema";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";
import { useState } from "react";
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
import type { TranslationKey } from "@/i18n/core/static-types";
import { getLanguageFromLocale } from "@/i18n/core/translation-utils";

// Chart constants
const CHART_CONSTANTS = {
  FULL_WIDTH: "100%",
  STROKE_DASHARRAY: "3 3",
  DEFAULT_COLORS: [
    "#3b82f6", // Blue - Total Users
    "#10b981", // Green - New Users
    "#f59e0b", // Amber - Active Users
    "#8b5cf6", // Purple - Verified Users
    "#ef4444", // Red - Suspended Users
    "#6b7280", // Gray - Premium Users
  ],
} as const;

interface LegendProps {
  series: Array<{
    name: TranslationKey;
    nameParams: Record<string, string | number> | undefined;
    color: string;
    visible: boolean;
  }>;
  onToggle: (name: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  locale: CountryLanguage;
}

function ChartLegend({
  series,
  onToggle,
  onShowAll,
  onHideAll,
  locale,
}: LegendProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <div className="border-t">
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="text-sm font-medium">
          {t("users.admin.stats.legend.title")}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={onShowAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t("users.admin.stats.legend.showAll")}
          </button>
          <button
            onClick={onHideAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t("users.admin.stats.legend.hideAll")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
        {series.map((item) => (
          <button
            key={item.name}
            onClick={() => onToggle(item.name)}
            className={`flex items-center gap-2 p-2 rounded text-sm transition-opacity ${
              item.visible ? "opacity-100" : "opacity-50"
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{t(item.name, item.nameParams)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface UsersStatsChartProps {
  locale: CountryLanguage;
  data: ChartDataType & { chartType?: ChartType };
  isLoading?: boolean;
  height?: number;
  className?: string;
}

export function UsersStatsChart({
  locale,
  data,
  isLoading = false,
  height = 300,
  className = "",
}: UsersStatsChartProps): JSX.Element {
  const { t } = simpleT(locale);
  const language = getLanguageFromLocale(locale);

  // State for managing which series are visible
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      data?.series?.forEach((series) => {
        initial[series.name] = true;
      });
      return initial;
    },
  );

  const toggleSeries = (name: string): void => {
    setVisibleSeries((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const showAllSeries = (): void => {
    setVisibleSeries((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = true;
      });
      return updated;
    });
  };

  const hideAllSeries = (): void => {
    setVisibleSeries((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = false;
      });
      return updated;
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className={`w-full`} style={{ height: `${height}px` }} />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.series || data.series.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t("users.admin.stats.chart.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height: `${height}px` }}
          >
            {t("users.admin.stats.chart.noData")}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter visible series
  const visibleSeriesData =
    data?.series?.filter((series) => visibleSeries[series.name] !== false) ||
    [];

  // Prepare legend data
  const legendData =
    data?.series?.map((series, index) => ({
      name: series.name,
      nameParams: series.nameParams,
      color:
        series.color ||
        CHART_CONSTANTS.DEFAULT_COLORS[
          index % CHART_CONSTANTS.DEFAULT_COLORS.length
        ],
      visible: visibleSeries[series.name] || false,
    })) || [];

  // Transform data for recharts
  const chartData =
    data.series[0]?.data.map((point, index) => {
      const dataPoint: Record<string, number | string> = {
        date: new Date(point.date).toLocaleDateString(language),
        dateValue:
          typeof point.date === "string" ? point.date : point.date.toString(),
      };

      // Add all series data for this date point
      visibleSeriesData.forEach((series) => {
        if (series.data[index]) {
          dataPoint[series.name] = series.data[index].value;
        }
      });

      return dataPoint;
    }) || [];

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }): JSX.Element | null => {
    if (active && payload?.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 dark:bg-popover dark:border-border">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index: number) => {
            // Find the series data to get translation parameters
            const seriesData = data?.series?.find(
              (series) => series.name === entry.name,
            );
            const translatedName = seriesData
              ? t(seriesData.name, seriesData.nameParams)
              : entry.name;

            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {`${translatedName}: ${new Intl.NumberFormat(language).format(entry.value)}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Determine chart type
  const chartType: ChartType = data.chartType || ChartType.LINE;

  const renderChart = (): JSX.Element => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const commonAxisProps = {
      tick: { fontSize: 12 },
      tickLine: { stroke: "hsl(var(--border))" },
      axisLine: { stroke: "hsl(var(--border))" },
    };

    switch (chartType) {
      case ChartType.BAR:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid
              strokeDasharray={CHART_CONSTANTS.STROKE_DASHARRAY}
              stroke="hsl(var(--border))"
            />
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {visibleSeriesData.map((series, index) => (
              <Bar
                key={series.name}
                dataKey={series.name}
                fill={
                  series.color ||
                  CHART_CONSTANTS.DEFAULT_COLORS[
                    index % CHART_CONSTANTS.DEFAULT_COLORS.length
                  ]
                }
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case ChartType.AREA:
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid
              strokeDasharray={CHART_CONSTANTS.STROKE_DASHARRAY}
              stroke="hsl(var(--border))"
            />
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {visibleSeriesData.map((series, index) => (
              <Area
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={
                  series.color ||
                  CHART_CONSTANTS.DEFAULT_COLORS[
                    index % CHART_CONSTANTS.DEFAULT_COLORS.length
                  ]
                }
                fill={
                  series.color ||
                  CHART_CONSTANTS.DEFAULT_COLORS[
                    index % CHART_CONSTANTS.DEFAULT_COLORS.length
                  ]
                }
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      default: // LINE
        return (
          <LineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray={CHART_CONSTANTS.STROKE_DASHARRAY}
              stroke="hsl(var(--border))"
            />
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {visibleSeriesData.map((series, index) => (
              <Line
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={
                  series.color ||
                  CHART_CONSTANTS.DEFAULT_COLORS[
                    index % CHART_CONSTANTS.DEFAULT_COLORS.length
                  ]
                }
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {data.title || t("users.admin.stats.chart.title")}
        </CardTitle>
        {data.subtitle && (
          <p className="text-sm text-muted-foreground">{data.subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width={CHART_CONSTANTS.FULL_WIDTH} height={height}>
          {renderChart()}
        </ResponsiveContainer>
        {legendData.length > 0 && (
          <ChartLegend
            series={legendData}
            onToggle={toggleSeries}
            onShowAll={showAllSeries}
            onHideAll={hideAllSeries}
            locale={locale}
          />
        )}
      </CardContent>
    </Card>
  );
}
