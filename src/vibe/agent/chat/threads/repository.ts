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
  sql,
} from "drizzle-orm";
import { type CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DefaultFolderId } from "../config";
import { type ChatFolder, chatFolders, chatThreads } from "../db";
import { ThreadStatus, ThreadStreamingState } from "../enum";
import { scopedTranslation as chatScopedTranslation } from "../i18n";
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
import definitions from "./definition";
import { scopedTranslation, type ThreadsT } from "./i18n";

/**
 * Threads Repository - Static class pattern
 */
export class ThreadsRepository {
  /**
   * Verify existing thread and check permissions
   * Returns thread ID if valid, error response otherwise
   */
  private static async verifyExistingThread(params: {
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

  /**
   * Ensure thread exists or create new one with permission checks
   * Used by AI streaming to get or create a thread before posting messages
   */
  /**
   * Walk a folder chain to its top-level folder name. Used exactly ONCE per
   * thread, at creation, to stamp loop_instance_id from REMOTE/<instance>
   * placement (Remote-tab sugar). Routing reads the COLUMN, never folders.
   */
  /** Pure placement walk: the ROOT folder's name (= the instance a
   *  REMOTE/<instance> chain belongs to), independent of loop routing. */
  static async deriveFolderRootInstanceName(
    leafFolderId: string,
  ): Promise<string | null> {
    let currentId: string | null = leafFolderId;
    for (let depth = 0; depth < 32 && currentId; depth++) {
      const [row]: Array<{ name: string; parentId: string | null }> = await db
        .select({ name: chatFolders.name, parentId: chatFolders.parentId })
        .from(chatFolders)
        .where(eq(chatFolders.id, currentId))
        .limit(1);
      if (!row) {
        return null;
      }
      if (row.parentId === null) {
        return row.name;
      }
      currentId = row.parentId;
    }
    return null;
  }

  static async deriveLoopInstanceFromFolder(
    leafFolderId: string,
    /** Thread owner — resolves the connection's loopLocation setting. */
    userId?: string,
  ): Promise<string | null> {
    const instanceName =
      await ThreadsRepository.deriveFolderRootInstanceName(leafFolderId);
    if (!instanceName) {
      return null;
    }
    // The connection's loopLocation setting decides where the loop runs:
    // 'caller' keeps it on THIS instance (loop_instance_id stays NULL);
    // 'target' (default) stamps the connected instance.
    if (userId) {
      const { remoteConnections } =
        await import("next-vibe/remote-connection/db");
      const [conn] = await db
        .select({ loopLocation: remoteConnections.loopLocation })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, userId),
            eq(remoteConnections.instanceId, instanceName),
          ),
        )
        .limit(1);
      if (conn?.loopLocation === "caller") {
        return null;
      }
    }
    return instanceName;
  }

  static async ensureThread({
    threadId,
    rootFolderId,
    subFolderId,
    userId,
    isIncognito,
    logger,
    user,
    leadId,
    locale,
    originInstanceId,
    loopInstanceId,
    syncEligible,
    parentThreadId,
  }: {
    threadId: string;
    rootFolderId: DefaultFolderId;
    subFolderId: string | null | undefined;
    userId?: string;
    leadId?: string;
    isIncognito: boolean;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
    /** Owning instance for a FOREIGN copy (relay executor landing). NULL/absent = ours. */
    originInstanceId?: string | null;
    /** Explicit loop location. Absent → derived ONCE from REMOTE/<x> placement (creation sugar). */
    loopInstanceId?: string | null;
    /** Transient plumbing threads (tool executions) set false — never derived from folders. */
    syncEligible?: boolean;
    /** Spawning thread when this is a sub-stream/sub-agent child. NULL/absent = top-level. */
    parentThreadId?: string | null;
  }): Promise<
    ResponseType<{
      threadId: string;
      isNew: boolean;
    }>
  > {
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
      // Incognito threads have no DB row — the chain's context is all there is.
      return success({ threadId, isNew: true });
    }

    const [existing] = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (existing?.id) {
      const verifyResult = await ThreadsRepository.verifyExistingThread({
        threadId,
        isIncognito,
        userId,
        user,
        logger,
        locale,
      });

      if (!verifyResult.success) {
        return verifyResult;
      }

      // Existing thread: fixture bookkeeping lives in the separate `fixtures`
      // table (keyed by threadId), independent of the thread row — nothing to
      // carry back here.
      return success({ threadId: verifyResult.data, isNew: false });
    }

    const title = chatScopedTranslation.scopedT(locale).t("common.newChat");
    let folder: ChatFolder | null = null;

    if (subFolderId) {
      const [folderResult] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, subFolderId))
        .limit(1);

      if (!folderResult) {
        logger.error("Folder not found", { subFolderId });
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
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
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
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
          const { t } = scopedTranslation.scopedT(locale);
          return fail({
            message: t("get.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
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
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
    }

    let resolvedLeadId: string | null = leadId ?? null;
    if (resolvedLeadId) {
      const [leadExists] = await db
        .select({ id: leads.id })
        .from(leads)
        .where(eq(leads.id, resolvedLeadId))
        .limit(1);
      if (!leadExists) {
        logger.warn("leadId from JWT not found in leads table, ignoring", {
          leadId: resolvedLeadId,
        });
        resolvedLeadId = null;
      }
    }

    // ONE-TIME creation sugar: a thread born inside REMOTE/<instance> runs its
    // loop there. The stamp lands in the column; placement never routes again.
    // originInstanceId stays whatever the caller passed (NULL for a source
    // thread) — a non-null origin marks a MIRROR; the loop/relay guards treat
    // origin-set threads as foreign copies, so we must NOT stamp it here for a
    // source thread the user created in a REMOTE tab. Placement on the peer is
    // resolved by the receiver from the folder path, not by an origin stamp.
    const effectiveLoopInstanceId =
      loopInstanceId !== undefined
        ? loopInstanceId
        : rootFolderId === DefaultFolderId.REMOTE && subFolderId
          ? await ThreadsRepository.deriveLoopInstanceFromFolder(
              subFolderId,
              userId,
            )
          : null;

    await db.insert(chatThreads).values({
      id: threadId,
      userId: userId ?? null,
      leadId: resolvedLeadId,
      title,
      rootFolderId,
      folderId: subFolderId ?? null,
      originInstanceId: originInstanceId ?? null,
      loopInstanceId: effectiveLoopInstanceId,
      syncEligible: syncEligible ?? true,
      parentThreadId: parentThreadId ?? null,
      // Thread creation is fixture-agnostic: record/replay bookkeeping lives in
      // the dedicated `fixtures` table (keyed by threadId), written by the test
      // harness up front on every instance. A fresh thread with a provided id
      // is created exactly as any other — the engine reads fixtures by that id.
    });

    logger.debug("Created new thread", {
      threadId,
      title,
      userId,
      leadId,
    });

    return success({ threadId, isNew: true });
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

      // Track whether the query guarantees all results are owned by the current user.
      // When true, we skip the per-thread canViewThread loop (owner always has view).
      let allThreadsOwnedByUser = false;

      if (rootFolderId === DefaultFolderId.PUBLIC) {
        // PUBLIC folder: Show all threads in public folder (from all users)
        conditions.push(eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC));
      } else if (rootFolderId === DefaultFolderId.SHARED) {
        // SHARED folder: Show user's own threads
        conditions.push(eq(chatThreads.rootFolderId, DefaultFolderId.SHARED));
        // For public users, filter by leadId; for authenticated users, filter by userId
        if (user.isPublic) {
          conditions.push(eq(chatThreads.leadId, userIdentifier));
        } else {
          conditions.push(eq(chatThreads.userId, userIdentifier));
        }
        allThreadsOwnedByUser = true;
      } else if (rootFolderId) {
        // Specific folder: Show only user's own threads in that folder
        // For public users, filter by leadId; for authenticated users, filter by userId
        if (user.isPublic) {
          conditions.push(eq(chatThreads.leadId, userIdentifier));
        } else {
          conditions.push(eq(chatThreads.userId, userIdentifier));
        }
        conditions.push(eq(chatThreads.rootFolderId, rootFolderId));
        allThreadsOwnedByUser = true;
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
            ilike(chatThreads.description, `%${search}%`),
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

      // Filter threads based on user permissions.
      // Skip per-thread canViewThread when the DB query already guarantees ownership —
      // the owner always has view access, so checking each thread individually is wasteful.
      let visibleThreads;
      if (allThreadsOwnedByUser) {
        visibleThreads = dbThreads;
      } else {
        visibleThreads = [];
        for (const thread of dbThreads) {
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
      }

      // Map DB fields to API response format (DB has rootFolderId , folderId as UUID)
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
            description: thread.description,
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
      } else if (
        data.rootFolderId === DefaultFolderId.PRIVATE ||
        data.rootFolderId === DefaultFolderId.REMOTE
      ) {
        // Creating thread in PRIVATE or REMOTE root — virtual folder owned by this user
        folder = {
          id: `${data.rootFolderId}-root`,
          userId: userIdentifier,
          leadId: null,
          rootFolderId: data.rootFolderId as
            | DefaultFolderId.PRIVATE
            | DefaultFolderId.REMOTE,
          name:
            data.rootFolderId === DefaultFolderId.PRIVATE
              ? "Private"
              : "Remote",
          icon: null,
          color: null,
          parentId: null,
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

      // ONE-TIME creation sugar: Remote-tab threads stamp their loop location.
      const loopInstanceId =
        data.rootFolderId === DefaultFolderId.REMOTE && data.subFolderId
          ? await ThreadsRepository.deriveLoopInstanceFromFolder(
              data.subFolderId,
              user.isPublic ? undefined : user.id,
            )
          : null;

      const threadData = {
        id: threadId,
        userId: userIdentifier,
        title: data.title || t("post.threadTitle.default"),
        rootFolderId: data.rootFolderId,
        folderId: data.subFolderId ?? null,
        loopInstanceId,
        status: ThreadStatus.ACTIVE,
        defaultModel: data.model ?? null,
        defaultSkill: data.character ?? null,
        systemPrompt: data.systemPrompt ?? null,
        pinned: false,
        archived: false,
        tags: [],
        description: null,
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

  /**
   * Cross-instance applier for `thread-title-updated`: update the title in DB
   * and re-emit locally (fanOut=false) so this instance's WS clients see it.
   */
  static async applyRemoteThreadTitleUpdated(
    props: RemoteEventHandlerProps<
      typeof definitions.GET,
      "thread-title-updated"
    >,
  ): Promise<void> {
    const { responseData, user, logger } = props;
    const thread = responseData.threads?.[0];
    if (!thread?.id || !thread.title) {
      return;
    }
    const updatedRows = await db
      .update(chatThreads)
      .set({ title: thread.title, updatedAt: new Date() })
      .where(eq(chatThreads.id, thread.id))
      .returning({
        rootFolderId: chatThreads.rootFolderId,
        folderId: chatThreads.folderId,
      })
      .catch((err: Error) => {
        logger.warn(
          "[threads/repository] thread-title-updated: DB update failed",
          {
            threadId: thread.id,
            error: err.message,
          },
        );
        return [];
      });
    const updatedRow = updatedRows[0];
    if (!updatedRow) {
      return;
    }
    const { createEndpointEmitter } =
      await import("next-vibe/realtime/emitter");
    createEndpointEmitter(definitions.GET, logger, user, {
      requestData: {
        rootFolderId: updatedRow.rootFolderId,
        subFolderId: updatedRow.folderId ?? null,
      },
      fanOut: false,
    })("thread-title-updated", {
      responseData: { threads: [{ id: thread.id, title: thread.title }] },
    });
  }

  /**
   * Cross-instance applier for the `thread-created` event: materialize a
   * FOREIGN MIRROR of the sender's new thread. NEVER re-run createThread with
   * the wire inputs — that fabricates a local-looking thread (raw wire root,
   * origin NULL) and poisons every later ownership check. Placement is data:
   * REMOTE root, origin column = the bridge wire's sender label, folderId =
   * the SAME-id wire subFolderId when that folder already synced (folder
   * events / pull heal it otherwise).
   */
  static async applyRemoteThreadCreate(
    props: RemoteEventHandlerProps<typeof definitions.POST, "thread-created">,
  ): Promise<void> {
    const { user, logger, requestData, originInstanceId } = props;
    // requestData is already gated by the bridge against the event's declared
    // requestFields subset (id/title/rootFolderId/subFolderId).
    if (!requestData.id) {
      logger.error("Relayed thread-created missing thread id — dropped");
      return;
    }
    const userId = "id" in user && typeof user.id === "string" ? user.id : null;
    if (!userId) {
      return;
    }
    // Folders sync by SAME id: place immediately when the wire folder exists.
    // PUSH-ONLY convergence: no waiting — the sender ships the chain first
    // (ordered on the WS leg) and re-pushes placement at every turn end, so
    // a reordered leg heals on the next thread-updated.
    // When the specific folder hasn't synced yet, fall back to the scaffold
    // (REMOTE/<originInstanceId>/private|background) so the thread lands in
    // the correct instance subtree rather than at the REMOTE root.
    let mirrorFolderId: string | null = null;
    if (requestData.subFolderId) {
      const [folderRow] = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(eq(chatFolders.id, requestData.subFolderId))
        .limit(1);
      mirrorFolderId = folderRow ? requestData.subFolderId : null;
    }
    if (mirrorFolderId === null && originInstanceId) {
      const { resolveScaffoldFolderId } =
        await import("next-vibe/agent/chat/threads/sync-provider");
      const senderRootFolderId =
        requestData.rootFolderId ?? DefaultFolderId.PRIVATE;
      mirrorFolderId = await resolveScaffoldFolderId(
        userId,
        originInstanceId,
        senderRootFolderId,
      );
    }
    await db
      .insert(chatThreads)
      .values({
        id: requestData.id,
        userId,
        rootFolderId: DefaultFolderId.REMOTE,
        folderId: mirrorFolderId,
        title: requestData.title ?? "",
        originInstanceId,
      })
      .onConflictDoUpdate({
        target: chatThreads.id,
        // A message event may have raced a minimal stub in first — backfill
        // the fields the stub lacks. The setWhere is LOAD-BEARING: a relay
        // EXECUTOR also emits thread-created for its landing copy of the
        // CALLER's thread — that echo must NEVER touch the caller's local
        // original (origin NULL = ours). Only rows already stamped foreign
        // (message stubs always stamp origin) may be backfilled.
        set: {
          title: requestData.title ?? "",
          rootFolderId: DefaultFolderId.REMOTE,
          ...(mirrorFolderId !== null && { folderId: mirrorFolderId }),
        },
        setWhere: sql`${chatThreads.originInstanceId} IS NOT NULL`,
      })
      .catch((err: Error) => {
        logger.error("Failed to apply remote thread create", {
          message: err.message,
        });
      });
    // Surface the mirror in open sidebars (REMOTE root) — local WS
    // subscribers insert it into the folder-contents list cache.
    const { createFolderContentsEmitter } =
      await import("next-vibe/agent/chat/folder-contents/[rootFolderId]/emitter");
    const now = new Date();
    createFolderContentsEmitter(
      logger,
      user,
      DefaultFolderId.REMOTE,
    )("thread-created", {
      responseData: {
        items: [
          {
            id: requestData.id,
            type: "thread" as const,
            title: requestData.title ?? "",
            rootFolderId: DefaultFolderId.REMOTE,
            folderId: mirrorFolderId,
            status: ThreadStatus.ACTIVE,
            streamingState: ThreadStreamingState.IDLE,
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
    });
  }
}
