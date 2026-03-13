/**
 * Users Login Attempts Failed — Repository
 * Server-only. DB access.
 * Counts failed login attempts per resolution bucket.
 */

import "server-only";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { loginAttempts } from "../../db";

export async function queryUsersLoginAttemptsFailed({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket: sql<string>`date_trunc(${trunc}, ${loginAttempts.createdAt})`.as(
        "bucket",
      ),
      cnt: count(),
    })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.success, false),
        gte(loginAttempts.createdAt, timeRange.from),
        lte(loginAttempts.createdAt, timeRange.to),
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
