/**
 * Subscription SQL shared by the subscription data sources (Vibe Sense) and
 * the payment revenue report, so "active", "ended" and "counted" mean the same
 * thing on every surface.
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import { RESOLUTION_MS } from "next-vibe/dataflow/shared/fields";
import { fillGaps } from "next-vibe/dataflow/shared/range";

import { notInternalUserSql } from "@/payment/analytics/money-sql";

import { SubscriptionStatus } from "./enum";

/**
 * When a subscription stopped counting (null = still running). Canceled rows
 * without ended_at fall back to canceled_at, then updated_at. Alias `s`.
 */
export const SUB_END_SQL = sql.raw(
  `COALESCE(s.ended_at, CASE WHEN s.status = '${SubscriptionStatus.CANCELED}' THEN COALESCE(s.canceled_at, s.updated_at) END)`,
);

/**
 * Subscriptions that count in analytics: checkout finished (not incomplete)
 * and not owned by an admin (internal/test) account. Alias `s`.
 */
export const COUNTED_SUBSCRIPTION_SQL: SQL = sql`s.status NOT IN (${SubscriptionStatus.INCOMPLETE}, ${SubscriptionStatus.INCOMPLETE_EXPIRED})
  AND ${notInternalUserSql("s.user_id")}`;

/** Timestamptz literal for a JS date. */
export function tzSql(date: Date): SQL {
  return sql`${date.toISOString()}::timestamptz`;
}

/**
 * Snapshot points for a range: one row per bucket of fillGaps (same aligned
 * timestamps the graph uses), measured at the bucket's end, capped at now.
 */
export function bucketEnds(
  range: TimeRange,
  resolution: Resolution,
): { start: Date; end: Date }[] {
  const starts = fillGaps([], range, resolution).map((p) => p.timestamp);
  const now = Date.now();
  return starts.map((start, index) => {
    const next = starts[index + 1];
    const end = next
      ? next.getTime()
      : start.getTime() + RESOLUTION_MS[resolution];
    return { start, end: new Date(Math.min(end, now)) };
  });
}

/** `(VALUES (start, end), ...) AS v(bucket, e)` for bucketEnds output. */
export function bucketEndsValuesSql(ends: { start: Date; end: Date }[]): SQL {
  return sql`(VALUES ${sql.join(
    ends.map(
      (b) => sql`(${b.start.toISOString()}::timestamptz, ${tzSql(b.end)})`,
    ),
    sql`, `,
  )}) AS v(bucket, e)`;
}

/** Map snapshot rows back onto the bucket timestamps. */
export function snapshotPoints(
  ends: { start: Date; end: Date }[],
  rows: { bucket: string | Date; value: string | number | null }[],
): DataPoint[] {
  const byTs = new Map<number, number>();
  for (const row of rows) {
    byTs.set(new Date(row.bucket).getTime(), Number(row.value ?? 0));
  }
  return ends.map((b) => ({
    timestamp: b.start,
    value: byTs.get(b.start.getTime()) ?? 0,
  }));
}
