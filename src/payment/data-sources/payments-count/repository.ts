/**
 * Payments Count - Repository
 * Server-only. DB access.
 * Collected payments per bucket (packs, new subscriptions and renewals):
 * succeeded or later-refunded, no setup sessions, no admin accounts.
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

import {
  paidStatusSql,
  REPORTABLE_PAYMENT_SQL,
  reportingUserSql,
  utcTs,
} from "../../analytics/money-sql";
import { CheckoutMode } from "../../enum";

export class QueryPaymentsCountRepository {
  static async queryPaymentsCount(data: {
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
      QueryResultRow & { bucket: string; value: string | number | null }
    >(sql`
      SELECT ${resolutionBucketExpr(resolution, sql`pt.created_at`)} AS bucket,
        count(*) AS value
      FROM payment_transactions pt
      WHERE ${REPORTABLE_PAYMENT_SQL} AND ${paidStatusSql("pt")}
        AND pt.mode <> ${CheckoutMode.SETUP}
        AND ${reportingUserSql("pt.user_id")}
        AND pt.created_at >= ${utcTs(range.from)}
        AND pt.created_at <= ${utcTs(range.to)}
      GROUP BY 1 ORDER BY 1`);

    const raw = result.rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Math.round(Number(r.value ?? 0) * 100) / 100,
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
