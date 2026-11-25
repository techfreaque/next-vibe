/**
 * Referral Earnings Volume - Repository
 * Server-only. DB access.
 * Referral commissions per resolution bucket in USD (canceled excluded).
 */

import "server-only";

import { and, gte, lte, ne, sql, sum } from "drizzle-orm";
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

import { referralEarnings } from "../../db";
import { ReferralEarningStatus } from "../../enum";

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
          ne(referralEarnings.status, ReferralEarningStatus.CANCELED),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      // amount_cents is earned credits, 1 credit = 1 USD cent
      value: Number(r.total ?? 0) / 100,
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
