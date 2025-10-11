/**
 * SMTP Accounts List Repository
 * Business logic for listing SMTP accounts
 */

import "server-only";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { SortOrder } from "../../messages/enum";
import { db, smtpAccounts } from "../db";
import type { SmtpAccountResponseType } from "../definition";
import type { SmtpAccountStatusFilter } from "../enum";
import { mapStatusFilter, SmtpAccountSortField } from "../enum";
import type {
  SmtpAccountsListRequestType,
  SmtpAccountsListResponseType,
} from "./definition";

interface SmtpAccountsListRepository {
  listSmtpAccounts(
    query: SmtpAccountsListRequestType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountsListResponseType>>;
}

/**
 * SMTP Accounts List Repository Class
 * Handles all business logic for listing SMTP accounts
 */
class SmtpAccountsListRepositoryImpl implements SmtpAccountsListRepository {
  /**
   * Get list of SMTP accounts with filtering and pagination
   */
  async listSmtpAccounts(
    query: SmtpAccountsListRequestType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountsListResponseType>> {
    try {
      logger.info("Getting SMTP accounts", { query });

      // Build where conditions
      const whereConditions = [];

      // Status filter
      const mappedStatus = mapStatusFilter(
        query.status as SmtpAccountStatusFilter,
      );
      if (mappedStatus) {
        whereConditions.push(eq(smtpAccounts.status, mappedStatus));
      }

      // Default account filter
      if (
        query.isDefault !== undefined &&
        typeof query.isDefault === "boolean"
      ) {
        whereConditions.push(eq(smtpAccounts.isDefault, query.isDefault));
      }

      // Search filter
      if (query.search && typeof query.search === "string") {
        whereConditions.push(
          or(
            ilike(smtpAccounts.name, `%${query.search}%`),
            ilike(smtpAccounts.description, `%${query.search}%`),
            ilike(smtpAccounts.fromEmail, `%${query.search}%`),
          ),
        );
      }

      // Build order by
      const sortBy = query.sortBy || "createdAt";
      const sortOrder = query.sortOrder || "desc";

      // Get the sort column with proper type checking
      let sortColumn;
      if (sortBy === SmtpAccountSortField.NAME) {
        sortColumn = smtpAccounts.name;
      } else if (sortBy === SmtpAccountSortField.STATUS) {
        sortColumn = smtpAccounts.status;
      } else if (sortBy === SmtpAccountSortField.PRIORITY) {
        sortColumn = smtpAccounts.priority;
      } else if (sortBy === SmtpAccountSortField.TOTAL_EMAILS_SENT) {
        sortColumn = smtpAccounts.totalEmailsSent;
      } else if (sortBy === SmtpAccountSortField.LAST_USED_AT) {
        sortColumn = smtpAccounts.lastUsedAt;
      } else {
        sortColumn = smtpAccounts.createdAt;
      }

      const orderBy =
        sortOrder === SortOrder.ASC ? sortColumn : desc(sortColumn);

      // Pagination
      const page = typeof query.page === "number" ? query.page : 1;
      const limit = typeof query.limit === "number" ? query.limit : 20;
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(smtpAccounts)
        .where(
          whereConditions.length > 0 ? and(...whereConditions) : undefined,
        );

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limit);

      // Get accounts
      const accounts = await db
        .select()
        .from(smtpAccounts)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      // Transform to response format
      const responseAccounts: SmtpAccountResponseType[] = accounts.map(
        (account) => ({
          id: account.id,
          name: account.name,
          description: account.description || undefined,
          host: account.host,
          port: account.port,
          securityType: account.securityType,
          username: account.username,

          fromEmail: account.fromEmail,
          connectionTimeout: account.connectionTimeout || undefined,
          maxConnections: account.maxConnections || undefined,
          rateLimitPerHour: account.rateLimitPerHour || undefined,
          status: account.status,
          isDefault: account.isDefault || undefined,
          priority: account.priority || undefined,
          healthCheckStatus: account.healthCheckStatus,
          consecutiveFailures: account.consecutiveFailures || 0,
          lastHealthCheck: account.lastHealthCheck?.toISOString() || null,
          lastFailureAt: account.lastFailureAt?.toISOString() || null,
          lastFailureReason: account.lastFailureReason,
          emailsSentToday: account.emailsSentToday || 0,
          emailsSentThisMonth: account.emailsSentThisMonth || 0,
          totalEmailsSent: account.totalEmailsSent || 0,
          lastUsedAt: account.lastUsedAt?.toISOString() || null,
          metadata: account.metadata || undefined,
          isExactMatch: false,
          weight: 1,
          isFailover: false,
          failoverPriority: 0,
          campaignTypes: account.campaignTypes || [],
          emailJourneyVariants: account.emailJourneyVariants || [],
          emailCampaignStages: account.emailCampaignStages || [],
          countries: account.countries || [],
          languages: account.languages || [],

          createdBy: account.createdBy,
          updatedBy: account.updatedBy,
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString(),
        }),
      );

      logger.info("SMTP accounts retrieved successfully", {
        count: accounts.length,
        total,
        page,
        totalPages,
      });

      return createSuccessResponse({
        accounts: responseAccounts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        filters: query,
      });
    } catch (error) {
      logger.error("Error getting SMTP accounts", error);
      return createErrorResponse(
        "leadsErrors.leads.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

/**
 * Export singleton instance
 */
export const smtpAccountsListRepository = new SmtpAccountsListRepositoryImpl();
