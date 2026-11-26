/**
 * Subscriptions MRR - Repository
 * Server-only. DB access.
 * Snapshot: monthly recurring revenue in approx. USD at the END of each
 * bucket. Each running subscription is priced by its owner's latest paid
 * subscription payment before that moment; yearly plans count 1/12. Same
 * rule as the Revenue report's MRR. Admin accounts excluded.
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
import type { QueryResultRow } from "pg";

import {
  paidStatusSql,
  paymentKindSql,
  REPORTABLE_PAYMENT_SQL,
  usdSql,
} from "@/payment/analytics/money-sql";

import { BillingInterval } from "../../enum";
import {
  bucketEnds,
  bucketEndsValuesSql,
  COUNTED_SUBSCRIPTION_SQL,
  snapshotPoints,
  SUB_END_SQL,
} from "../../series-sql";

export class QuerySubscriptionsMrrRepository {
  static async querySubscriptionsMrr(data: {
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
    const ends = bucketEnds(range, resolution);
    if (ends.length === 0) {
      return success({
        result: [],
        meta: { actualResolution: resolution, lookbackUsed: lookback ?? 0 },
      });
    }
    const result = await db.execute<
      QueryResultRow & { bucket: string; value: string | number | null }
    >(sql`
      SELECT v.bucket, round(coalesce(sum(CASE WHEN s.billing_interval = ${BillingInterval.YEARLY} OR s.interval = 'year' THEN lp.usd / 12 ELSE lp.usd END), 0), 2) AS value
      FROM ${bucketEndsValuesSql(ends)}
      LEFT JOIN subscriptions s
        ON ${COUNTED_SUBSCRIPTION_SQL}
        AND s.created_at < v.e
        AND (${SUB_END_SQL} IS NULL OR ${SUB_END_SQL} >= v.e)
      LEFT JOIN LATERAL (
        SELECT ${usdSql("pt.amount", "pt.currency")} AS usd
        FROM payment_transactions pt
        WHERE ${REPORTABLE_PAYMENT_SQL} AND s.id IS NOT NULL
          AND pt.user_id = s.user_id
          AND ${paymentKindSql("pt")} IN ('newSubscription', 'renewal')
          AND ${paidStatusSql("pt")}
          AND pt.created_at < (v.e AT TIME ZONE 'UTC')
        ORDER BY pt.created_at DESC
        LIMIT 1
      ) lp ON true
      GROUP BY v.bucket`);

    return success({
      result: snapshotPoints(ends, result.rows),
      meta: {
        actualResolution: resolution,
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
