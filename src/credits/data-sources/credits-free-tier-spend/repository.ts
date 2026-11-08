/**
 * Credits Free-Tier Spend - Repository
 * Server-only. DB access.
 * Free credits consumed (USAGE transactions' freeCreditsUsed) per bucket - mirrors the public
 * daily cap's Spent Today. Calendar buckets use server-local midnight (the cap's reset boundary).
 * See ../free-tier-series.ts.
 */

import "server-only";

import { and, eq, gte, lte, sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { GraphResolution } from "next-vibe/dataflow/enum";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";

import { creditTransactions } from "../../db";
import { CreditTransactionType } from "../../enum";
import { bucketStart, sumIntoBuckets } from "../free-tier-series";

const CALENDAR_RESOLUTIONS: Resolution[] = [
  GraphResolution.ONE_DAY,
  GraphResolution.ONE_WEEK,
  GraphResolution.ONE_MONTH,
];

export class QueryCreditsFreeTierSpendRepository {
  static async queryCreditsFreeTierSpend(data: {
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
    // Pre-aggregate in SQL on a fine UTC grid (15 min covers every real-world UTC offset),
    // then re-bucket on the cap's local-time boundaries in JS.
    const bin = CALENDAR_RESOLUTIONS.includes(resolution)
      ? "15 minutes"
      : "1 minute";
    const freeUsed = sql`COALESCE((${creditTransactions.metadata}->>'freeCreditsUsed')::numeric, 0)`;
    const rows = await db
      .select({
        bin: sql<string>`date_bin(${bin}::interval, ${creditTransactions.createdAt}, '2000-01-01')::timestamptz`.as(
          "bin",
        ),
        total: sql<string>`sum(${freeUsed})`,
      })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.type, CreditTransactionType.USAGE),
          gte(
            creditTransactions.createdAt,
            bucketStart(range.from, resolution),
          ),
          lte(creditTransactions.createdAt, range.to),
        ),
      )
      .groupBy(sql`1`);

    const result = sumIntoBuckets(
      rows.map((r) => ({ at: new Date(r.bin), amount: Number(r.total ?? 0) })),
      range,
      resolution,
    );
    return success({
      result,
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
