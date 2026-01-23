/**
 * Shared Stats Filtering Schemas and Enums
 * Reusable filtering infrastructure for stats endpoints
 * @deprecated This file should no longer be used and will be removed in the future.
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

// Re-export dateSchema for consistency
export { dateSchema };

/**
 * Time Period Enum
 * Defines different time periods for historical data aggregation
 */
export enum TimePeriod {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  YEAR = "year",
}

/**
 * Date Range Preset Enum
 * Common date range presets for quick filtering
 */
export enum DateRangePreset {
  TODAY = "today",
  YESTERDAY = "yesterday",
  LAST_7_DAYS = "last_7_days",
  LAST_30_DAYS = "last_30_days",
  LAST_90_DAYS = "last_90_days",
  THIS_WEEK = "this_week",
  LAST_WEEK = "last_week",
  THIS_MONTH = "this_month",
  LAST_MONTH = "last_month",
  THIS_QUARTER = "this_quarter",
  LAST_QUARTER = "last_quarter",
  THIS_YEAR = "this_year",
  LAST_YEAR = "last_year",
  CUSTOM = "custom",
}

/**
 * Chart Type Enum
 * Different chart visualization types
 */
export enum ChartType {
  LINE = "line",
  BAR = "bar",
  AREA = "area",
  PIE = "pie",
  DONUT = "donut",
}

/**
 * Historical Data Point Schema
 * Structure for time-series data points
 */
const historicalDataPointSchema = z.object({
  date: dateSchema,
  value: z.coerce.number(),
  label: z.string().optional() as z.ZodType<TranslationKey | undefined>,
  labelParams: z
    .record(z.string(), z.union([z.string(), z.coerce.number()]))
    .optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.coerce.number(), z.boolean()]))
    .optional(),
});

export type HistoricalDataPointType = z.infer<typeof historicalDataPointSchema>;

/**
 * Historical Data Series Schema
 * Structure for a complete data series
 */
const historicalDataSeriesSchema = z.object({
  name: z.string() as z.ZodType<TranslationKey>,
  nameParams: z
    .record(z.string(), z.union([z.string(), z.coerce.number()]))
    .optional(),
  data: z.array(historicalDataPointSchema),
  color: z.string().optional(),
  type: z.enum(ChartType).optional(),
});

/**
 * Chart Data Schema
 * Complete chart data structure
 */
export const chartDataSchema = z.object({
  series: z.array(historicalDataSeriesSchema),
  categories: z.array(z.string()).optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  yAxisLabel: z.string().optional(),
  xAxisLabel: z.string().optional(),
});

export type ChartDataType = z.infer<typeof chartDataSchema>;

/**
 * Date Range Calculation Utilities
 */

/**
 * Calculate date range from preset
 */
export function getDateRangeFromPreset(preset: DateRangePreset): {
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
    case DateRangePreset.THIS_MONTH: {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: startOfMonth, to: now };
    }
    case DateRangePreset.LAST_MONTH: {
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      lastMonthEnd.setHours(23, 59, 59, 999);
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
      );
      lastQuarterEnd.setHours(23, 59, 59, 999);
      return { from: lastQuarterStart, to: lastQuarterEnd };
    }

    case DateRangePreset.THIS_YEAR: {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return { from: startOfYear, to: now };
    }

    case DateRangePreset.LAST_YEAR: {
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(
        today.getFullYear() - 1,
        11,
        31,
        23,
        59,
        59,
        999,
      );
      return { from: lastYearStart, to: lastYearEnd };
    }
    default:
      return {
        from: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: now,
      };
  }
}
