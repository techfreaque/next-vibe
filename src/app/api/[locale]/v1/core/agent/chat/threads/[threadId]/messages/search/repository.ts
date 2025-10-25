/**
 * Message Search Repository
 * Business logic for searching messages within a thread
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatMessages, chatThreads } from "../../../../db";
import { validateNotIncognito } from "../../../../validation";
import type {
  MessageSearchRequestOutput,
  MessageSearchResponseOutput,
  MessageSearchUrlVariablesOutput,
} from "./definition";

/**
 * Message Search Repository Interface
 */
export interface MessageSearchRepositoryInterface {
  searchMessages(
    data: MessageSearchRequestOutput,
    urlVariables: MessageSearchUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageSearchResponseOutput>>;
}

/**
 * Message Search Repository Implementation
 */
export class MessageSearchRepositoryImpl
  implements MessageSearchRepositoryInterface
{
  /**
   * Search messages within a specific thread using full-text search
   */
  async searchMessages(
    data: MessageSearchRequestOutput,
    urlVariables: MessageSearchUrlVariablesOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageSearchResponseOutput>> {
    try {
      const { threadId } = urlVariables;
      const { query } = data;
      const page = data.pagination?.page ?? 1;
      const limit = data.pagination?.limit ?? 20;

      logger.debug("Searching messages", {
        userId: user.id,
        threadId,
        query,
        page,
        limit,
      });

      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Verify thread exists and belongs to user
      const [thread] = await db
        .select({ id: chatThreads.id, rootFolderId: chatThreads.rootFolderId })
        .from(chatThreads)
        .where(
          and(eq(chatThreads.id, threadId), eq(chatThreads.userId, user.id)),
        )
        .limit(1);

      if (!thread) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Reject incognito threads
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Perform full-text search on messages within the thread
      const offset = (page - 1) * limit;

      // Search using PostgreSQL full-text search
      const results = await db
        .select({
          id: chatMessages.id,
          content: chatMessages.content,
          role: chatMessages.role,
          createdAt: chatMessages.createdAt,
          rank: sql<number>`ts_rank(${chatMessages.searchVector}, plainto_tsquery('english', ${query}))`,
          headline: sql<string>`ts_headline('english', ${chatMessages.content}, plainto_tsquery('english', ${query}), 'MaxWords=50, MinWords=25')`,
        })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            sql`${chatMessages.searchVector} @@ plainto_tsquery('english', ${query})`,
          ),
        )
        .orderBy(
          sql`ts_rank(${chatMessages.searchVector}, plainto_tsquery('english', ${query})) DESC`,
        )
        .limit(limit)
        .offset(offset);

      // Get total count
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            sql`${chatMessages.searchVector} @@ plainto_tsquery('english', ${query})`,
          ),
        );

      logger.debug("Messages search completed", {
        resultsCount: results.length,
        totalCount,
        page,
        limit,
      });

      return createSuccessResponse({
        results: results.map((r) => ({
          id: r.id,
          content: r.content,
          role: r.role,
          rank: r.rank,
          headline: r.headline,
          createdAt: r.createdAt,
        })),
        totalCount,
      });
    } catch (error) {
      logger.error("Failed to search messages", { error: parseError(error) });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.serverError.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}
