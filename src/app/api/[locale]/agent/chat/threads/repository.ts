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
  success,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { chatFolders, chatThreads, type ChatFolder } from "../db";
import {
  canCreateThreadInFolder,
  canViewThread,
  canEditThread,
  canPostInThread,
  canHideThread,
  canDeleteThread,
  canManageThreadPermissions,
} from "../permissions/permissions";
import { ThreadStatus } from "../enum";
import { validateNotIncognito } from "../validation";
import { DefaultFolderId } from "../config";
import type {
  ThreadCreateRequestOutput,
  ThreadCreateResponseOutput,
  ThreadListRequestOutput,
  ThreadListResponseOutput,
} from "./definition";

/**
 * Generate thread title from first message
 * Truncates content to max 50 characters at word boundary
 */
export function generateThreadTitle(content: string): string {
  const maxLength = 50;
  const minLastSpace = 20;
  const ellipsis = "...";
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > minLastSpace
    ? `${truncated.substring(0, lastSpace)}${ellipsis}`
    : truncated;
}

/**
 * Verify existing thread and check permissions
 * Returns thread ID if valid, error response otherwise
 */
async function verifyExistingThread(params: {
  threadId: string;
  isIncognito: boolean;
  userId?: string;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): Promise<ResponseType<string>> {
  const { threadId, isIncognito, userId, user, logger } = params;

  if (!isIncognito && userId) {
    const [existing] = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (!existing?.id) {
      logger.error("Thread not found", { threadId, userId });
      return fail({
        message: "app.api.agent.chat.threads.get.errors.notFound.title",
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

    const hasPermission = await canPostInThread(user, existing, folder, logger);

    if (!hasPermission) {
      logger.error("User does not have permission to post in thread", {
        threadId,
        userId,
        threadUserId: existing.userId,
        rootFolderId: existing.rootFolderId,
      });
      return fail({
        message: "app.api.agent.chat.threads.get.errors.forbidden.title",
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

/**
 * Ensure thread exists or create new one with permission checks
 * Used by AI streaming to get or create a thread before posting messages
 */
export async function ensureThread({
  threadId,
  rootFolderId,
  subFolderId,
  userId,
  content,
  isIncognito,
  logger,
  user,
  leadId,
}: {
  threadId: string | null | undefined;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null | undefined;
  userId?: string;
  leadId?: string;
  content: string;
  isIncognito: boolean;
  logger: EndpointLogger;
  user: JwtPayloadType;
}): Promise<{ threadId: string; isNew: boolean }> {
  logger.debug("ensureThread called", {
    threadId,
    rootFolderId,
    subFolderId,
    userId,
    leadId,
    isIncognito,
  });

  // If threadId provided, verify it exists and check permissions (unless incognito)
  if (threadId) {
    const verifyResult = await verifyExistingThread({
      threadId,
      isIncognito,
      userId,
      user,
      logger,
    });

    if (!verifyResult.success) {
      const errorMessage = verifyResult.message || "UNKNOWN_ERROR";
      return await Promise.reject(new Error(errorMessage));
    }

    return { threadId: verifyResult.data, isNew: false };
  }

  // Create new thread - check permissions first
  const newThreadId = crypto.randomUUID();
  const title = generateThreadTitle(content);

  // Only store in DB if not incognito
  if (!isIncognito) {
    let folder: ChatFolder | null = null;

    if (subFolderId) {
      // Get parent folder to check permissions
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
      // Creating thread directly in a root folder (no subfolder)
      // Check permission using DEFAULT_FOLDER_CONFIGS rolesCreateThread
      const { getDefaultFolderConfig } = await import("../config");
      const { hasRolePermission } = await import("../permissions/permissions");

      const rootConfig = getDefaultFolderConfig(rootFolderId);
      if (!rootConfig) {
        logger.error("Root folder config not found", { rootFolderId });
        return await Promise.reject(new Error("FOLDER_NOT_FOUND"));
      }

      // Any authenticated user can create threads in their private/shared root folders
      if (rootFolderId === DefaultFolderId.PUBLIC) {
        const hasPermission = await hasRolePermission(
          user,
          rootConfig.rolesCreateThread,
          logger,
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

    // Check if user has permission to create thread in this folder (only if folder exists)
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
      const hasPermission = await canCreateThreadInFolder(user, folder, logger);

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

    // DO NOT set permission fields - leave as empty arrays to inherit from parent folder
    // Permission inheritance: empty array [] = inherit from parent folder
    // Only set explicit permissions when user overrides via context menu

    await db.insert(chatThreads).values({
      id: newThreadId,
      userId: userId ?? null,
      leadId: leadId ?? null,
      title,
      rootFolderId,
      folderId: subFolderId ?? null,
      // rolesRead, rolesWrite, rolesModerate, rolesAdmin are NOT set
      // They default to [] which means inherit from parent folder
    });

    logger.debug("Created new thread", {
      threadId: newThreadId,
      title,
      userId,
      leadId,
    });
  } else {
    logger.debug("Generated incognito thread ID", { threadId: newThreadId });
  }

  return { threadId: newThreadId, isNew: true };
}

/**
 * 24h cache for total conversations count
 */
let totalConversationsCountCache: { count: number; timestamp: number } | null = null;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Threads Repository Interface
 */
export interface ThreadsRepositoryInterface {
  listThreads(
    data: ThreadListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadListResponseOutput>>;

  createThread(
    data: ThreadCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadCreateResponseOutput>>;

  /**
   * Get total count of conversations/threads (cached for 24h)
   */
  getTotalConversationsCount(logger: EndpointLogger): Promise<ResponseType<number>>;
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
          message: "app.api.agent.chat.threads.get.errors.unauthorized.title",
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
        .map((t) => t.folderId)
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
            canEditThread(user, thread, folder, logger, allFolders),
            canPostInThread(user, thread, folder, logger, allFolders),
            canHideThread(user, thread, logger, folder, allFolders),
            canDeleteThread(user, thread, logger),
            canManageThreadPermissions(
              user,
              thread,
              folder,
              logger,
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
            createdAt: thread.createdAt.toISOString(),
            updatedAt: thread.updatedAt.toISOString(),
          };
        }),
      );

      const pageCount = Math.ceil(total / limit);

      return success({
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
        message: "app.api.agent.chat.threads.get.errors.server.title",
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
        "app.api.agent.chat.threads.post",
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
          message: "app.api.agent.chat.threads.post.errors.unauthorized.title",
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
            message: "app.api.agent.chat.threads.post.errors.notFound.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: {
              message: "Folder not found",
            },
          });
        }

        folder = folderResult;
      } else if (data.thread?.rootFolderId === DefaultFolderId.PUBLIC) {
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
      const hasPermission = await canCreateThreadInFolder(user, folder, logger);

      if (!hasPermission) {
        return fail({
          message: "app.api.agent.chat.threads.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
          messageParams: {
            message: "Cannot create thread in this location",
          },
        });
      }

      // DO NOT set permission fields - leave as empty arrays to inherit from parent folder
      // Permission inheritance: empty array [] = inherit from parent folder
      // Only set explicit permissions when user overrides via context menu

      const threadData = {
        userId: userIdentifier,
        title:
          data.thread?.title ||
          simpleT(locale).t(
            "app.api.agent.chat.threads.post.threadTitle.default",
          ),
        rootFolderId: data.thread?.rootFolderId,
        folderId: data.thread?.subFolderId ?? null,
        status: ThreadStatus.ACTIVE,
        defaultModel: data.thread?.model ?? null,
        defaultPersona: data.thread?.persona ?? null,
        systemPrompt: data.thread?.systemPrompt ?? null,
        pinned: false,
        archived: false,
        tags: [],
        preview: null,
        // rolesView, rolesEdit, rolesPost, rolesModerate, rolesAdmin are NOT set
        // They default to null which means inherit from parent folder
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

      return success({
        response: {
          thread,
        },
      });
    } catch (error) {
      logger.error("Error creating thread", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get total count of conversations/threads with 24h caching
   */
  async getTotalConversationsCount(logger: EndpointLogger): Promise<ResponseType<number>> {
    try {
      const now = Date.now();

      // Check if cache exists and is still valid (within 24h)
      if (totalConversationsCountCache && (now - totalConversationsCountCache.timestamp) < CACHE_DURATION_MS) {
        logger.debug("Returning cached total conversations count", {
          count: totalConversationsCountCache.count,
          age: `${Math.floor((now - totalConversationsCountCache.timestamp) / 1000 / 60 / 60)}h`
        });
        return success(totalConversationsCountCache.count);
      }

      // Cache is invalid or doesn't exist - query database
      logger.debug("Fetching fresh total conversations count from database");

      const [{ total }] = await db
        .select({ total: count() })
        .from(chatThreads);

      // Update cache
      totalConversationsCountCache = {
        count: total,
        timestamp: now,
      };

      logger.debug("Total conversations count fetched and cached", { count: total });

      return success(total);
    } catch (error) {
      logger.error("Error getting total conversations count", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.errors.count_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

/**
 * Default repository instance
 */
export const threadsRepository = new ThreadsRepositoryImpl();
