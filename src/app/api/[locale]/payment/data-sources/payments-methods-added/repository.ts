/**
 * Payment Methods Added - Repository
 * Server-only. DB access.
 * Count of new payment methods added per resolution bucket.
 */

import "server-only";

import { and, count, gte, lte, sql } from "drizzle-orm";
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

import { paymentMethods } from "../../db";

export class QueryPaymentsMethodsAddedRepository {
  static async queryPaymentsMethodsAdded(data: {
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
        bucket: resolutionBucketExpr(resolution, paymentMethods.createdAt).as(
          "bucket",
        ),
        cnt: count(),
      })
      .from(paymentMethods)
      .where(
        and(
          gte(paymentMethods.createdAt, range.from),
          lte(paymentMethods.createdAt, range.to),
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
