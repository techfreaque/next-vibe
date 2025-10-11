/**
 * Admin Stats enums
 * Defines the enums used in the consultation admin stats module
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Date Range Preset Enum - predefined date ranges for filtering
 */
export const {
  enum: DateRangePreset,
  options: DateRangePresetOptions,
  Value: DateRangePresetValue,
} = createEnumOptions({
  TODAY: "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.today",
  YESTERDAY:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.yesterday",
  LAST_7_DAYS:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.last7Days",
  LAST_30_DAYS:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.last30Days",
  LAST_90_DAYS:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.last90Days",
  THIS_WEEK:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.thisWeek",
  LAST_WEEK:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.lastWeek",
  THIS_MONTH:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.thisMonth",
  LAST_MONTH:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.lastMonth",
  THIS_QUARTER:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.thisQuarter",
  LAST_QUARTER:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.lastQuarter",
  THIS_YEAR:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.thisYear",
  LAST_YEAR:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.lastYear",
  CUSTOM:
    "app.api.v1.core.consultation.admin.stats.enums.dateRangePreset.custom",
});

/**
 * Time Period Enum - granularity for time-based data aggregation
 */
export const {
  enum: TimePeriod,
  options: TimePeriodOptions,
  Value: TimePeriodValue,
} = createEnumOptions({
  HOUR: "app.api.v1.core.consultation.admin.stats.enums.timePeriod.hour",
  DAY: "app.api.v1.core.consultation.admin.stats.enums.timePeriod.day",
  WEEK: "app.api.v1.core.consultation.admin.stats.enums.timePeriod.week",
  MONTH: "app.api.v1.core.consultation.admin.stats.enums.timePeriod.month",
  QUARTER: "app.api.v1.core.consultation.admin.stats.enums.timePeriod.quarter",
  YEAR: "app.api.v1.core.consultation.admin.stats.enums.timePeriod.year",
});

/**
 * Chart Data Field Enum - fields available for chart data visualization
 */
export const {
  enum: ChartDataField,
  options: ChartDataFieldOptions,
  Value: ChartDataFieldValue,
} = createEnumOptions({
  COUNT: "app.api.v1.core.consultation.admin.stats.enums.chartDataField.count",
  COMPLETED:
    "app.api.v1.core.consultation.admin.stats.enums.chartDataField.completed",
  CANCELLED:
    "app.api.v1.core.consultation.admin.stats.enums.chartDataField.cancelled",
  NO_SHOW:
    "app.api.v1.core.consultation.admin.stats.enums.chartDataField.noShow",
});

/**
 * Chart Type Enum - visualization types for data display
 */
export const {
  enum: ChartType,
  options: ChartTypeOptions,
  Value: ChartTypeValue,
} = createEnumOptions({
  LINE: "app.api.v1.core.consultation.admin.stats.enums.chartType.line",
  BAR: "app.api.v1.core.consultation.admin.stats.enums.chartType.bar",
  AREA: "app.api.v1.core.consultation.admin.stats.enums.chartType.area",
  PIE: "app.api.v1.core.consultation.admin.stats.enums.chartType.pie",
  DONUT: "app.api.v1.core.consultation.admin.stats.enums.chartType.donut",
});

/**
 * Group By Field Enum - fields available for data grouping
 */
export const {
  enum: GroupByField,
  options: GroupByFieldOptions,
  Value: GroupByFieldValue,
} = createEnumOptions({
  STATUS: "app.api.v1.core.consultation.admin.stats.get.groupBy.options.status",
  OUTCOME:
    "app.api.v1.core.consultation.admin.stats.get.groupBy.options.outcome",
  TYPE: "app.api.v1.core.consultation.admin.stats.get.groupBy.options.type",
  CONSULTANT:
    "app.api.v1.core.consultation.admin.stats.get.groupBy.options.consultant",
  DATE: "app.api.v1.core.consultation.admin.stats.get.groupBy.options.date",
});
