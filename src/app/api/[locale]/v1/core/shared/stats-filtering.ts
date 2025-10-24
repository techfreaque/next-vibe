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
    DAY: "app.api.v1.core.shared.stats.timePeriod.day",
    WEEK: "app.api.v1.core.shared.stats.timePeriod.week",
    MONTH: "app.api.v1.core.shared.stats.timePeriod.month",
    QUARTER: "app.api.v1.core.shared.stats.timePeriod.quarter",
    YEAR: "app.api.v1.core.shared.stats.timePeriod.year",
  });

/**
 * Date Range Preset Enum
 * Common date range presets for quick filtering
 */
export const { enum: DateRangePreset, options: DateRangePresetOptions } =
  createEnumOptions({
    TODAY: "app.api.v1.core.shared.stats.dateRange.today",
    YESTERDAY: "app.api.v1.core.shared.stats.dateRange.yesterday",
    LAST_7_DAYS: "app.api.v1.core.shared.stats.dateRange.last7Days",
    LAST_30_DAYS: "app.api.v1.core.shared.stats.dateRange.last30Days",
    LAST_90_DAYS: "app.api.v1.core.shared.stats.dateRange.last90Days",
    THIS_WEEK: "app.api.v1.core.shared.stats.dateRange.thisWeek",
    LAST_WEEK: "app.api.v1.core.shared.stats.dateRange.lastWeek",
    THIS_MONTH: "app.api.v1.core.shared.stats.dateRange.thisMonth",
    LAST_MONTH: "app.api.v1.core.shared.stats.dateRange.lastMonth",
    THIS_QUARTER: "app.api.v1.core.shared.stats.dateRange.thisQuarter",
    LAST_QUARTER: "app.api.v1.core.shared.stats.dateRange.lastQuarter",
    THIS_YEAR: "app.api.v1.core.shared.stats.dateRange.thisYear",
    LAST_YEAR: "app.api.v1.core.shared.stats.dateRange.lastYear",
    CUSTOM: "app.api.v1.core.shared.stats.dateRange.custom",
  });

/**
 * Chart Type Enum
 * Different chart visualization types
 */
export const { enum: ChartType, options: ChartTypeOptions } = createEnumOptions(
  {
    LINE: "app.api.v1.core.shared.stats.chartType.line",
    BAR: "app.api.v1.core.shared.stats.chartType.bar",
    AREA: "app.api.v1.core.shared.stats.chartType.area",
    PIE: "app.api.v1.core.shared.stats.chartType.pie",
    DONUT: "app.api.v1.core.shared.stats.chartType.donut",
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
