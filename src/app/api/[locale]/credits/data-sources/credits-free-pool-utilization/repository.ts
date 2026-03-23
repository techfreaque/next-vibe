/**
 * Credits Free Pool Utilization - Repository
 * Server-only. DB access.
 * Snapshot: ratio of consumed free credits across lead wallets per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, avg, isNotNull, lt } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { RESOLUTION_MS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { FREE_CREDIT_POOL } from "../../constants";
import { creditWallets } from "../../db";

export class QueryCreditsFreePoolUtilizationRepository {
  static async queryCreditsFreePoolUtilization(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const stepMs = RESOLUTION_MS[resolution];
    const points: DataPoint[] = [];

    let ts = range.from.getTime();
    while (ts <= range.to.getTime()) {
      const bucket = new Date(ts);
      const next = new Date(ts + stepMs);

      const [row] = await db
        .select({ avgFree: avg(creditWallets.freeCreditsRemaining) })
        .from(creditWallets)
        .where(
          and(
            isNotNull(creditWallets.leadId),
            lt(creditWallets.createdAt, next),
          ),
        );

      const avgRemaining = Number(row?.avgFree ?? FREE_CREDIT_POOL);
      const utilization = Math.max(
        0,
        (FREE_CREDIT_POOL - avgRemaining) / FREE_CREDIT_POOL,
      );

      points.push({ timestamp: bucket, value: utilization });
      ts += stepMs;
    }

    const result = fillGaps(points, range, resolution);
    return success({
      result,
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
