/**
 * Chat Downvotes Total — Repository
 * Server-only. DB access.
 * Sum of all downvotes on chat messages per resolution bucket.
 */

import "server-only";

import { and, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { chatMessages } from "../../db";

export async function queryChatDownvotesTotal({
  timeRange,
  resolution,
}: {
  timeRange: TimeRange;
  resolution: Resolution;
}): Promise<DataPoint[]> {
  const trunc = resolutionToTrunc(resolution);
  const rows = await db
    .select({
      bucket: sql<string>`date_trunc(${trunc}, ${chatMessages.createdAt})`.as(
        "bucket",
      ),
      total: sum(chatMessages.downvotes),
    })
    .from(chatMessages)
    .where(
      and(
        gte(chatMessages.createdAt, timeRange.from),
        lte(chatMessages.createdAt, timeRange.to),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  return rows.map(
    (r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.total ?? 0),
    }),
  );
}
