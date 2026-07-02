/**
 * Credits Wallets Total - Repository
 * Server-only. DB access.
 * Snapshot: count of total credit wallets per resolution bucket.
 */

import "server-only";

import { count, lt } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import { RESOLUTION_MS } from "next-vibe/dataflow/shared/fields";
import { fillGaps } from "next-vibe/dataflow/shared/range";

import { creditWallets } from "../../db";

export class QueryCreditsWalletsTotalRepository {
  static async queryCreditsWalletsTotal(data: {
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
        .select({ total: count() })
        .from(creditWallets)
        .where(lt(creditWallets.createdAt, next));

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
