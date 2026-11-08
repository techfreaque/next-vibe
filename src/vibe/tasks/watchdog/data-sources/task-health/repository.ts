/**
 * Task Health - Data Source Repository
 * Server-only. Buckets task executions, the spend ledger and incidents.
 */

import "server-only";

import { and, count, eq, gte, inArray, lte, sql, type SQL } from "drizzle-orm";
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

import { CronTaskStatus } from "../../../enum";
import { cronTaskExecutions } from "../../../cron/db";
import { taskIncidents, taskSpendLedger } from "../../db";
import {
  TaskHealthMetric,
  type TaskHealthMetricValue,
  TaskIncidentTypeFilter,
  type TaskIncidentTypeFilterValue,
} from "../../enum";

interface BucketRow {
  bucket: string;
  value: number | string | null;
}

export class TaskHealthSeriesRepository {
  static async query(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    metric: typeof TaskHealthMetricValue;
    incidentType: typeof TaskIncidentTypeFilterValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const rows = await TaskHealthSeriesRepository.rows(data);
    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.value ?? 0),
    }));
    return success({
      result: fillGaps(raw, range, resolution),
      meta: { actualResolution: resolution, lookbackUsed: lookback ?? 0 },
    });
  }

  private static async rows(data: {
    resolution: Resolution;
    range: TimeRange;
    metric: typeof TaskHealthMetricValue;
    incidentType: typeof TaskIncidentTypeFilterValue;
  }): Promise<BucketRow[]> {
    const { resolution, range } = data;
    const startedBucket = resolutionBucketExpr(
      resolution,
      cronTaskExecutions.startedAt,
    );
    const inRange: SQL[] = [
      gte(cronTaskExecutions.startedAt, range.from),
      lte(cronTaskExecutions.startedAt, range.to),
      // First attempt of each run: retries are not new task starts
      eq(cronTaskExecutions.retryAttempt, 0),
    ];

    switch (data.metric) {
      case TaskHealthMetric.STARTED:
        return db
          .select({ bucket: startedBucket.as("bucket"), value: count() })
          .from(cronTaskExecutions)
          .where(and(...inRange))
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      case TaskHealthMetric.COMPLETED:
        return db
          .select({ bucket: startedBucket.as("bucket"), value: count() })
          .from(cronTaskExecutions)
          .where(
            and(
              ...inRange,
              eq(cronTaskExecutions.status, CronTaskStatus.COMPLETED),
            ),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      case TaskHealthMetric.FAILED:
        return db
          .select({ bucket: startedBucket.as("bucket"), value: count() })
          .from(cronTaskExecutions)
          .where(
            and(
              ...inRange,
              inArray(cronTaskExecutions.status, [
                CronTaskStatus.FAILED,
                CronTaskStatus.ERROR,
                CronTaskStatus.TIMEOUT,
              ]),
            ),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      case TaskHealthMetric.WATCHDOG_CANCELLED:
        return db
          .select({ bucket: startedBucket.as("bucket"), value: count() })
          .from(cronTaskExecutions)
          .where(
            and(
              ...inRange,
              eq(cronTaskExecutions.status, CronTaskStatus.CANCELLED),
            ),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      case TaskHealthMetric.AVG_DURATION:
        return db
          .select({
            bucket: startedBucket.as("bucket"),
            value: sql<number>`avg(${cronTaskExecutions.durationMs}) / 1000.0`,
          })
          .from(cronTaskExecutions)
          .where(
            and(...inRange, sql`${cronTaskExecutions.durationMs} is not null`),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      case TaskHealthMetric.P95_DURATION:
        return db
          .select({
            bucket: startedBucket.as("bucket"),
            value: sql<number>`percentile_cont(0.95) within group (order by ${cronTaskExecutions.durationMs}) / 1000.0`,
          })
          .from(cronTaskExecutions)
          .where(
            and(...inRange, sql`${cronTaskExecutions.durationMs} is not null`),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      case TaskHealthMetric.CREDIT_SPEND:
        return db
          .select({
            bucket: resolutionBucketExpr(
              resolution,
              taskSpendLedger.createdAt,
            ).as("bucket"),
            value: sql<number>`coalesce(sum(${taskSpendLedger.amount}), 0)`,
          })
          .from(taskSpendLedger)
          .where(
            and(
              gte(taskSpendLedger.createdAt, range.from),
              lte(taskSpendLedger.createdAt, range.to),
            ),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      case TaskHealthMetric.INCIDENTS: {
        const conditions: SQL[] = [
          gte(taskIncidents.createdAt, range.from),
          lte(taskIncidents.createdAt, range.to),
        ];
        if (data.incidentType !== TaskIncidentTypeFilter.ALL) {
          conditions.push(eq(taskIncidents.type, data.incidentType));
        }
        return db
          .select({
            bucket: resolutionBucketExpr(
              resolution,
              taskIncidents.createdAt,
            ).as("bucket"),
            value: count(),
          })
          .from(taskIncidents)
          .where(and(...conditions))
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      }
    }
  }
}
