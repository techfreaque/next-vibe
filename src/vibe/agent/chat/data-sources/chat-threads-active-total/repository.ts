/**
 * Chat Threads Active Total - Repository
 * Server-only. DB access.
 * Active threads per bucket: distinct human chat threads (see human-chat-sql)
 * that received at least one user message in the bucket. Before 2026-11-25
 * this was a running count of every non-deleted thread ever created.
 */

import "server-only";

import { and, countDistinct, eq, gte, lte, sql } from "drizzle-orm";
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
import { humanChatMessage } from "../human-chat-sql";

export class QueryChatThreadsActiveTotalRepository {
  static async queryChatThreadsActiveTotal(data: {
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
        cnt: countDistinct(chatMessages.threadId),
      })
      .from(chatMessages)
      .where(
        and(
          humanChatMessage,
          eq(chatMessages.role, ChatMessageRole.USER),
          gte(chatMessages.createdAt, range.from),
          lte(chatMessages.createdAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.cnt ?? 0),
    }));

    return success({
      result: fillGaps(raw, range, resolution),
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
