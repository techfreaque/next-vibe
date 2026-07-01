/**
 * Referral Earnings Volume - Repository
 * Server-only. DB access.
 * Sum of referral earnings in cents per resolution bucket.
 */

import "server-only";

import { and, gte, lte, sql, sum } from "drizzle-orm";
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

import { referralEarnings } from "../../db";

export class QueryReferralsEarningsVolumeRepository {
  static async queryReferralsEarningsVolume(data: {
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
        bucket: resolutionBucketExpr(resolution, referralEarnings.createdAt).as(
          "bucket",
        ),
        total: sum(referralEarnings.amountCents),
      })
      .from(referralEarnings)
      .where(
        and(
          gte(referralEarnings.createdAt, range.from),
          lte(referralEarnings.createdAt, range.to),
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
