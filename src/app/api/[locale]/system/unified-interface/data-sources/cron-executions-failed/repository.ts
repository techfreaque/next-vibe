/**
 * Cron Executions Failed — Repository
 * Server-only. DB access.
 * Count of failed cron task executions per resolution bucket.
 */

import "server-only";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { cronTaskExecutions } from "../../tasks/cron/db";

export async function queryCronExecutionsFailed({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket:
        sql<string>`date_trunc(${trunc}, ${cronTaskExecutions.startedAt})`.as(
          "bucket",
        ),
      cnt: count(),
    })
    .from(cronTaskExecutions)
    .where(
      and(
        eq(cronTaskExecutions.status, "status.failed"),
        gte(cronTaskExecutions.startedAt, timeRange.from),
        lte(cronTaskExecutions.startedAt, timeRange.to),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  return rows.map(
    (r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.cnt),
    }),
  );
}
