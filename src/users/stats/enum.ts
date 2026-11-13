/**
 * Users Stats Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Reporting window. Every KPI is compared to the window of equal length
 * right before it.
 */
export const {
  enum: StatsRange,
  options: StatsRangeOptions,
  Value: StatsRangeValue,
} = createEnumOptions(scopedTranslation, {
  LAST_7_DAYS: "enums.range.last7Days",
  LAST_30_DAYS: "enums.range.last30Days",
  LAST_90_DAYS: "enums.range.last90Days",
  LAST_12_MONTHS: "enums.range.last12Months",
  THIS_MONTH: "enums.range.thisMonth",
  LAST_MONTH: "enums.range.lastMonth",
  ALL_TIME: "enums.range.allTime",
  CUSTOM: "enums.range.custom",
});

/**
 * Chart bucket size. AUTO picks day/week/month from the window length.
 */
export const {
  enum: StatsGranularity,
  options: StatsGranularityOptions,
  Value: StatsGranularityValue,
} = createEnumOptions(scopedTranslation, {
  AUTO: "enums.granularity.auto",
  DAY: "enums.granularity.day",
  WEEK: "enums.granularity.week",
  MONTH: "enums.granularity.month",
});
