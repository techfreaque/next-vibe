/**
 * Users Stats Repository
 */

import "server-only";

import { and, eq, gte, ilike, lte, or, type SQL, sql } from "drizzle-orm";
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
import { userLeadLinks } from "next-vibe/identity/lead/db";
import {
  UserPermissionRole,
  type UserRoleDB,
} from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { paymentRefunds, paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { subscriptions } from "@/subscription/db";
import { SubscriptionStatus } from "@/subscription/enum";

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
import { scopedTranslation } from "./i18n";

export class UsersStatsRepository {
  /**
   * Resolve the queried window.
   * An explicit custom range (CUSTOM preset, or any from/to supplied) wins over
   * the preset so the date pickers actually filter; otherwise fall back to the
   * selected preset. `to` is pushed to the end of its day so the upper bound is
   * inclusive of signups made that day.
   */
  private static resolveDateRange(
    preset: (typeof DateRangePreset)[keyof typeof DateRangePreset],
    from: Date | undefined,
    to: Date | undefined,
  ): { from: Date; to: Date } {
    const hasCustom = preset === DateRangePreset.CUSTOM || Boolean(from ?? to);
    if (hasCustom && (from ?? to)) {
      const preset30 = getDateRangeFromPreset(DateRangePreset.LAST_30_DAYS);
      const resolvedFrom = from ?? preset30.from;
      const resolvedToRaw = to ?? new Date();
      const resolvedTo = new Date(resolvedToRaw);
      resolvedTo.setHours(23, 59, 59, 999);
      // Guard against an inverted range: swap so queries stay valid.
      return resolvedFrom <= resolvedTo
        ? { from: resolvedFrom, to: resolvedTo }
        : { from: resolvedTo, to: resolvedFrom };
    }
    return getDateRangeFromPreset(preset);
  }

  /**
   * Map a UserRoleFilter value to the stored permission role.
   * The filter carries an i18n key ("list.enums.userRoleFilter.customer") while
   * user_roles.role stores the permission role ("enums.userRole.customer"), so a
   * raw string compare always missed - the role filter silently matched nobody.
   */
  private static roleFilterToDbRole(
    role: string,
  ): (typeof UserRoleDB)[number] | null {
    switch (role) {
      case UserRoleFilter.PUBLIC:
        return UserPermissionRole.PUBLIC;
      case UserRoleFilter.CUSTOMER:
        return UserPermissionRole.CUSTOMER;
      case UserRoleFilter.PARTNER_ADMIN:
        return UserPermissionRole.PARTNER_ADMIN;
      case UserRoleFilter.PARTNER_EMPLOYEE:
        return UserPermissionRole.PARTNER_EMPLOYEE;
      case UserRoleFilter.ADMIN:
        return UserPermissionRole.ADMIN;
      default:
        return null;
    }
  }

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
        return `Week ${UsersStatsRepository.getWeekNumber(date)}`;
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

  static async getUserStats(
    rawQuery: UserStatsRequestOutput | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
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
        dateFrom: timePeriodOptions?.dateFrom,
        dateTo: timePeriodOptions?.dateTo,
      };

      logger.debug("Fetching user statistics", query);

      const dateRange = UsersStatsRepository.resolveDateRange(
        query.dateRangePreset,
        query.dateFrom,
        query.dateTo,
      );

      // Attribute conditions (status/role/country/subscription/payment/search)
      // are kept separate from the signup-date window: signup counts filter by
      // users.createdAt in range, but revenue/subscription counts must scope to
      // the SAME users while using their OWN event date for the window.
      const attrConditions: SQL[] = [];

      if (query.status && query.status !== UserStatusFilter.ALL) {
        switch (query.status) {
          case UserStatusFilter.ACTIVE:
            attrConditions.push(eq(users.isActive, true));
            break;
          case UserStatusFilter.INACTIVE:
            attrConditions.push(eq(users.isActive, false));
            break;
          case UserStatusFilter.PENDING:
            attrConditions.push(eq(users.isActive, false));
            attrConditions.push(eq(users.emailVerified, false));
            break;
          case UserStatusFilter.SUSPENDED:
            attrConditions.push(eq(users.isActive, false));
            attrConditions.push(eq(users.emailVerified, true));
            break;
          case UserStatusFilter.EMAIL_VERIFIED:
            attrConditions.push(eq(users.emailVerified, true));
            break;
          case UserStatusFilter.EMAIL_UNVERIFIED:
            attrConditions.push(eq(users.emailVerified, false));
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
          attrConditions.push(searchCondition);
        }
      }

      if (query.role && query.role !== UserRoleFilter.ALL) {
        const dbRole = UsersStatsRepository.roleFilterToDbRole(query.role);
        if (dbRole) {
          attrConditions.push(
            sql`${users.id} IN (SELECT user_id FROM user_roles WHERE role = ${dbRole})`,
          );
        }
      }

      if (query.country) {
        attrConditions.push(ilike(users.locale, `%-${query.country}`));
      }

      if (query.language) {
        attrConditions.push(ilike(users.locale, `${query.language}-%`));
      }

      if (
        query.subscriptionStatus &&
        query.subscriptionStatus !== SubscriptionStatusFilter.ALL
      ) {
        if (
          query.subscriptionStatus === SubscriptionStatusFilter.NO_SUBSCRIPTION
        ) {
          attrConditions.push(
            sql`${users.id} NOT IN (SELECT user_id FROM subscriptions)`,
          );
        } else {
          attrConditions.push(
            sql`${users.id} IN (SELECT user_id FROM subscriptions WHERE status = ${query.subscriptionStatus})`,
          );
        }
      }

      if (
        query.paymentMethod &&
        query.paymentMethod !== PaymentMethodFilter.ALL
      ) {
        if (query.paymentMethod === PaymentMethodFilter.NO_PAYMENT_METHOD) {
          attrConditions.push(
            sql`${users.id} NOT IN (SELECT user_id FROM payment_methods)`,
          );
        } else if (query.paymentMethod === PaymentMethodFilter.CRYPTO) {
          attrConditions.push(
            sql`${users.id} IN (SELECT user_id FROM payment_transactions WHERE provider = 'NOWPAYMENTS')`,
          );
        } else {
          attrConditions.push(
            sql`${users.id} IN (SELECT user_id FROM payment_methods WHERE type = ${query.paymentMethod})`,
          );
        }
      }

      // Signup-window clause: createdAt in range AND all attribute filters.
      const signupConditions: SQL[] = [
        gte(users.createdAt, dateRange.from),
        lte(users.createdAt, dateRange.to),
        ...attrConditions,
      ];
      const whereClause = and(...signupConditions);

      // Bare attribute predicate (no date window) reused to scope
      // revenue/subscription aggregates to the same filtered users; undefined
      // when no attribute filter is set so platform-wide totals are used.
      const attrUserScope =
        attrConditions.length > 0 ? and(...attrConditions) : undefined;

      const timePeriod = timePeriodOptions?.timePeriod ?? TimePeriod.DAY;
      const response = await UsersStatsRepository.buildResponse(
        whereClause,
        attrUserScope,
        dateRange,
        timePeriod,
      );
      return success(response);
    } catch (error) {
      logger.error("Error fetching user statistics", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async buildResponse(
    whereClause: SQL | undefined,
    attrUserScope: SQL | undefined,
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
          ...(attrUserScope
            ? [
                sql`${subscriptions.userId} IN (SELECT ${users.id} FROM ${users} WHERE ${attrUserScope})`,
              ]
            : []),
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
          ...(attrUserScope
            ? [
                sql`${paymentTransactions.userId} IN (SELECT ${users.id} FROM ${users} WHERE ${attrUserScope})`,
              ]
            : []),
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
          ...(attrUserScope
            ? [
                sql`${paymentRefunds.userId} IN (SELECT ${users.id} FROM ${users} WHERE ${attrUserScope})`,
              ]
            : []),
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
    const dateTruncFormat = UsersStatsRepository.getDateTruncFormat(timePeriod);
    const historicalData = await db
      .select({
        period: sql<string>`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${users.createdAt})::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .where(whereClause)
      .groupBy(
        sql`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${users.createdAt})`,
      )
      .orderBy(
        sql`date_trunc(${sql.raw(`'${dateTruncFormat}'`)}, ${users.createdAt})`,
      );

    const growthChart = historicalData.map((item) => ({
      x: UsersStatsRepository.formatPeriodLabel(item.period, timePeriod),
      y: item.count,
      label: UsersStatsRepository.formatPeriodLabel(item.period, timePeriod),
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
            x: "Active Subscriptions",
            y: activeSubscriptions,
            label: "Active Subscriptions",
          },
          {
            x: "Canceled Subscriptions",
            y: canceledSubscriptions,
            label: "Canceled Subscriptions",
          },
          {
            x: "Expired Subscriptions",
            y: expiredSubscriptions,
            label: "Expired Subscriptions",
          },
          {
            x: "No Subscription",
            y: noSubscription,
            label: "No Subscription",
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
        generatedAt: new Date(),
      },
    };
  }
}
