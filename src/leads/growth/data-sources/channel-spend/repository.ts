/**
 * Growth Channel Spend - Repository
 * Server-only. Spreads each spend entry over its period and buckets it.
 */

import "server-only";

import { and, eq, gte, lte, type SQL } from "drizzle-orm";
import type { CurrenciesArr } from "next-vibe/core/i18n/core/config";
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
import { fillGaps } from "next-vibe/dataflow/shared/range";

import { paidMinorToUsdCents } from "@/referral/commission";

import { growthChannelSpend } from "../../db";
import { distributeSpend } from "../../funnel";

export class GrowthChannelSpendRepository {
  static async query(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    channel: string;
    currency: (typeof CurrenciesArr)[number];
    convertToUsd: boolean;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const conditions: SQL[] = [
      // Period overlaps the range
      lte(growthChannelSpend.periodStart, range.to),
      gte(growthChannelSpend.periodEnd, range.from),
    ];
    if (!data.convertToUsd) {
      conditions.push(eq(growthChannelSpend.currency, data.currency));
    }
    const channel = data.channel.trim();
    if (channel.length > 0) {
      conditions.push(eq(growthChannelSpend.channel, channel));
    }
    const rows = await db
      .select({
        periodStart: growthChannelSpend.periodStart,
        periodEnd: growthChannelSpend.periodEnd,
        amountCents: growthChannelSpend.amountCents,
        currency: growthChannelSpend.currency,
      })
      .from(growthChannelSpend)
      .where(and(...conditions));
    // USD mode: every entry at the finance FX table rate; a currency the
    // table does not know is left out rather than guessed.
    const periods = data.convertToUsd
      ? rows.flatMap((row) => {
          const amountCents = paidMinorToUsdCents(
            row.amountCents,
            row.currency,
          );
          return amountCents === null ? [] : [{ ...row, amountCents }];
        })
      : rows;

    return success({
      result: fillGaps(
        distributeSpend(periods, range, resolution),
        range,
        resolution,
      ),
      meta: {
        actualResolution: resolution,
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
