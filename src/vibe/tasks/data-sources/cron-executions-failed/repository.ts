/**
 * Cron Executions Failed - Repository
 * Server-only. DB access.
 * Count of failed cron task executions per resolution bucket: failed,
 * errored and timed-out runs (a timeout is a failure, not a success).
 */

import "server-only";

import { and, count, gte, inArray, lte, sql } from "drizzle-orm";

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
import { CronTaskStatus } from "../../enum";

export class QueryCronExecutionsFailedRepository {
  static async queryCronExecutionsFailed(data: {
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
          inArray(cronTaskExecutions.status, [
            CronTaskStatus.FAILED,
            CronTaskStatus.ERROR,
            CronTaskStatus.TIMEOUT,
          ]),
          gte(cronTaskExecutions.startedAt, range.from),
          lte(cronTaskExecutions.startedAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.cnt),
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
