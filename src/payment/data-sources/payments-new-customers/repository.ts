/**
 * Payments New Customers - Repository
 * Server-only. DB access.
 * Distinct users whose FIRST collected payment ever (pack or subscription)
 * falls in the bucket. Same paid definition as the revenue series; admin
 * accounts and zero-amount rows excluded.
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
  notInternalUserSql,
  paidStatusSql,
  utcTs,
} from "../../analytics/money-sql";
import { CheckoutMode } from "../../enum";

export class QueryPaymentsNewCustomersRepository {
  static async queryPaymentsNewCustomers(data: {
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
      QueryResultRow & { bucket: string; customers: string | number }
    >(sql`
      SELECT ${resolutionBucketExpr(resolution, sql`f.first_at`)} AS bucket,
        count(*) AS customers
      FROM (
        SELECT pt.user_id, min(pt.created_at) AS first_at
        FROM payment_transactions pt
        WHERE ${paidStatusSql("pt")}
          AND pt.mode <> ${CheckoutMode.SETUP}
          AND pt.amount > 0
          AND pt.user_id IS NOT NULL
          AND ${notInternalUserSql("pt.user_id")}
        GROUP BY pt.user_id
      ) f
      WHERE f.first_at >= ${utcTs(range.from)}
        AND f.first_at <= ${utcTs(range.to)}
      GROUP BY 1 ORDER BY 1`);

    const raw = result.rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.customers),
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
