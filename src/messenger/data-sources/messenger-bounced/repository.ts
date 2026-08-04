/**
 * Messenger Bounced - Repository
 * Server-only. DB access.
 * Count of bounced messages (bouncedAt not null) per resolution bucket.
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";
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

import { emails } from "../../messages/db";

export class QueryMessengerBouncedRepository {
  static async queryMessengerBounced(data: {
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
        bucket: resolutionBucketExpr(resolution, emails.bouncedAt).as("bucket"),
        cnt: count(),
      })
      .from(emails)
      .where(
        and(
          isNotNull(emails.bouncedAt),
          gte(emails.bouncedAt, range.from),
          lte(emails.bouncedAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.cnt),
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
