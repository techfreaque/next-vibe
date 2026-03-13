/**
 * Credits Purchased — Repository
 * Server-only. DB access.
 * Sum of PURCHASE and SUBSCRIPTION transaction amounts per resolution bucket.
 */

import "server-only";

import { and, gte, inArray, lte, sql, sum } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { creditTransactions } from "../../db";
import { CreditTransactionType } from "../../enum";

export async function queryCreditsPurchased({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket:
        sql<string>`date_trunc(${trunc}, ${creditTransactions.createdAt})`.as(
          "bucket",
        ),
      total: sum(creditTransactions.amount),
    })
    .from(creditTransactions)
    .where(
      and(
        inArray(creditTransactions.type, [
          CreditTransactionType.PURCHASE,
          CreditTransactionType.SUBSCRIPTION,
        ]),
        gte(creditTransactions.createdAt, timeRange.from),
        lte(creditTransactions.createdAt, timeRange.to),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  return rows.map(
    (r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.total ?? 0),
    }),
  );
}
