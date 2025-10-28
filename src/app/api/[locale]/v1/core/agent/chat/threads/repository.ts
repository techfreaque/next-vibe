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
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { chatThreads } from "../db";
import { ThreadStatus } from "../enum";
import type { PersonaId } from "../personas/config";
import { validateNotIncognito } from "../validation";
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
      const page = data.page ?? 1;
      const limit = data.limit ?? 20;
      const search = data.search;
      const rootFolderId = data.rootFolderId;
      const subFolderId = data.subFolderId;
      const status = data.status;
      const isPinned = data.isPinned;
      const dateFrom = data.dateFrom;
      const dateTo = data.dateTo;

      logger.info("Listing threads - START", {
        userId: user.id,
        leadId: user.leadId,
        isPublic: user.isPublic,
        hasUserId: !!user.id,
        hasLeadId: !!user.leadId,
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

      // For anonymous users (public), use leadId instead of userId
      // For authenticated users, use userId
      const userIdentifier = user.isPublic ? user.leadId : user.id;

      logger.info("Listing threads - User identifier", {
        userIdentifier,
        isPublic: user.isPublic,
      });

      if (!userIdentifier) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Build where clause - use leadId for anonymous users, userId for authenticated users
      const conditions = [eq(chatThreads.userId, userIdentifier)];

      // Filter by root folder
      if (rootFolderId) {
        conditions.push(eq(chatThreads.rootFolderId, rootFolderId));
      }

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
      const dbThreads = await db
        .select()
        .from(chatThreads)
        .where(whereClause)
        .orderBy(desc(chatThreads.pinned), desc(chatThreads.updatedAt))
        .limit(limit)
        .offset(offset);

      // Map DB fields to API response format (DB has rootFolderId as DefaultFolderId, folderId as UUID)
      const threads = dbThreads.map((thread) => ({
        id: thread.id,
        title: thread.title,
        rootFolderId: thread.rootFolderId,
        folderId: thread.folderId,
        status: thread.status,
        preview: thread.preview,
        pinned: thread.pinned,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      }));

      const pageCount = Math.ceil(total / limit);

      logger.info("Threads listed successfully", {
        total,
        page,
        limit,
        pageCount,
        resultsCount: threads.length,
        threadIds: threads.map((t) => t.id),
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
      logger.error("Error listing threads", parseError(error));
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
        leadId: user.leadId,
        isPublic: user.isPublic,
        title: data.thread?.title,
        rootFolderId: data.thread?.rootFolderId,
        subFolderId: data.thread?.subFolderId,
      });

      // Reject incognito threads - they should never be created on server
      const incognitoError = validateNotIncognito(
        data.thread?.rootFolderId || "",
        locale,
        "app.api.v1.core.agent.chat.threads.post",
      );
      if (incognitoError) {
        return incognitoError;
      }

      // Subfolder validation: subFolderId is optional and validated by schema

      // For anonymous users (public), use leadId instead of userId
      // For authenticated users, use userId
      const userIdentifier = user.isPublic ? user.leadId : user.id;

      if (!userIdentifier) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.threads.post.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const threadData = {
        userId: userIdentifier,
        title:
          data.thread?.title ||
          simpleT(locale).t(
            "app.api.v1.core.agent.chat.threads.post.threadTitle.default",
          ),
        rootFolderId: data.thread?.rootFolderId,
        folderId: data.thread?.subFolderId ?? null,
        status: ThreadStatus.ACTIVE,
        defaultModel: data.thread?.model ?? null,
        defaultPersona: (data.thread?.persona as PersonaId | null) ?? null,
        systemPrompt: data.thread?.systemPrompt ?? null,
        pinned: false,
        archived: false,
        tags: [],
        preview: null,
        metadata: {},
      } satisfies typeof chatThreads.$inferInsert;

      const [dbThread] = await db
        .insert(chatThreads)
        .values(threadData)
        .returning();

      // Map DB fields to API response format (DB has rootFolderId as DefaultFolderId, folderId as UUID)
      const thread = {
        id: dbThread.id,
        title: dbThread.title,
        rootFolderId: dbThread.rootFolderId, // Already typed as DefaultFolderId from DB schema
        subFolderId: dbThread.folderId,
        status: dbThread.status,
        createdAt: dbThread.createdAt,
        updatedAt: dbThread.updatedAt,
      };

      logger.debug("Thread created successfully", { threadId: thread.id });

      return createSuccessResponse({
        response: {
          thread,
        },
      });
    } catch (error) {
      logger.error("Error creating thread", parseError(error));
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
