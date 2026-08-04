/**
 * Leads Website Visits - Repository
 * Server-only. DB access.
 * Counts WEBSITE_VISIT engagement events per resolution bucket.
 */

import "server-only";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";
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
import { leadEngagements } from "next-vibe/identity/lead/db";
import { EngagementTypes } from "next-vibe/identity/lead/enum";

export class QueryLeadsWebsiteVisitsRepository {
  static async queryLeadsWebsiteVisits(data: {
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
        bucket: resolutionBucketExpr(resolution, leadEngagements.timestamp).as(
          "bucket",
        ),
        cnt: count(),
      })
      .from(leadEngagements)
      .where(
        and(
          eq(leadEngagements.engagementType, EngagementTypes.WEBSITE_VISIT),
          gte(leadEngagements.timestamp, range.from),
          lte(leadEngagements.timestamp, range.to),
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
