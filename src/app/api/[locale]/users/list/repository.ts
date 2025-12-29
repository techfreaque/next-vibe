/**
 * Users List Repository Implementation
 * Business logic for listing and filtering users
 */

import "server-only";

import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { users } from "@/app/api/[locale]/user/db";

import { SortOrder, UserSortField, UserStatusFilter } from "../enum";
import type { UserListRequestOutput } from "./definition";

export class UserListRepository {
  /**
   * Convert status filter to database conditions
   */
  private static convertStatusFilter(status: string | undefined): SQL | null {
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
  private static convertRoleFilter(): SQL | null {
    // Role filtering disabled for now due to enum type complexity
    // TODO: Implement proper role filtering with correct type mapping
    return null;
  }

  /**
   * Get sort column based on sort field
   */
  private static getSortColumn(
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

  static async listUsers(
    data: UserListRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      response: {
        users: Array<{
          id: string;
          email: string;
          privateName: string;
          publicName: string;
          isActive: boolean;
          emailVerified: boolean;
          createdAt: Date;
          updatedAt: Date;
        }>;
      };
      paginationInfo: {
        totalCount: number;
        pageCount: number;
        page: number;
        limit: number;
      };
    }>
  > {
    try {
      logger.debug("Listing users", {
        query: data,
        requestingUser: user.id,
      });

      // Type assertion to match new definition structure
      const requestData = data as {
        searchFilters?: {
          search?: string;
          status?: string[];
          role?: string[];
        };
        sortingOptions?: {
          sortBy?: string;
          sortOrder?: string;
        };
        paginationInfo?: {
          page?: number;
          limit?: number;
        };
      };

      const limit = requestData.paginationInfo?.limit || 20;
      const page = requestData.paginationInfo?.page || 1;
      const offset = (page - 1) * limit;

      // Build conditions
      const conditions: SQL[] = [];

      // Status filter
      const statusCondition = UserListRepository.convertStatusFilter(
        requestData.searchFilters?.status?.[0],
      );
      if (statusCondition) {
        conditions.push(statusCondition);
      }

      // Role filter
      const roleCondition = UserListRepository.convertRoleFilter();
      if (roleCondition) {
        conditions.push(roleCondition);
      }

      // Search filter
      if (requestData.searchFilters?.search) {
        const searchCondition = or(
          ilike(users.email, `%${requestData.searchFilters.search}%`),
          ilike(users.privateName, `%${requestData.searchFilters.search}%`),
          ilike(users.publicName, `%${requestData.searchFilters.search}%`),
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      // Build where clause
      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get sort configuration
      const sortField =
        requestData.sortingOptions?.sortBy || UserSortField.CREATED_AT;
      const sortOrder = requestData.sortingOptions?.sortOrder || SortOrder.DESC;
      const sortColumn = UserListRepository.getSortColumn(sortField);

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

      return success({
        response: {
          users: usersList.map((u) => ({
            id: u.id,
            email: u.email,
            privateName: u.privateName,
            publicName: u.publicName,
            isActive: u.isActive,
            emailVerified: u.emailVerified,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          })),
        },
        paginationInfo: {
          totalCount: total,
          pageCount: totalPages,
          page,
          limit,
        },
      });
    } catch (error) {
      logger.error("Error listing users", parseError(error));
      return fail({
        message: "app.api.users.list.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
