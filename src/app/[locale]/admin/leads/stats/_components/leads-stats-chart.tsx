/**
 * Leads Stats Chart with Source Control
 * Enhanced chart component that integrates with source legend
 */

"use client";

import type { ChartDataType } from "next-vibe/shared/types/stats-filtering.schema";
import { ChartType } from "next-vibe/shared/types/stats-filtering.schema";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";
import { useEffect, useState } from "react";
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

import {
  LeadSource,
  LeadSourceOptions,
} from "@/app/api/[locale]/v1/core/leads/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";
import { getLanguageFromLocale } from "@/i18n/core/translation-utils";

import { LeadsSourceLegend } from "./leads-source-legend";

// Type for YAxis props
interface YAxisProps {
  tick: { fontSize: number; fill: string };
  tickLine: { stroke: string };
  axisLine: { stroke: string };
  scale: "log";
  domain: [number, number] | ["dataMin", "dataMax"] | [number, "dataMax"];
  allowDataOverflow: boolean;
  tickCount?: number;
  ticks?: number[];
  tickFormatter?: (value: number) => string;
}

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
    sourceData?: Record<keyof typeof LeadSource, number>;
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
    Partial<Record<keyof typeof LeadSource, boolean>>
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
      const initial: Partial<Record<keyof typeof LeadSource, boolean>> = {};
      (Object.keys(data.sourceData) as Array<keyof typeof LeadSource>).forEach(
        (source) => {
          initial[source] = true;
        },
      );
      setVisibleSources(initial);
    }
  }, [data?.sourceData]);

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
        updated[key as keyof typeof LeadSource] = true;
      });
      return updated;
    });
  };

  const hideAllSources = (): void => {
    setVisibleSources((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key as keyof typeof LeadSource] = false;
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
          <Skeleton className={`w-full`} style={{ height: `${height}px` }} />
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
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height: `${height}px` }}
          >
            {t("app.admin.leads.leads.admin.stats.chart.noData")}
          </div>
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

  // Transform data for recharts with log scale handling
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
    ? Object.entries(data.sourceData).map(([source, count]) => {
        const total = Object.values(data.sourceData || {}).reduce(
          (sum, val) => sum + val,
          0,
        );

        const sourceKey = source as keyof typeof LeadSource;
        const sourceTranslationKey = LeadSource[sourceKey] as TranslationKey;

        return {
          source: sourceTranslationKey,
          name: t(sourceTranslationKey),
          color: CHART_CONSTANTS.SOURCE_COLORS[sourceKey] || "#6b7280",
          visible: visibleSources[sourceKey] || false,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        };
      })
    : [];

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
      payload?: Record<string, number | string>;
    }>;
    label?: string;
  }): JSX.Element | null => {
    if (active && payload?.length) {
      // Find the original values for this date point
      const dateValue = payload[0]?.payload?.dateValue as string;
      const originalValues = dateValue
        ? originalValuesMap.get(dateValue)
        : undefined;

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

            // Use original value if available, otherwise use the display value
            const originalValue = originalValues?.[entry.name];
            const displayValue =
              originalValue !== undefined ? originalValue : entry.value;

            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {`${translatedName}: ${new Intl.NumberFormat(locale.split("-")[0]).format(displayValue)}`}
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
      tick: { fontSize: 12, fill: "hsl(var(--foreground))" },
      tickLine: { stroke: "hsl(var(--border))" },
      axisLine: { stroke: "hsl(var(--border))" },
    };

    // Log scale that handles 0 values properly and divides into thirds
    const getYAxisProps = (): YAxisProps => {
      return {
        ...commonAxisProps,
        scale: "log" as const,
        domain: [0.000001, "dataMax"] as const,
        allowDataOverflow: false,
        tickFormatter: (value: number): string => {
          if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
          }
          if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
          }
          if (value >= 1) {
            return Math.round(value).toString();
          }
          if (value === 0.000001) {
            return "0"; // Show 0 for our converted zero values
          }
          if (value >= 0.1) {
            return value.toFixed(1);
          }
          if (value >= 0.01) {
            return value.toFixed(2);
          }
          return value.toFixed(3);
        },
      };
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
            <YAxis {...getYAxisProps()} />
            <Tooltip content={<CustomTooltip />} />
            {activeSeries.map((series, index) => (
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
            <YAxis {...getYAxisProps()} />
            <Tooltip content={<CustomTooltip />} />
            {activeSeries.map((series, index) => (
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
            <YAxis {...getYAxisProps()} />
            <Tooltip content={<CustomTooltip />} />
            {activeSeries.map((series, index) => (
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
    <div className={`space-y-4 ${className}`}>
      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {data.title || t("app.admin.leads.leads.admin.stats.chart.title")}
          </CardTitle>
          {data.subtitle && (
            <p className="text-sm text-muted-foreground">{data.subtitle}</p>
          )}
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width={CHART_CONSTANTS.FULL_WIDTH}
            height={height}
          >
            {renderChart()}
          </ResponsiveContainer>
          {legendData.length > 0 && (
            <div className="border-t">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="text-sm font-medium">
                  {t("app.admin.leads.leads.admin.stats.legend.title")}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={showAllSeries}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t("app.admin.leads.leads.admin.stats.legend.showAll")}
                  </button>
                  <button
                    onClick={hideAllSeries}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {t("app.admin.leads.leads.admin.stats.legend.hideAll")}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 p-4">
                {legendData.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => toggleSeries(item.name)}
                    className={`flex items-center gap-2 text-sm transition-opacity hover:opacity-80 ${
                      item.visible ? "opacity-100" : "opacity-50"
                    }`}
                    title={t(
                      "app.admin.leads.leads.admin.stats.legend.clickToToggle",
                    )}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={
                        item.visible
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {t(item.name)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
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
    </div>
  );
}
