/**
 * Shared Stats Filtering Schemas and Enums
 * Reusable filtering infrastructure for stats endpoints
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { scopedTranslation } from "./i18n";

/**
 * Time Period Enum
 * Defines different time periods for historical data aggregation
 */
export const { enum: TimePeriod, options: TimePeriodOptions } =
  createEnumOptions(scopedTranslation, {
    DAY: "stats.timePeriod.day",
    WEEK: "stats.timePeriod.week",
    MONTH: "stats.timePeriod.month",
    QUARTER: "stats.timePeriod.quarter",
    YEAR: "stats.timePeriod.year",
  });

/**
 * Date Range Preset Enum
 * Common date range presets for quick filtering
 */
export const { enum: DateRangePreset, options: DateRangePresetOptions } =
  createEnumOptions(scopedTranslation, {
    TODAY: "stats.dateRange.today",
    YESTERDAY: "stats.dateRange.yesterday",
    LAST_7_DAYS: "stats.dateRange.last7Days",
    LAST_30_DAYS: "stats.dateRange.last30Days",
    LAST_90_DAYS: "stats.dateRange.last90Days",
    THIS_WEEK: "stats.dateRange.thisWeek",
    LAST_WEEK: "stats.dateRange.lastWeek",
    THIS_MONTH: "stats.dateRange.thisMonth",
    LAST_MONTH: "stats.dateRange.lastMonth",
    THIS_QUARTER: "stats.dateRange.thisQuarter",
    LAST_QUARTER: "stats.dateRange.lastQuarter",
    THIS_YEAR: "stats.dateRange.thisYear",
    LAST_YEAR: "stats.dateRange.lastYear",
    CUSTOM: "stats.dateRange.custom",
  });

/**
 * Chart Type Enum
 * Different chart visualization types
 */
export const { enum: ChartType, options: ChartTypeOptions } = createEnumOptions(
  scopedTranslation,
  {
    LINE: "stats.chartType.line",
    BAR: "stats.chartType.bar",
    AREA: "stats.chartType.area",
    PIE: "stats.chartType.pie",
    DONUT: "stats.chartType.donut",
  },
);

/**
 * Historical Data Point Schema
 * Structure for time-series data points
 */
export const historicalDataPointSchema = z.object({
  date: dateSchema,
  value: z.coerce.number(),
  label: z.string().optional() as z.ZodType<TranslationKey | undefined>,
  metadata: z
    .record(
      z.string(),
      z.union([
        z.string() as z.ZodType<TranslationKey>,
        z.coerce.number(),
        z.boolean(),
      ]),
    )
    .optional(),
});

export type HistoricalDataPointType = z.infer<typeof historicalDataPointSchema>;

/**
 * Calculate date range from preset
 */
export function getDateRangeFromPreset(
  preset: (typeof DateRangePreset)[keyof typeof DateRangePreset],
): {
  from: Date;
  to: Date;
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case DateRangePreset.TODAY:
      return {
        from: today,
        to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    case DateRangePreset.YESTERDAY: {
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return {
        from: yesterday,
        to: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    }
    case DateRangePreset.LAST_7_DAYS:
      return {
        from: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: now,
      };
    case DateRangePreset.LAST_30_DAYS:
      return {
        from: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: now,
      };
    case DateRangePreset.LAST_90_DAYS:
      return {
        from: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
        to: now,
      };
    case DateRangePreset.THIS_WEEK: {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return { from: startOfWeek, to: now };
    }
    case DateRangePreset.LAST_WEEK: {
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      lastWeekEnd.setHours(23, 59, 59, 999);
      return { from: lastWeekStart, to: lastWeekEnd };
    }
    case DateRangePreset.THIS_MONTH:
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: now,
      };
    case DateRangePreset.LAST_MONTH: {
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      const lastMonthEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
        23,
        59,
        59,
        999,
      );
      return { from: lastMonthStart, to: lastMonthEnd };
    }
    case DateRangePreset.THIS_QUARTER: {
      const quarterStart = new Date(
        today.getFullYear(),
        Math.floor(today.getMonth() / 3) * 3,
        1,
      );
      return { from: quarterStart, to: now };
    }
    case DateRangePreset.LAST_QUARTER: {
      const lastQuarterMonth = Math.floor(today.getMonth() / 3) * 3 - 3;
      const lastQuarterStart = new Date(
        today.getFullYear(),
        lastQuarterMonth,
        1,
      );
      if (lastQuarterMonth < 0) {
        lastQuarterStart.setFullYear(today.getFullYear() - 1);
        lastQuarterStart.setMonth(9);
      }
      const lastQuarterEnd = new Date(
        lastQuarterStart.getFullYear(),
        lastQuarterStart.getMonth() + 3,
        0,
        23,
        59,
        59,
        999,
      );
      return { from: lastQuarterStart, to: lastQuarterEnd };
    }
    case DateRangePreset.THIS_YEAR:
      return { from: new Date(today.getFullYear(), 0, 1), to: now };
    case DateRangePreset.LAST_YEAR:
      return {
        from: new Date(today.getFullYear() - 1, 0, 1),
        to: new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
      };
    case DateRangePreset.CUSTOM:
    default:
      return {
        from: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: now,
      };
  }
}
