/**
 * Error Logs Series - Repository
 * Server-only. DB access.
 *
 * error_logs holds ONE row per error class (fingerprint) with a running
 * occurrence total and its last-seen time, so counting its rows per bucket
 * says nothing about volume. Volume comes from error_log_daily (occurrences
 * per class per UTC day, live since ERROR_LOG_DAILY_SINCE).
 *
 * - occurrences: sum of error_log_daily.occurrences per day
 * - distinct: error classes that occurred at least once that day
 * - new: error classes first seen in the bucket (error_logs.first_seen)
 * - openBacklog: unresolved classes right now, one point at the bucket that
 *   contains range.to (no history: the graph persists it on every run)
 */

import "server-only";

import {
  and,
  count,
  countDistinct,
  eq,
  gt,
  gte,
  lte,
  type SQL,
  sql,
} from "drizzle-orm";
import type { QueryResultRow } from "pg";

import {
  type ResponseType,
  success,
} from "../../../../core/route/response.schema";
import { db } from "../../../../database";
import { GraphResolution } from "../../../../dataflow/enum";
import {
  type DataPoint,
  type Resolution,
  RESOLUTION_MS,
  type TimeRange,
} from "../../../../dataflow/shared/fields";
import { resolutionBucketExpr } from "../../../../dataflow/shared/query-utils";
import { fillGaps } from "../../../../dataflow/shared/range";
import { ERROR_LOG_DAILY_SINCE } from "../../daily";
import { errorLogDaily, errorLogs } from "../../db";
import {
  ErrorLogsLevelFilter,
  type ErrorLogsLevelFilterValue,
  ErrorLogsMetric,
  type ErrorLogsMetricValue,
} from "./enum";

const DAY_MS = 24 * 60 * 60 * 1000;

interface BucketRow {
  bucket: string;
  value: number | string | null;
}

export class ErrorLogsSeriesRepository {
  static async query(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    metric: typeof ErrorLogsMetricValue;
    level: typeof ErrorLogsLevelFilterValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { range, lookback } = data;
    const resolution = ErrorLogsSeriesRepository.effectiveResolution(data);
    const meta = { actualResolution: resolution, lookbackUsed: lookback ?? 0 };

    if (data.metric === ErrorLogsMetric.OPEN_BACKLOG) {
      return success({
        result: await ErrorLogsSeriesRepository.openBacklog(
          range,
          resolution,
          data.level,
        ),
        meta,
      });
    }

    const query = ErrorLogsSeriesRepository.rowsQuery(
      data.metric,
      range,
      resolution,
      data.level,
    );
    const rows = query
      ? (await db.execute<QueryResultRow & BucketRow>(query)).rows
      : [];
    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.value ?? 0),
    }));
    return success({ result: fillGaps(raw, range, resolution), meta });
  }

  /** error_log_daily only knows days: never split a day into hours. */
  private static effectiveResolution(data: {
    resolution: Resolution;
    metric: typeof ErrorLogsMetricValue;
  }): Resolution {
    const daily =
      data.metric === ErrorLogsMetric.OCCURRENCES ||
      data.metric === ErrorLogsMetric.DISTINCT;
    if (daily && RESOLUTION_MS[data.resolution] < DAY_MS) {
      return GraphResolution.ONE_DAY;
    }
    return data.resolution;
  }

  private static levelCondition(
    level: typeof ErrorLogsLevelFilterValue,
  ): SQL[] {
    switch (level) {
      case ErrorLogsLevelFilter.ERROR:
        return [eq(errorLogs.level, "error")];
      case ErrorLogsLevelFilter.WARN:
        return [eq(errorLogs.level, "warn")];
      case ErrorLogsLevelFilter.ALL:
        return [];
    }
  }

  /**
   * The bucketed query for the occurrences / distinct / new metrics, as SQL
   * so it can be inspected and cross-checked. Null when the range ends before
   * live per-day counting started.
   */
  static rowsQuery(
    metric: Exclude<
      typeof ErrorLogsMetricValue,
      typeof ErrorLogsMetric.OPEN_BACKLOG
    >,
    range: TimeRange,
    resolution: Resolution,
    level: typeof ErrorLogsLevelFilterValue,
  ): SQL | null {
    const levelCond = ErrorLogsSeriesRepository.levelCondition(level);

    if (metric === ErrorLogsMetric.NEW) {
      return db
        .select({
          bucket: resolutionBucketExpr(resolution, errorLogs.firstSeen).as(
            "bucket",
          ),
          value: count().as("value"),
        })
        .from(errorLogs)
        .where(
          and(
            gte(errorLogs.firstSeen, range.from),
            lte(errorLogs.firstSeen, range.to),
            ...levelCond,
          ),
        )
        .groupBy(sql`1`)
        .orderBy(sql`1`)
        .getSQL();
    }

    // Daily table: whole days that touch the range, never the backfilled lump
    // rows before live per-day counting started.
    const fromDay = new Date(
      Math.max(
        Math.floor(range.from.getTime() / DAY_MS) * DAY_MS,
        ERROR_LOG_DAILY_SINCE.getTime(),
      ),
    );
    if (fromDay.getTime() > range.to.getTime()) {
      return null;
    }
    const value =
      metric === ErrorLogsMetric.DISTINCT
        ? countDistinct(errorLogDaily.fingerprint).as("value")
        : sql<number>`coalesce(sum(${errorLogDaily.occurrences}), 0)`.as(
            "value",
          );
    return db
      .select({
        bucket: resolutionBucketExpr(resolution, errorLogDaily.day).as(
          "bucket",
        ),
        value,
      })
      .from(errorLogDaily)
      .innerJoin(
        errorLogs,
        eq(errorLogs.fingerprint, errorLogDaily.fingerprint),
      )
      .where(
        and(
          gte(errorLogDaily.day, fromDay),
          lte(errorLogDaily.day, range.to),
          gt(errorLogDaily.occurrences, 0),
          ...levelCond,
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`)
      .getSQL();
  }

  /**
   * Unresolved error classes now, as one point at the bucket containing
   * range.to. Empty when the range ends in the past (no history to replay).
   */
  private static async openBacklog(
    range: TimeRange,
    resolution: Resolution,
    level: typeof ErrorLogsLevelFilterValue,
  ): Promise<DataPoint[]> {
    const lastBucket = fillGaps([], range, resolution).at(-1);
    if (
      !lastBucket ||
      range.to.getTime() < Date.now() - RESOLUTION_MS[resolution]
    ) {
      return [];
    }
    const [row] = await db
      .select({ value: count() })
      .from(errorLogs)
      .where(
        and(
          eq(errorLogs.resolved, false),
          ...ErrorLogsSeriesRepository.levelCondition(level),
        ),
      );
    return [
      { timestamp: lastBucket.timestamp, value: Number(row?.value ?? 0) },
    ];
  }
}
