/**
 * Payments Revenue — Repository
 * Server-only. DB access.
 * Sum of completed payment amounts per resolution bucket.
 */

import "server-only";

import { and, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { paymentTransactions } from "../../db";
import { PaymentStatus } from "../../enum";

export async function queryPaymentsRevenue({
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
        sql<string>`date_trunc(${trunc}, ${paymentTransactions.createdAt})`.as(
          "bucket",
        ),
      total: sum(paymentTransactions.amount),
    })
    .from(paymentTransactions)
    .where(
      and(
        eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
        gte(paymentTransactions.createdAt, timeRange.from),
        lte(paymentTransactions.createdAt, timeRange.to),
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
