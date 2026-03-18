/**
 * Chat Threads Repository
 * Business logic for thread management operations
 */

import "server-only";

import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNull,
  lte,
  or,
} from "drizzle-orm";
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
import type { CountryLanguage } from "@/i18n/core/config";

import { DefaultFolderId } from "../config";
import { type ChatFolder, chatFolders, chatThreads } from "../db";
import { ThreadStatus } from "../enum";
import {
  canCreateThreadInFolder,
  canDeleteThread,
  canEditThread,
  canHideThread,
  canManageThreadPermissions,
  canPostInThread,
  canViewThread,
} from "../permissions/permissions";
import type {
  ThreadCreateRequestOutput,
  ThreadCreateResponseOutput,
  ThreadListRequestOutput,
  ThreadListResponseOutput,
} from "./definition";
import { scopedTranslation, type ThreadsT } from "./i18n";

function generateThreadTitle(content: string): string {
  const maxLength = 50;
  const minLastSpace = 20;
  const ellipsis = "...";
  const truncated = content.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > minLastSpace
    ? `${truncated.slice(0, lastSpace)}${ellipsis}`
    : truncated;
}

/**
 * Verify existing thread and check permissions
 * Returns thread ID if valid, error response otherwise
 */
async function verifyExistingThread(params: {
  threadId: string;
  isIncognito: boolean;
  userId: string | undefined;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): Promise<ResponseType<string>> {
  const { threadId, isIncognito, userId, user, logger, locale } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!isIncognito && userId) {
    const [existing] = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (!existing?.id) {
      logger.error("Thread not found", { threadId, userId });
      return fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    let folder: ChatFolder | null = null;
    if (existing.folderId) {
      const [folderResult] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, existing.folderId))
        .limit(1);
      folder = folderResult || null;
    }

    const hasPermission = await canPostInThread(
      user,
      existing,
      folder,
      logger,
      locale,
    );

    if (!hasPermission) {
      logger.error("User does not have permission to post in thread", {
        threadId,
        userId,
        threadUserId: existing.userId,
        rootFolderId: existing.rootFolderId,
      });
      return fail({
        message: t("get.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    logger.debug("Permission check passed for existing thread", {
      threadId,
      userId,
      threadUserId: existing.userId,
      rootFolderId: existing.rootFolderId,
    });
  }

  return success(threadId);
}

async function ensureThread({
  threadId,
  rootFolderId,
  subFolderId,
  userId,
  content,
  isIncognito,
  logger,
  user,
  leadId,
  locale,
}: {
  threadId: string;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null | undefined;
  userId?: string;
  leadId?: string;
  content: string;
  isIncognito: boolean;
  logger: EndpointLogger;
  user: JwtPayloadType;
  locale: CountryLanguage;
}): Promise<{ threadId: string; isNew: boolean }> {
  logger.debug("ensureThread called", {
    threadId,
    rootFolderId,
    subFolderId,
    userId,
    leadId,
    isIncognito,
  });

  if (isIncognito) {
    logger.debug("Thread ID provided for incognito", { threadId });
    return { threadId, isNew: true };
  }

  const [existing] = await db
    .select()
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);

  if (existing?.id) {
    const verifyResult = await verifyExistingThread({
      threadId,
      isIncognito,
      userId,
      user,
      logger,
      locale,
    });

    if (!verifyResult.success) {
      const errorMessage = verifyResult.message || "UNKNOWN_ERROR";
      return await Promise.reject(new Error(errorMessage));
    }

    return { threadId: verifyResult.data, isNew: false };
  }

  const title = generateThreadTitle(content);
  let folder: ChatFolder | null = null;

  if (subFolderId) {
    const [folderResult] = await db
      .select()
      .from(chatFolders)
      .where(eq(chatFolders.id, subFolderId))
      .limit(1);

    if (!folderResult) {
      logger.error("Folder not found", { subFolderId });
      return await Promise.reject(new Error("FOLDER_NOT_FOUND"));
    }

    folder = folderResult;
    logger.debug("Found folder for permission check", {
      folderId: folder.id,
      folderName: folder.name,
      rootFolderId: folder.rootFolderId,
      parentId: folder.parentId,
    });
  } else if (!subFolderId) {
    const { getDefaultFolderConfig } = await import("../config");
    const { hasRolePermission } = await import("../permissions/permissions");

    const rootConfig = getDefaultFolderConfig(rootFolderId);
    if (!rootConfig) {
      logger.error("Root folder config not found", { rootFolderId });
      return await Promise.reject(new Error("FOLDER_NOT_FOUND"));
    }

    if (rootFolderId === DefaultFolderId.PUBLIC) {
      const hasPermission = await hasRolePermission(
        user,
        rootConfig.rolesCreateThread,
        logger,
        locale,
      );

      if (!hasPermission) {
        logger.error(
          "User does not have permission to create threads in root folder",
          {
            userId,
            leadId,
            isPublic: user.isPublic,
            rootFolderId,
            requiredRoles: rootConfig.rolesCreateThread,
          },
        );
        return await Promise.reject(new Error("PERMISSION_DENIED"));
      }

      logger.info("User has permission to create thread in root folder", {
        userId,
        leadId,
        isPublic: user.isPublic,
        rootFolderId,
      });
    }
  }

  if (folder) {
    logger.debug("About to check permissions", {
      hasFolder: !!folder,
      folderId: folder?.id,
      folderName: folder?.name,
      folderParentId: folder?.parentId,
      userId,
      leadId,
      rootFolderId,
      subFolderId,
    });
    const hasPermission = await canCreateThreadInFolder(
      user,
      folder,
      logger,
      locale,
    );

    logger.debug("Permission check result", {
      hasPermission,
      userId,
      leadId,
      rootFolderId,
      subFolderId,
    });

    if (!hasPermission) {
      logger.error("User does not have permission to create thread", {
        userId,
        leadId,
        rootFolderId,
        subFolderId,
      });
      return await Promise.reject(new Error("PERMISSION_DENIED"));
    }
  }

  await db.insert(chatThreads).values({
    id: threadId,
    userId: userId ?? null,
    leadId: leadId ?? null,
    title,
    rootFolderId,
    folderId: subFolderId ?? null,
  });

  logger.debug("Created new thread", {
    threadId,
    title,
    userId,
    leadId,
  });

  return { threadId, isNew: true };
}

/**
 * Threads Repository - Static class pattern
 */
export class ThreadsRepository {
  /**
   * Generate thread title from first message
   * Truncates content to max 50 characters at word boundary
   */
  static generateThreadTitle(content: string): string {
    return generateThreadTitle(content);
  }

  /**
   * Ensure thread exists or create new one with permission checks
   * Used by AI streaming to get or create a thread before posting messages
   */
  static async ensureThread(
    params: Parameters<typeof ensureThread>[0],
  ): Promise<{ threadId: string; isNew: boolean }> {
    return ensureThread(params);
  }

  /** 24h cache for total conversations count */
  private static totalConversationsCountCache: {
    count: number;
    timestamp: number;
  } | null = null;
  private static readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
  /**
   * List threads with pagination and filtering
   */
  static async listThreads(
    data: ThreadListRequestOutput,
    user: JwtPayloadType,
    t: ThreadsT,
    logger: EndpointLogger,
    locale: CountryLanguage,
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
      const userId = !user.isPublic && user.id;

      logger.debug("Listing threads - START", {
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

      logger.debug("Listing threads - User identifier", {
        userIdentifier,
        isPublic: user.isPublic,
      });

      if (!userIdentifier) {
        return fail({
          message: t("get.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Build where clause - use leadId for anonymous users, userId for authenticated users
      // For PUBLIC folder, show all public threads from all users
      // For SHARED folder, show user's own threads + threads where user is moderator
      // For other folders, only show user's own threads
      // If no rootFolderId specified, show threads from all folders (filtered by permissions later)
      const conditions = [];

      if (rootFolderId === DefaultFolderId.PUBLIC) {
        // PUBLIC folder: Show all threads in public folder (from all users)
        conditions.push(eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC));
      } else if (rootFolderId === DefaultFolderId.SHARED) {
        // SHARED folder: Show user's own threads
        // Permission filtering happens later via canViewThread
        conditions.push(eq(chatThreads.rootFolderId, DefaultFolderId.SHARED));
        // For public users, filter by leadId; for authenticated users, filter by userId
        if (user.isPublic) {
          conditions.push(eq(chatThreads.leadId, userIdentifier));
        } else {
          conditions.push(eq(chatThreads.userId, userIdentifier));
        }
      } else if (rootFolderId) {
        // Specific folder: Show only user's own threads in that folder
        // For public users, filter by leadId; for authenticated users, filter by userId
        if (user.isPublic) {
          conditions.push(eq(chatThreads.leadId, userIdentifier));
        } else {
          conditions.push(eq(chatThreads.userId, userIdentifier));
        }
        conditions.push(eq(chatThreads.rootFolderId, rootFolderId));
      } else {
        // No rootFolderId specified: Show threads from all folders
        // For public users, show threads from public folder
        // For authenticated users, show their own threads from all folders + all public threads
        // Permission filtering happens later via canViewThread
        if (user.isPublic) {
          // Public users: Show all threads from public folder
          conditions.push(eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC));
        } else {
          // Authenticated users: Show their own threads from all folders + all threads from public folder
          conditions.push(
            or(
              eq(chatThreads.userId, userIdentifier),
              eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC),
            )!,
          );
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

      // Build folder map for permission inheritance
      // Fetch all folders that are referenced by threads
      const folderIds = dbThreads
        .map((row) => row.folderId)
        .filter((id): id is string => id !== null);

      const allFolders: Record<string, ChatFolder> = {};
      if (folderIds.length > 0) {
        const folders = await db
          .select()
          .from(chatFolders)
          .where(inArray(chatFolders.id, folderIds));

        for (const folder of folders) {
          allFolders[folder.id] = folder;
        }

        // Also fetch parent folders for proper inheritance chain
        const parentIds = folders
          .map((f) => f.parentId)
          .filter((id): id is string => id !== null);

        if (parentIds.length > 0) {
          const parentFolders = await db
            .select()
            .from(chatFolders)
            .where(inArray(chatFolders.id, parentIds));

          for (const folder of parentFolders) {
            allFolders[folder.id] = folder;
          }
        }
      }

      // Filter threads based on user permissions
      const visibleThreads = [];
      for (const thread of dbThreads) {
        // Get folder if thread has one
        const folder = thread.folderId
          ? allFolders[thread.folderId] || null
          : null;

        const canView = await canViewThread(
          user,
          thread,
          folder,
          logger,
          locale,
          allFolders,
        );

        if (canView) {
          visibleThreads.push(thread);
        }
      }

      // Map DB fields to API response format (DB has rootFolderId as DefaultFolderId, folderId as UUID)
      // Compute permission flags for each thread
      const threads = await Promise.all(
        visibleThreads.map(async (thread) => {
          const folder = thread.folderId
            ? allFolders[thread.folderId] || null
            : null;

          // Compute all permission flags server-side
          const [
            canEditFlag,
            canPostFlag,
            canModerateFlag,
            canDeleteFlag,
            canManagePermsFlag,
          ] = await Promise.all([
            canEditThread(user, thread, folder, logger, locale, allFolders),
            canPostInThread(user, thread, folder, logger, locale, allFolders),
            canHideThread(user, thread, logger, locale, folder, allFolders),
            canDeleteThread(user, thread, logger, locale),
            canManageThreadPermissions(
              user,
              thread,
              folder,
              logger,
              locale,
              allFolders,
            ),
          ]);

          return {
            id: thread.id,
            title: thread.title,
            rootFolderId: thread.rootFolderId,
            folderId: thread.folderId,
            status: thread.status,
            preview: thread.preview,
            pinned: thread.pinned,
            archived: thread.archived,
            // Preserve null values for inheritance (null = inherit, [] = deny, [roles...] = allow)
            rolesView: thread.rolesView,
            rolesEdit: thread.rolesEdit,
            rolesPost: thread.rolesPost,
            rolesModerate: thread.rolesModerate,
            rolesAdmin: thread.rolesAdmin,
            // Permission flags - computed server-side
            canEdit: canEditFlag,
            canPost: canPostFlag,
            canModerate: canModerateFlag,
            canDelete: canDeleteFlag,
            canManagePermissions: canManagePermsFlag,
            streamingState: thread.streamingState,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
          };
        }),
      );

      const pageCount = Math.ceil(total / limit);

      return success({
        threads,
        totalCount: total,
        pageCount,
        currentPage: page,
        pageSize: limit,
      });
    } catch (error) {
      logger.error("Error listing threads", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Create a new thread
   */
  static async createThread(
    data: ThreadCreateRequestOutput,
    user: JwtPayloadType,
    t: ThreadsT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ThreadCreateResponseOutput>> {
    try {
      logger.debug("Creating thread", {
        userId: user.id,
        leadId: user.leadId,
        isPublic: user.isPublic,
        title: data.title,
        rootFolderId: data.rootFolderId,
        subFolderId: data.subFolderId,
      });

      // Subfolder validation: subFolderId is optional and validated by schema

      // For anonymous users (public), use leadId instead of userId
      // For authenticated users, use userId
      const userIdentifier = user.isPublic ? user.leadId : user.id;

      if (!userIdentifier) {
        return fail({
          message: t("post.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Check permissions: get folder if subFolderId is provided
      const folderId = data.subFolderId;
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
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: {
              message: "Folder not found",
            },
          });
        }

        folder = folderResult;
      } else if (data.rootFolderId === DefaultFolderId.PUBLIC) {
        // Creating thread in PUBLIC root - need to check ADMIN permission
        // Create a virtual folder object for permission check
        folder = {
          id: "public-root",
          userId: null, // Root folders have no owner
          leadId: null,
          rootFolderId: DefaultFolderId.PUBLIC as const,
          name: "Public",
          icon: null,
          color: null,
          parentId: null, // This is the key - null means root level
          expanded: true,
          sortOrder: 0,
          pinned: false,
          rolesView: [],
          rolesManage: [],
          rolesCreateThread: [],
          rolesPost: [],
          rolesModerate: [],
          rolesAdmin: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Check if user has permission to create thread in this folder
      const hasPermission = await canCreateThreadInFolder(
        user,
        folder,
        logger,
        locale,
      );

      if (!hasPermission) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
          messageParams: {
            message: "Cannot create thread in this location",
          },
        });
      }

      const threadId = data.id ?? crypto.randomUUID();

      const threadData = {
        id: threadId,
        userId: userIdentifier,
        title: data.title || t("post.threadTitle.default"),
        rootFolderId: data.rootFolderId,
        folderId: data.subFolderId ?? null,
        status: ThreadStatus.ACTIVE,
        defaultModel: data.model ?? null,
        defaultSkill: data.character ?? null,
        systemPrompt: data.systemPrompt ?? null,
        pinned: false,
        archived: false,
        tags: [],
        preview: null,
      } satisfies typeof chatThreads.$inferInsert;

      const [dbThread] = await db
        .insert(chatThreads)
        .values(threadData)
        .returning();

      logger.debug("Thread created successfully", { threadId: dbThread.id });

      return success({
        threadId: dbThread.id,
        status: dbThread.status,
        createdAt: dbThread.createdAt,
        updatedAt: dbThread.updatedAt,
      });
    } catch (error) {
      logger.error("Error creating thread", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get total count of conversations/threads with 24h caching
   */
  static async getTotalConversationsCount(
    logger: EndpointLogger,
    t: ThreadsT,
  ): Promise<ResponseType<number>> {
    try {
      const now = Date.now();

      // Check if cache exists and is still valid (within 24h)
      if (
        ThreadsRepository.totalConversationsCountCache &&
        now - ThreadsRepository.totalConversationsCountCache.timestamp <
          ThreadsRepository.CACHE_DURATION_MS
      ) {
        logger.debug("Returning cached total conversations count", {
          count: ThreadsRepository.totalConversationsCountCache.count,
          age: `${Math.floor((now - ThreadsRepository.totalConversationsCountCache.timestamp) / 1000 / 60 / 60)}h`,
        });
        return success(ThreadsRepository.totalConversationsCountCache.count);
      }

      // Cache is invalid or doesn't exist - query database
      logger.debug("Fetching fresh total conversations count from database");

      const [{ total }] = await db.select({ total: count() }).from(chatThreads);

      // Update cache
      ThreadsRepository.totalConversationsCountCache = {
        count: total,
        timestamp: now,
      };

      logger.debug("Total conversations count fetched and cached", {
        count: total,
      });

      return success(total);
    } catch (error) {
      logger.error(
        "Error getting total conversations count",
        parseError(error),
      );
      return fail({
        message: t("errors.count_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
