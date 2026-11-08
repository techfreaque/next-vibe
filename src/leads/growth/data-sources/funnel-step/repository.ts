/**
 * Growth Funnel Step - Repository
 * Server-only. Counts journeys whose step timestamp falls in each bucket.
 */

import "server-only";

import {
  and,
  count,
  eq,
  gte,
  isNotNull,
  lte,
  sql,
  type SQL,
} from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
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

import { growthJourneys } from "../../db";
import {
  AttributionTouch,
  type AttributionTouchValue,
  ChannelTypeFilter,
  type ChannelTypeFilterValue,
  FunnelStep,
  type FunnelStepValue,
} from "../../enum";

export class GrowthFunnelStepRepository {
  static async query(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    step: typeof FunnelStepValue;
    touch: typeof AttributionTouchValue;
    channelType: typeof ChannelTypeFilterValue;
    channel: string;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const column = GrowthFunnelStepRepository.stepColumn(data.step);
    const conditions: SQL[] = [
      isNotNull(column),
      gte(column, range.from),
      lte(column, range.to),
    ];
    const first = data.touch === AttributionTouch.FIRST;
    if (data.channelType !== ChannelTypeFilter.ALL) {
      conditions.push(
        eq(
          first
            ? growthJourneys.firstChannelType
            : growthJourneys.lastChannelType,
          data.channelType,
        ),
      );
    }
    const channel = data.channel.trim();
    if (channel.length > 0) {
      conditions.push(
        eq(
          first ? growthJourneys.firstChannel : growthJourneys.lastChannel,
          channel,
        ),
      );
    }

    const rows = await db
      .select({
        bucket: resolutionBucketExpr(resolution, column).as("bucket"),
        cnt: count(),
      })
      .from(growthJourneys)
      .where(and(...conditions))
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.cnt),
    }));
    return success({
      result: fillGaps(raw, range, resolution),
      meta: {
        actualResolution: resolution,
        lookbackUsed: lookback ?? 0,
      },
    });
  }

  private static stepColumn(step: typeof FunnelStepValue): PgColumn {
    switch (step) {
      case FunnelStep.VISIT:
        return growthJourneys.firstTouchAt;
      case FunnelStep.CHAT:
        return growthJourneys.firstChatAt;
      case FunnelStep.SIGNUP:
        return growthJourneys.signedUpAt;
      case FunnelStep.NEWSLETTER:
        return growthJourneys.newsletterConfirmedAt;
      case FunnelStep.PAID:
        return growthJourneys.firstPaidAt;
      case FunnelStep.RETAINED:
        return growthJourneys.retainedAt;
    }
  }
}
