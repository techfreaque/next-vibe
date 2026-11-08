/**
 * Growth Funnel - pure aggregation helpers.
 *
 * No DB, no IO. Shared by the funnel data sources and the spend report, and
 * unit tested directly.
 */

import { GraphResolution } from "next-vibe/dataflow/enum";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";

import type { FunnelStepValue } from "./enum";
import { FunnelStep } from "./enum";

const MS_PER_DAY = 86_400_000;

/** Funnel order - each step converts from the one before it. */
export const FUNNEL_ORDER: ReadonlyArray<typeof FunnelStepValue> = [
  FunnelStep.VISIT,
  FunnelStep.CHAT,
  FunnelStep.SIGNUP,
  FunnelStep.NEWSLETTER,
  FunnelStep.PAID,
  FunnelStep.RETAINED,
];

/** numerator / denominator, or null when there is nothing to divide by. */
export function rate(numerator: number, denominator: number): number | null {
  if (denominator <= 0) {
    return null;
  }
  return numerator / denominator;
}

/** Cost per unit in cents, or null when nothing was bought. */
export function costPer(amountCents: number, count: number): number | null {
  if (count <= 0) {
    return null;
  }
  return Math.round(amountCents / count);
}

export interface FunnelStepSummary {
  step: typeof FunnelStepValue;
  count: number;
  /** Conversion from the previous step (null for the first step / empty previous) */
  fromPrevious: number | null;
  /** Conversion from the first visit */
  fromVisit: number | null;
}

/**
 * Step-to-step conversion for a set of step counts. Missing steps count as 0.
 */
export function summarizeFunnel(
  counts: Partial<Record<typeof FunnelStepValue, number>>,
): FunnelStepSummary[] {
  const visits = counts[FunnelStep.VISIT] ?? 0;
  return FUNNEL_ORDER.map((step, index) => {
    const count = counts[step] ?? 0;
    const previousStep = index > 0 ? FUNNEL_ORDER[index - 1] : undefined;
    const previous =
      previousStep === undefined ? null : (counts[previousStep] ?? 0);
    return {
      step,
      count,
      fromPrevious: previous === null ? null : rate(count, previous),
      fromVisit: index === 0 ? null : rate(count, visits),
    };
  });
}

/** UTC midnight of the day containing `date`. */
export function utcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/**
 * Bucket timestamp for a UTC day at a resolution. Matches the buckets
 * produced by resolutionBucketExpr / fillGaps: Monday for weeks, the 1st for
 * months; finer resolutions keep the day start (aligned to every sub-day bucket).
 */
export function dayBucket(dayTs: number, resolution: Resolution): number {
  const day = new Date(dayTs);
  if (resolution === GraphResolution.ONE_MONTH) {
    return Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 1);
  }
  if (resolution === GraphResolution.ONE_WEEK) {
    const dayOfWeek = day.getUTCDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return dayTs - daysToMonday * MS_PER_DAY;
  }
  return dayTs;
}

export interface SpendPeriod {
  periodStart: Date;
  periodEnd: Date;
  amountCents: number;
}

/**
 * Spread each spend entry evenly over the days of its period (both ends
 * inclusive), keep the days inside `range`, and sum per bucket.
 * Values are in currency units (cents / 100).
 */
export function distributeSpend(
  periods: readonly SpendPeriod[],
  range: TimeRange,
  resolution: Resolution,
): DataPoint[] {
  const fromDay = utcDay(range.from);
  const toDay = utcDay(range.to);
  const buckets = new Map<number, number>();
  for (const period of periods) {
    const startDay = utcDay(period.periodStart);
    const endDay = utcDay(period.periodEnd);
    if (endDay < startDay) {
      continue;
    }
    const days = (endDay - startDay) / MS_PER_DAY + 1;
    const perDay = period.amountCents / days;
    const first = Math.max(startDay, fromDay);
    const last = Math.min(endDay, toDay);
    for (let ts = first; ts <= last; ts += MS_PER_DAY) {
      const key = dayBucket(ts, resolution);
      buckets.set(key, (buckets.get(key) ?? 0) + perDay);
    }
  }
  return [...buckets.entries()]
    .toSorted(([a], [b]) => a - b)
    .map(([ts, cents]) => ({
      timestamp: new Date(ts),
      value: Math.round(cents) / 100,
    }));
}
