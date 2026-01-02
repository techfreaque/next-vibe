/**
 * SMTP Accounts List Repository
 * Business logic for listing SMTP accounts
 */

import "server-only";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { SortOrder } from "../../messages/enum";
import { smtpAccounts } from "../db";
import { mapStatusFilter, SmtpAccountSortField } from "../enum";
import type {
  SmtpAccountsListGETRequestOutput,
  SmtpAccountsListGETResponseOutput,
} from "./definition";

/**
 * SMTP Accounts List Repository
 * Handles all business logic for listing SMTP accounts
 */
export class SmtpAccountsListRepository {
  /**
   * Get list of SMTP accounts with filtering and pagination
   */
  static async listSmtpAccounts(
    data: SmtpAccountsListGETRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountsListGETResponseOutput>> {
    try {
      logger.info("Getting SMTP accounts", { data, userId: user.id });

      // Build where conditions
      const whereConditions = [];

      // Status filter
      if (data.status) {
        const mappedStatus = mapStatusFilter(data.status);
        if (mappedStatus) {
          whereConditions.push(eq(smtpAccounts.status, mappedStatus));
        }
      }

      // Search filter
      if (data.search) {
        whereConditions.push(
          or(
            ilike(smtpAccounts.name, `%${data.search}%`),
            ilike(smtpAccounts.description, `%${data.search}%`),
            ilike(smtpAccounts.fromEmail, `%${data.search}%`),
          ),
        );
      }

      // Build order by
      const sortBy = data.sortBy || SmtpAccountSortField.CREATED_AT;
      const sortOrder = data.sortOrder || SortOrder.DESC;

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

      const orderBy = sortOrder === SortOrder.ASC ? sortColumn : desc(sortColumn);

      // Pagination
      const page = data.page || 1;
      const limit = data.limit || 20;
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(smtpAccounts)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

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

      // Transform to response format - match endpoint definition exactly
      const responseAccounts = accounts.map((account) => ({
        id: account.id,
        name: account.name,
        status: account.status,
        healthCheckStatus: account.healthCheckStatus,
        priority: account.priority || 0,
        totalEmailsSent: account.totalEmailsSent || 0,
        lastUsedAt: account.lastUsedAt?.toISOString() || null,
        createdAt: account.createdAt.toISOString(),
      }));

      logger.info("SMTP accounts retrieved successfully", {
        count: accounts.length,
        total,
        page,
        totalPages,
      });

      return success({
        accounts: responseAccounts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    } catch (error) {
      logger.error("Error getting SMTP accounts", parseError(error));
      return fail({
        message: "app.api.emails.smtpClient.list.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
