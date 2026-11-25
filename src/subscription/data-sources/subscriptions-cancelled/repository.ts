/**
 * Subscriptions Cancelled - Repository
 * Server-only. DB access.
 * Cancellations REQUESTED per bucket (canceled_at): the user or Stripe
 * cancelled, access may run until the period ends (see churned). Incomplete
 * checkouts and admin accounts excluded.
 */

import "server-only";

import { sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import { resolutionBucketExpr } from "next-vibe/dataflow/shared/query-utils";
import { fillGaps } from "next-vibe/dataflow/shared/range";
import type { QueryResultRow } from "pg";

import { COUNTED_SUBSCRIPTION_SQL, tzSql } from "../../series-sql";

export class QuerySubscriptionsCancelledRepository {
  static async querySubscriptionsCancelled(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const result = await db.execute<
      QueryResultRow & { bucket: string; value: string | number }
    >(sql`
      SELECT ${resolutionBucketExpr(resolution, sql`s.canceled_at`)} AS bucket,
        count(*) AS value
      FROM subscriptions s
      WHERE ${COUNTED_SUBSCRIPTION_SQL}
        AND s.canceled_at >= ${tzSql(range.from)}
        AND s.canceled_at <= ${tzSql(range.to)}
      GROUP BY 1 ORDER BY 1`);

    const raw = result.rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.value),
    }));
    return success({
      result: fillGaps(raw, range, resolution),
      meta: {
        actualResolution: resolution,
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
