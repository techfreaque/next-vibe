/**
 * Leads Campaign Running — Repository
 * Server-only. DB access.
 * Snapshot: count of leads with CAMPAIGN_RUNNING status per resolution bucket.
 */

import "server-only";

import { and, count, eq, lt } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { RESOLUTION_MS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { leads } from "../../db";
import { LeadStatus } from "../../enum";

export async function queryLeadsCampaignRunning({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const stepMs = RESOLUTION_MS[resolution];
  const points: DataPoint[] = [];

  let ts = timeRange.from.getTime();
  while (ts <= timeRange.to.getTime()) {
    const bucket = new Date(ts);
    const next = new Date(ts + stepMs);

    const [row] = await db
      .select({ cnt: count() })
      .from(leads)
      .where(
        and(
          lt(leads.createdAt, next),
          eq(leads.status, LeadStatus.CAMPAIGN_RUNNING),
        ),
      );

    points.push({ timestamp: bucket, value: Number(row?.cnt ?? 0) });
    ts += stepMs;
  }

  return points;
}
