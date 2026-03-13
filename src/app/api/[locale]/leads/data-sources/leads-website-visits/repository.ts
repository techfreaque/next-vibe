/**
 * Leads Website Visits — Repository
 * Server-only. DB access.
 * Counts WEBSITE_VISIT engagement events per resolution bucket.
 */

import "server-only";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { leadEngagements } from "../../db";
import { EngagementTypes } from "../../enum";

export async function queryLeadsWebsiteVisits({
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
        sql<string>`date_trunc(${trunc}, ${leadEngagements.timestamp})`.as(
          "bucket",
        ),
      cnt: count(),
    })
    .from(leadEngagements)
    .where(
      and(
        eq(leadEngagements.engagementType, EngagementTypes.WEBSITE_VISIT),
        gte(leadEngagements.timestamp, timeRange.from),
        lte(leadEngagements.timestamp, timeRange.to),
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
