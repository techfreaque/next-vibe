/**
 * Messenger Delivered — Repository
 * Server-only. DB access.
 * Count of delivered messages (deliveredAt not null) per resolution bucket.
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { emails } from "../../messages/db";

export async function queryMessengerDelivered({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket: sql<string>`date_trunc(${trunc}, ${emails.deliveredAt})`.as(
        "bucket",
      ),
      cnt: count(),
    })
    .from(emails)
    .where(
      and(
        isNotNull(emails.deliveredAt),
        gte(emails.deliveredAt, timeRange.from),
        lte(emails.deliveredAt, timeRange.to),
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
