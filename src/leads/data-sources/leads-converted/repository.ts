/**
 * Leads Converted - Repository
 * Server-only. DB access.
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
import { leads } from "next-vibe/identity/lead/db";
import { LeadStatus } from "next-vibe/identity/lead/enum";

export class QueryLeadsConvertedRepository {
  static async queryLeadsConverted(data: {
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
        bucket: resolutionBucketExpr(resolution, leads.convertedAt).as(
          "bucket",
        ),
        cnt: count(),
      })
      .from(leads)
      .where(
        and(
          gte(leads.convertedAt, range.from),
          lte(leads.convertedAt, range.to),
          eq(leads.status, LeadStatus.SIGNED_UP),
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
