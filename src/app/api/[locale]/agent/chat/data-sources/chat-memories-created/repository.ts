/**
 * Chat Memories Created - Repository
 * Server-only. DB access.
 * Count of new memories per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, count, gte, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { resolutionBucketExpr } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/query-utils";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { cortexNodes } from "@/app/api/[locale]/agent/cortex/db";
import { CortexNodeType } from "@/app/api/[locale]/agent/cortex/enum";
import { MEMORIES_PREFIX } from "@/app/api/[locale]/agent/cortex/repository";

export class QueryChatMemoriesCreatedRepository {
  static async queryChatMemoriesCreated(data: {
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
    const { like, eq } = await import("drizzle-orm");
    const rows = await db
      .select({
        bucket: resolutionBucketExpr(resolution, cortexNodes.createdAt).as(
          "bucket",
        ),
        cnt: count(),
      })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.nodeType, CortexNodeType.FILE),
          like(cortexNodes.path, `${MEMORIES_PREFIX}/%`),
          gte(cortexNodes.createdAt, range.from),
          lte(cortexNodes.createdAt, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.bucket),
        value: Number(r.cnt),
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
