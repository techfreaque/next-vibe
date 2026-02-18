/**
 * Users Stats Repository
 */

import "server-only";

import { and, eq, gte, ilike, lte, or, type SQL, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { userLeadLinks } from "@/app/api/[locale]/leads/db";
import {
  paymentRefunds,
  paymentTransactions,
} from "@/app/api/[locale]/payment/db";
import { PaymentStatus } from "@/app/api/[locale]/payment/enum";
import {
  DateRangePreset,
  getDateRangeFromPreset,
  TimePeriod,
} from "@/app/api/[locale]/shared/stats-filtering";
import { subscriptions } from "@/app/api/[locale]/subscription/db";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { userRoles, users } from "@/app/api/[locale]/user/db";

import {
  PaymentMethodFilter,
  SubscriptionStatusFilter,
  UserRoleFilter,
  UserStatusFilter,
} from "../enum";
import type {
  UserStatsRequestOutput,
  UserStatsResponseOutput,
} from "./definition";

export interface UsersStatsRepository {
  getUserStats(
    data: UserStatsRequestOutput | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserStatsResponseOutput>>;
}

class UsersStatsRepositoryImpl implements UsersStatsRepository {
  private getDateTruncFormat(
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

  private formatPeriodLabel(
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
        return `Week ${this.getWeekNumber(date)}`;
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

  private getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.ceil(
      (diff + startOfYear.getDay() * 24 * 60 * 60 * 1000) / oneWeek,
    );
  }

  async getUserStats(
    rawQuery: UserStatsRequestOutput | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserStatsResponseOutput>> {
    try {
      // Extract nested filters with type safety
      const basicFilters = rawQuery?.basicFilters;
      const subscriptionFilters = rawQuery?.subscriptionFilters;
      const locationFilters = rawQuery?.locationFilters;
      const timePeriodOptions = rawQuery?.timePeriodOptions;

      const query = {
        search: basicFilters?.search,
        status: basicFilters?.status ?? UserStatusFilter.ALL,
        role: basicFilters?.role ?? UserRoleFilter.ALL,
        subscriptionStatus:
          subscriptionFilters?.subscriptionStatus ??
          SubscriptionStatusFilter.ALL,
        paymentMethod:
          subscriptionFilters?.paymentMethod ?? PaymentMethodFilter.ALL,
        country: locationFilters?.country,
        language: locationFilters?.language,
        dateRangePreset:
          timePeriodOptions?.dateRangePreset ?? DateRangePreset.LAST_30_DAYS,
      };

      logger.debug("Fetching user statistics", query);

      const dateRange = getDateRangeFromPreset(query.dateRangePreset);

      const whereConditions: SQL[] = [];
      whereConditions.push(gte(users.createdAt, dateRange.from));
      whereConditions.push(lte(users.createdAt, dateRange.to));

      if (query.status && query.status !== UserStatusFilter.ALL) {
        switch (query.status) {
          case UserStatusFilter.ACTIVE:
            whereConditions.push(eq(users.isActive, true));
            break;
          case UserStatusFilter.INACTIVE:
            whereConditions.push(eq(users.isActive, false));
            break;
          case UserStatusFilter.PENDING:
            whereConditions.push(eq(users.isActive, false));
            whereConditions.push(eq(users.emailVerified, false));
            break;
          case UserStatusFilter.SUSPENDED:
            whereConditions.push(eq(users.isActive, false));
            whereConditions.push(eq(users.emailVerified, true));
            break;
          case UserStatusFilter.EMAIL_VERIFIED:
            whereConditions.push(eq(users.emailVerified, true));
            break;
          case UserStatusFilter.EMAIL_UNVERIFIED:
            whereConditions.push(eq(users.emailVerified, false));
            break;
        }
      }

      if (query.search) {
        const searchCondition = or(
          ilike(users.privateName, `%${query.search}%`),
          ilike(users.publicName, `%${query.search}%`),
          ilike(users.email, `%${query.search}%`),
        );
        if (searchCondition) {
          whereConditions.push(searchCondition);
        }
      }

      if (query.role && query.role !== UserRoleFilter.ALL) {
        whereConditions.push(
          sql`${users.id} IN (SELECT user_id FROM user_roles WHERE role = ${query.role})`,
        );
      }

      if (query.country) {
        whereConditions.push(ilike(users.locale, `%-${query.country}`));
      }

      if (query.language) {
        whereConditions.push(ilike(users.locale, `${query.language}-%`));
      }

      if (
        query.subscriptionStatus &&
        query.subscriptionStatus !== SubscriptionStatusFilter.ALL
      ) {
        if (
          query.subscriptionStatus === SubscriptionStatusFilter.NO_SUBSCRIPTION
        ) {
          whereConditions.push(
            sql`${users.id} NOT IN (SELECT user_id FROM subscriptions)`,
          );
        } else {
          whereConditions.push(
            sql`${users.id} IN (SELECT user_id FROM subscriptions WHERE status = ${query.subscriptionStatus})`,
          );
        }
      }

      if (
        query.paymentMethod &&
        query.paymentMethod !== PaymentMethodFilter.ALL
      ) {
        if (query.paymentMethod === PaymentMethodFilter.NO_PAYMENT_METHOD) {
          whereConditions.push(
            sql`${users.id} NOT IN (SELECT user_id FROM payment_methods)`,
          );
        } else if (query.paymentMethod === PaymentMethodFilter.CRYPTO) {
          whereConditions.push(
            sql`${users.id} IN (SELECT user_id FROM payment_transactions WHERE provider = 'NOWPAYMENTS')`,
          );
        } else {
          whereConditions.push(
            sql`${users.id} IN (SELECT user_id FROM payment_methods WHERE type = ${query.paymentMethod})`,
          );
        }
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      const timePeriod = timePeriodOptions?.timePeriod ?? TimePeriod.DAY;
      const response = await this.buildResponse(
        whereClause,
        dateRange,
        timePeriod,
      );
      return success(response);
    } catch (error) {
      logger.error("Error fetching user statistics", parseError(error));
      return fail({
        message: "app.api.users.stats.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  private async buildResponse(
    whereClause: SQL | undefined,
    dateRange: { from: Date; to: Date },
    timePeriod: (typeof TimePeriod)[keyof typeof TimePeriod],
  ): Promise<UserStatsResponseOutput> {
    const [basicCounts] = await db
      .select({
        totalUsers: sql<number>`count(*)::int`,
        activeUsers: sql<number>`count(*) filter (where ${users.isActive} = true)::int`,
        inactiveUsers: sql<number>`count(*) filter (where ${users.isActive} = false)::int`,
        emailVerifiedUsers: sql<number>`count(*) filter (where ${users.emailVerified} = true)::int`,
        emailUnverifiedUsers: sql<number>`count(*) filter (where ${users.emailVerified} = false)::int`,
      })
      .from(users)
      .where(whereClause);

    const totalUsers = basicCounts?.totalUsers ?? 0;

    const [leadStats] = await db
      .select({
        usersWithLeadId: sql<number>`count(distinct ${userLeadLinks.userId})::int`,
      })
      .from(userLeadLinks)
      .innerJoin(users, eq(userLeadLinks.userId, users.id))
      .where(whereClause ? sql`${whereClause}` : undefined);

    const usersWithLeadId = leadStats?.usersWithLeadId ?? 0;

    // Subscription stats - filter by subscription createdAt
    const [subscriptionCounts] = await db
      .select({
        activeSubscriptions: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.ACTIVE})::int`,
        canceledSubscriptions: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.CANCELED})::int`,
        expiredSubscriptions: sql<number>`count(*) filter (where ${subscriptions.status} IN (${SubscriptionStatus.INCOMPLETE_EXPIRED}, ${SubscriptionStatus.UNPAID}))::int`,
        totalWithSubscription: sql<number>`count(*)::int`,
      })
      .from(subscriptions)
      .where(
        and(
          gte(subscriptions.createdAt, dateRange.from),
          lte(subscriptions.createdAt, dateRange.to),
        ),
      );

    const activeSubscriptions = subscriptionCounts?.activeSubscriptions ?? 0;
    const canceledSubscriptions =
      subscriptionCounts?.canceledSubscriptions ?? 0;
    const expiredSubscriptions = subscriptionCounts?.expiredSubscriptions ?? 0;
    const totalWithSubscription =
      subscriptionCounts?.totalWithSubscription ?? 0;
    const noSubscription = totalUsers - totalWithSubscription;

    // Payment stats - filter by transaction createdAt
    const [paymentCounts] = await db
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

    const [refundCounts] = await db
      .select({
        refundedAmount: sql<number>`coalesce(sum(${paymentRefunds.amount}::numeric), 0)::int`,
        refundCount: sql<number>`count(*)::int`,
      })
      .from(paymentRefunds)
      .where(
        and(
          gte(paymentRefunds.createdAt, dateRange.from),
          lte(paymentRefunds.createdAt, dateRange.to),
        ),
      );

    const totalRevenue = paymentCounts?.totalRevenue ?? 0;
    const transactionCount = paymentCounts?.transactionCount ?? 0;
    const refundCount = refundCounts?.refundCount ?? 0;
    const averageOrderValue =
      transactionCount > 0 ? Math.round(totalRevenue / transactionCount) : 0;
    const refundRate =
      transactionCount > 0 ? refundCount / transactionCount : 0;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [timeBased] = await db
      .select({
        newUsers: sql<number>`count(*)::int`,
        usersCreatedToday: sql<number>`count(*) filter (where ${users.createdAt} >= ${today})::int`,
        usersCreatedThisWeek: sql<number>`count(*) filter (where ${users.createdAt} >= ${thisWeek})::int`,
        usersCreatedThisMonth: sql<number>`count(*) filter (where ${users.createdAt} >= ${thisMonth})::int`,
        usersCreatedLastMonth: sql<number>`count(*) filter (where ${users.createdAt} >= ${lastMonth} and ${users.createdAt} < ${thisMonth})::int`,
      })
      .from(users)
      .where(whereClause);

    // Generate historical chart data based on the selected time period
    const dateTruncFormat = this.getDateTruncFormat(timePeriod);
    const historicalData = await db
      .select({
        period: sql<string>`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${users.createdAt})::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .where(
        and(
          gte(users.createdAt, dateRange.from),
          lte(users.createdAt, dateRange.to),
        ),
      )
      .groupBy(
        sql`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${users.createdAt})`,
      )
      .orderBy(
        sql`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${users.createdAt})`,
      );

    const growthChart = historicalData.map((item) => ({
      x: this.formatPeriodLabel(item.period, timePeriod),
      y: item.count,
      label: this.formatPeriodLabel(item.period, timePeriod),
    }));

    const roleStats = await db
      .select({
        role: userRoles.role,
        count: sql<number>`count(*)::int`,
      })
      .from(userRoles)
      .leftJoin(users, eq(userRoles.userId, users.id))
      .where(whereClause)
      .groupBy(userRoles.role);

    const roleCounts = {
      publicUsers: 0,
      customerUsers: 0,
      partnerAdminUsers: 0,
      partnerEmployeeUsers: 0,
      adminUsers: 0,
    };

    const roleChart: Array<{ x: string; y: number; label: string }> = [];

    for (const item of roleStats) {
      const roleKey = item.role;
      const count = item.count;
      const lastPart = roleKey.split(".").pop() ?? "";

      switch (lastPart) {
        case "public":
          roleCounts.publicUsers = count;
          break;
        case "customer":
          roleCounts.customerUsers = count;
          break;
        case "partnerAdmin":
          roleCounts.partnerAdminUsers = count;
          break;
        case "partnerEmployee":
          roleCounts.partnerEmployeeUsers = count;
          break;
        case "admin":
          roleCounts.adminUsers = count;
          break;
      }

      roleChart.push({ x: roleKey, y: count, label: roleKey });
    }

    roleChart.sort((a, b) => b.y - a.y);

    const verificationRate =
      totalUsers > 0 ? (basicCounts?.emailVerifiedUsers ?? 0) / totalUsers : 0;
    const leadAssociationRate =
      totalUsers > 0 ? usersWithLeadId / totalUsers : 0;
    const growthRate =
      (timeBased?.usersCreatedLastMonth ?? 0) > 0
        ? ((timeBased?.usersCreatedThisMonth ?? 0) -
            (timeBased?.usersCreatedLastMonth ?? 0)) /
          (timeBased?.usersCreatedLastMonth ?? 1)
        : 0;
    const retentionRate =
      totalUsers > 0 ? (basicCounts?.activeUsers ?? 0) / totalUsers : 0;

    return {
      overviewStats: {
        totalUsers,
        activeUsers: basicCounts?.activeUsers ?? 0,
        inactiveUsers: basicCounts?.inactiveUsers ?? 0,
        newUsers: timeBased?.newUsers ?? 0,
      },
      emailStats: {
        emailVerifiedUsers: basicCounts?.emailVerifiedUsers ?? 0,
        emailUnverifiedUsers: basicCounts?.emailUnverifiedUsers ?? 0,
        verificationRate,
      },
      subscriptionStats: {
        activeSubscriptions,
        canceledSubscriptions,
        expiredSubscriptions,
        noSubscription,
        subscriptionChart: [
          {
            x: "app.api.users.stats.response.subscriptionStats.activeSubscriptions.label",
            y: activeSubscriptions,
            label:
              "app.api.users.stats.response.subscriptionStats.activeSubscriptions.label",
          },
          {
            x: "app.api.users.stats.response.subscriptionStats.canceledSubscriptions.label",
            y: canceledSubscriptions,
            label:
              "app.api.users.stats.response.subscriptionStats.canceledSubscriptions.label",
          },
          {
            x: "app.api.users.stats.response.subscriptionStats.expiredSubscriptions.label",
            y: expiredSubscriptions,
            label:
              "app.api.users.stats.response.subscriptionStats.expiredSubscriptions.label",
          },
          {
            x: "app.api.users.stats.response.subscriptionStats.noSubscription.label",
            y: noSubscription,
            label:
              "app.api.users.stats.response.subscriptionStats.noSubscription.label",
          },
        ],
      },
      paymentStats: {
        totalRevenue,
        transactionCount,
        averageOrderValue,
        refundRate,
      },
      roleDistribution: {
        ...roleCounts,
        roleChart,
      },
      growthMetrics: {
        timeSeriesData: {
          usersCreatedToday: timeBased?.usersCreatedToday ?? 0,
          usersCreatedThisWeek: timeBased?.usersCreatedThisWeek ?? 0,
          usersCreatedThisMonth: timeBased?.usersCreatedThisMonth ?? 0,
          usersCreatedLastMonth: timeBased?.usersCreatedLastMonth ?? 0,
        },
        performanceRates: {
          growthRate,
          leadToUserConversionRate: leadAssociationRate,
          retentionRate,
        },
        growthChart,
      },
      businessInsights: {
        generatedAt: new Date().toISOString(),
      },
    };
  }
}

export const usersStatsRepository = new UsersStatsRepositoryImpl();
