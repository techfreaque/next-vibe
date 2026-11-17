/**
 * Yearly Credits Repository
 * A yearly plan grants its tier's monthly credits every month:
 * - grantCurrentMonth (daily task): for every live yearly subscription, grant
 *   the current month's credits (months 2..12; month 1 comes with the yearly
 *   invoice), expiring when that month ends. Idempotent per subscription and
 *   month, so running it daily grants each month exactly once.
 * - backfill (admin, dry run by default): months of the current yearly period
 *   that passed before this task existed, granted once as one pack expiring at
 *   the period end.
 * Server-only.
 */

import "server-only";

import { and, eq, inArray, isNotNull, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditPacks } from "@/credits/db";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import {
  getTierCredits,
  getTierProductForPlan,
  ProductIds,
} from "@/products/repository-client";

import { subscriptions } from "../db";
import { BillingInterval, SubscriptionStatus } from "../enum";
import type { YearlyCreditsT } from "./i18n";
import {
  currentMonthSlot,
  monthSlots,
  yearlyBackfillKey,
  yearlyMonthGrantKey,
} from "./slots";

const LIVE_STATUSES = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.PAST_DUE,
];

export interface YearlyGrantResult {
  scanned: number;
  granted: number;
  credits: number;
}

export interface YearlyBackfillRow {
  subscriptionId: string;
  userEmail: string;
  plan: string;
  periodStart: string;
  periodEnd: string;
  currentMonth: number;
  missedMonths: number;
  credits: number;
  status: "pending" | "granted" | "alreadyGranted" | "nothingMissed";
}

export interface YearlyBackfillResult {
  dryRunApplied: boolean;
  subscriptions: number;
  months: number;
  credits: number;
  rows: YearlyBackfillRow[];
}

async function liveYearlySubscriptions(): Promise<
  Array<{
    id: string;
    userId: string;
    userEmail: string;
    planId: string;
    providerSubscriptionId: string | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }>
> {
  const rows = await db
    .select({
      id: subscriptions.id,
      userId: subscriptions.userId,
      userEmail: users.email,
      planId: subscriptions.planId,
      providerSubscriptionId: subscriptions.providerSubscriptionId,
      currentPeriodStart: subscriptions.currentPeriodStart,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
    })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.userId, users.id))
    .where(
      and(
        eq(subscriptions.billingInterval, BillingInterval.YEARLY),
        inArray(subscriptions.status, LIVE_STATUSES),
        isNotNull(subscriptions.currentPeriodStart),
        isNotNull(subscriptions.currentPeriodEnd),
      ),
    );
  return rows.flatMap((row) =>
    row.currentPeriodStart && row.currentPeriodEnd
      ? [
          {
            ...row,
            currentPeriodStart: row.currentPeriodStart,
            currentPeriodEnd: row.currentPeriodEnd,
          },
        ]
      : [],
  );
}

async function packExists(sessionId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: creditPacks.id })
    .from(creditPacks)
    .where(sql`${creditPacks.metadata}->>'sessionId' = ${sessionId}`)
    .limit(1);
  return Boolean(row);
}

export class YearlyCreditsRepository {
  static async grantCurrentMonth(
    logger: EndpointLogger,
    locale: CountryLanguage,
    tYearly: YearlyCreditsT,
    now: Date = new Date(),
  ): Promise<ResponseType<YearlyGrantResult>> {
    try {
      const { t } = creditsScopedTranslation.scopedT(locale);
      const subs = await liveYearlySubscriptions();
      let granted = 0;
      let credits = 0;
      for (const sub of subs) {
        const slot = currentMonthSlot(
          sub.currentPeriodStart,
          sub.currentPeriodEnd,
          now,
        );
        // Month 1 of the period is the yearly invoice's own grant.
        if (!slot || slot.index === 0) {
          continue;
        }
        const tierCredits = getTierCredits(
          getTierProductForPlan(sub.planId) ?? ProductIds.SUBSCRIPTION,
        );
        const grant = await CreditRepository.addUserCredits(
          sub.userId,
          tierCredits,
          "subscription",
          logger,
          t,
          slot.end,
          yearlyMonthGrantKey(sub.providerSubscriptionId ?? sub.id, slot.start),
        );
        if (!grant.success) {
          logger.error("Yearly monthly credit grant failed", {
            subscriptionId: sub.id,
            error: grant.message,
          });
          continue;
        }
        if (grant.data.granted) {
          granted++;
          credits += tierCredits;
          logger.info("Granted yearly plan monthly credits", {
            subscriptionId: sub.id,
            userId: sub.userId,
            month: slot.index + 1,
            credits: tierCredits,
            expiresAt: slot.end.toISOString(),
          });
        }
      }
      return success({ scanned: subs.length, granted, credits });
    } catch (error) {
      logger.error("Yearly monthly credit task failed", parseError(error));
      return fail({
        message: tYearly("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Months of the current yearly period before the current one that got no
   * monthly grant. With dryRun nothing is written.
   */
  static async backfill(
    dryRun: boolean,
    logger: EndpointLogger,
    locale: CountryLanguage,
    tYearly: YearlyCreditsT,
    now: Date = new Date(),
  ): Promise<ResponseType<YearlyBackfillResult>> {
    try {
      const { t } = creditsScopedTranslation.scopedT(locale);
      const subs = await liveYearlySubscriptions();
      const rows: YearlyBackfillRow[] = [];
      for (const sub of subs) {
        const subKey = sub.providerSubscriptionId ?? sub.id;
        const tierProductId =
          getTierProductForPlan(sub.planId) ?? ProductIds.SUBSCRIPTION;
        const tierCredits = getTierCredits(tierProductId);
        const current = currentMonthSlot(
          sub.currentPeriodStart,
          sub.currentPeriodEnd,
          now,
        );
        const base = {
          subscriptionId: sub.id,
          userEmail: sub.userEmail,
          plan: tierProductId,
          periodStart: sub.currentPeriodStart.toISOString(),
          periodEnd: sub.currentPeriodEnd.toISOString(),
          currentMonth: current ? current.index + 1 : 0,
        };
        const backfillKey = yearlyBackfillKey(subKey, sub.currentPeriodStart);
        if (await packExists(backfillKey)) {
          rows.push({
            ...base,
            missedMonths: 0,
            credits: 0,
            status: "alreadyGranted",
          });
          continue;
        }
        let missedMonths = 0;
        for (const slot of monthSlots(
          sub.currentPeriodStart,
          sub.currentPeriodEnd,
        )) {
          if (slot.index === 0 || !current || slot.index >= current.index) {
            continue;
          }
          if (!(await packExists(yearlyMonthGrantKey(subKey, slot.start)))) {
            missedMonths++;
          }
        }
        const credits = missedMonths * tierCredits;
        if (credits === 0) {
          rows.push({
            ...base,
            missedMonths,
            credits,
            status: "nothingMissed",
          });
          continue;
        }
        if (dryRun) {
          rows.push({ ...base, missedMonths, credits, status: "pending" });
          continue;
        }
        const grant = await CreditRepository.addUserCredits(
          sub.userId,
          credits,
          "subscription",
          logger,
          t,
          sub.currentPeriodEnd,
          backfillKey,
        );
        if (!grant.success) {
          return grant;
        }
        logger.info("Backfilled yearly plan monthly credits", {
          subscriptionId: sub.id,
          userId: sub.userId,
          missedMonths,
          credits,
        });
        rows.push({
          ...base,
          missedMonths,
          credits,
          status: grant.data.granted ? "granted" : "alreadyGranted",
        });
      }
      const counted = rows.filter(
        (row) => row.status === "pending" || row.status === "granted",
      );
      return success({
        dryRunApplied: dryRun,
        subscriptions: counted.length,
        months: counted.reduce((sum, row) => sum + row.missedMonths, 0),
        credits: counted.reduce((sum, row) => sum + row.credits, 0),
        rows,
      });
    } catch (error) {
      logger.error("Yearly credit backfill failed", parseError(error));
      return fail({
        message: tYearly("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
