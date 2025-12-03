/**
 * Shared Stats Filtering Schemas and Enums
 * Reusable filtering infrastructure for stats endpoints
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

/**
 * Time Period Enum
 * Defines different time periods for historical data aggregation
 */
export const { enum: TimePeriod, options: TimePeriodOptions } =
  createEnumOptions({
    DAY: "app.api.shared.stats.timePeriod.day",
    WEEK: "app.api.shared.stats.timePeriod.week",
    MONTH: "app.api.shared.stats.timePeriod.month",
    QUARTER: "app.api.shared.stats.timePeriod.quarter",
    YEAR: "app.api.shared.stats.timePeriod.year",
  });

/**
 * Date Range Preset Enum
 * Common date range presets for quick filtering
 */
export const { enum: DateRangePreset, options: DateRangePresetOptions } =
  createEnumOptions({
    TODAY: "app.api.shared.stats.dateRange.today",
    YESTERDAY: "app.api.shared.stats.dateRange.yesterday",
    LAST_7_DAYS: "app.api.shared.stats.dateRange.last7Days",
    LAST_30_DAYS: "app.api.shared.stats.dateRange.last30Days",
    LAST_90_DAYS: "app.api.shared.stats.dateRange.last90Days",
    THIS_WEEK: "app.api.shared.stats.dateRange.thisWeek",
    LAST_WEEK: "app.api.shared.stats.dateRange.lastWeek",
    THIS_MONTH: "app.api.shared.stats.dateRange.thisMonth",
    LAST_MONTH: "app.api.shared.stats.dateRange.lastMonth",
    THIS_QUARTER: "app.api.shared.stats.dateRange.thisQuarter",
    LAST_QUARTER: "app.api.shared.stats.dateRange.lastQuarter",
    THIS_YEAR: "app.api.shared.stats.dateRange.thisYear",
    LAST_YEAR: "app.api.shared.stats.dateRange.lastYear",
    CUSTOM: "app.api.shared.stats.dateRange.custom",
  });

/**
 * Chart Type Enum
 * Different chart visualization types
 */
export const { enum: ChartType, options: ChartTypeOptions } = createEnumOptions(
  {
    LINE: "app.api.shared.stats.chartType.line",
    BAR: "app.api.shared.stats.chartType.bar",
    AREA: "app.api.shared.stats.chartType.area",
    PIE: "app.api.shared.stats.chartType.pie",
    DONUT: "app.api.shared.stats.chartType.donut",
  },
);

/**
 * Historical Data Point Schema
 * Structure for time-series data points
 */
export const historicalDataPointSchema = z.object({
  date: dateSchema,
  value: z.number(),
  label: z.string().optional() as z.ZodType<TranslationKey | undefined>,
  metadata: z
    .record(
      z.string(),
      z.union([
        z.string() as z.ZodType<TranslationKey>,
        z.number(),
        z.boolean(),
      ]),
    )
    .optional(),
});

export type HistoricalDataPointType = z.infer<typeof historicalDataPointSchema>;
