/**
 * Leads Email Clicks - Repository
 * Server-only. DB access.
 * Counts email campaign rows that were clicked within the time range.
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
import { emailCampaigns } from "next-vibe/identity/lead/db";

export class QueryLeadsEmailClicksRepository {
  static async queryLeadsEmailClicks(data: {
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
        bucket: resolutionBucketExpr(resolution, emailCampaigns.clickedAt).as(
          "bucket",
        ),
        cnt: count(),
      })
      .from(emailCampaigns)
      .where(
        and(
          isNotNull(emailCampaigns.clickedAt),
          gte(emailCampaigns.clickedAt, range.from),
          lte(emailCampaigns.clickedAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.bucket),
        value: Number(r.cnt),
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
