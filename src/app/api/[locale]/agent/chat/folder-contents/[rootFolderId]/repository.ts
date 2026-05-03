import "server-only";

import { and, count, desc, eq, inArray, isNull, max } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  type ChatFolder,
  chatFolders,
  chatThreads,
  threadShareLinks,
} from "@/app/api/[locale]/agent/chat/db";
import {
  canCreateThreadInFolder,
  canDeleteFolder,
  canDeleteThread,
  canEditThread,
  canHideFolder,
  canHideThread,
  canManageFolder,
  canManageFolderPermissions,
  canManageThreadPermissions,
  canPostInThread,
  canViewFolder,
  canViewThread,
} from "@/app/api/[locale]/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  FolderContentsItem,
  FolderContentsRequestOutput,
  FolderContentsResponseOutput,
  FolderContentsUrlVariablesOutput,
} from "./definition";
import type { FolderContentsT } from "./i18n";

export class FolderContentsRepository {
  static async getFolderContents(
    urlPathParams: FolderContentsUrlVariablesOutput,
    data: FolderContentsRequestOutput,
    user: JwtPayloadType,
    t: FolderContentsT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderContentsResponseOutput>> {
    const userIdentifier = user.isPublic ? user.leadId : user.id;

    if (!userIdentifier) {
      logger.error("Missing user identifier", { user });
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    const { rootFolderId } = urlPathParams;
    const subFolderId = data.subFolderId ?? null;
    const threadIds = data.threadIds ?? null;

    try {
      logger.debug("Fetching folder contents", {
        userIdentifier,
        rootFolderId,
        subFolderId,
        threadIds: threadIds?.length ?? 0,
      });

      // --- When threadIds is provided, skip folders and fetch only those threads ---
      if (threadIds && threadIds.length > 0) {
        return FolderContentsRepository.getThreadsByIds(
          threadIds,
          rootFolderId,
          user,
          userIdentifier,
          t,
          logger,
          locale,
        );
      }

      // --- Fetch folders at this level ---
      let folderWhere;
      if (rootFolderId === DefaultFolderId.PUBLIC) {
        folderWhere = and(
          eq(chatFolders.rootFolderId, rootFolderId),
          subFolderId
            ? eq(chatFolders.parentId, subFolderId)
            : isNull(chatFolders.parentId),
        );
      } else if (rootFolderId === DefaultFolderId.SHARED) {
        folderWhere = and(
          eq(chatFolders.rootFolderId, rootFolderId),
          eq(chatFolders.userId, userIdentifier),
          subFolderId
            ? eq(chatFolders.parentId, subFolderId)
            : isNull(chatFolders.parentId),
        );
      } else {
        folderWhere = and(
          eq(chatFolders.userId, userIdentifier),
          eq(chatFolders.rootFolderId, rootFolderId),
          subFolderId
            ? eq(chatFolders.parentId, subFolderId)
            : isNull(chatFolders.parentId),
        );
      }

      const dbFolders = await db.select().from(chatFolders).where(folderWhere);

      // Build a flat folder map for permission checks (need ancestor chain)
      const allFoldersForPermissions = await db
        .select()
        .from(chatFolders)
        .where(
          rootFolderId === DefaultFolderId.PUBLIC
            ? eq(chatFolders.rootFolderId, rootFolderId)
            : and(
                eq(chatFolders.userId, userIdentifier),
                eq(chatFolders.rootFolderId, rootFolderId),
              ),
        );

      const folderMap: Record<string, (typeof allFoldersForPermissions)[0]> =
        {};
      for (const f of allFoldersForPermissions) {
        folderMap[f.id] = f;
      }

      // Filter and map folders
      const folderItems: FolderContentsItem[] = [];
      for (const folder of dbFolders) {
        if (!(await canViewFolder(user, folder, logger, locale))) {
          continue;
        }

        if (!folder.userId && folder.rootFolderId !== DefaultFolderId.PUBLIC) {
          continue;
        }

        const [
          canManage,
          canCreateThread,
          canModerate,
          canDelete,
          canManagePerms,
        ] = await Promise.all([
          canManageFolder(user, folder, logger, locale, folderMap),
          canCreateThreadInFolder(user, folder, logger, locale, folderMap),
          canHideFolder(user, folder, logger, locale, folderMap),
          canDeleteFolder(user, folder, logger, locale, folderMap),
          canManageFolderPermissions(user, folder, logger, locale, folderMap),
        ]);

        folderItems.push({
          type: "folder" as const,
          sortOrder: folder.sortOrder,
          id: folder.id,
          userId: folder.userId,
          rootFolderId: folder.rootFolderId,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          // Folder fields
          name: folder.name,
          icon: folder.icon,
          color: folder.color,
          parentId: folder.parentId,
          expanded: folder.expanded,
          canManage,
          canCreateThread,
          canModerate,
          canDelete,
          canManagePermissions: canManagePerms,
          rolesView: folder.rolesView ?? [],
          rolesManage: folder.rolesManage ?? [],
          rolesCreateThread: folder.rolesCreateThread ?? [],
          rolesPost: folder.rolesPost ?? [],
          rolesModerate: folder.rolesModerate ?? [],
          rolesAdmin: folder.rolesAdmin ?? [],
          // Thread-only fields - null for folders
          title: null,
          folderId: null,
          status: null,
          preview: null,
          pinned: folder.pinned,
          archived: null,
          canEdit: null,
          canPost: null,
          streamingState: null,
          rolesEdit: null,
          // Share link fields - null for folders
          activeShareCount: null,
          lastSharedAt: null,
        });
      }

      // --- Fetch threads at this level ---
      const threadConditions = [];

      if (rootFolderId === DefaultFolderId.PUBLIC) {
        threadConditions.push(
          eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC),
        );
      } else if (rootFolderId === DefaultFolderId.SHARED) {
        threadConditions.push(
          eq(chatThreads.rootFolderId, DefaultFolderId.SHARED),
        );
        if (user.isPublic) {
          threadConditions.push(eq(chatThreads.leadId, userIdentifier));
        } else {
          threadConditions.push(eq(chatThreads.userId, userIdentifier));
        }
      } else {
        if (user.isPublic) {
          threadConditions.push(eq(chatThreads.leadId, userIdentifier));
        } else {
          threadConditions.push(eq(chatThreads.userId, userIdentifier));
        }
        threadConditions.push(eq(chatThreads.rootFolderId, rootFolderId));
      }

      // Filter by current folder level
      if (subFolderId === null) {
        threadConditions.push(isNull(chatThreads.folderId));
      } else {
        threadConditions.push(eq(chatThreads.folderId, subFolderId));
      }

      const dbThreads = await db
        .select()
        .from(chatThreads)
        .where(and(...threadConditions))
        .orderBy(desc(chatThreads.pinned), desc(chatThreads.updatedAt));

      // Batch-fetch active share link counts for SHARED folder threads
      const shareCountMap = new Map<
        string,
        { activeShareCount: number; lastSharedAt: Date | null }
      >();
      if (rootFolderId === DefaultFolderId.SHARED && dbThreads.length > 0) {
        const shareThreadIds = dbThreads.map((thread) => thread.id);
        const shareCounts = await db
          .select({
            threadId: threadShareLinks.threadId,
            activeShareCount: count(threadShareLinks.id),
            lastSharedAt: max(threadShareLinks.createdAt),
          })
          .from(threadShareLinks)
          .where(
            and(
              inArray(threadShareLinks.threadId, shareThreadIds),
              eq(threadShareLinks.active, true),
            ),
          )
          .groupBy(threadShareLinks.threadId);
        for (const row of shareCounts) {
          shareCountMap.set(row.threadId, {
            activeShareCount: row.activeShareCount,
            lastSharedAt: row.lastSharedAt ?? null,
          });
        }
      }

      // Build folder map for thread permission checks
      const threadFolderMap: Record<string, ChatFolder> = {};
      if (subFolderId) {
        const [parentFolder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, subFolderId))
          .limit(1);
        if (parentFolder) {
          threadFolderMap[parentFolder.id] = parentFolder;
          // Also fetch parent's ancestors
          let currentParentId = parentFolder.parentId;
          while (currentParentId) {
            const [ancestor] = await db
              .select()
              .from(chatFolders)
              .where(eq(chatFolders.id, currentParentId))
              .limit(1);
            if (!ancestor) {
              break;
            }
            threadFolderMap[ancestor.id] = ancestor;
            currentParentId = ancestor.parentId;
          }
        }
      }

      const threadItems: FolderContentsItem[] = [];
      for (const thread of dbThreads) {
        const folder = thread.folderId
          ? (threadFolderMap[thread.folderId] ?? null)
          : null;

        if (
          !(await canViewThread(
            user,
            thread,
            folder,
            logger,
            locale,
            threadFolderMap,
          ))
        ) {
          continue;
        }

        const [canEdit, canPost, canModerate, canDelete, canManagePerms] =
          await Promise.all([
            canEditThread(
              user,
              thread,
              folder,
              logger,
              locale,
              threadFolderMap,
            ),
            canPostInThread(
              user,
              thread,
              folder,
              logger,
              locale,
              threadFolderMap,
            ),
            canHideThread(
              user,
              thread,
              logger,
              locale,
              folder,
              threadFolderMap,
            ),
            canDeleteThread(user, thread, logger, locale),
            canManageThreadPermissions(
              user,
              thread,
              folder,
              logger,
              locale,
              threadFolderMap,
            ),
          ]);

        threadItems.push({
          type: "thread" as const,
          sortOrder: thread.sortOrder,
          id: thread.id,
          userId: thread.userId,
          rootFolderId: thread.rootFolderId,
          createdAt: thread.createdAt,
          updatedAt: thread.updatedAt,
          // Thread fields
          title: thread.title,
          folderId: thread.folderId,
          status: thread.status,
          preview: thread.preview,
          pinned: thread.pinned,
          archived: thread.archived,
          canEdit,
          canPost,
          canModerate,
          canDelete,
          canManagePermissions: canManagePerms,
          streamingState: thread.streamingState,
          rolesView: thread.rolesView ?? null,
          rolesEdit: thread.rolesEdit ?? null,
          rolesPost: thread.rolesPost ?? null,
          rolesModerate: thread.rolesModerate ?? null,
          rolesAdmin: thread.rolesAdmin ?? null,
          // Folder-only fields - null for threads
          name: null,
          icon: null,
          color: null,
          parentId: null,
          expanded: null,
          canManage: null,
          canCreateThread: null,
          rolesManage: null,
          rolesCreateThread: null,
          // Share link fields - only populated for SHARED folder
          activeShareCount:
            shareCountMap.get(thread.id)?.activeShareCount ?? null,
          lastSharedAt: shareCountMap.get(thread.id)?.lastSharedAt ?? null,
        });
      }

      // Merge and sort: pinned items first, then by updatedAt descending
      const allItems = [...folderItems, ...threadItems].toSorted((a, b) => {
        const aPinned = a.pinned ?? false;
        const bPinned = b.pinned ?? false;
        if (aPinned !== bPinned) {
          return aPinned ? -1 : 1;
        }
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      // Compute root folder permissions
      let rootFolderPermissions = {
        canCreateThread: false,
        canCreateFolder: false,
      };
      const { RootFolderPermissionsRepository } =
        await import("../../folders/[rootFolderId]/root-permissions/repository");
      const permissionsResult =
        await RootFolderPermissionsRepository.getRootFolderPermissions(
          { rootFolderId },
          user,
          locale,
          logger,
        );
      if (permissionsResult.success) {
        rootFolderPermissions = permissionsResult.data;
      }

      return success({
        rootFolderPermissions,
        items: allItems,
      });
    } catch (error) {
      logger.error("Failed to fetch folder contents", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Fetch specific threads by IDs for search results.
   * Returns only threads (no folders), with full permissions.
   */
  static async getThreadsByIds(
    threadIds: string[],
    rootFolderId: DefaultFolderId,
    user: JwtPayloadType,
    userIdentifier: string,
    translate: FolderContentsT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderContentsResponseOutput>> {
    try {
      const threadConditions = [inArray(chatThreads.id, threadIds)];

      // Scope to rootFolderId
      threadConditions.push(eq(chatThreads.rootFolderId, rootFolderId));

      // Scope to user for non-public folders
      if (rootFolderId !== DefaultFolderId.PUBLIC) {
        if (user.isPublic) {
          threadConditions.push(eq(chatThreads.leadId, userIdentifier));
        } else {
          threadConditions.push(eq(chatThreads.userId, userIdentifier));
        }
      }

      const dbThreads = await db
        .select()
        .from(chatThreads)
        .where(and(...threadConditions))
        .orderBy(desc(chatThreads.updatedAt));

      // Batch-fetch share counts for SHARED folder
      const shareCountMap = new Map<
        string,
        { activeShareCount: number; lastSharedAt: Date | null }
      >();
      if (rootFolderId === DefaultFolderId.SHARED && dbThreads.length > 0) {
        const ids = dbThreads.map((thread) => thread.id);
        const shareCounts = await db
          .select({
            threadId: threadShareLinks.threadId,
            activeShareCount: count(threadShareLinks.id),
            lastSharedAt: max(threadShareLinks.createdAt),
          })
          .from(threadShareLinks)
          .where(
            and(
              inArray(threadShareLinks.threadId, ids),
              eq(threadShareLinks.active, true),
            ),
          )
          .groupBy(threadShareLinks.threadId);
        for (const row of shareCounts) {
          shareCountMap.set(row.threadId, {
            activeShareCount: row.activeShareCount,
            lastSharedAt: row.lastSharedAt ?? null,
          });
        }
      }

      // Build folder map for permission checks
      const folderIds = [
        ...new Set(
          dbThreads
            .map((thread) => thread.folderId)
            .filter((id): id is string => id !== null),
        ),
      ];
      const threadFolderMap: Record<string, ChatFolder> = {};
      if (folderIds.length > 0) {
        const folders = await db
          .select()
          .from(chatFolders)
          .where(inArray(chatFolders.id, folderIds));
        for (const f of folders) {
          threadFolderMap[f.id] = f;
        }
      }

      const threadItems: FolderContentsItem[] = [];
      for (const thread of dbThreads) {
        const folder = thread.folderId
          ? (threadFolderMap[thread.folderId] ?? null)
          : null;

        if (
          !(await canViewThread(
            user,
            thread,
            folder,
            logger,
            locale,
            threadFolderMap,
          ))
        ) {
          continue;
        }

        const [canEdit, canPost, canModerate, canDelete, canManagePerms] =
          await Promise.all([
            canEditThread(
              user,
              thread,
              folder,
              logger,
              locale,
              threadFolderMap,
            ),
            canPostInThread(
              user,
              thread,
              folder,
              logger,
              locale,
              threadFolderMap,
            ),
            canHideThread(
              user,
              thread,
              logger,
              locale,
              folder,
              threadFolderMap,
            ),
            canDeleteThread(user, thread, logger, locale),
            canManageThreadPermissions(
              user,
              thread,
              folder,
              logger,
              locale,
              threadFolderMap,
            ),
          ]);

        threadItems.push({
          type: "thread" as const,
          sortOrder: thread.sortOrder,
          id: thread.id,
          userId: thread.userId,
          rootFolderId: thread.rootFolderId,
          createdAt: thread.createdAt,
          updatedAt: thread.updatedAt,
          title: thread.title,
          folderId: thread.folderId,
          status: thread.status,
          preview: thread.preview,
          pinned: thread.pinned,
          archived: thread.archived,
          canEdit,
          canPost,
          canModerate,
          canDelete,
          canManagePermissions: canManagePerms,
          streamingState: thread.streamingState,
          rolesView: thread.rolesView ?? null,
          rolesEdit: thread.rolesEdit ?? null,
          rolesPost: thread.rolesPost ?? null,
          rolesModerate: thread.rolesModerate ?? null,
          rolesAdmin: thread.rolesAdmin ?? null,
          name: null,
          icon: null,
          color: null,
          parentId: null,
          expanded: null,
          canManage: null,
          canCreateThread: null,
          rolesManage: null,
          rolesCreateThread: null,
          activeShareCount:
            shareCountMap.get(thread.id)?.activeShareCount ?? null,
          lastSharedAt: shareCountMap.get(thread.id)?.lastSharedAt ?? null,
        });
      }

      // Preserve the order from the input threadIds (search relevance order)
      const idOrder = new Map(threadIds.map((id, idx) => [id, idx]));
      const sortedItems = threadItems.toSorted(
        (a, b) => (idOrder.get(a.id) ?? 999) - (idOrder.get(b.id) ?? 999),
      );

      // Compute root folder permissions
      let rootFolderPermissions = {
        canCreateThread: false,
        canCreateFolder: false,
      };
      const { RootFolderPermissionsRepository } =
        await import("../../folders/[rootFolderId]/root-permissions/repository");
      const permissionsResult =
        await RootFolderPermissionsRepository.getRootFolderPermissions(
          { rootFolderId },
          user,
          locale,
          logger,
        );
      if (permissionsResult.success) {
        rootFolderPermissions = permissionsResult.data;
      }

      return success({
        rootFolderPermissions,
        items: sortedItems,
      });
    } catch (error) {
      logger.error("Failed to fetch threads by IDs", parseError(error));
      return fail({
        message: translate("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
