/**
 * Subscription Admin Stats Repository
 */

import "server-only";

import { and, eq, gte, lte, sql } from "drizzle-orm";
import { getDateRangeFromPreset } from "next-vibe/core/core-utils/stats-filtering.schema";
import {
  DateRangePreset,
  TimePeriod,
} from "next-vibe/core/core-utils/stats-filtering.schema";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditPacks, creditWallets } from "@/credits/db";
import { financeRevenueEvents } from "@/finance/db";
import { RevenueEventKind } from "@/finance/enum";
import { paymentTransactions } from "@/payment/db";
import { CheckoutMode, PaymentStatus } from "@/payment/enum";
import { payoutRequests, referralEarnings, userReferrals } from "@/referral/db";
import { PayoutStatus } from "@/referral/enum";
import { subscriptions } from "@/subscription/db";
import { BillingInterval, SubscriptionStatus } from "@/subscription/enum";
import { usdAmountSql } from "@/users/money-sql";

import type {
  SubscriptionStatsRequestOutput,
  SubscriptionStatsResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class SubscriptionAdminStatsRepository {
  private static getDateTruncFormat(
    timePeriod: (typeof TimePeriod)[keyof typeof TimePeriod],
  ): string {
    switch (timePeriod) {
      case TimePeriod.DAY:
        return "day";
      case TimePeriod.WEEK:
        return "week";
      case TimePeriod.MONTH:
        return "month";
      case TimePeriod.QUARTER:
        return "quarter";
      case TimePeriod.YEAR:
        return "year";
      default:
        return "day";
    }
  }

  private static formatPeriodLabel(
    period: string,
    timePeriod: (typeof TimePeriod)[keyof typeof TimePeriod],
    locale: CountryLanguage,
  ): string {
    const date = new Date(period);
    switch (timePeriod) {
      case TimePeriod.DAY:
        return date.toLocaleDateString(locale, {
          month: "short",
          day: "numeric",
        });
      case TimePeriod.WEEK:
        return `Week ${SubscriptionAdminStatsRepository.getWeekNumber(date)}`;
      case TimePeriod.MONTH:
        return date.toLocaleDateString(locale, {
          month: "short",
          year: "numeric",
        });
      case TimePeriod.QUARTER:
        return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      case TimePeriod.YEAR:
        return date.getFullYear().toString();
      default:
        return period;
    }
  }

  private static getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.ceil(
      (diff + startOfYear.getDay() * 24 * 60 * 60 * 1000) / oneWeek,
    );
  }

  static async getStats(
    rawQuery: SubscriptionStatsRequestOutput | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionStatsResponseOutput>> {
    try {
      const timePeriodOptions = rawQuery?.timePeriodOptions;
      const dateRangePreset =
        timePeriodOptions?.dateRangePreset ?? DateRangePreset.LAST_30_DAYS;
      const timePeriod = timePeriodOptions?.timePeriod ?? TimePeriod.DAY;

      logger.debug("Fetching subscription admin statistics", {
        dateRangePreset,
        timePeriod,
      });

      const dateRange = getDateRangeFromPreset(dateRangePreset);

      const response = await SubscriptionAdminStatsRepository.buildResponse(
        dateRange,
        timePeriod,
        locale,
      );
      return success(response);
    } catch (error) {
      logger.error(
        "Error fetching subscription admin statistics",
        parseError(error),
      );
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Net revenue in range, USD cents. Primary source: the finance ledger
   * (processor data incl. renewals, refunds and disputes). Fallback when it
   * holds nothing in range (finance ingest never ran on this instance): our
   * own succeeded checkouts, FX-normalized (no renewals, so a lower bound).
   */
  private static async revenueInRange(dateRange: {
    from: Date;
    to: Date;
  }): Promise<{
    netCents: number;
    grossCents: number;
    chargeCount: number;
    fromFinanceLedger: boolean;
  }> {
    const [ledger] = await db
      .select({
        gross: sql<number>`coalesce(sum(${financeRevenueEvents.amountUsd}) filter (where ${financeRevenueEvents.kind} = ${RevenueEventKind.CHARGE}), 0)::float`,
        reversed: sql<number>`coalesce(sum(${financeRevenueEvents.amountUsd}) filter (where ${financeRevenueEvents.kind} in (${RevenueEventKind.REFUND}, ${RevenueEventKind.DISPUTE})), 0)::float`,
        charges: sql<number>`count(*) filter (where ${financeRevenueEvents.kind} = ${RevenueEventKind.CHARGE})::int`,
      })
      .from(financeRevenueEvents)
      .where(
        and(
          gte(financeRevenueEvents.occurredAt, dateRange.from),
          lte(financeRevenueEvents.occurredAt, dateRange.to),
        ),
      );
    const charges = ledger?.charges ?? 0;
    if (charges > 0) {
      const gross = Number(ledger?.gross ?? 0);
      const reversed = Number(ledger?.reversed ?? 0);
      return {
        netCents: Math.round((gross - reversed) * 100),
        grossCents: Math.round(gross * 100),
        chargeCount: charges,
        fromFinanceLedger: true,
      };
    }
    const [local] = await db
      .select({
        gross: sql<number>`coalesce(sum(${usdAmountSql(paymentTransactions.amount, paymentTransactions.currency)}), 0)::float`,
        charges: sql<number>`count(*)::int`,
      })
      .from(paymentTransactions)
      .where(
        and(
          eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
          gte(paymentTransactions.createdAt, dateRange.from),
          lte(paymentTransactions.createdAt, dateRange.to),
        ),
      );
    const grossCents = Math.round(Number(local?.gross ?? 0) * 100);
    return {
      netCents: grossCents,
      grossCents,
      chargeCount: local?.charges ?? 0,
      fromFinanceLedger: false,
    };
  }

  private static async buildResponse(
    dateRange: { from: Date; to: Date },
    timePeriod: (typeof TimePeriod)[keyof typeof TimePeriod],
    locale: CountryLanguage,
  ): Promise<SubscriptionStatsResponseOutput> {
    // All money below is USD CENTS (the widget formats value / 100).
    // payment_transactions holds major units in mixed USD / EUR / PLN, so every
    // sum goes through the finance FX table, never a raw sum of mixed units.
    //
    // Revenue: the finance ledger (finance_revenue_events) is the processor's
    // own record - it carries fees and every Stripe RENEWAL (payment_transactions
    // records renewals only since 2026-11). Fall back to
    // payment_transactions only when the finance ledger has nothing in range.
    const revenue =
      await SubscriptionAdminStatsRepository.revenueInRange(dateRange);
    const totalRevenue = revenue.netCents;
    const transactionCount = revenue.chargeCount;
    const avgOrderValue =
      transactionCount > 0
        ? Math.round(revenue.grossCents / transactionCount)
        : 0;

    // MRR: each live subscription at ITS OWN price (latest succeeded
    // subscription payment of that user, FX to USD), yearly / 12. Live =
    // status ACTIVE and the paid period has not ended (a stale "active" row
    // whose period ran out long ago is not revenue). Scheduled cancellations
    // still count until they end, matching Stripe.
    const now = new Date();
    const latestSubPayment = db
      .select({
        userId: paymentTransactions.userId,
        usd: sql<number>`${usdAmountSql(paymentTransactions.amount, paymentTransactions.currency)}`.as(
          "usd",
        ),
        rn: sql<number>`row_number() over (partition by ${paymentTransactions.userId} order by ${paymentTransactions.createdAt} desc)`.as(
          "rn",
        ),
      })
      .from(paymentTransactions)
      .where(
        and(
          eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
          eq(paymentTransactions.mode, CheckoutMode.SUBSCRIPTION),
        ),
      )
      .as("latest_sub_payment");
    const [mrrResult] = await db
      .select({
        mrrUsd: sql<number>`coalesce(sum(
          CASE
            WHEN ${subscriptions.billingInterval} = ${BillingInterval.YEARLY} THEN ${latestSubPayment.usd} / 12
            ELSE ${latestSubPayment.usd}
          END
        ), 0)::float`,
      })
      .from(subscriptions)
      .leftJoin(
        latestSubPayment,
        and(
          eq(latestSubPayment.userId, subscriptions.userId),
          eq(latestSubPayment.rn, 1),
        ),
      )
      .where(
        and(
          eq(subscriptions.status, SubscriptionStatus.ACTIVE),
          gte(subscriptions.currentPeriodEnd, now),
        ),
      );
    const mrr = Math.round(Number(mrrResult?.mrrUsd ?? 0) * 100);
    const arr = mrr * 12;

    // Subscription counts (active = live as defined for MRR above)
    const [subCounts] = await db
      .select({
        activeCount: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.ACTIVE} and ${subscriptions.currentPeriodEnd} >= ${now})::int`,
        trialingCount: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.TRIALING})::int`,
        canceledCount: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.CANCELED})::int`,
        totalCount: sql<number>`count(*)::int`,
      })
      .from(subscriptions);

    const activeCount = subCounts?.activeCount ?? 0;
    const trialingCount = subCounts?.trialingCount ?? 0;
    const canceledCount = subCounts?.canceledCount ?? 0;
    const totalSubCount = subCounts?.totalCount ?? 0;
    const churnRate = totalSubCount > 0 ? canceledCount / totalSubCount : 0;

    // Interval stats
    const [intervalResult] = await db
      .select({
        monthlyCount: sql<number>`count(*) filter (where ${subscriptions.billingInterval} = ${BillingInterval.MONTHLY})::int`,
        yearlyCount: sql<number>`count(*) filter (where ${subscriptions.billingInterval} = ${BillingInterval.YEARLY})::int`,
      })
      .from(subscriptions)
      .where(
        sql`${subscriptions.status} IN (${SubscriptionStatus.ACTIVE}, ${SubscriptionStatus.TRIALING}) and ${subscriptions.currentPeriodEnd} >= ${now}`,
      );

    const monthlyCount = intervalResult?.monthlyCount ?? 0;
    const yearlyCount = intervalResult?.yearlyCount ?? 0;
    const totalIntervalCount = monthlyCount + yearlyCount;
    const yearlyRevenuePct =
      totalIntervalCount > 0 ? yearlyCount / totalIntervalCount : 0;

    // Credit stats - packs from user wallets
    const [creditResult] = await db
      .select({
        totalPurchased: sql<number>`coalesce(sum(${creditPacks.originalAmount}::numeric), 0)::int`,
        totalSpent: sql<number>`coalesce(sum((${creditPacks.originalAmount}::numeric - ${creditPacks.remaining}::numeric)), 0)::int`,
        packsSold: sql<number>`count(*)::int`,
        avgPackSize: sql<number>`coalesce(avg(${creditPacks.originalAmount}::numeric), 0)::int`,
      })
      .from(creditPacks)
      .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
      .where(sql`${creditWallets.userId} IS NOT NULL`);

    const totalPurchased = creditResult?.totalPurchased ?? 0;
    const totalSpent = creditResult?.totalSpent ?? 0;
    const packsSold = creditResult?.packsSold ?? 0;
    const avgPackSize = creditResult?.avgPackSize ?? 0;

    // Referral stats
    const [referralResult] = await db
      .select({
        totalReferrals: sql<number>`count(*)::int`,
      })
      .from(userReferrals);

    const [earningsResult] = await db
      .select({
        totalEarned: sql<number>`coalesce(sum(${referralEarnings.amountCents}), 0)::int`,
      })
      .from(referralEarnings);

    const [payoutResult] = await db
      .select({
        pendingPayouts: sql<number>`coalesce(sum(${payoutRequests.amountCents}) filter (where ${payoutRequests.status} IN (${PayoutStatus.PENDING}, ${PayoutStatus.APPROVED})), 0)::int`,
      })
      .from(payoutRequests);

    // Conversion: referred users who made at least one succeeded payment.
    const [convertedResult] = await db
      .select({
        converted: sql<number>`count(*)::int`,
      })
      .from(userReferrals)
      .where(
        sql`exists (select 1 from ${paymentTransactions} where ${paymentTransactions.userId} = ${userReferrals.referredUserId} and ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED})`,
      );

    const totalReferrals = referralResult?.totalReferrals ?? 0;
    const totalEarned = earningsResult?.totalEarned ?? 0;
    const pendingPayouts = payoutResult?.pendingPayouts ?? 0;
    const conversionRate =
      totalReferrals > 0
        ? (convertedResult?.converted ?? 0) / totalReferrals
        : 0;

    // Revenue chart - time series
    const dateTruncFormat =
      SubscriptionAdminStatsRepository.getDateTruncFormat(timePeriod);
    const revenueChartData = revenue.fromFinanceLedger
      ? await db
          .select({
            period: sql<string>`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${financeRevenueEvents.occurredAt})::text`,
            total: sql<number>`round(coalesce(sum(case when ${financeRevenueEvents.kind} = ${RevenueEventKind.CHARGE} then ${financeRevenueEvents.amountUsd} when ${financeRevenueEvents.kind} in (${RevenueEventKind.REFUND}, ${RevenueEventKind.DISPUTE}) then -${financeRevenueEvents.amountUsd} else 0 end), 0) * 100)::int`,
          })
          .from(financeRevenueEvents)
          .where(
            and(
              gte(financeRevenueEvents.occurredAt, dateRange.from),
              lte(financeRevenueEvents.occurredAt, dateRange.to),
            ),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`)
      : await db
          .select({
            period: sql<string>`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${paymentTransactions.createdAt})::text`,
            total: sql<number>`round(coalesce(sum(${usdAmountSql(paymentTransactions.amount, paymentTransactions.currency)}) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}), 0) * 100)::int`,
          })
          .from(paymentTransactions)
          .where(
            and(
              gte(paymentTransactions.createdAt, dateRange.from),
              lte(paymentTransactions.createdAt, dateRange.to),
            ),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);

    const revenueChart = revenueChartData.map((item) => ({
      x: SubscriptionAdminStatsRepository.formatPeriodLabel(
        item.period,
        timePeriod,
        locale,
      ),
      y: item.total,
      label: SubscriptionAdminStatsRepository.formatPeriodLabel(
        item.period,
        timePeriod,
        locale,
      ),
    }));

    // Subscription chart - time series of active subscriptions created
    const subChartData = await db
      .select({
        period: sql<string>`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${subscriptions.createdAt})::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(subscriptions)
      .where(
        and(
          gte(subscriptions.createdAt, dateRange.from),
          lte(subscriptions.createdAt, dateRange.to),
        ),
      )
      .groupBy(
        sql`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${subscriptions.createdAt})`,
      )
      .orderBy(
        sql`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${subscriptions.createdAt})`,
      );

    const subscriptionChart = subChartData.map((item) => ({
      x: SubscriptionAdminStatsRepository.formatPeriodLabel(
        item.period,
        timePeriod,
        locale,
      ),
      y: item.count,
      label: SubscriptionAdminStatsRepository.formatPeriodLabel(
        item.period,
        timePeriod,
        locale,
      ),
    }));

    return {
      revenueStats: {
        mrr,
        arr,
        totalRevenue,
        avgOrderValue,
      },
      subscriptionStats: {
        activeCount,
        trialingCount,
        canceledCount,
        churnRate,
      },
      intervalStats: {
        monthlyCount,
        yearlyCount,
        yearlyRevenuePct,
      },
      creditStats: {
        totalPurchased,
        totalSpent,
        packsSold,
        avgPackSize,
      },
      referralStats: {
        totalReferrals,
        conversionRate,
        totalEarned,
        pendingPayouts,
      },
      growthMetrics: {
        revenueChart,
        subscriptionChart,
      },
      businessInsights: {
        generatedAt: new Date(),
      },
    };
  }
}
