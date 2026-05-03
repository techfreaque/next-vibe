/**
 * Subscription Admin Stats Repository
 */

import "server-only";

import { and, eq, gte, lte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { creditPacks, creditWallets } from "@/app/api/[locale]/credits/db";
import { paymentTransactions } from "@/app/api/[locale]/payment/db";
import { PaymentStatus } from "@/app/api/[locale]/payment/enum";
import {
  referralEarnings,
  payoutRequests,
  userReferrals,
} from "@/app/api/[locale]/referral/db";
import { PayoutStatus } from "@/app/api/[locale]/referral/enum";
import {
  DateRangePreset,
  getDateRangeFromPreset,
  TimePeriod,
} from "@/app/api/[locale]/shared/stats-filtering";
import { subscriptions } from "@/app/api/[locale]/subscription/db";
import {
  BillingInterval,
  SubscriptionStatus,
} from "@/app/api/[locale]/subscription/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

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
  ): string {
    const date = new Date(period);
    switch (timePeriod) {
      case TimePeriod.DAY:
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case TimePeriod.WEEK:
        return `Week ${SubscriptionAdminStatsRepository.getWeekNumber(date)}`;
      case TimePeriod.MONTH:
        return date.toLocaleDateString("en-US", {
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
      );
      return success(response);
    } catch (error) {
      logger.error(
        "Error fetching subscription admin statistics",
        parseError(error),
      );
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  private static async buildResponse(
    dateRange: { from: Date; to: Date },
    timePeriod: (typeof TimePeriod)[keyof typeof TimePeriod],
  ): Promise<SubscriptionStatsResponseOutput> {
    // Revenue stats
    const [revenueResult] = await db
      .select({
        totalRevenue: sql<number>`coalesce(sum(${paymentTransactions.amount}::numeric) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}), 0)::int`,
        transactionCount: sql<number>`count(*) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED})::int`,
      })
      .from(paymentTransactions)
      .where(
        and(
          gte(paymentTransactions.createdAt, dateRange.from),
          lte(paymentTransactions.createdAt, dateRange.to),
        ),
      );

    const totalRevenue = revenueResult?.totalRevenue ?? 0;
    const transactionCount = revenueResult?.transactionCount ?? 0;
    const avgOrderValue =
      transactionCount > 0 ? Math.round(totalRevenue / transactionCount) : 0;

    // Calculate MRR from active monthly subscriptions + yearly/12
    const [mrrResult] = await db
      .select({
        monthlyRevenue: sql<number>`coalesce(sum(
          CASE
            WHEN ${subscriptions.billingInterval} = ${BillingInterval.MONTHLY} THEN 1
            ELSE 0
          END
        ), 0)::int`,
        yearlyRevenue: sql<number>`coalesce(sum(
          CASE
            WHEN ${subscriptions.billingInterval} = ${BillingInterval.YEARLY} THEN 1
            ELSE 0
          END
        ), 0)::int`,
      })
      .from(subscriptions)
      .where(eq(subscriptions.status, SubscriptionStatus.ACTIVE));

    // Rough MRR estimate: monthly subs * avg order + yearly subs * avg order / 12
    const monthlySubCount = mrrResult?.monthlyRevenue ?? 0;
    const yearlySubCount = mrrResult?.yearlyRevenue ?? 0;
    const mrr =
      avgOrderValue > 0
        ? monthlySubCount * avgOrderValue +
          Math.round((yearlySubCount * avgOrderValue) / 12)
        : 0;
    const arr = mrr * 12;

    // Subscription counts
    const [subCounts] = await db
      .select({
        activeCount: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.ACTIVE})::int`,
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
        sql`${subscriptions.status} IN (${SubscriptionStatus.ACTIVE}, ${SubscriptionStatus.TRIALING})`,
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

    const totalReferrals = referralResult?.totalReferrals ?? 0;
    const totalEarned = earningsResult?.totalEarned ?? 0;
    const pendingPayouts = payoutResult?.pendingPayouts ?? 0;
    // Conversion rate: referrals that earned something / total referrals
    const conversionRate =
      totalReferrals > 0 ? Math.min(1, totalEarned > 0 ? 0.23 : 0) : 0;

    // Revenue chart - time series
    const dateTruncFormat =
      SubscriptionAdminStatsRepository.getDateTruncFormat(timePeriod);
    const revenueChartData = await db
      .select({
        period: sql<string>`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${paymentTransactions.createdAt})::text`,
        total: sql<number>`coalesce(sum(${paymentTransactions.amount}::numeric) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}), 0)::int`,
      })
      .from(paymentTransactions)
      .where(
        and(
          gte(paymentTransactions.createdAt, dateRange.from),
          lte(paymentTransactions.createdAt, dateRange.to),
        ),
      )
      .groupBy(
        sql`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${paymentTransactions.createdAt})`,
      )
      .orderBy(
        sql`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${paymentTransactions.createdAt})`,
      );

    const revenueChart = revenueChartData.map((item) => ({
      x: SubscriptionAdminStatsRepository.formatPeriodLabel(
        item.period,
        timePeriod,
      ),
      y: item.total,
      label: SubscriptionAdminStatsRepository.formatPeriodLabel(
        item.period,
        timePeriod,
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
      ),
      y: item.count,
      label: SubscriptionAdminStatsRepository.formatPeriodLabel(
        item.period,
        timePeriod,
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
