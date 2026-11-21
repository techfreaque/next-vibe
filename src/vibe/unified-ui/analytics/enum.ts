/**
 * Analytics window enums shared by every report endpoint.
 * Values are i18n keys of the analytics scope (see ./i18n). Endpoints that
 * declare `analyticsWindowFields` spread `analyticsTranslations` into their own
 * i18n so these keys resolve in their scope too.
 */

import { createEnumOptions } from "../_shared/enum";
import { scopedTranslation } from "./i18n";

export const { enum: AnalyticsRange, options: AnalyticsRangeOptions } =
  createEnumOptions(scopedTranslation, {
    LAST_7_DAYS: "analytics.range.last7Days",
    LAST_30_DAYS: "analytics.range.last30Days",
    LAST_90_DAYS: "analytics.range.last90Days",
    LAST_6_MONTHS: "analytics.range.last6Months",
    LAST_12_MONTHS: "analytics.range.last12Months",
    ALL_TIME: "analytics.range.allTime",
    CUSTOM: "analytics.range.custom",
  });

export type AnalyticsRangeValue =
  (typeof AnalyticsRange)[keyof typeof AnalyticsRange];

export const AnalyticsRangeDB = [
  AnalyticsRange.LAST_7_DAYS,
  AnalyticsRange.LAST_30_DAYS,
  AnalyticsRange.LAST_90_DAYS,
  AnalyticsRange.LAST_6_MONTHS,
  AnalyticsRange.LAST_12_MONTHS,
  AnalyticsRange.ALL_TIME,
  AnalyticsRange.CUSTOM,
] as const;

export const {
  enum: AnalyticsGranularity,
  options: AnalyticsGranularityOptions,
} = createEnumOptions(scopedTranslation, {
  AUTO: "analytics.granularity.auto",
  DAY: "analytics.granularity.day",
  WEEK: "analytics.granularity.week",
  MONTH: "analytics.granularity.month",
});

export type AnalyticsGranularityValue =
  (typeof AnalyticsGranularity)[keyof typeof AnalyticsGranularity];

export const AnalyticsGranularityDB = [
  AnalyticsGranularity.AUTO,
  AnalyticsGranularity.DAY,
  AnalyticsGranularity.WEEK,
  AnalyticsGranularity.MONTH,
] as const;

/** Resolved bucket size (AUTO is resolved server-side from the window length). */
export type AnalyticsBucket = "day" | "week" | "month";

export const ANALYTICS_BUCKETS = ["day", "week", "month"] as const;

/** Short label key for a preset (segmented control). */
export const ANALYTICS_RANGE_SHORT_KEY = {
  [AnalyticsRange.LAST_7_DAYS]: "analytics.rangeShort.last7Days",
  [AnalyticsRange.LAST_30_DAYS]: "analytics.rangeShort.last30Days",
  [AnalyticsRange.LAST_90_DAYS]: "analytics.rangeShort.last90Days",
  [AnalyticsRange.LAST_6_MONTHS]: "analytics.rangeShort.last6Months",
  [AnalyticsRange.LAST_12_MONTHS]: "analytics.rangeShort.last12Months",
  [AnalyticsRange.ALL_TIME]: "analytics.rangeShort.allTime",
  [AnalyticsRange.CUSTOM]: "analytics.rangeShort.custom",
} as const;

export const ANALYTICS_BUCKET_KEY = {
  day: "analytics.granularity.day",
  week: "analytics.granularity.week",
  month: "analytics.granularity.month",
} as const;
