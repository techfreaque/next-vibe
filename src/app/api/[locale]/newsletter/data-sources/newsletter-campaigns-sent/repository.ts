/**
 * Newsletter Campaigns Sent — Repository
 * Server-only. DB access.
 * Counts newsletter campaigns sent per resolution bucket.
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { newsletterCampaigns } from "../../db";

export async function queryNewsletterCampaignsSent({
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
        sql<string>`date_trunc(${trunc}, ${newsletterCampaigns.sentAt})`.as(
          "bucket",
        ),
      cnt: count(),
    })
    .from(newsletterCampaigns)
    .where(
      and(
        isNotNull(newsletterCampaigns.sentAt),
        gte(newsletterCampaigns.sentAt, timeRange.from),
        lte(newsletterCampaigns.sentAt, timeRange.to),
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
