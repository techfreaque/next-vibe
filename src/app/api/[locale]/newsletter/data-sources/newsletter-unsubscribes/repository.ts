/**
 * Newsletter Unsubscribes — Repository
 * Server-only. DB access.
 * Counts newsletter unsubscriptions per resolution bucket.
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { newsletterSubscriptions } from "../../db";

export async function queryNewsletterUnsubscribes({
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
        sql<string>`date_trunc(${trunc}, ${newsletterSubscriptions.unsubscribedDate})`.as(
          "bucket",
        ),
      cnt: count(),
    })
    .from(newsletterSubscriptions)
    .where(
      and(
        isNotNull(newsletterSubscriptions.unsubscribedDate),
        gte(newsletterSubscriptions.unsubscribedDate, timeRange.from),
        lte(newsletterSubscriptions.unsubscribedDate, timeRange.to),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  return rows.map(
    (r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.cnt),
    }),
  );
}
