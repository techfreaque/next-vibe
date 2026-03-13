/**
 * Subscriptions Active — Repository
 * Server-only. DB access.
 * Snapshot: count of active subscriptions per resolution bucket.
 */

import "server-only";

import { and, count, eq, lt } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { RESOLUTION_MS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { subscriptions } from "../../db";
import { SubscriptionStatus } from "../../enum";

export async function querySubscriptionsActive({
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
      .select({ total: count() })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, SubscriptionStatus.ACTIVE),
          lt(subscriptions.createdAt, next),
        ),
      );

    points.push({ timestamp: bucket, value: Number(row?.total ?? 0) });
    ts += stepMs;
  }

  return points;
}
