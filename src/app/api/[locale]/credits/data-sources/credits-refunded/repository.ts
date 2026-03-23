/**
 * Credits Refunded - Repository
 * Server-only. DB access.
 * Sum of REFUND transaction amounts per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionBucketExpr } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { creditTransactions } from "../../db";
import { CreditTransactionType } from "../../enum";

export class QueryCreditsRefundedRepository {
  static async queryCreditsRefunded(data: {
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
          creditTransactions.createdAt,
        ).as("bucket"),
        total: sum(creditTransactions.amount),
      })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.type, CreditTransactionType.REFUND),
          gte(creditTransactions.createdAt, range.from),
          lte(creditTransactions.createdAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.bucket),
        value: Number(r.total ?? 0),
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
