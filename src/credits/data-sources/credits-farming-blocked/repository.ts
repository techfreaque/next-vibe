/**
 * Credits Farming Blocked - Repository
 * Server-only. DB access.
 * Count of blocked free-credit farming attempts (anti_farming_events, all kinds)
 * per resolution bucket: subnet budget hits, duplicate and disposable emails.
 */

import "server-only";

import { and, count, gte, lte, sql } from "drizzle-orm";
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
import { resolutionBucketExpr } from "next-vibe/dataflow/shared/query-utils";
import { fillGaps } from "next-vibe/dataflow/shared/range";

import { antiFarmingEvents } from "../../anti-farming/db";

export class QueryCreditsFarmingBlockedRepository {
  static async queryCreditsFarmingBlocked(data: {
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
        bucket: resolutionBucketExpr(
          resolution,
          antiFarmingEvents.createdAt,
        ).as("bucket"),
        total: count(),
      })
      .from(antiFarmingEvents)
      .where(
        and(
          gte(antiFarmingEvents.createdAt, range.from),
          lte(antiFarmingEvents.createdAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.total ?? 0),
    }));
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
