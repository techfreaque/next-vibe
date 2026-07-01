/**
 * Leads Email Opens - Repository
 * Server-only. DB access.
 * Counts email campaign rows that were opened within the time range.
 */

import "server-only";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/core/utils/dataflow/shared/fields";
import { resolutionBucketExpr } from "next-vibe/core/utils/dataflow/shared/query-utils";
import { fillGaps } from "next-vibe/core/utils/dataflow/shared/range";
import { db } from "next-vibe/database";
import { emailCampaigns } from "next-vibe/identity/lead/db";

export class QueryLeadsEmailOpensRepository {
  static async queryLeadsEmailOpens(data: {
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
        bucket: resolutionBucketExpr(resolution, emailCampaigns.openedAt).as(
          "bucket",
        ),
        cnt: count(),
      })
      .from(emailCampaigns)
      .where(
        and(
          isNotNull(emailCampaigns.openedAt),
          gte(emailCampaigns.openedAt, range.from),
          lte(emailCampaigns.openedAt, range.to),
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
