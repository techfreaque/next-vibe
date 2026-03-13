/**
 * Chat Messages With Attachments — Repository
 * Server-only. DB access.
 * Count of messages with file attachments per resolution bucket.
 */

import "server-only";

import { and, count, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { chatMessages } from "../../db";

export async function queryChatMessagesWithAttachments({
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
      cnt: count(),
    })
    .from(chatMessages)
    .where(
      and(
        sql`${chatMessages.metadata}->>'attachments' IS NOT NULL AND jsonb_array_length((${chatMessages.metadata}->'attachments')::jsonb) > 0`,
        gte(chatMessages.createdAt, timeRange.from),
        lte(chatMessages.createdAt, timeRange.to),
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
