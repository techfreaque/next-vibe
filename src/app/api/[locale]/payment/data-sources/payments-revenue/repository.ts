/**
 * Payments Revenue — Repository
 * Server-only. DB access.
 * Sum of completed payment amounts per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { paymentTransactions } from "../../db";
import { PaymentStatus } from "../../enum";

export class QueryPaymentsRevenueRepository {
  static async queryPaymentsRevenue(data: {
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
          sql<string>`date_trunc(${trunc}, ${paymentTransactions.createdAt})`.as(
            "bucket",
          ),
        total: sum(paymentTransactions.amount),
      })
      .from(paymentTransactions)
      .where(
        and(
          eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
          gte(paymentTransactions.createdAt, range.from),
          lte(paymentTransactions.createdAt, range.to),
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
