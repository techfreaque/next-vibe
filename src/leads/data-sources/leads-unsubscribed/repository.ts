/**
 * Leads Unsubscribed - Repository
 * Server-only. DB access.
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
import { leads } from "next-vibe/identity/lead/db";

export class QueryLeadsUnsubscribedRepository {
  static async queryLeadsUnsubscribed(data: {
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
        bucket: resolutionBucketExpr(resolution, leads.unsubscribedAt).as(
          "bucket",
        ),
        cnt: count(),
      })
      .from(leads)
      .where(
        and(
          isNotNull(leads.unsubscribedAt),
          gte(leads.unsubscribedAt, range.from),
          lte(leads.unsubscribedAt, range.to),
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
