/**
 * Credits Wallets Total - Repository
 * Server-only. DB access.
 * Credit wallets in existence at the end of each bucket (users + guest leads):
 * wallets created before the first bucket plus a running count per bucket.
 */

import "server-only";

import { and, count, gte, lt, lte, sql } from "drizzle-orm";
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

import { creditWallets } from "../../db";

export class QueryCreditsWalletsTotalRepository {
  static async queryCreditsWalletsTotal(data: {
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
    const firstBucket =
      fillGaps([], range, resolution)[0]?.timestamp ?? range.from;

    const [baselineRows, createdRows] = await Promise.all([
      db
        .select({ total: count() })
        .from(creditWallets)
        .where(lt(creditWallets.createdAt, firstBucket)),
      db
        .select({
          bucket: resolutionBucketExpr(resolution, creditWallets.createdAt).as(
            "bucket",
          ),
          total: count(),
        })
        .from(creditWallets)
        .where(
          and(
            gte(creditWallets.createdAt, firstBucket),
            lte(creditWallets.createdAt, range.to),
          ),
        )
        .groupBy(sql`1`)
        .orderBy(sql`1`),
    ]);

    let running = Number(baselineRows[0]?.total ?? 0);
    const result = fillGaps(
      createdRows.map((r): DataPoint => ({
        timestamp: new Date(r.bucket),
        value: Number(r.total ?? 0),
      })),
      range,
      resolution,
    ).map((p): DataPoint => {
      running += p.value;
      return { timestamp: p.timestamp, value: running };
    });

    return success({
      result,
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
