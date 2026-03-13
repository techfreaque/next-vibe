/**
 * Referral Earnings Volume — Repository
 * Server-only. DB access.
 * Sum of referral earnings in cents per resolution bucket.
 */

import "server-only";

import { and, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { referralEarnings } from "../../db";

export async function queryReferralsEarningsVolume({
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
        sql<string>`date_trunc(${trunc}, ${referralEarnings.createdAt})`.as(
          "bucket",
        ),
      total: sum(referralEarnings.amountCents),
    })
    .from(referralEarnings)
    .where(
      and(
        gte(referralEarnings.createdAt, timeRange.from),
        lte(referralEarnings.createdAt, timeRange.to),
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
