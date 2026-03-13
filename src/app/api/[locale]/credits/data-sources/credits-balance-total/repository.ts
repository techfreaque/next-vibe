/**
 * Credits Balance Total — Repository
 * Server-only. DB access.
 * Snapshot: sum of all user wallet balances per resolution bucket.
 */

import "server-only";

import { and, isNotNull, lt, sum } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { RESOLUTION_MS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { creditWallets } from "../../db";

export async function queryCreditsBalanceTotal({
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
      .select({ total: sum(creditWallets.balance) })
      .from(creditWallets)
      .where(
        and(lt(creditWallets.createdAt, next), isNotNull(creditWallets.userId)),
      );

    points.push({ timestamp: bucket, value: Number(row?.total ?? 0) });
    ts += stepMs;
  }

  return points;
}
