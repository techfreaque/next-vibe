/**
 * Leads Form Submits — Repository
 * Server-only. DB access.
 * Counts FORM_SUBMIT engagement events per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { leadEngagements } from "../../db";
import { EngagementTypes } from "../../enum";

export class QueryLeadsFormSubmitsRepository {
  static async queryLeadsFormSubmits(data: {
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
    const trunc = resolutionToTrunc(resolution);
    const rows = await db
      .select({
        bucket:
          sql<string>`date_trunc(${trunc}, ${leadEngagements.timestamp})`.as(
            "bucket",
          ),
        cnt: count(),
      })
      .from(leadEngagements)
      .where(
        and(
          eq(leadEngagements.engagementType, EngagementTypes.FORM_SUBMIT),
          gte(leadEngagements.timestamp, range.from),
          lte(leadEngagements.timestamp, range.to),
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
