/**
 * Payments Failed - Repository
 * Server-only. DB access.
 * Count of failed payment transactions per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionBucketExpr } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { paymentTransactions } from "../../db";
import { PaymentStatus } from "../../enum";

export class QueryPaymentsFailedRepository {
  static async queryPaymentsFailed(data: {
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
          eq(paymentTransactions.status, PaymentStatus.FAILED),
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
