/**
 * Credits Balance Total - Repository
 * Server-only. DB access.
 *
 * Outstanding credits in signed-in user wallets at the END of each bucket,
 * rebuilt from the ledger: every balance change is a credit_transactions row,
 * so balance(t) = sum(amount) of the wallet's rows up to t (prod: ledger sum
 * matches credit_wallets.balance to within a few credits).
 * Lead (guest) wallets are left out: their monthly free allowance lapses
 * without a ledger row, so a ledger sum would only grow.
 * Unit: credits (paid, gifted and free credits still unspent).
 */

import "server-only";

import { and, eq, gte, isNotNull, lt, lte, sql, sum } from "drizzle-orm";
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

import { creditTransactions, creditWallets } from "../../db";

export class QueryCreditsBalanceTotalRepository {
  static async queryCreditsBalanceTotal(data: {
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
    const bucket = resolutionBucketExpr(
      resolution,
      creditTransactions.createdAt,
    );
    const firstBucket =
      fillGaps([], range, resolution)[0]?.timestamp ?? range.from;

    const [baselineRows, deltaRows] = await Promise.all([
      db
        .select({ total: sum(creditTransactions.amount) })
        .from(creditTransactions)
        .innerJoin(
          creditWallets,
          eq(creditWallets.id, creditTransactions.walletId),
        )
        .where(
          and(
            isNotNull(creditWallets.userId),
            lt(creditTransactions.createdAt, firstBucket),
          ),
        ),
      db
        .select({
          bucket: bucket.as("bucket"),
          total: sum(creditTransactions.amount),
        })
        .from(creditTransactions)
        .innerJoin(
          creditWallets,
          eq(creditWallets.id, creditTransactions.walletId),
        )
        .where(
          and(
            isNotNull(creditWallets.userId),
            gte(creditTransactions.createdAt, firstBucket),
            lte(creditTransactions.createdAt, range.to),
          ),
        )
        .groupBy(sql`1`)
        .orderBy(sql`1`),
    ]);

    const deltas = fillGaps(
      deltaRows.map((r): DataPoint => ({
        timestamp: new Date(r.bucket),
        value: Number(r.total ?? 0),
      })),
      range,
      resolution,
    );
    let running = Number(baselineRows[0]?.total ?? 0);
    const result = deltas.map((p): DataPoint => {
      running += p.value;
      return { timestamp: p.timestamp, value: Math.round(running) };
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
