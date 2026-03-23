/**
 * Credits Avg Transaction - Repository
 * Server-only. DB access.
 * Average credit transaction amount per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, avg, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionBucketExpr } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { creditTransactions } from "../../db";

export class QueryCreditsAvgTransactionRepository {
  static async queryCreditsAvgTransaction(data: {
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
        average: avg(creditTransactions.amount),
      })
      .from(creditTransactions)
      .where(
        and(
          gte(creditTransactions.createdAt, range.from),
          lte(creditTransactions.createdAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.bucket),
        value: Math.abs(Number(r.average ?? 0)),
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
