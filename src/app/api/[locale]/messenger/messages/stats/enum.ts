import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Time Period Enum
 */
export const {
  enum: TimePeriod,
  options: TimePeriodOptions,
  Value: TimePeriodValue,
} = createEnumOptions(scopedTranslation, {
  hour: "get.timePeriod.hour",
  day: "get.timePeriod.day",
  week: "get.timePeriod.week",
  month: "get.timePeriod.month",
  quarter: "get.timePeriod.quarter",
  year: "get.timePeriod.year",
});

export const TimePeriodDB = [
  TimePeriod.hour,
  TimePeriod.day,
  TimePeriod.week,
  TimePeriod.month,
  TimePeriod.quarter,
  TimePeriod.year,
] as const;

/**
 * Date Range Preset Enum
 */
export const {
  enum: DateRangePreset,
  options: DateRangePresetOptions,
  Value: DateRangePresetValue,
} = createEnumOptions(scopedTranslation, {
  today: "dateRange.today",
  yesterday: "dateRange.yesterday",
  last_7_days: "dateRange.last7Days",
  last_30_days: "dateRange.last30Days",
  last_90_days: "dateRange.last90Days",
  this_week: "dateRange.thisWeek",
  last_week: "dateRange.lastWeek",
  this_month: "dateRange.thisMonth",
  last_month: "dateRange.lastMonth",
  this_quarter: "dateRange.thisQuarter",
  last_quarter: "dateRange.lastQuarter",
  this_year: "dateRange.thisYear",
  last_year: "dateRange.lastYear",
  custom: "dateRange.custom",
});

export const DateRangePresetDB = [
  DateRangePreset.today,
  DateRangePreset.yesterday,
  DateRangePreset.last_7_days,
  DateRangePreset.last_30_days,
  DateRangePreset.last_90_days,
  DateRangePreset.this_week,
  DateRangePreset.last_week,
  DateRangePreset.this_month,
  DateRangePreset.last_month,
  DateRangePreset.this_quarter,
  DateRangePreset.last_quarter,
  DateRangePreset.this_year,
  DateRangePreset.last_year,
  DateRangePreset.custom,
] as const;

/**
 * Chart Type Enum
 */
export const {
  enum: ChartType,
  options: ChartTypeOptions,
  Value: ChartTypeValue,
} = createEnumOptions(scopedTranslation, {
  line: "get.chartType.line",
  bar: "get.chartType.bar",
  area: "get.chartType.area",
  pie: "get.chartType.pie",
  donut: "get.chartType.donut",
});

export const ChartTypeDB = [
  ChartType.line,
  ChartType.bar,
  ChartType.area,
  ChartType.pie,
  ChartType.donut,
] as const;

/**
 * Get date range from preset value
 */
export function getDateRangeFromPreset(
  preset: (typeof DateRangePreset)[keyof typeof DateRangePreset],
): { from: Date; to: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const DAY = 24 * 60 * 60 * 1000;

  switch (preset) {
    case DateRangePreset.today:
      return { from: today, to: new Date(today.getTime() + DAY - 1) };
    case DateRangePreset.yesterday: {
      const yesterday = new Date(today.getTime() - DAY);
      return { from: yesterday, to: new Date(yesterday.getTime() + DAY - 1) };
    }
    case DateRangePreset.last_7_days:
      return { from: new Date(today.getTime() - 7 * DAY), to: now };
    case DateRangePreset.last_30_days:
      return { from: new Date(today.getTime() - 30 * DAY), to: now };
    case DateRangePreset.last_90_days:
      return { from: new Date(today.getTime() - 90 * DAY), to: now };
    case DateRangePreset.this_week: {
      const day = today.getDay();
      const monday = new Date(today.getTime() - day * DAY);
      return { from: monday, to: now };
    }
    case DateRangePreset.last_week: {
      const day = today.getDay();
      const thisMonday = new Date(today.getTime() - day * DAY);
      const lastMonday = new Date(thisMonday.getTime() - 7 * DAY);
      return {
        from: lastMonday,
        to: new Date(thisMonday.getTime() - 1),
      };
    }
    case DateRangePreset.this_month: {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: firstOfMonth, to: now };
    }
    case DateRangePreset.last_month: {
      const firstOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        from: firstOfLastMonth,
        to: new Date(firstOfThisMonth.getTime() - 1),
      };
    }
    case DateRangePreset.this_quarter: {
      const quarter = Math.floor(now.getMonth() / 3);
      const firstOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
      return { from: firstOfQuarter, to: now };
    }
    case DateRangePreset.last_quarter: {
      const quarter = Math.floor(now.getMonth() / 3);
      const firstOfLastQuarter = new Date(
        now.getFullYear(),
        (quarter - 1) * 3,
        1,
      );
      const firstOfThisQuarter = new Date(now.getFullYear(), quarter * 3, 1);
      return {
        from: firstOfLastQuarter,
        to: new Date(firstOfThisQuarter.getTime() - 1),
      };
    }
    case DateRangePreset.this_year: {
      const firstOfYear = new Date(now.getFullYear(), 0, 1);
      return { from: firstOfYear, to: now };
    }
    case DateRangePreset.last_year: {
      const firstOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
      const firstOfThisYear = new Date(now.getFullYear(), 0, 1);
      return {
        from: firstOfLastYear,
        to: new Date(firstOfThisYear.getTime() - 1),
      };
    }
    default:
      return { from: new Date(today.getTime() - 30 * DAY), to: now };
  }
}
