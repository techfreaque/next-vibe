/**
 * Cron Executions Total - Repository
 * Server-only. DB access.
 * Count of all cron task executions per resolution bucket.
 */

import "server-only";

import { and, count, gte, lte, sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "../../../core/route/response.schema";
import { db } from "../../../database";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "../../../dataflow/shared/fields";
import { resolutionBucketExpr } from "../../../dataflow/shared/query-utils";
import { fillGaps } from "../../../dataflow/shared/range";
import { cronTaskExecutions } from "../../cron/db";

export class QueryCronExecutionsTotalRepository {
  static async queryCronExecutionsTotal(data: {
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
        bucket: resolutionBucketExpr(
          resolution,
          cronTaskExecutions.startedAt,
        ).as("bucket"),
        cnt: count(),
      })
      .from(cronTaskExecutions)
      .where(
        and(
          gte(cronTaskExecutions.startedAt, range.from),
          lte(cronTaskExecutions.startedAt, range.to),
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
