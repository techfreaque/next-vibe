/**
 * Leads Stats Chart with Source Control
 * Enhanced chart component that integrates with source legend
 */

"use client";

import type { ChartDataType } from "next-vibe/shared/types/stats-filtering.schema";
import { ChartType } from "next-vibe/shared/types/stats-filtering.schema";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Area, Axis, Bar, Chart, Line } from "next-vibe-ui/ui/chart";
import { Div } from "next-vibe-ui/ui/div";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import { H4, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import {
  LeadSource,
  LeadSourceOptions,
  type LeadSourceValues,
} from "@/app/api/[locale]/leads/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";
import { getLanguageFromLocale } from "@/i18n/core/translation-utils";

import { LeadsSourceLegend } from "./leads-source-legend";

// Chart constants
const CHART_CONSTANTS = {
  FULL_WIDTH: "100%",
  STROKE_DASHARRAY: "3 3",
  // Updated colors that work better in both light and dark mode
  DEFAULT_COLORS: [
    "#3b82f6", // Blue - Website
    "#10b981", // Green - Social Media
    "#f59e0b", // Amber - Email Campaign
    "#8b5cf6", // Purple - Referral
    "#ef4444", // Red - CSV Import
    "#6b7280", // Gray - API
    "#ec4899", // Pink - Unknown
    "#14b8a6", // Teal - Additional
  ],
  SOURCE_COLORS: {
    [LeadSource.WEBSITE]: "#3b82f6", // Blue - high contrast
    [LeadSource.SOCIAL_MEDIA]: "#10b981", // Emerald - good visibility
    [LeadSource.EMAIL_CAMPAIGN]: "#f59e0b", // Amber - strong contrast
    [LeadSource.REFERRAL]: "#8b5cf6", // Violet - accessible
    [LeadSource.CSV_IMPORT]: "#ef4444", // Red - high visibility
    [LeadSource.API]: "#6b7280", // Slate - muted but visible
  },
} as const;

interface LeadsStatsChartWithSourceControlProps {
  locale: CountryLanguage;
  data: ChartDataType & {
    chartType?: ChartType;
    sourceData?: Record<typeof LeadSourceValues, number>;
  };
  isLoading?: boolean;
  height?: number;
  className?: string;
  showSourceLegend?: boolean;
}

export function LeadsStatsChart({
  locale,
  data,
  isLoading = false,
  height = 300,
  className = "",
  showSourceLegend = false,
}: LeadsStatsChartWithSourceControlProps): JSX.Element {
  const { t } = simpleT(locale);

  // State for managing which series are visible
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>(
    {},
  );
  const [visibleSources, setVisibleSources] = useState<
    Partial<Record<typeof LeadSourceValues, boolean>>
  >({});

  // Initialize visibility state when data changes
  useEffect(() => {
    if (data?.series) {
      const initial: Record<string, boolean> = {};
      data.series.forEach((series) => {
        initial[series.name] = true;
      });
      setVisibleSeries(initial);
    }
  }, [data?.series]);

  // Initialize source visibility
  useEffect(() => {
    if (data?.sourceData) {
      const initial: Partial<Record<typeof LeadSourceValues, boolean>> = {};
      (Object.keys(data.sourceData) as Array<typeof LeadSourceValues>).forEach(
        (source) => {
          initial[source] = true;
        },
      );
      setVisibleSources(initial);
    }
  }, [data?.sourceData]);

  // Format Y-axis values - must be before any early returns per React hooks rules
  const formatYAxis = React.useCallback((value: number | string): string => {
    const val = typeof value === "string" ? Number.parseFloat(value) : value;
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    if (val >= 1) {
      return Math.round(val).toString();
    }
    if (val === 0.000001) {
      return "0";
    }
    if (val >= 0.1) {
      return val.toFixed(1);
    }
    if (val >= 0.01) {
      return val.toFixed(2);
    }
    return val.toFixed(3);
  }, []);

  const toggleSeries = (name: string): void => {
    setVisibleSeries((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const toggleSource = (sourceTranslationKey: TranslationKey): void => {
    // Find the option that has this translation key as its label
    const option = LeadSourceOptions.find(
      (opt) => opt.label === sourceTranslationKey,
    );

    if (option) {
      // option.value is the enum key (e.g., "WEBSITE")
      setVisibleSources((prev) => ({
        ...prev,
        [option.value]: !prev[option.value],
      }));
    }
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

  const showAllSources = (): void => {
    setVisibleSources((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key as typeof LeadSourceValues] = true;
      });
      return updated;
    });
  };

  const hideAllSources = (): void => {
    setVisibleSources((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key as typeof LeadSourceValues] = false;
      });
      return updated;
    });
  };

  const toggleAllSources = (): void => {
    const visibleValues = Object.values(visibleSources).filter(
      (v) => v !== undefined,
    );
    const allVisible =
      visibleValues.length > 0 && visibleValues.every((visible) => visible);
    if (allVisible) {
      hideAllSources();
    } else {
      showAllSources();
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-5 w-48 " />
        </CardHeader>
        <CardContent>
          <Skeleton style={{ height: `${height}px`, width: "100%" }} />
        </CardContent>
      </Card>
    );
  }

  if (!data?.series || data.series.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            {t("app.admin.leads.leads.admin.stats.chart.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div style={{ height: `${height}px` }}>
            <Div className="flex items-center justify-center text-muted-foreground h-full">
              {t("app.admin.leads.leads.admin.stats.chart.noData")}
            </Div>
          </Div>
        </CardContent>
      </Card>
    );
  }

  const language = getLanguageFromLocale(locale);

  // Filter visible series
  const activeSeries =
    data?.series?.filter((series) => visibleSeries[series.name]) || [];

  // Create a map to store original values for tooltip display
  const originalValuesMap = new Map<string, Record<string, number>>();

  // Transform data for Victory charts with log scale handling
  const chartData =
    data?.series?.[0]?.data.map((point, index) => {
      const dataPoint: Record<string, number | string> = {
        date: new Date(point.date).toLocaleDateString(language),
        dateValue:
          typeof point.date === "string"
            ? point.date
            : new Date(point.date).toISOString(),
      };

      const originalValues: Record<string, number> = {};

      // Add only visible series data for this date point
      activeSeries.forEach((series) => {
        if (series.data[index]) {
          const originalValue = series.data[index].value;
          let value = originalValue;
          // For log scale, convert zero to a very specific small number for rendering
          // Use a number that's extremely unlikely to be a real value
          if (value === 0) {
            value = 0.000001; // Very small value for log scale rendering
          }
          dataPoint[series.name] = value;
          originalValues[series.name] = originalValue;
        }
      });

      // Store original values with date as key
      const dateKey =
        typeof point.date === "string"
          ? point.date
          : new Date(point.date).toISOString();
      originalValuesMap.set(dateKey, originalValues);

      return dataPoint;
    }) || [];

  // Prepare legend data
  const legendData =
    data?.series?.map((series, index) => ({
      name: series.name,
      color:
        series.color ||
        CHART_CONSTANTS.DEFAULT_COLORS[
          index % CHART_CONSTANTS.DEFAULT_COLORS.length
        ],
      visible: visibleSeries[series.name] || false,
    })) || [];

  // Prepare source legend data
  const sourceLegendData = data?.sourceData
    ? (
        Object.entries(data.sourceData) as Array<
          [typeof LeadSourceValues, number]
        >
      ).map(([source, count]) => {
        const total = Object.values(data.sourceData || {}).reduce(
          (sum, val) => sum + val,
          0,
        );

        return {
          source: source,
          name: t(source),
          color: CHART_CONSTANTS.SOURCE_COLORS[source] || "#6b7280",
          visible: visibleSources[source] || false,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        };
      })
    : [];

  // Determine chart type
  const chartType: ChartType = data.chartType || ChartType.LINE;

  const renderChart = (): JSX.Element => {
    const commonProps = {
      height,
      width: 600,
      padding: { top: 5, right: 30, left: 50, bottom: 40 },
    };

    const chartComponents = activeSeries.map((series, index) => {
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
                data: {
                  fill: color,
                  fillOpacity: 0.3,
                  stroke: color,
                  strokeWidth: 2,
                },
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
        <Axis dependentAxis tickFormat={formatYAxis} />
        {chartComponents}
      </Chart>
    );
  };

  return (
    <Div className={`flex flex-col gap-4 ${className}`}>
      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {data.title || t("app.admin.leads.leads.admin.stats.chart.title")}
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
            <Div className="border-t">
              <Div className="flex items-center justify-between p-4 border-b">
                <H4 className="text-sm font-medium">
                  {t("app.admin.leads.leads.admin.stats.legend.title")}
                </H4>
                <Div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={showAllSeries}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t("app.admin.leads.leads.admin.stats.legend.showAll")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={hideAllSeries}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {t("app.admin.leads.leads.admin.stats.legend.hideAll")}
                  </Button>
                </Div>
              </Div>
              <Div className="flex flex-wrap gap-4 p-4">
                {legendData.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => toggleSeries(item.name)}
                    className={`flex items-center gap-2 text-sm transition-opacity hover:opacity-80 ${
                      item.visible ? "opacity-100" : "opacity-50"
                    }`}
                    title={t(
                      "app.admin.leads.leads.admin.stats.legend.clickToToggle",
                    )}
                  >
                    <Div style={{ backgroundColor: item.color }}>
                      <Div className="w-3 h-3 rounded-full" />
                    </Div>
                    <Span
                      className={
                        item.visible
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {t(item.name)}
                    </Span>
                  </Button>
                ))}
              </Div>
            </Div>
          )}
        </CardContent>
      </Card>

      {/* Source Legend */}
      {showSourceLegend && sourceLegendData.length > 0 && (
        <LeadsSourceLegend
          locale={locale}
          sources={sourceLegendData}
          onToggleSource={toggleSource}
          onToggleAll={toggleAllSources}
          onShowAll={showAllSources}
          onHideAll={hideAllSources}
        />
      )}
    </Div>
  );
}
