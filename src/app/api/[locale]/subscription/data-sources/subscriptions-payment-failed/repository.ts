/**
 * Subscriptions Payment Failed — Repository
 * Server-only. DB access.
 * Count of subscriptions with failed payments per resolution bucket (grouped by paymentFailedAt).
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, count, gte, isNotNull, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { subscriptions } from "../../db";

export class QuerySubscriptionsPaymentFailedRepository {
  static async querySubscriptionsPaymentFailed(data: {
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
          sql<string>`date_trunc(${trunc}, ${subscriptions.paymentFailedAt})`.as(
            "bucket",
          ),
        total: count(),
      })
      .from(subscriptions)
      .where(
        and(
          isNotNull(subscriptions.paymentFailedAt),
          gte(subscriptions.paymentFailedAt, range.from),
          lte(subscriptions.paymentFailedAt, range.to),
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
