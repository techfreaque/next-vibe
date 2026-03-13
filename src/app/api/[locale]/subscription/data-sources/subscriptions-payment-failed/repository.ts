/**
 * Subscriptions Payment Failed — Repository
 * Server-only. DB access.
 * Count of subscriptions with failed payments per resolution bucket (grouped by paymentFailedAt).
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { subscriptions } from "../../db";

export async function querySubscriptionsPaymentFailed({
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
        sql<string>`date_trunc(${trunc}, ${subscriptions.paymentFailedAt})`.as(
          "bucket",
        ),
      total: count(),
    })
    .from(subscriptions)
    .where(
      and(
        isNotNull(subscriptions.paymentFailedAt),
        gte(subscriptions.paymentFailedAt, timeRange.from),
        lte(subscriptions.paymentFailedAt, timeRange.to),
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
