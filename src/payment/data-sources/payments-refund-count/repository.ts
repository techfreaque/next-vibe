/**
 * Payments Refund Count - Repository
 * Server-only. DB access.
 * Succeeded refunds per bucket, admin accounts excluded.
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

import { notInternalUserSql, utcTs } from "../../analytics/money-sql";
import { RefundStatus } from "../../enum";

export class QueryPaymentsRefundCountRepository {
  static async queryPaymentsRefundCount(data: {
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
      SELECT ${resolutionBucketExpr(resolution, sql`r.created_at`)} AS bucket,
        count(*) AS value
      FROM payment_refunds r
      WHERE r.status = ${RefundStatus.SUCCEEDED}
        AND ${notInternalUserSql("r.user_id")}
        AND r.created_at >= ${utcTs(range.from)}
        AND r.created_at <= ${utcTs(range.to)}
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
