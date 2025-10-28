/**
 * Users List Repository Implementation
 * Business logic for listing and filtering users
 */

import "server-only";

import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import { SortOrder, UserSortField, UserStatusFilter } from "../enum";
import type { UserListRequestOutput } from "./definition";

export interface UserListRepository {
  listUsers(
    data: UserListRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      response: {
        totalCount: number;
        pageCount: number;
        page: number;
        limit: number;
        users: Array<{
          id: string;
          email: string;
          privateName: string;
          publicName: string;
          isActive: boolean;
          emailVerified: boolean;
          createdAt: string;
          updatedAt: string;
        }>;
      };
    }>
  >;
}

export class UserListRepositoryImpl implements UserListRepository {
  /**
   * Convert status filter to database conditions
   */
  private convertStatusFilter(status: string | undefined): SQL | null {
    if (!status || status === UserStatusFilter.ALL) {
      return null;
    }

    switch (status) {
      case UserStatusFilter.ACTIVE:
        return eq(users.isActive, true);
      case UserStatusFilter.INACTIVE:
        return eq(users.isActive, false);
      case UserStatusFilter.EMAIL_VERIFIED:
        return eq(users.emailVerified, true);
      case UserStatusFilter.EMAIL_UNVERIFIED:
        return eq(users.emailVerified, false);
      default:
        return null;
    }
  }

  /**
   * Convert role filter to database conditions
   * Note: Role filtering is disabled due to complex enum type mapping
   */
  private convertRoleFilter(): SQL | null {
    // Role filtering disabled for now due to enum type complexity
    // TODO: Implement proper role filtering with correct type mapping
    return null;
  }

  /**
   * Get sort column based on sort field
   */
  private getSortColumn(
    field: string,
  ):
    | typeof users.createdAt
    | typeof users.updatedAt
    | typeof users.email
    | typeof users.privateName
    | typeof users.publicName {
    switch (field) {
      case UserSortField.CREATED_AT:
        return users.createdAt;
      case UserSortField.UPDATED_AT:
        return users.updatedAt;
      case UserSortField.EMAIL:
        return users.email;
      case UserSortField.PRIVATE_NAME:
        return users.privateName;
      case UserSortField.PUBLIC_NAME:
        return users.publicName;
      default:
        return users.createdAt;
    }
  }

  async listUsers(
    data: UserListRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      response: {
        totalCount: number;
        pageCount: number;
        page: number;
        limit: number;
        users: Array<{
          id: string;
          email: string;
          privateName: string;
          publicName: string;
          isActive: boolean;
          emailVerified: boolean;
          createdAt: string;
          updatedAt: string;
        }>;
      };
    }>
  > {
    try {
      logger.debug("Listing users", { query: data, requestingUser: user.id });

      // Type assertion to fix inference issues
      const requestData = data as {
        searchAndPagination?: {
          limit?: number;
          page?: number;
          search?: string;
        };
        filters?: {
          status?: string[];
          role?: string[];
        };
        sorting?: {
          sortBy?: string;
          sortOrder?: string;
        };
      };

      const limit = requestData.searchAndPagination?.limit || 20;
      const page = requestData.searchAndPagination?.page || 1;
      const offset = (page - 1) * limit;

      // Build conditions
      const conditions: SQL[] = [];

      // Status filter
      const statusCondition = this.convertStatusFilter(
        requestData.filters?.status?.[0],
      );
      if (statusCondition) {
        conditions.push(statusCondition);
      }

      // Role filter
      const roleCondition = this.convertRoleFilter();
      if (roleCondition) {
        conditions.push(roleCondition);
      }

      // Search filter
      if (requestData.searchAndPagination?.search) {
        const searchCondition = or(
          ilike(users.email, `%${requestData.searchAndPagination.search}%`),
          ilike(
            users.privateName,
            `%${requestData.searchAndPagination.search}%`,
          ),
          ilike(
            users.publicName,
            `%${requestData.searchAndPagination.search}%`,
          ),
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      // Build where clause
      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get sort configuration
      const sortField = requestData.sorting?.sortBy || UserSortField.CREATED_AT;
      const sortOrder = requestData.sorting?.sortOrder || SortOrder.DESC;
      const sortColumn = this.getSortColumn(sortField);

      // Execute queries
      const [usersList, [{ total }]] = await Promise.all([
        db
          .select()
          .from(users)
          .where(whereClause)
          .orderBy(sortOrder === SortOrder.ASC ? sortColumn : desc(sortColumn))
          .limit(limit)
          .offset(offset),
        db.select({ total: count() }).from(users).where(whereClause),
      ]);

      const totalPages = Math.ceil(total / limit);

      logger.debug("Users listed successfully", {
        total,
        page,
        limit,
        totalPages,
        resultsCount: usersList.length,
      });

      return createSuccessResponse({
        response: {
          totalCount: total,
          pageCount: totalPages,
          page,
          limit,
          users: usersList.map((user) => ({
            id: user.id,
            email: user.email,
            privateName: user.privateName,
            publicName: user.publicName,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          })),
        },
      });
    } catch (error) {
      logger.error("Error listing users", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.users.list.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

export const userListRepository = new UserListRepositoryImpl();
