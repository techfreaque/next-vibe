/**
 * Referral Conversion Rate - Repository
 * Server-only. DB access.
 * Signups / lead-clicks per resolution bucket = conversion rate (0–100).
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, count, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionBucketExpr } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { leadReferrals, userReferrals } from "../../db";

export class QueryReferralsConversionRateRepository {
  static async queryReferralsConversionRate(data: {
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

    // Fetch clicks (lead_referrals) and signups (user_referrals) in parallel
    const [clickRows, signupRows] = await Promise.all([
      db
        .select({
          bucket: resolutionBucketExpr(resolution, leadReferrals.createdAt).as(
            "bucket",
          ),
          cnt: count(),
        })
        .from(leadReferrals)
        .where(
          and(
            gte(leadReferrals.createdAt, range.from),
            lte(leadReferrals.createdAt, range.to),
          ),
        )
        .groupBy(sql`1`)
        .orderBy(sql`1`),

      db
        .select({
          bucket: resolutionBucketExpr(resolution, userReferrals.createdAt).as(
            "bucket",
          ),
          cnt: count(),
        })
        .from(userReferrals)
        .where(
          and(
            gte(userReferrals.createdAt, range.from),
            lte(userReferrals.createdAt, range.to),
          ),
        )
        .groupBy(sql`1`)
        .orderBy(sql`1`),
    ]);

    // Build lookup maps keyed by bucket ISO string
    const clickMap = new Map(
      clickRows.map((r) => [new Date(r.bucket).toISOString(), Number(r.cnt)]),
    );
    const signupMap = new Map(
      signupRows.map((r) => [new Date(r.bucket).toISOString(), Number(r.cnt)]),
    );

    // Collect all bucket timestamps
    const allBuckets = new Set([...clickMap.keys(), ...signupMap.keys()]);

    const raw: DataPoint[] = [...allBuckets].toSorted().map((iso) => {
      const clicks = clickMap.get(iso) ?? 0;
      const signups = signupMap.get(iso) ?? 0;
      const rate = clicks > 0 ? Math.round((signups / clicks) * 100) : 0;
      return { timestamp: new Date(iso), value: rate };
    });

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
