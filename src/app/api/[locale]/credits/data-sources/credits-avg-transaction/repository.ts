/**
 * Credits Avg Transaction — Repository
 * Server-only. DB access.
 * Average credit transaction amount per resolution bucket.
 */

import "server-only";

import { and, avg, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { creditTransactions } from "../../db";

export async function queryCreditsAvgTransaction({
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
      average: avg(creditTransactions.amount),
    })
    .from(creditTransactions)
    .where(
      and(
        gte(creditTransactions.createdAt, timeRange.from),
        lte(creditTransactions.createdAt, timeRange.to),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  return rows.map(
    (r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Math.abs(Number(r.average ?? 0)),
    }),
  );
}
