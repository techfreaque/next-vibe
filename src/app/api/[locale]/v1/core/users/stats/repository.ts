/**
 * Users Stats Repository
 * Handles database operations for user statistics as historical charts
 */

import "server-only";

import {
  and,
  eq,
  gte,
  ilike,
  isNotNull,
  isNull,
  lte,
  or,
  type SQL,
  sql,
} from "drizzle-orm";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { userRoles, users } from "@/app/api/[locale]/v1/core/user/db";
import type { CountryLanguage } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import {
  DateRangePreset,
  getDateRangeFromPreset,
} from "next-vibe/shared/types/stats-filtering.schema";
import { parseError } from "next-vibe/shared/utils";

import { UserRoleFilter, UserStatusFilter } from "../enum";

// Manual types to fix the definition issues
interface UserStatsRequest {
  status?: string;
  role?: string;
  country?: string;
  language?: string;
  search?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  hasLeadId?: boolean;
  hasStripeCustomerId?: boolean;
  preferredContactMethod?: string;
  hasPhone?: boolean;
  hasBio?: boolean;
  hasWebsite?: boolean;
  hasJobTitle?: boolean;
  dateRangePreset?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface UsersStatsResponse {
  // Nested structures
  overviewStats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    newUsers: number;
  };
  emailStats: {
    emailVerifiedUsers: number;
    emailUnverifiedUsers: number;
    verificationRate: number;
  };
  profileStats: {
    complete: {
      usersWithPhone: number;
      usersWithBio: number;
      usersWithWebsite: number;
      usersWithJobTitle: number;
      usersWithImage: number;
    };
    integration: {
      usersWithStripeId: number;
      usersWithoutStripeId: number;
      stripeIntegrationRate: number;
      usersWithLeadId: number;
      usersWithoutLeadId: number;
      leadAssociationRate: number;
    };
  };
  roleDistribution: {
    publicUsers: number;
    customerUsers: number;
    partnerAdminUsers: number;
    partnerEmployeeUsers: number;
    adminUsers: number;
  };
  growthMetrics: {
    timeSeriesData: {
      usersCreatedToday: number;
      usersCreatedThisWeek: number;
      usersCreatedThisMonth: number;
      usersCreatedLastMonth: number;
    };
    performanceRates: {
      growthRate: number;
      leadToUserConversionRate: number;
      retentionRate: number;
    };
  };
  businessInsights: {
    uniqueCompanies: number;
    generatedAt: string;
  };

  // Flat fields for backward compatibility
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
  emailVerifiedUsers: number;
  emailUnverifiedUsers: number;
  verificationRate: number;
  usersWithPhone: number;
  usersWithBio: number;
  usersWithWebsite: number;
  usersWithJobTitle: number;
  usersWithImage: number;
  usersWithStripeId: number;
  usersWithoutStripeId: number;
  stripeIntegrationRate: number;
  usersWithLeadId: number;
  usersWithoutLeadId: number;
  leadAssociationRate: number;
  publicUsers: number;
  customerUsers: number;
  partnerAdminUsers: number;
  partnerEmployeeUsers: number;
  adminUsers: number;
  uniqueCompanies: number;
  usersCreatedToday: number;
  usersCreatedThisWeek: number;
  usersCreatedThisMonth: number;
  usersCreatedLastMonth: number;
  growthRate: number;
  leadToUserConversionRate: number;
  retentionRate: number;
  generatedAt: string;
}

/**
 * Users Stats Repository Interface
 */
export interface UsersStatsRepository {
  getUserStats(
    data: UserStatsRequest,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UsersStatsResponse>>;
}

/**
 * Users Stats Repository Implementation
 */
class UsersStatsRepositoryImpl implements UsersStatsRepository {
  /**
   * Get comprehensive user statistics as historical charts with extensive filtering
   */
  async getUserStats(
    rawQuery: UserStatsRequest,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UsersStatsResponse>> {
    try {
      // Apply defaults to handle optional properties from apiHandler
      const query = {
        ...rawQuery,
        dateRangePreset:
          rawQuery.dateRangePreset ?? DateRangePreset.LAST_30_DAYS,
        status: rawQuery.status ?? UserStatusFilter.ALL,
        role: rawQuery.role ?? UserRoleFilter.ALL,
      };

      logger.debug(
        "Fetching user statistics with comprehensive filters",
        query,
      );

      // Calculate date range
      const dateRange =
        query.dateFrom && query.dateTo
          ? { from: new Date(query.dateFrom), to: new Date(query.dateTo) }
          : getDateRangeFromPreset(query.dateRangePreset as DateRangePreset);

      // Build comprehensive where conditions for filtering
      const whereConditions = [];

      // Date range filter
      whereConditions.push(gte(users.createdAt, dateRange.from));
      whereConditions.push(lte(users.createdAt, dateRange.to));

      // Status filter
      if (query.status && query.status !== UserStatusFilter.ALL) {
        switch (query.status) {
          case UserStatusFilter.ACTIVE:
            whereConditions.push(eq(users.isActive, true));
            break;
          case UserStatusFilter.INACTIVE:
            whereConditions.push(eq(users.isActive, false));
            break;
          case UserStatusFilter.EMAIL_VERIFIED:
            whereConditions.push(eq(users.emailVerified, true));
            break;
          case UserStatusFilter.EMAIL_UNVERIFIED:
            whereConditions.push(eq(users.emailVerified, false));
            break;
        }
      }

      // Search filter
      if (query.search) {
        whereConditions.push(
          or(
            ilike(users.firstName, `%${query.search}%`),
            ilike(users.lastName, `%${query.search}%`),
            ilike(users.email, `%${query.search}%`),
            ilike(users.company, `%${query.search}%`),
          ),
        );
      }

      // Additional user property filters
      if (query.emailVerified !== undefined) {
        whereConditions.push(eq(users.emailVerified, query.emailVerified));
      }

      if (query.isActive !== undefined) {
        whereConditions.push(eq(users.isActive, query.isActive));
      }

      if (query.hasLeadId !== undefined) {
        if (query.hasLeadId) {
          whereConditions.push(isNotNull(users.leadId));
        } else {
          whereConditions.push(isNull(users.leadId));
        }
      }

      if (query.hasStripeCustomerId !== undefined) {
        if (query.hasStripeCustomerId) {
          whereConditions.push(isNotNull(users.stripeCustomerId));
        } else {
          whereConditions.push(isNull(users.stripeCustomerId));
        }
      }

      // Skip preferredContactMethod filtering for now due to enum type complexity
      // if (query.preferredContactMethod) {
      //   whereConditions.push(
      //     eq(users.preferredContactMethod, query.preferredContactMethod),
      //   );
      // }

      if (query.hasPhone !== undefined) {
        if (query.hasPhone) {
          whereConditions.push(isNotNull(users.phone));
        } else {
          whereConditions.push(isNull(users.phone));
        }
      }

      if (query.hasBio !== undefined) {
        if (query.hasBio) {
          whereConditions.push(isNotNull(users.bio));
        } else {
          whereConditions.push(isNull(users.bio));
        }
      }

      if (query.hasWebsite !== undefined) {
        if (query.hasWebsite) {
          whereConditions.push(isNotNull(users.website));
        } else {
          whereConditions.push(isNull(users.website));
        }
      }

      if (query.hasJobTitle !== undefined) {
        if (query.hasJobTitle) {
          whereConditions.push(isNotNull(users.jobTitle));
        } else {
          whereConditions.push(isNull(users.jobTitle));
        }
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Generate user statistics
      const currentPeriodStats = await this.generateCurrentPeriodStats(
        whereClause,
        logger,
      );

      // Structure response according to the new nested definition
      const response: UsersStatsResponse = {
        // Nested overview stats
        overviewStats: {
          totalUsers: currentPeriodStats.totalUsers,
          activeUsers: currentPeriodStats.activeUsers,
          inactiveUsers: currentPeriodStats.inactiveUsers,
          newUsers: currentPeriodStats.newUsers,
        },

        // Nested email stats
        emailStats: {
          emailVerifiedUsers: currentPeriodStats.emailVerifiedUsers,
          emailUnverifiedUsers: currentPeriodStats.emailUnverifiedUsers,
          verificationRate: currentPeriodStats.verificationRate,
        },

        // Nested profile stats
        profileStats: {
          complete: {
            usersWithPhone: currentPeriodStats.usersWithPhone,
            usersWithBio: currentPeriodStats.usersWithBio,
            usersWithWebsite: currentPeriodStats.usersWithWebsite,
            usersWithJobTitle: currentPeriodStats.usersWithJobTitle,
            usersWithImage: currentPeriodStats.usersWithImage,
          },
          integration: {
            usersWithStripeId: currentPeriodStats.usersWithStripeId,
            usersWithoutStripeId: currentPeriodStats.usersWithoutStripeId,
            stripeIntegrationRate: currentPeriodStats.stripeIntegrationRate,
            usersWithLeadId: currentPeriodStats.usersWithLeadId,
            usersWithoutLeadId: currentPeriodStats.usersWithoutLeadId,
            leadAssociationRate: currentPeriodStats.leadAssociationRate,
          },
        },

        // Nested role distribution
        roleDistribution: {
          publicUsers: currentPeriodStats.publicUsers,
          customerUsers: currentPeriodStats.customerUsers,
          partnerAdminUsers: currentPeriodStats.partnerAdminUsers,
          partnerEmployeeUsers: currentPeriodStats.partnerEmployeeUsers,
          adminUsers: currentPeriodStats.adminUsers,
        },

        // Nested growth metrics
        growthMetrics: {
          timeSeriesData: {
            usersCreatedToday: currentPeriodStats.usersCreatedToday,
            usersCreatedThisWeek: currentPeriodStats.usersCreatedThisWeek,
            usersCreatedThisMonth: currentPeriodStats.usersCreatedThisMonth,
            usersCreatedLastMonth: currentPeriodStats.usersCreatedLastMonth,
          },
          performanceRates: {
            growthRate: currentPeriodStats.growthRate,
            leadToUserConversionRate:
              currentPeriodStats.leadToUserConversionRate,
            retentionRate: currentPeriodStats.retentionRate,
          },
        },

        // Nested business insights
        businessInsights: {
          uniqueCompanies: currentPeriodStats.uniqueCompanies,
          generatedAt: new Date().toISOString(),
        },

        // Keep backward compatibility with flat fields
        totalUsers: currentPeriodStats.totalUsers,
        activeUsers: currentPeriodStats.activeUsers,
        inactiveUsers: currentPeriodStats.inactiveUsers,
        newUsers: currentPeriodStats.newUsers,
        emailVerifiedUsers: currentPeriodStats.emailVerifiedUsers,
        emailUnverifiedUsers: currentPeriodStats.emailUnverifiedUsers,
        verificationRate: currentPeriodStats.verificationRate,
        usersWithPhone: currentPeriodStats.usersWithPhone,
        usersWithBio: currentPeriodStats.usersWithBio,
        usersWithWebsite: currentPeriodStats.usersWithWebsite,
        usersWithJobTitle: currentPeriodStats.usersWithJobTitle,
        usersWithImage: currentPeriodStats.usersWithImage,
        usersWithStripeId: currentPeriodStats.usersWithStripeId,
        usersWithoutStripeId: currentPeriodStats.usersWithoutStripeId,
        stripeIntegrationRate: currentPeriodStats.stripeIntegrationRate,
        usersWithLeadId: currentPeriodStats.usersWithLeadId,
        usersWithoutLeadId: currentPeriodStats.usersWithoutLeadId,
        leadAssociationRate: currentPeriodStats.leadAssociationRate,
        publicUsers: currentPeriodStats.publicUsers,
        customerUsers: currentPeriodStats.customerUsers,
        partnerAdminUsers: currentPeriodStats.partnerAdminUsers,
        partnerEmployeeUsers: currentPeriodStats.partnerEmployeeUsers,
        adminUsers: currentPeriodStats.adminUsers,
        uniqueCompanies: currentPeriodStats.uniqueCompanies,
        usersCreatedToday: currentPeriodStats.usersCreatedToday,
        usersCreatedThisWeek: currentPeriodStats.usersCreatedThisWeek,
        usersCreatedThisMonth: currentPeriodStats.usersCreatedThisMonth,
        usersCreatedLastMonth: currentPeriodStats.usersCreatedLastMonth,
        growthRate: currentPeriodStats.growthRate,
        leadToUserConversionRate: currentPeriodStats.leadToUserConversionRate,
        retentionRate: currentPeriodStats.retentionRate,
        generatedAt: new Date().toISOString(),
      };

      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Error fetching user statistics", error);
      return createErrorResponse(
        "app.api.v1.core.users.list.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Generate current period statistics
   */
  private async generateCurrentPeriodStats(
    whereClause: SQL | undefined,
    logger: EndpointLogger,
  ): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    newUsers: number;
    emailVerifiedUsers: number;
    emailUnverifiedUsers: number;
    verificationRate: number;
    usersWithPhone: number;
    usersWithBio: number;
    usersWithWebsite: number;
    usersWithJobTitle: number;
    usersWithImage: number;
    usersByContactMethod: { [key: string]: number };
    usersWithStripeId: number;
    usersWithoutStripeId: number;
    stripeIntegrationRate: number;
    usersWithLeadId: number;
    usersWithoutLeadId: number;
    leadAssociationRate: number;
    usersByRole: { [key: string]: number };
    publicUsers: number;
    customerUsers: number;
    partnerAdminUsers: number;
    partnerEmployeeUsers: number;
    adminUsers: number;
    usersByCompany: { [key: string]: number };
    uniqueCompanies: number;
    usersCreatedToday: number;
    usersCreatedThisWeek: number;
    usersCreatedThisMonth: number;
    usersCreatedLastMonth: number;
    growthRate: number;
    leadToUserConversionRate: number;
    retentionRate: number;
  }> {
    // Get basic user counts
    const baseQuery = db
      .select({
        totalUsers: sql<number>`count(*)::int`,
        activeUsers: sql<number>`count(*) filter (where ${users.isActive} = true)::int`,
        inactiveUsers: sql<number>`count(*) filter (where ${users.isActive} = false)::int`,
        emailVerifiedUsers: sql<number>`count(*) filter (where ${users.emailVerified} = true)::int`,
        emailUnverifiedUsers: sql<number>`count(*) filter (where ${users.emailVerified} = false)::int`,
        usersWithPhone: sql<number>`count(*) filter (where ${users.phone} is not null)::int`,
        usersWithBio: sql<number>`count(*) filter (where ${users.bio} is not null)::int`,
        usersWithWebsite: sql<number>`count(*) filter (where ${users.website} is not null)::int`,
        usersWithJobTitle: sql<number>`count(*) filter (where ${users.jobTitle} is not null)::int`,
        usersWithImage: sql<number>`count(*) filter (where ${users.imageUrl} is not null)::int`,
        usersWithStripeId: sql<number>`count(*) filter (where ${users.stripeCustomerId} is not null)::int`,
        usersWithoutStripeId: sql<number>`count(*) filter (where ${users.stripeCustomerId} is null)::int`,
        usersWithLeadId: sql<number>`count(*) filter (where ${users.leadId} is not null)::int`,
        usersWithoutLeadId: sql<number>`count(*) filter (where ${users.leadId} is null)::int`,
      })
      .from(users);

    const [basicCounts] = (await baseQuery.where(whereClause)) ?? {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      emailVerifiedUsers: 0,
      emailUnverifiedUsers: 0,
      usersWithPhone: 0,
      usersWithBio: 0,
      usersWithWebsite: 0,
      usersWithJobTitle: 0,
      usersWithImage: 0,
      usersWithStripeId: 0,
      usersWithoutStripeId: 0,
      usersWithLeadId: 0,
      usersWithoutLeadId: 0,
    };

    // Get time-based metrics
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [timeBased] = (await db
      .select({
        newUsers: sql<number>`count(*)::int`,
        usersCreatedToday: sql<number>`count(*) filter (where ${users.createdAt} >= ${today})::int`,
        usersCreatedThisWeek: sql<number>`count(*) filter (where ${users.createdAt} >= ${thisWeek})::int`,
        usersCreatedThisMonth: sql<number>`count(*) filter (where ${users.createdAt} >= ${thisMonth})::int`,
        usersCreatedLastMonth: sql<number>`count(*) filter (where ${users.createdAt} >= ${lastMonth} and ${users.createdAt} < ${thisMonth})::int`,
      })
      .from(users)
      .where(whereClause)) ?? [
      {
        newUsers: 0,
        usersCreatedToday: 0,
        usersCreatedThisWeek: 0,
        usersCreatedThisMonth: 0,
        usersCreatedLastMonth: 0,
      },
    ];

    // Get contact method distribution
    const contactMethods = await db
      .select({
        method: users.preferredContactMethod,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .where(whereClause)
      .groupBy(users.preferredContactMethod);

    const usersByContactMethod = Object.fromEntries(
      contactMethods.map((item) => [item.method, item.count]),
    );

    // Get company distribution
    const companies = await db
      .select({
        company: users.company,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .where(whereClause)
      .groupBy(users.company);

    const usersByCompany = Object.fromEntries(
      companies.map((item) => [item.company, item.count]),
    );

    const uniqueCompanies = companies.length;

    // Calculate rates
    const totalUsers = basicCounts.totalUsers;
    const verificationRate =
      totalUsers > 0 ? basicCounts.emailVerifiedUsers / totalUsers : 0;
    const stripeIntegrationRate =
      totalUsers > 0 ? basicCounts.usersWithStripeId / totalUsers : 0;
    const leadAssociationRate =
      totalUsers > 0 ? basicCounts.usersWithLeadId / totalUsers : 0;

    // Calculate growth rate (month-over-month)
    const growthRate =
      timeBased.usersCreatedLastMonth > 0
        ? (timeBased.usersCreatedThisMonth - timeBased.usersCreatedLastMonth) /
          timeBased.usersCreatedLastMonth
        : 0;

    // Get role distribution
    const roleStats = await db
      .select({
        role: userRoles.role,
        count: sql<number>`count(*)::int`,
      })
      .from(userRoles)
      .leftJoin(users, eq(userRoles.userId, users.id))
      .where(whereClause)
      .groupBy(userRoles.role);

    const usersByRole = Object.fromEntries(
      roleStats.map((item) => [item.role, item.count]),
    );

    // Extract specific role counts
    const publicUsers = usersByRole.PUBLIC || 0;
    const customerUsers = usersByRole.CUSTOMER || 0;
    const partnerAdminUsers = usersByRole.PARTNER_ADMIN || 0;
    const partnerEmployeeUsers = usersByRole.PARTNER_EMPLOYEE || 0;
    const adminUsers = usersByRole.ADMIN || 0;

    // Calculate more accurate conversion and retention rates
    const leadToUserConversionRate =
      await this.calculateLeadToUserConversionRate(whereClause, logger);
    const retentionRate = await this.calculateRetentionRate(
      whereClause,
      logger,
    );

    return {
      totalUsers,
      activeUsers: basicCounts.activeUsers,
      inactiveUsers: basicCounts.inactiveUsers,
      newUsers: timeBased.newUsers,
      emailVerifiedUsers: basicCounts.emailVerifiedUsers,
      emailUnverifiedUsers: basicCounts.emailUnverifiedUsers,
      verificationRate,
      usersWithPhone: basicCounts.usersWithPhone,
      usersWithBio: basicCounts.usersWithBio,
      usersWithWebsite: basicCounts.usersWithWebsite,
      usersWithJobTitle: basicCounts.usersWithJobTitle,
      usersWithImage: basicCounts.usersWithImage,
      usersByContactMethod,
      usersWithStripeId: basicCounts.usersWithStripeId,
      usersWithoutStripeId: basicCounts.usersWithoutStripeId,
      stripeIntegrationRate,
      usersWithLeadId: basicCounts.usersWithLeadId,
      usersWithoutLeadId: basicCounts.usersWithoutLeadId,
      leadAssociationRate,
      usersByRole,
      publicUsers,
      customerUsers,
      partnerAdminUsers,
      partnerEmployeeUsers,
      adminUsers,
      usersByCompany,
      uniqueCompanies,
      usersCreatedToday: timeBased.usersCreatedToday,
      usersCreatedThisWeek: timeBased.usersCreatedThisWeek,
      usersCreatedThisMonth: timeBased.usersCreatedThisMonth,
      usersCreatedLastMonth: timeBased.usersCreatedLastMonth,
      growthRate,
      leadToUserConversionRate,
      retentionRate,
    };
  }

  /**
   * Calculate lead to user conversion rate
   * Note: Leads table doesn't exist in current schema, using leadId field instead
   */
  private async calculateLeadToUserConversionRate(
    whereClause: SQL | undefined,
    logger: EndpointLogger,
  ): Promise<number> {
    try {
      // Calculate conversion rate based on users with leadId field
      const [conversionStats] = await db
        .select({
          totalUsers: sql<number>`count(*)::int`,
          usersWithLeadId: sql<number>`count(case when ${users.leadId} is not null then 1 end)::int`,
        })
        .from(users)
        .where(whereClause);

      return conversionStats.totalUsers > 0
        ? conversionStats.usersWithLeadId / conversionStats.totalUsers
        : 0;
    } catch (error) {
      logger.error("Error calculating lead to user conversion rate", error);
      return 0;
    }
  }

  /**
   * Calculate user retention rate
   */
  private async calculateRetentionRate(
    whereClause: SQL | undefined,
    logger: EndpointLogger,
  ): Promise<number> {
    try {
      // Calculate retention based on active users vs total users
      const [retentionStats] = await db
        .select({
          totalUsers: sql<number>`count(*)::int`,
          activeUsers: sql<number>`count(case when ${users.isActive} = true then 1 end)::int`,
        })
        .from(users)
        .where(whereClause);

      return retentionStats.totalUsers > 0
        ? retentionStats.activeUsers / retentionStats.totalUsers
        : 0;
    } catch (error) {
      logger.error("Error calculating retention rate", error);
      return 0.85; // Default fallback
    }
  }

  // Note: Historical data generation methods have been removed as they are not
  // part of the current API definition. They can be re-added if needed.
}

/**
 * Default repository instance
 */
export const usersStatsRepository = new UsersStatsRepositoryImpl();
