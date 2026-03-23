/**
 * Credits Balance Total - Repository
 * Server-only. DB access.
 * Snapshot: sum of all user wallet balances per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, isNotNull, lt, sum } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { RESOLUTION_MS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { creditWallets } from "../../db";

export class QueryCreditsBalanceTotalRepository {
  static async queryCreditsBalanceTotal(data: {
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
        .select({ total: sum(creditWallets.balance) })
        .from(creditWallets)
        .where(
          and(
            lt(creditWallets.createdAt, next),
            isNotNull(creditWallets.userId),
          ),
        );

      points.push({ timestamp: bucket, value: Number(row?.total ?? 0) });
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
