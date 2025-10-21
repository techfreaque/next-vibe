/**
 * Shared Stats Filtering Schemas and Enums
 * Reusable filtering infrastructure for stats endpoints
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";
import type { TranslationKey } from "@/i18n/core/static-types";

/**
 * Time Period Enum
 * Defines different time periods for historical data aggregation
 */
export const { enum: TimePeriod, options: TimePeriodOptions } =
  createEnumOptions({
    DAY: "shared.stats.timePeriod.day",
    WEEK: "shared.stats.timePeriod.week",
    MONTH: "shared.stats.timePeriod.month",
    QUARTER: "shared.stats.timePeriod.quarter",
    YEAR: "shared.stats.timePeriod.year",
  });

/**
 * Date Range Preset Enum
 * Common date range presets for quick filtering
 */
export const { enum: DateRangePreset, options: DateRangePresetOptions } =
  createEnumOptions({
    TODAY: "shared.stats.dateRange.today",
    YESTERDAY: "shared.stats.dateRange.yesterday",
    LAST_7_DAYS: "shared.stats.dateRange.last7Days",
    LAST_30_DAYS: "shared.stats.dateRange.last30Days",
    LAST_90_DAYS: "shared.stats.dateRange.last90Days",
    THIS_WEEK: "shared.stats.dateRange.thisWeek",
    LAST_WEEK: "shared.stats.dateRange.lastWeek",
    THIS_MONTH: "shared.stats.dateRange.thisMonth",
    LAST_MONTH: "shared.stats.dateRange.lastMonth",
    THIS_QUARTER: "shared.stats.dateRange.thisQuarter",
    LAST_QUARTER: "shared.stats.dateRange.lastQuarter",
    THIS_YEAR: "shared.stats.dateRange.thisYear",
    LAST_YEAR: "shared.stats.dateRange.lastYear",
    CUSTOM: "shared.stats.dateRange.custom",
  });

/**
 * Chart Type Enum
 * Different chart visualization types
 */
export const { enum: ChartType, options: ChartTypeOptions } = createEnumOptions(
  {
    LINE: "shared.stats.chartType.line",
    BAR: "shared.stats.chartType.bar",
    AREA: "shared.stats.chartType.area",
    PIE: "shared.stats.chartType.pie",
    DONUT: "shared.stats.chartType.donut",
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
