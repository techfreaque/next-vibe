import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Time Period Enum
 */
export const {
  enum: TimePeriod,
  options: TimePeriodOptions,
  Value: TimePeriodValue,
} = createEnumOptions({
  hour: "app.api.emails.messages.stats.get.timePeriod.hour",
  day: "app.api.emails.messages.stats.get.timePeriod.day",
  week: "app.api.emails.messages.stats.get.timePeriod.week",
  month: "app.api.emails.messages.stats.get.timePeriod.month",
  quarter: "app.api.emails.messages.stats.get.timePeriod.quarter",
  year: "app.api.emails.messages.stats.get.timePeriod.year",
});

/**
 * Date Range Preset Enum
 */
export const {
  enum: DateRangePreset,
  options: DateRangePresetOptions,
  Value: DateRangePresetValue,
} = createEnumOptions({
  today: "app.api.emails.messages.stats.dateRange.today",
  yesterday: "app.api.emails.messages.stats.dateRange.yesterday",
  last_7_days: "app.api.emails.messages.stats.dateRange.last7Days",
  last_30_days: "app.api.emails.messages.stats.dateRange.last30Days",
  last_90_days: "app.api.emails.messages.stats.dateRange.last90Days",
  this_week: "app.api.emails.messages.stats.dateRange.thisWeek",
  last_week: "app.api.emails.messages.stats.dateRange.lastWeek",
  this_month: "app.api.emails.messages.stats.dateRange.thisMonth",
  last_month: "app.api.emails.messages.stats.dateRange.lastMonth",
  this_quarter: "app.api.emails.messages.stats.dateRange.thisQuarter",
  last_quarter: "app.api.emails.messages.stats.dateRange.lastQuarter",
  this_year: "app.api.emails.messages.stats.dateRange.thisYear",
  last_year: "app.api.emails.messages.stats.dateRange.lastYear",
  custom: "app.api.emails.messages.stats.dateRange.custom",
});

/**
 * Chart Type Enum
 */
export const {
  enum: ChartType,
  options: ChartTypeOptions,
  Value: ChartTypeValue,
} = createEnumOptions({
  line: "app.api.emails.messages.stats.get.chartType.line",
  bar: "app.api.emails.messages.stats.get.chartType.bar",
  area: "app.api.emails.messages.stats.get.chartType.area",
  pie: "app.api.emails.messages.stats.get.chartType.pie",
  donut: "app.api.emails.messages.stats.get.chartType.donut",
});
