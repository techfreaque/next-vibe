/**
 * Chat Threads Repository
 * Business logic for thread management operations
 */

import "server-only";

import { and, count, desc, eq, gte, ilike, isNull, lte, or } from "drizzle-orm";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { UserRoleDB } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { getDefaultFolderConfig } from "../config";
import { chatFolders, chatThreads, type ChatFolder } from "../db";
import { canReadThread, canWriteFolder } from "../permissions/permissions";
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

      // Extract userId safely - only exists for authenticated users
      const userId = !user.isPublic && "id" in user ? user.id : undefined;

      logger.info("Listing threads - START", {
        userId,
        leadId: user.leadId,
        isPublic: user.isPublic,
        hasUserId: !!userId,
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
      const userIdentifier = user.isPublic ? user.leadId : userId;

      logger.info("Listing threads - User identifier", {
        userIdentifier,
        isPublic: user.isPublic,
      });

      if (!userIdentifier) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.get.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Build where clause - use leadId for anonymous users, userId for authenticated users
      // For PUBLIC folder, show all public threads from all users
      // For other folders, only show user's own threads
      const conditions = [];

      if (rootFolderId === "public") {
        // PUBLIC folder: Show all threads in public folder (from all users)
        conditions.push(eq(chatThreads.rootFolderId, "public"));
      } else {
        // Other folders: Show only user's own threads
        conditions.push(eq(chatThreads.userId, userIdentifier));

        // Filter by root folder if specified
        if (rootFolderId) {
          conditions.push(eq(chatThreads.rootFolderId, rootFolderId));
        }
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

      // Filter threads based on user permissions
      const visibleThreads = [];
      for (const thread of dbThreads) {
        // Get folder if thread has one
        let folder = null;
        if (thread.folderId) {
          const [folderResult] = await db
            .select()
            .from(chatFolders)
            .where(eq(chatFolders.id, thread.folderId))
            .limit(1);
          folder = folderResult || null;
        }

        if (await canReadThread(user, thread, folder, logger)) {
          visibleThreads.push(thread);
        }
      }

      // Map DB fields to API response format (DB has rootFolderId as DefaultFolderId, folderId as UUID)
      const threads = visibleThreads.map((thread) => ({
        id: thread.id,
        title: thread.title,
        rootFolderId: thread.rootFolderId as "incognito" | "private" | "public" | "shared",
        folderId: thread.folderId,
        status: thread.status,
        preview: thread.preview,
        pinned: thread.pinned,
        allowedRoles: (thread.allowedRoles || []) as ("ADMIN" | "AI_TOOL_OFF" | "CLI_OFF" | "CUSTOMER" | "PARTNER_ADMIN" | "PARTNER_EMPLOYEE" | "PUBLIC" | "WEB_OFF")[],
        createdAt: thread.createdAt.toISOString(),
        updatedAt: thread.updatedAt.toISOString(),
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
      return fail({
        message: "app.api.v1.core.agent.chat.threads.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
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
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.post.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Check permissions: get folder if subFolderId is provided
      const folderId = data.thread?.subFolderId;
      let folder: ChatFolder | null = null;

      if (folderId) {
        // Get parent folder to check permissions
        const [folderResult] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, folderId))
          .limit(1);

        if (!folderResult) {
          return fail({
            message:
              "app.api.v1.core.agent.chat.threads.post.errors.notFound.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: {
              message: "Folder not found",
            },
          });
        }

        folder = folderResult;
      } else if (data.thread?.rootFolderId === "public") {
        // Creating thread in PUBLIC root - need to check ADMIN permission
        // Create a virtual folder object for permission check
        folder = {
          id: "public-root",
          userId: "", // Root folders have no owner
          rootFolderId: "public" as const,
          name: "Public",
          icon: null,
          color: null,
          parentId: null, // This is the key - null means root level
          expanded: true,
          sortOrder: 0,
          metadata: {},
          allowedRoles: [],
          moderatorIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Check if user has permission to create thread in this folder
      const hasPermission = await canWriteFolder(user, folder, logger);

      if (!hasPermission) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
          messageParams: {
            message: "Cannot create thread in this location",
          },
        });
      }

      // Determine allowedRoles: inherit from parent folder or set based on rootFolderId
      let allowedRoles: (typeof UserRoleDB)[number][] = [];

      if (folder && folderId) {
        // Inherit allowedRoles from parent folder (already fetched above)
        allowedRoles = (folder.allowedRoles || []) as (typeof UserRoleDB)[number][];
      } else {
        // Get default allowedRoles from root folder config
        const rootFolderConfig = getDefaultFolderConfig(data.thread?.rootFolderId);
        allowedRoles = rootFolderConfig?.defaultAllowedRoles || [];
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
        allowedRoles,
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
        createdAt: dbThread.createdAt.toISOString(),
        updatedAt: dbThread.updatedAt.toISOString(),
      };

      logger.debug("Thread created successfully", { threadId: thread.id });

      return createSuccessResponse({
        response: {
          thread,
        },
      });
    } catch (error) {
      logger.error("Error creating thread", parseError(error));
      return fail({
        message: "app.api.v1.core.agent.chat.threads.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

/**
 * Default repository instance
 */
export const threadsRepository = new ThreadsRepositoryImpl();
