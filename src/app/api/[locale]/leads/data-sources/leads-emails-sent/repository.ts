/**
 * Leads Emails Sent — Repository
 * Server-only. DB access.
 * Counts email campaign rows sent within the time range per resolution bucket.
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { emailCampaigns } from "../../db";

export async function queryLeadsEmailsSent({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket: sql<string>`date_trunc(${trunc}, ${emailCampaigns.sentAt})`.as(
        "bucket",
      ),
      cnt: count(),
    })
    .from(emailCampaigns)
    .where(
      and(
        isNotNull(emailCampaigns.sentAt),
        gte(emailCampaigns.sentAt, timeRange.from),
        lte(emailCampaigns.sentAt, timeRange.to),
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
