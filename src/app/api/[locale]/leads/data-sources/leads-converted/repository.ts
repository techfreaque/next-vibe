/**
 * Leads Converted — Repository
 * Server-only. DB access.
 */

import "server-only";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { leads } from "../../db";
import { LeadStatus } from "../../enum";

export async function queryLeadsConverted({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket: sql<string>`date_trunc(${trunc}, ${leads.convertedAt})`.as(
        "bucket",
      ),
      cnt: count(),
    })
    .from(leads)
    .where(
      and(
        gte(leads.convertedAt, timeRange.from),
        lte(leads.convertedAt, timeRange.to),
        eq(leads.status, LeadStatus.SIGNED_UP),
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
