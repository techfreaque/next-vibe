/**
 * Subscriptions Churned - Repository
 * Server-only. DB access.
 * Count of churned (ended) subscriptions per resolution bucket (grouped by endedAt).
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionBucketExpr } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { subscriptions } from "../../db";

export class QuerySubscriptionsChurnedRepository {
  static async querySubscriptionsChurned(data: {
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
    const rows = await db
      .select({
        bucket: resolutionBucketExpr(resolution, subscriptions.endedAt).as(
          "bucket",
        ),
        total: count(),
      })
      .from(subscriptions)
      .where(
        and(
          isNotNull(subscriptions.endedAt),
          gte(subscriptions.endedAt, range.from),
          lte(subscriptions.endedAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.bucket),
        value: Number(r.total ?? 0),
      }),
    );
    const result = fillGaps(raw, range, resolution);
    return success({
      result,
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
