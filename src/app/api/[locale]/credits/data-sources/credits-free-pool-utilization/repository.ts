/**
 * Credits Free Pool Utilization — Repository
 * Server-only. DB access.
 * Snapshot: ratio of consumed free credits across lead wallets per resolution bucket.
 */

import "server-only";

import { and, avg, isNotNull, lt } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { RESOLUTION_MS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { creditWallets } from "../../db";

const FREE_CREDIT_POOL = 20;

export async function queryCreditsFreePoolUtilization({
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
      .select({ avgFree: avg(creditWallets.freeCreditsRemaining) })
      .from(creditWallets)
      .where(
        and(isNotNull(creditWallets.leadId), lt(creditWallets.createdAt, next)),
      );

    const avgRemaining = Number(row?.avgFree ?? FREE_CREDIT_POOL);
    const utilization = Math.max(
      0,
      (FREE_CREDIT_POOL - avgRemaining) / FREE_CREDIT_POOL,
    );

    points.push({ timestamp: bucket, value: utilization });
    ts += stepMs;
  }

  return points;
}
