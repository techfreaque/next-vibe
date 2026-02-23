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
