/**
 * Chat Threads Repository
 * Business logic for thread management operations
 */

import "server-only";

import { and, count, desc, eq, gte, ilike, isNull, lte, or } from "drizzle-orm";
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

import { chatThreads } from "../db";
import { ThreadStatus } from "../enum";
import type {
  ThreadCreateRequestOutput,
  ThreadCreateResponseOutput,
  ThreadListRequestOutput,
  ThreadListResponseOutput,
} from "./definition";

/**
 * Threads Repository Interface
 */
export interface ThreadsRepositoryInterface {
  listThreads(
    data: ThreadListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadListResponseOutput>>;

  createThread(
    data: ThreadCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadCreateResponseOutput>>;
}

/**
 * Threads Repository Implementation
 */
export class ThreadsRepositoryImpl implements ThreadsRepositoryInterface {
  /**
   * List threads with pagination and filtering
   */
  async listThreads(
    data: ThreadListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadListResponseOutput>> {
    try {
      const page = data.pagination?.page ?? 1;
      const limit = data.pagination?.limit ?? 20;
      const search = data.filters?.search;
      const rootFolderId = data.filters?.rootFolderId;
      const subFolderId = data.filters?.subFolderId;
      const status = data.filters?.status;
      const isPinned = data.filters?.isPinned;
      const dateFrom = data.filters?.dateFrom;
      const dateTo = data.filters?.dateTo;

      logger.debug("Listing threads", {
        userId: user.id,
        page,
        limit,
        search,
        rootFolderId,
        subFolderId,
        status,
        isPinned,
        dateFrom,
        dateTo,
      });

      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Build where clause
      const conditions = [eq(chatThreads.userId, user.id)];

      // Filter by root folder (required)
      conditions.push(eq(chatThreads.rootFolderId, rootFolderId));

      // Filter by subfolder (optional)
      if (subFolderId !== undefined) {
        if (subFolderId === null) {
          // No subfolder (root level within the root folder)
          conditions.push(isNull(chatThreads.folderId));
        } else {
          conditions.push(eq(chatThreads.folderId, subFolderId));
        }
      }

      // Filter by status
      if (status) {
        conditions.push(eq(chatThreads.status, status));
      }

      // Filter by pinned status
      if (isPinned !== undefined) {
        conditions.push(eq(chatThreads.pinned, isPinned));
      }

      // Filter by date range
      if (dateFrom) {
        conditions.push(gte(chatThreads.createdAt, new Date(dateFrom)));
      }
      if (dateTo) {
        conditions.push(lte(chatThreads.createdAt, new Date(dateTo)));
      }

      // Search in title and preview
      if (search) {
        conditions.push(
          or(
            ilike(chatThreads.title, `%${search}%`),
            ilike(chatThreads.preview, `%${search}%`),
          )!,
        );
      }

      const whereClause = and(...conditions);

      // Get total count
      const [{ total }] = await db
        .select({ total: count() })
        .from(chatThreads)
        .where(whereClause);

      // Get paginated threads
      const offset = (page - 1) * limit;
      const threads = await db
        .select({
          id: chatThreads.id,
          title: chatThreads.title,
          rootFolderId: chatThreads.rootFolderId,
          folderId: chatThreads.folderId,
          status: chatThreads.status,
          preview: chatThreads.preview,
          pinned: chatThreads.pinned,
          createdAt: chatThreads.createdAt,
          updatedAt: chatThreads.updatedAt,
        })
        .from(chatThreads)
        .where(whereClause)
        .orderBy(desc(chatThreads.pinned), desc(chatThreads.updatedAt))
        .limit(limit)
        .offset(offset);

      const pageCount = Math.ceil(total / limit);

      logger.debug("Threads listed successfully", {
        total,
        page,
        limit,
        pageCount,
        resultsCount: threads.length,
      });

      return createSuccessResponse({
        response: {
          threads,
          totalCount: total,
          pageCount,
          page,
          limit,
        },
      });
    } catch (error) {
      logger.error("Error listing threads", error);
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Create a new thread
   */
  async createThread(
    data: ThreadCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadCreateResponseOutput>> {
    try {
      logger.debug("Creating thread", {
        userId: user.id,
        title: data.thread?.title,
        rootFolderId: data.thread?.rootFolderId,
        subFolderId: data.thread?.subFolderId,
      });

      // Reject incognito threads - they should never be created on server
      if (data.thread?.rootFolderId === "incognito") {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.post.errors.forbidden.title",
          ErrorResponseTypes.FORBIDDEN,
          { message: "Incognito threads cannot be created on the server" },
        );
      }

      // Validate subfolder exists if provided
      if (data.thread?.subFolderId) {
        // TODO: Add folder validation when folders repository is implemented
      }

      // Type guard to ensure user has id
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.post.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const [thread] = await db
        .insert(chatThreads)
        .values({
          userId: user.id,
          // eslint-disable-next-line i18next/no-literal-string
          title: data.thread?.title || "New Chat",
          rootFolderId: data.thread?.rootFolderId,
          folderId: data.thread?.subFolderId ?? null,
          status: ThreadStatus.ACTIVE,
          defaultModel: data.thread?.model ?? null,
          defaultTone: data.thread?.persona ?? null,
          systemPrompt: data.thread?.systemPrompt ?? null,
          pinned: false,
          archived: false,
          tags: [],
          preview: null,
          metadata: {},
        })
        .returning({
          id: chatThreads.id,
          title: chatThreads.title,
          rootFolderId: chatThreads.rootFolderId,
          folderId: chatThreads.folderId,
          status: chatThreads.status,
          createdAt: chatThreads.createdAt,
          updatedAt: chatThreads.updatedAt,
        });

      logger.debug("Thread created successfully", { threadId: thread.id });

      return createSuccessResponse({
        response: {
          thread,
        },
      });
    } catch (error) {
      logger.error("Error creating thread", error);
      return createErrorResponse(
        "app.api.v1.core.agent.chat.threads.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

/**
 * Default repository instance
 */
export const threadsRepository = new ThreadsRepositoryImpl();
