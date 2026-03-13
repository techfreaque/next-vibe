/**
 * Leads Email Opens — Repository
 * Server-only. DB access.
 * Counts email campaign rows that were opened within the time range.
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { emailCampaigns } from "../../db";

export async function queryLeadsEmailOpens({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket: sql<string>`date_trunc(${trunc}, ${emailCampaigns.openedAt})`.as(
        "bucket",
      ),
      cnt: count(),
    })
    .from(emailCampaigns)
    .where(
      and(
        isNotNull(emailCampaigns.openedAt),
        gte(emailCampaigns.openedAt, timeRange.from),
        lte(emailCampaigns.openedAt, timeRange.to),
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
