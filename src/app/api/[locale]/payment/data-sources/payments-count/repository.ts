/**
 * Payments Count - Repository
 * Server-only. DB access.
 * Count of completed payment transactions per resolution bucket.
 */

import "server-only";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import { resolutionBucketExpr } from "next-vibe/dataflow/shared/query-utils";
import { fillGaps } from "next-vibe/dataflow/shared/range";
import { db } from "next-vibe/database";

import { paymentTransactions } from "../../db";
import { PaymentStatus } from "../../enum";

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
    const rows = await db
      .select({
        bucket: resolutionBucketExpr(
          resolution,
          paymentTransactions.createdAt,
        ).as("bucket"),
        cnt: count(),
      })
      .from(paymentTransactions)
      .where(
        and(
          eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
          gte(paymentTransactions.createdAt, range.from),
          lte(paymentTransactions.createdAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.bucket),
        value: Number(r.cnt),
      }),
    );
    const result = fillGaps(raw, range, resolution);
    return success({
      result,
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
