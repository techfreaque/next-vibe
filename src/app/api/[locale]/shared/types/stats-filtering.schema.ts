/**
 * Shared Stats Filtering Schemas and Enums
 * Reusable filtering infrastructure for stats endpoints
 * @deprecated This file should no longer be used and will be removed in the future.
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import type { Countries, Languages } from "@/i18n/core/config";
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
 * Base Stats Filter Schema
 * Common filtering options for all stats endpoints
 */
export const baseStatsFilterSchema = z.object({
  // Time-based filtering
  timePeriod: z.nativeEnum(TimePeriod).default(TimePeriod.DAY),
  dateRangePreset: z
    .nativeEnum(DateRangePreset)
    .default(DateRangePreset.LAST_30_DAYS),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),

  // Chart configuration
  chartType: z.nativeEnum(ChartType).default(ChartType.LINE),

  // Data options
  includeComparison: z.coerce.boolean().default(false),
  comparisonPeriod: z.nativeEnum(DateRangePreset).optional(),
});

export type BaseStatsFilterType = z.infer<typeof baseStatsFilterSchema>;

/**
 * Historical Data Point Schema
 * Structure for time-series data points
 */
export const historicalDataPointSchema = z.object({
  date: dateSchema,
  value: z.number(),
  label: z.string().optional() as z.ZodType<TranslationKey | undefined>,
  labelParams: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});

export type HistoricalDataPointType = z.infer<typeof historicalDataPointSchema>;

/**
 * Historical Data Series Schema
 * Structure for a complete data series
 */
export const historicalDataSeriesSchema = z.object({
  name: z.string() as z.ZodType<TranslationKey>,
  nameParams: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .optional(),
  data: z.array(historicalDataPointSchema),
  color: z.string().optional(),
  type: z.nativeEnum(ChartType).optional(),
});

export type HistoricalDataSeriesType = z.infer<
  typeof historicalDataSeriesSchema
>;

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
 * Current period stats schema for summary numbers
 */
export const currentPeriodStatsSchema = z.object({
  // Core metrics
  totalCount: z.number().describe("Total count for the current period"),
  newCount: z.number().describe("New items in the current period"),
  activeCount: z.number().describe("Active items in the current period"),

  // Engagement metrics (for emails/campaigns)
  totalSent: z.number().optional().describe("Total emails sent"),
  totalOpened: z.number().optional().describe("Total emails opened"),
  totalClicked: z.number().optional().describe("Total emails clicked"),
  totalBounced: z.number().optional().describe("Total emails bounced"),
  totalUnsubscribed: z.number().optional().describe("Total unsubscribed"),

  // Conversion metrics (for leads)
  totalSignedUp: z.number().optional().describe("Total leads signed up"),
  totalConsultationBooked: z
    .number()
    .optional()
    .describe("Total consultations booked"),
  totalConverted: z.number().optional().describe("Total converted leads"),

  // Rate calculations
  openRate: z.number().optional().describe("Email open rate (0-1)"),
  clickRate: z.number().optional().describe("Email click rate (0-1)"),
  bounceRate: z.number().optional().describe("Email bounce rate (0-1)"),
  unsubscribeRate: z
    .number()
    .optional()
    .describe("Email unsubscribe rate (0-1)"),
  conversionRate: z.number().optional().describe("Lead conversion rate (0-1)"),
  signupRate: z.number().optional().describe("Lead signup rate (0-1)"),
  consultationBookingRate: z
    .number()
    .optional()
    .describe("Consultation booking rate (0-1)"),

  // Distribution data
  // Generic string keys - specific implementations should override with proper enum types
  byType: z
    .record(z.string(), z.number())
    .optional()
    .describe("Distribution by type"),
  byStatus: z
    .record(z.string(), z.number())
    .optional()
    .describe("Distribution by status"),
  bySource: z
    .record(z.string(), z.number())
    .optional()
    .describe("Distribution by source"),
  // Proper enum types for country and language
  byCountry: z
    .record(z.custom<Countries>(), z.number())
    .optional()
    .describe("Distribution by country"),
  byLanguage: z
    .record(z.custom<Languages>(), z.number())
    .optional()
    .describe("Distribution by language"),

  // Time-based metrics
  todayCount: z.number().optional().describe("Count for today"),
  thisWeekCount: z.number().optional().describe("Count for this week"),
  thisMonthCount: z.number().optional().describe("Count for this month"),
  lastMonthCount: z.number().optional().describe("Count for last month"),

  // Top performers
  topPerforming: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe("Top performing items"),
  recentActivity: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe("Recent activity"),
});

export type CurrentPeriodStatsType = z.infer<typeof currentPeriodStatsSchema>;

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

/**
 * Get time period format string for SQL GROUP BY
 */
export function getTimePeriodFormat(period: TimePeriod): string {
  switch (period) {
    case TimePeriod.HOUR:
      return "DATE_TRUNC('hour', created_at)";
    case TimePeriod.DAY:
      return "DATE(created_at)";
    case TimePeriod.WEEK:
      return "DATE_TRUNC('week', created_at)";
    case TimePeriod.MONTH:
      return "DATE_TRUNC('month', created_at)";
    case TimePeriod.QUARTER:
      return "DATE_TRUNC('quarter', created_at)";
    case TimePeriod.YEAR:
      return "DATE_TRUNC('year', created_at)";
    default:
      return "DATE(created_at)";
  }
}
