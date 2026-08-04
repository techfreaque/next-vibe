/**
 * Chat Unique Users - Repository
 * Server-only. DB access.
 * Count of distinct users who posted messages per resolution bucket.
 */

import "server-only";

import { and, countDistinct, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
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

import { chatMessages } from "../../db";
import { ChatMessageRole } from "../../enum";

export class QueryChatUniqueUsersRepository {
  static async queryChatUniqueUsers(data: {
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
        bucket: resolutionBucketExpr(resolution, chatMessages.createdAt).as(
          "bucket",
        ),
        cnt: countDistinct(chatMessages.authorId),
      })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.role, ChatMessageRole.USER),
          isNotNull(chatMessages.authorId),
          gte(chatMessages.createdAt, range.from),
          lte(chatMessages.createdAt, range.to),
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
