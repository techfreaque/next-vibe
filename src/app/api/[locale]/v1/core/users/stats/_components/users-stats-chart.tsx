/**
 * Users Stats Chart Component
 * Displays users statistics in chart format following leads stats pattern
 */

"use client";

import type { ChartDataType } from "next-vibe/shared/types/stats-filtering.schema";
import { ChartType } from "next-vibe/shared/types/stats-filtering.schema";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { H4, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";
import {
  Chart,
  Line,
  Bar,
  Area,
  Axis,
} from "next-vibe-ui/ui/chart";

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
    <Div className="border-t">
      <Div className="flex items-center justify-between p-4 border-b">
        <H4 className="text-sm font-medium">
          {t("app.admin.users.stats.legend.title")}
        </H4>
        <Div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t("app.admin.users.stats.legend.showAll")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onHideAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t("app.admin.users.stats.legend.hideAll")}
          </Button>
        </Div>
      </Div>
      <Div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
        {series.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            onClick={() => onToggle(item.name)}
            className={`flex items-center gap-2 p-2 rounded text-sm transition-opacity ${
              item.visible ? "opacity-100" : "opacity-50"
            }`}
          >
            <Div style={{ backgroundColor: item.color }}>
              <Div className="w-3 h-3 rounded-full" />
            </Div>
            <Span className="truncate">{t(item.name, item.nameParams)}</Span>
          </Button>
        ))}
      </Div>
    </Div>
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
          <Skeleton style={{ height: `${height}px`, width: "100%" }} />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.series || data.series.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t("app.admin.users.stats.chart.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Div style={{ height: `${height}px` }}>
            <Div className="flex items-center justify-center text-muted-foreground">
              {t("app.admin.users.stats.chart.noData")}
            </Div>
          </Div>
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

  // Transform data for Victory charts
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


  // Determine chart type
  const chartType: ChartType = data.chartType || ChartType.LINE;

  const renderChart = (): JSX.Element => {
    const commonProps = {
      height,
      width: 600,
      padding: { top: 5, right: 30, left: 50, bottom: 40 },
    };

    const chartComponents = visibleSeriesData.map((series, index) => {
      const color =
        series.color ||
        CHART_CONSTANTS.DEFAULT_COLORS[
          index % CHART_CONSTANTS.DEFAULT_COLORS.length
        ];

      switch (chartType) {
        case ChartType.BAR:
          return (
            <Bar
              key={series.name}
              data={chartData}
              x="date"
              y={series.name}
              style={{ data: { fill: color } }}
            />
          );
        case ChartType.AREA:
          return (
            <Area
              key={series.name}
              data={chartData}
              x="date"
              y={series.name}
              interpolation="monotoneX"
              style={{
                data: { fill: color, fillOpacity: 0.3, stroke: color, strokeWidth: 2 },
              }}
            />
          );
        default:
          return (
            <Line
              key={series.name}
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
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {data.title || t("app.admin.users.stats.chart.title")}
        </CardTitle>
        {data.subtitle && (
          <P className="text-sm text-muted-foreground">{data.subtitle}</P>
        )}
      </CardHeader>
      <CardContent>
        <Div style={{ width: CHART_CONSTANTS.FULL_WIDTH, height }}>
          {renderChart()}
        </Div>
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
