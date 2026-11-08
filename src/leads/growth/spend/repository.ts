/**
 * Channel Spend - Repository
 * Server-only.
 */

import "server-only";

import { desc, type SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { normalizeChannelKey } from "../attribution";
import { growthChannelSpend, growthJourneys } from "../db";
import { costPer, utcDay } from "../funnel";
import type { GrowthT } from "../i18n";
import type {
  ChannelSpendGetResponseOutput,
  ChannelSpendLogRequestOutput,
  ChannelSpendLogResponseOutput,
} from "./definition";

export class ChannelSpendRepository {
  /**
   * Spend entries, newest period first. Signups / paying users count journeys
   * whose FIRST-touch channel matches and whose step falls in the period
   * (end date inclusive).
   */
  static async list(
    logger: EndpointLogger,
    t: GrowthT,
  ): Promise<ResponseType<ChannelSpendGetResponseOutput>> {
    try {
      const rows = await db
        .select({
          id: growthChannelSpend.id,
          channel: growthChannelSpend.channel,
          periodStart: growthChannelSpend.periodStart,
          periodEnd: growthChannelSpend.periodEnd,
          amountCents: growthChannelSpend.amountCents,
          currency: growthChannelSpend.currency,
          note: growthChannelSpend.note,
          signups: ChannelSpendRepository.inPeriod(growthJourneys.signedUpAt),
          paid: ChannelSpendRepository.inPeriod(growthJourneys.firstPaidAt),
        })
        .from(growthChannelSpend)
        .orderBy(
          desc(growthChannelSpend.periodStart),
          growthChannelSpend.channel,
        );

      return success({
        rows: rows.map((row) => ({
          ...row,
          periodStart: ChannelSpendRepository.isoDay(row.periodStart),
          periodEnd: ChannelSpendRepository.isoDay(row.periodEnd),
          signups: Number(row.signups),
          paid: Number(row.paid),
          costPerPaidCents: costPer(row.amountCents, Number(row.paid)),
          costPerSignupCents: costPer(row.amountCents, Number(row.signups)),
        })),
      });
    } catch (error) {
      logger.error("Failed to list channel spend", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Upsert on (channel, periodStart, currency). */
  static async log(
    data: ChannelSpendLogRequestOutput,
    logger: EndpointLogger,
    t: GrowthT,
  ): Promise<ResponseType<ChannelSpendLogResponseOutput>> {
    try {
      const periodStart = new Date(utcDay(data.periodStart));
      const periodEnd = new Date(utcDay(data.periodEnd));
      if (
        Number.isNaN(periodStart.getTime()) ||
        Number.isNaN(periodEnd.getTime()) ||
        periodEnd < periodStart
      ) {
        return fail({
          message: t("errors.invalidPeriod"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const now = new Date();
      const values = {
        channel: normalizeChannelKey(data.channel),
        periodStart,
        periodEnd,
        amountCents: Math.round(data.amount * 100),
        currency: data.currency,
        note: data.note?.trim() || null,
      };
      const [row] = await db
        .insert(growthChannelSpend)
        .values(values)
        .onConflictDoUpdate({
          target: [
            growthChannelSpend.channel,
            growthChannelSpend.periodStart,
            growthChannelSpend.currency,
          ],
          set: {
            periodEnd: values.periodEnd,
            amountCents: values.amountCents,
            note: values.note,
            updatedAt: now,
          },
        })
        .returning({ id: growthChannelSpend.id });

      if (!row) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      logger.debug("Channel spend logged", {
        id: row.id,
        channel: values.channel,
        amountCents: values.amountCents,
      });
      return success({ id: row.id });
    } catch (error) {
      logger.error("Failed to log channel spend", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Journeys whose first-touch channel matches the row and whose step is in its period. */
  private static inPeriod(column: PgColumn): SQL<number> {
    return sql<number>`(
      select count(*)::int from ${growthJourneys}
      where ${growthJourneys.firstChannel} = ${growthChannelSpend.channel}
        and ${column} >= ${growthChannelSpend.periodStart}
        and ${column} < ${growthChannelSpend.periodEnd} + interval '1 day'
    )`;
  }

  private static isoDay(date: Date): string {
    return new Date(utcDay(date)).toISOString().slice(0, 10);
  }
}
