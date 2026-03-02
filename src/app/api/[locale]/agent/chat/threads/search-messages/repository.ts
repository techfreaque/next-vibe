/**
 * Global Message Search Repository
 * Business logic for searching messages across all threads
 */

import "server-only";

import { and, eq, gte, lte, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type { DefaultFolderId } from "../../config";
import { chatMessages, chatThreads } from "../../db";
import { ChatMessageRole } from "../../enum";
import type {
  GlobalMessageSearchRequestOutput,
  GlobalMessageSearchResponseOutput,
} from "./definition";
import type { GlobalMessageSearchT } from "./i18n";

/**
 * Global Message Search Repository - Static class pattern
 * All methods return ResponseType for consistent error handling
 */
export class GlobalMessageSearchRepository {
  /**
   * Search messages across all threads using full-text search
   */
  static async searchMessages(
    data: GlobalMessageSearchRequestOutput,
    user: JwtPayloadType,
    t: GlobalMessageSearchT,
    logger: EndpointLogger,
  ): Promise<ResponseType<GlobalMessageSearchResponseOutput>> {
    try {
      const { query } = data;
      const page = data.pagination?.page ?? 1;
      const limit = data.pagination?.limit ?? 50;
      const rootFolderId = data.filters?.rootFolderId;
      const role = data.filters?.role;
      const startDate = data.filters?.startDate;
      const endDate = data.filters?.endDate;

      logger.debug("Global message search", {
        userId: user.id,
        query,
        rootFolderId,
        role,
        startDate,
        endDate,
        page,
        limit,
      });

      // Type guard to ensure user has id
      if (!user.id) {
        return fail({
          message: t("search.get.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      const offset = (page - 1) * limit;

      // Build search query using websearch_to_tsquery for natural language search
      const searchQuery = sql`websearch_to_tsquery('english', ${query})`;

      // Admin + error role filter = cross-user search for error monitoring
      const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);
      const isErrorSearch = role === ChatMessageRole.ERROR;
      const searchAllUsers = isAdmin && isErrorSearch;

      // Build WHERE conditions
      const conditions = [sql`${chatMessages.searchVector} @@ ${searchQuery}`];

      // Scope to current user unless admin searching for errors
      if (!searchAllUsers) {
        conditions.push(eq(chatThreads.userId, user.id));
      }

      // Exclude incognito threads
      conditions.push(sql`${chatThreads.rootFolderId} != 'incognito'`);

      // Optional filters
      if (rootFolderId) {
        conditions.push(
          eq(chatThreads.rootFolderId, rootFolderId as DefaultFolderId),
        );
      }

      if (role) {
        conditions.push(eq(chatMessages.role, role));
      }

      if (startDate) {
        conditions.push(gte(chatMessages.createdAt, new Date(startDate)));
      }

      if (endDate) {
        conditions.push(lte(chatMessages.createdAt, new Date(endDate)));
      }

      // Execute search query with join
      const results = await db
        .select({
          messageId: chatMessages.id,
          threadId: chatThreads.id,
          threadTitle: chatThreads.title,
          role: chatMessages.role,
          createdAt: chatMessages.createdAt,
          rootFolderId: chatThreads.rootFolderId,
          rank: sql<number>`ts_rank(${chatMessages.searchVector}, ${searchQuery})`,
          headline: sql<string>`ts_headline('english', COALESCE(${chatMessages.content}, ''), ${searchQuery}, 'MaxWords=50, MinWords=25, MaxFragments=3')`,
        })
        .from(chatMessages)
        .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
        .where(and(...conditions))
        .orderBy(
          sql`ts_rank(${chatMessages.searchVector}, ${searchQuery}) DESC`,
        )
        .limit(limit)
        .offset(offset);

      // Get total count
      const [countResult] = await db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(chatMessages)
        .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
        .where(and(...conditions));

      const total = countResult?.count ?? 0;

      logger.debug("Global message search completed", {
        resultsCount: results.length,
        total,
        page,
        limit,
      });

      return success({
        results: results.map((r) => ({
          messageId: r.messageId,
          threadId: r.threadId,
          threadTitle: r.threadTitle,
          role: r.role,
          headline: r.headline,
          createdAt: r.createdAt,
          rootFolderId: r.rootFolderId,
        })),
        total,
        page,
      });
    } catch (error) {
      logger.error("Failed to search messages globally", parseError(error));
      return fail({
        message: t("search.get.errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
