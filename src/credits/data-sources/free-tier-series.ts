/**
 * Free-tier analytics series helpers (pure, no DB).
 *
 * Shared by credits-free-tier-spend and credits-free-pool-utilization.
 *
 * DAY BOUNDARY: the public free-tier cap (PublicCapRepository.todayString) resets at
 * server-LOCAL midnight. The generic Vibe Sense buckets (date_trunc / fillGaps) use the
 * database/UTC day. To make "Free-Tier Spend" per day equal the cap widget's Spent Today,
 * free-tier-spend buckets calendar resolutions (1d / 1w / 1M) on server-local time.
 * Sub-day resolutions are timezone-independent (fixed intervals from a UTC anchor).
 *
 * FREE-TIER SPEND definition: the free portion of every USAGE transaction
 * (credit_transactions.metadata.freeCreditsUsed). This equals what the cap counts for
 * free-tier pools (no paid balance); spend by pools that hold paid credits is excluded.
 */

import { GraphResolution } from "next-vibe/dataflow/enum";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import { RESOLUTION_MS } from "next-vibe/dataflow/shared/fields";

const UTC_ANCHOR_MS = Date.UTC(2000, 0, 1);

/** Start of the bucket containing `date`. Calendar resolutions use server-local time. */
export function bucketStart(date: Date, resolution: Resolution): Date {
  switch (resolution) {
    case GraphResolution.ONE_DAY:
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    case GraphResolution.ONE_WEEK: {
      // ISO week (Monday), local time
      const dayIdx = (date.getDay() + 6) % 7;
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - dayIdx,
      );
    }
    case GraphResolution.ONE_MONTH:
      return new Date(date.getFullYear(), date.getMonth(), 1);
    default: {
      const ms = RESOLUTION_MS[resolution];
      return new Date(
        Math.floor((date.getTime() - UTC_ANCHOR_MS) / ms) * ms + UTC_ANCHOR_MS,
      );
    }
  }
}

/** Start of the bucket following the one that starts at `start`. */
export function nextBucketStart(start: Date, resolution: Resolution): Date {
  switch (resolution) {
    case GraphResolution.ONE_DAY:
      return new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + 1,
      );
    case GraphResolution.ONE_WEEK:
      return new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + 7,
      );
    case GraphResolution.ONE_MONTH:
      return new Date(start.getFullYear(), start.getMonth() + 1, 1);
    default:
      return new Date(start.getTime() + RESOLUTION_MS[resolution]);
  }
}

/** Start of the UTC calendar month containing `date` (free allowance periods are UTC months). */
export function utcMonthStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export interface TimedAmount {
  at: Date;
  amount: number;
}

/**
 * Sum `rows` into gap-filled buckets covering `range`, bucketed with bucketStart().
 */
export function sumIntoBuckets(
  rows: TimedAmount[],
  range: TimeRange,
  resolution: Resolution,
): DataPoint[] {
  const totals = new Map<number, number>();
  for (const row of rows) {
    const key = bucketStart(row.at, resolution).getTime();
    totals.set(key, (totals.get(key) ?? 0) + row.amount);
  }
  const points: DataPoint[] = [];
  let cursor = bucketStart(range.from, resolution);
  while (cursor.getTime() <= range.to.getTime()) {
    points.push({
      timestamp: cursor,
      value: totals.get(cursor.getTime()) ?? 0,
    });
    cursor = nextBucketStart(cursor, resolution);
  }
  return points;
}

/**
 * Month-to-date free allowance utilization per bucket:
 *   consumed(MTD up to bucket end) / granted(MTD up to bucket end), UTC month, resets on the 1st.
 * `consumed` = free portion of USAGE transactions, `granted` = FREE_GRANT transactions.
 * Buckets with nothing granted yet in their month yield 0. Clamped to [0, 1].
 */
export function utilizationSeries({
  consumed,
  granted,
  range,
  resolution,
}: {
  consumed: TimedAmount[];
  granted: TimedAmount[];
  range: TimeRange;
  resolution: Resolution;
}): DataPoint[] {
  const events = [
    ...consumed.map((c) => ({ at: c.at, used: c.amount, grant: 0 })),
    ...granted.map((g) => ({ at: g.at, used: 0, grant: g.amount })),
  ].toSorted((a, b) => a.at.getTime() - b.at.getTime());

  const points: DataPoint[] = [];
  let idx = 0;
  let monthKey = -1;
  let used = 0;
  let grant = 0;
  let cursor = bucketStart(range.from, resolution);
  while (cursor.getTime() <= range.to.getTime()) {
    const end = nextBucketStart(cursor, resolution).getTime();
    while (idx < events.length && events[idx]!.at.getTime() < end) {
      const ev = events[idx]!;
      const evMonth = utcMonthStart(ev.at).getTime();
      if (evMonth !== monthKey) {
        monthKey = evMonth;
        used = 0;
        grant = 0;
      }
      used += ev.used;
      grant += ev.grant;
      idx += 1;
    }
    // Bucket belongs to the month of its last instant; if no event landed in that month yet, 0.
    const bucketMonth = utcMonthStart(new Date(end - 1)).getTime();
    const value =
      bucketMonth === monthKey && grant > 0
        ? Math.min(1, Math.max(0, used / grant))
        : 0;
    points.push({ timestamp: cursor, value });
    cursor = new Date(end);
  }
  return points;
}
