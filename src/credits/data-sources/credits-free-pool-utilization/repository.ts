/**
 * Credits Free Pool Utilization - Repository
 * Server-only. DB access.
 *
 * Month-to-date free allowance utilization:
 *   free credits consumed / free credits granted, both since the 1st of the (UTC) month.
 * Independent of the per-wallet tier (guest / account / account + newsletter) because the
 * denominator is what was actually granted (FREE_GRANT transactions), not a fixed constant.
 * Resets on the 1st with the free allowance period. See ../free-tier-series.ts.
 */

import "server-only";

import { and, eq, gte, lte, sql } from "drizzle-orm";
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

import { creditTransactions } from "../../db";
import { CreditTransactionType } from "../../enum";
import {
  bucketStart,
  type TimedAmount,
  utcMonthStart,
  utilizationSeries,
} from "../free-tier-series";

function toTimed(rows: { bin: string; total: string | null }[]): TimedAmount[] {
  return rows.map((r) => ({
    at: new Date(r.bin),
    amount: Number(r.total ?? 0),
  }));
}

export class QueryCreditsFreePoolUtilizationRepository {
  static async queryCreditsFreePoolUtilization(data: {
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
    // Need the whole month before the first bucket for a correct month-to-date baseline.
    const since = new Date(
      Math.min(
        utcMonthStart(range.from).getTime(),
        bucketStart(range.from, resolution).getTime(),
      ),
    );
    const freeUsed = sql`COALESCE((${creditTransactions.metadata}->>'freeCreditsUsed')::numeric, 0)`;

    const [usageRows, grantRows] = await Promise.all([
      db
        .select({
          bin: sql<string>`date_bin('15 minutes'::interval, ${creditTransactions.createdAt}, '2000-01-01')::timestamptz`.as(
            "bin",
          ),
          total: sql<string>`sum(${freeUsed})`,
        })
        .from(creditTransactions)
        .where(
          and(
            eq(creditTransactions.type, CreditTransactionType.USAGE),
            gte(creditTransactions.createdAt, since),
            lte(creditTransactions.createdAt, range.to),
          ),
        )
        .groupBy(sql`1`),
      db
        .select({
          bin: sql<string>`date_bin('15 minutes'::interval, ${creditTransactions.createdAt}, '2000-01-01')::timestamptz`.as(
            "bin",
          ),
          total: sql<string>`sum(${creditTransactions.amount})`,
        })
        .from(creditTransactions)
        .where(
          and(
            eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
            gte(creditTransactions.createdAt, since),
            lte(creditTransactions.createdAt, range.to),
          ),
        )
        .groupBy(sql`1`),
    ]);

    const result = utilizationSeries({
      consumed: toTimed(usageRows),
      granted: toTimed(grantRows),
      range,
      resolution,
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
