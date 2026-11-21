/**
 * Analytics window resolution (pure, client + server safe).
 *
 * All buckets are UTC calendar buckets keyed by their start date
 * (`YYYY-MM-DD`). Weeks start on Monday (ISO, matches Postgres date_trunc).
 */

import {
  type AnalyticsBucket,
  AnalyticsGranularity,
  type AnalyticsGranularityValue,
  AnalyticsRange,
  type AnalyticsRangeValue,
} from "./enum";

export interface AnalyticsWindowInput {
  range?: AnalyticsRangeValue;
  from?: string;
  to?: string;
  granularity?: AnalyticsGranularityValue;
}

export interface AnalyticsWindow {
  /** Inclusive start (UTC midnight of the first day). */
  from: Date;
  /** Exclusive end (UTC midnight after the last day, or now). */
  to: Date;
  /** Same-length window directly before `from`. Null for all-time. */
  previousFrom: Date | null;
  previousTo: Date | null;
  bucket: AnalyticsBucket;
  /** Bucket start keys covering [from, to), oldest first. */
  buckets: string[];
  range: AnalyticsRangeValue;
}

const DAY_MS = 86_400_000;
/** Earliest date used for all-time windows when no data floor is given. */
const ALL_TIME_FLOOR = "2025-01-01";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function utcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function parseDay(value: string | undefined): Date | null {
  if (!value || !DATE_RE.test(value)) {
    return null;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Start of the bucket that contains `date`. */
export function bucketStart(date: Date, bucket: AnalyticsBucket): Date {
  const day = utcDay(date);
  if (bucket === "day") {
    return day;
  }
  if (bucket === "week") {
    const weekday = (day.getUTCDay() + 6) % 7; // Monday = 0
    return new Date(day.getTime() - weekday * DAY_MS);
  }
  return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 1));
}

export function nextBucket(date: Date, bucket: AnalyticsBucket): Date {
  if (bucket === "day") {
    return new Date(date.getTime() + DAY_MS);
  }
  if (bucket === "week") {
    return new Date(date.getTime() + 7 * DAY_MS);
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

export function bucketKey(date: Date, bucket: AnalyticsBucket): string {
  return toDayKey(bucketStart(date, bucket));
}

function autoBucket(from: Date, to: Date): AnalyticsBucket {
  const days = (to.getTime() - from.getTime()) / DAY_MS;
  if (days <= 62) {
    return "day";
  }
  if (days <= 400) {
    return "week";
  }
  return "month";
}

function resolveBucket(
  granularity: AnalyticsGranularityValue | undefined,
  from: Date,
  to: Date,
): AnalyticsBucket {
  switch (granularity) {
    case AnalyticsGranularity.DAY:
      return "day";
    case AnalyticsGranularity.WEEK:
      return "week";
    case AnalyticsGranularity.MONTH:
      return "month";
    default:
      return autoBucket(from, to);
  }
}

export function listBuckets(
  from: Date,
  to: Date,
  bucket: AnalyticsBucket,
): string[] {
  const keys: string[] = [];
  let cursor = bucketStart(from, bucket);
  // Hard cap protects against absurd custom windows with day buckets.
  while (cursor.getTime() < to.getTime() && keys.length < 1500) {
    keys.push(toDayKey(cursor));
    cursor = nextBucket(cursor, bucket);
  }
  return keys;
}

/**
 * Resolve a request window. `dataFloor` (earliest record) bounds all-time
 * windows so charts do not start years before the first row.
 */
export function resolveAnalyticsWindow(
  input: AnalyticsWindowInput,
  now: Date = new Date(),
  dataFloor?: Date | null,
): AnalyticsWindow {
  const range = input.range ?? AnalyticsRange.LAST_30_DAYS;
  const tomorrow = new Date(utcDay(now).getTime() + DAY_MS);
  let from: Date;
  let to: Date = tomorrow;

  switch (range) {
    case AnalyticsRange.LAST_7_DAYS:
      from = new Date(tomorrow.getTime() - 7 * DAY_MS);
      break;
    case AnalyticsRange.LAST_90_DAYS:
      from = new Date(tomorrow.getTime() - 90 * DAY_MS);
      break;
    case AnalyticsRange.LAST_6_MONTHS:
      from = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth() - 6,
          now.getUTCDate() + 1,
        ),
      );
      break;
    case AnalyticsRange.LAST_12_MONTHS:
      from = new Date(
        Date.UTC(
          now.getUTCFullYear() - 1,
          now.getUTCMonth(),
          now.getUTCDate() + 1,
        ),
      );
      break;
    case AnalyticsRange.ALL_TIME:
      from = dataFloor
        ? utcDay(dataFloor)
        : (parseDay(ALL_TIME_FLOOR) ?? utcDay(now));
      break;
    case AnalyticsRange.CUSTOM: {
      const customFrom = parseDay(input.from);
      const customTo = parseDay(input.to);
      to = customTo ? new Date(customTo.getTime() + DAY_MS) : tomorrow;
      from = customFrom ?? new Date(to.getTime() - 30 * DAY_MS);
      if (from.getTime() >= to.getTime()) {
        from = new Date(to.getTime() - DAY_MS);
      }
      break;
    }
    default:
      from = new Date(tomorrow.getTime() - 30 * DAY_MS);
  }

  const bucket = resolveBucket(input.granularity, from, to);
  const length = to.getTime() - from.getTime();
  const hasPrevious = range !== AnalyticsRange.ALL_TIME;

  return {
    from,
    to,
    previousFrom: hasPrevious ? new Date(from.getTime() - length) : null,
    previousTo: hasPrevious ? from : null,
    bucket,
    buckets: listBuckets(from, to, bucket),
    range,
  };
}

/** Map sparse `{bucket, value}` rows onto the full bucket list (missing = 0). */
export function fillBuckets(
  buckets: readonly string[],
  rows: ReadonlyArray<{ bucket: string; value: number }>,
): number[] {
  const byKey = new Map<string, number>();
  for (const row of rows) {
    byKey.set(row.bucket, (byKey.get(row.bucket) ?? 0) + row.value);
  }
  return buckets.map((key) => byKey.get(key) ?? 0);
}

/** Relative change; null when there is no comparable previous value. */
export function percentChange(
  current: number,
  previous: number | null | undefined,
): number | null {
  if (previous === null || previous === undefined) {
    return null;
  }
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return (current - previous) / Math.abs(previous);
}

/** Serializable window echo for responses (lets widgets and CLI label the period). */
export function serializeWindow(win: AnalyticsWindow): {
  from: string;
  to: string;
  previousFrom: string | null;
  previousTo: string | null;
  bucket: AnalyticsBucket;
} {
  return {
    from: toDayKey(win.from),
    to: toDayKey(new Date(win.to.getTime() - DAY_MS)),
    previousFrom: win.previousFrom ? toDayKey(win.previousFrom) : null,
    previousTo: win.previousTo
      ? toDayKey(new Date(win.previousTo.getTime() - DAY_MS))
      : null,
    bucket: win.bucket,
  };
}
