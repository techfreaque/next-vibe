/**
 * Chat Downvotes Total — Repository
 * Server-only. DB access.
 * Sum of all downvotes on chat messages per resolution bucket.
 */

import "server-only";

import { and, gte, lte, sql, sum } from "drizzle-orm";
import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";
import { resolutionToTrunc } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";

import { chatMessages } from "../../db";

export class QueryChatDownvotesTotalRepository {
  static async queryChatDownvotesTotal(data: {
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
        bucket: sql<string>`date_trunc(${trunc}, ${chatMessages.createdAt})`.as(
          "bucket",
        ),
        total: sum(chatMessages.downvotes),
      })
      .from(chatMessages)
      .where(
        and(
          gte(chatMessages.createdAt, range.from),
          lte(chatMessages.createdAt, range.to),
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
