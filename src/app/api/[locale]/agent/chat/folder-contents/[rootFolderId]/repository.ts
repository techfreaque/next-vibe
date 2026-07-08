import "server-only";

import { and, count, desc, eq, inArray, isNull, max } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  ChannelDecision,
  RemoteEventHandlerProps,
} from "next-vibe/core/route/handler";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EmitChannelDecision } from "next-vibe/realtime/structured-events";

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

import { ThreadStreamingState } from "../../enum";
import type {
  FolderContentsItem,
  FolderContentsRequestOutput,
  FolderContentsResponseOutput,
  FolderContentsUrlVariablesOutput,
} from "./definition";
import definitions from "./definition";
import type { FolderContentsT } from "./i18n";

export class FolderContentsRepository {
  /**
   * Map a default root folder to a WS channel kind for the SUBSCRIBER —
   * EXHAUSTIVE over DefaultFolderId (the only type a rootFolderId can be; the
   * endpoint's url param is a `z.enum([DefaultFolderId.*])`). PUBLIC/SHARED are
   * shared resource channels (many identities watch one); PRIVATE / BACKGROUND /
   * REMOTE are the owner's own channel; INCOGNITO never reaches the server.
   * Shared by the folder-contents and messages channel resolvers so the same
   * folder-trust drives subscribe-admission and the emitter's delivery channel.
   */
  static folderIdToChannelKind(
    user: JwtPayloadType,
    rootFolderId: DefaultFolderId,
  ): ChannelDecision["kind"] {
    switch (rootFolderId) {
      case DefaultFolderId.INCOGNITO:
        return "deny";
      case DefaultFolderId.PUBLIC:
      case DefaultFolderId.SHARED:
        // Many identities watch one channel.
        return user.isPublic ? (user.leadId ? "resource" : "deny") : "resource";
      case DefaultFolderId.PRIVATE:
      case DefaultFolderId.BACKGROUND:
      case DefaultFolderId.REMOTE:
        // Owner-private — events ride the owner's own user channel.
        return !user.isPublic && !!user.id ? "user" : "deny";
    }
  }

  /**
   * The emit-side channel kind for a folder event. The emitting user owns the
   * folder, so a PUBLIC/SHARED folder's events ride the shared resource channel
   * (every viewer gets them) and any other folder rides the owner's own user
   * channel. EXHAUSTIVE over DefaultFolderId. Mirrors folderIdToChannelKind's
   * public/owner split so emit-delivery lands on the subscribers' channel.
   */
  static emitChannelForFolder(
    rootFolderId: DefaultFolderId,
  ): EmitChannelDecision {
    switch (rootFolderId) {
      case DefaultFolderId.PUBLIC:
      case DefaultFolderId.SHARED:
        return { kind: "resource" };
      case DefaultFolderId.PRIVATE:
      case DefaultFolderId.BACKGROUND:
      case DefaultFolderId.REMOTE:
      case DefaultFolderId.INCOGNITO:
        return { kind: "user" };
    }
  }

  /**
   * resolveChannel for `folder-contents/[rootFolderId]`. The rootFolderId (a
   * typed DefaultFolderId) names the folder whose contents stream; its trust
   * class decides the channel.
   */
  static resolveSubscriptionChannel(ctx: {
    user: JwtPayloadType;
    urlPathParams: { readonly rootFolderId: DefaultFolderId };
  }): ChannelDecision {
    return {
      kind: FolderContentsRepository.folderIdToChannelKind(
        ctx.user,
        ctx.urlPathParams.rootFolderId,
      ),
    };
  }

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
          streamingState: ThreadStreamingState.IDLE,
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

  /**
   * Cross-instance applier for `folder-created`: folders sync by SAME id —
   * the regular item fields carry everything. Materialize the mirror row
   * (same id) under the REMOTE/<origin>/<private|background> scaffold and
   * re-emit locally so open sidebars show it live. Non-private/background
   * origin roots (e.g. mirror creations under REMOTE) never sync.
   */
  static async applyRemoteFolderCreated(
    props: RemoteEventHandlerProps<typeof definitions.GET, "folder-created">,
  ): Promise<void> {
    const { responseData, originInstanceId, user, logger } = props;
    const userId = "id" in user && typeof user.id === "string" ? user.id : null;
    // items may be ONE freshly-created folder (live folder CRUD) or a whole
    // chain root→leaf (pushThreadSync's self-healing chain push) — either way
    // they form one parent chain and apply in a single mirror pass.
    const item = responseData.items?.[0];
    if (
      !userId ||
      !item?.id ||
      typeof item.name !== "string" ||
      (item.rootFolderId !== DefaultFolderId.PRIVATE &&
        item.rootFolderId !== DefaultFolderId.BACKGROUND)
    ) {
      return;
    }
    // Skip if the event originated from this instance — the folder was already
    // created locally; re-applying it would add a spurious REMOTE mirror.
    const { RemoteConnectionRepository } =
      await import("@/app/api/[locale]/remote-connection/repository");
    const selfInstanceId =
      await RemoteConnectionRepository.getLocalInstanceId(userId);
    if (originInstanceId === selfInstanceId) {
      return;
    }
    const chainRows = (responseData.items ?? []).flatMap((row) =>
      row?.id && typeof row.name === "string"
        ? [
            {
              id: row.id,
              name: row.name,
              parentId: row.parentId ?? null,
              icon: row.icon ?? null,
              color: row.color ?? null,
            },
          ]
        : [],
    );
    const { ensureMirrorFolders } =
      await import("@/app/api/[locale]/agent/chat/threads/sync-provider");
    const leafId = await ensureMirrorFolders(
      userId,
      originInstanceId,
      item.rootFolderId,
      chainRows,
    );
    if (!leafId) {
      logger.warn("[FolderSync] mirror folder creation failed", {
        originInstanceId,
        folderId: item.id,
      });
      return;
    }
    const [leaf] = await db
      .select({
        id: chatFolders.id,
        name: chatFolders.name,
        icon: chatFolders.icon,
        color: chatFolders.color,
        parentId: chatFolders.parentId,
        sortOrder: chatFolders.sortOrder,
        createdAt: chatFolders.createdAt,
        updatedAt: chatFolders.updatedAt,
      })
      .from(chatFolders)
      .where(eq(chatFolders.id, leafId))
      .limit(1);
    if (!leaf) {
      return;
    }
    const { createFolderContentsEmitter } = await import("./emitter");
    const folderItem = {
      id: leaf.id,
      type: "folder" as const,
      name: leaf.name,
      icon: leaf.icon,
      color: leaf.color,
      parentId: leaf.parentId,
      sortOrder: leaf.sortOrder,
      rootFolderId: DefaultFolderId.REMOTE,
      createdAt: leaf.createdAt,
      updatedAt: leaf.updatedAt,
    };
    const { createEndpointEmitter } =
      await import("next-vibe/realtime/emitter");
    // Emit on the sub-folder channel where the mirror folder actually lives so
    // any open expanded view at that level gets the live update.
    createEndpointEmitter(definitions.GET, logger, user, {
      urlPathParams: { rootFolderId: DefaultFolderId.REMOTE },
      requestData: { subFolderId: leaf.parentId, threadIds: undefined },
      kindOverride: FolderContentsRepository.emitChannelForFolder(
        DefaultFolderId.REMOTE,
      ).kind,
      fanOut: false,
    })("folder-created", {
      responseData: { items: [folderItem] },
    });
    // Also emit on the root channel so any expanded-folder-list hooks refresh.
    createFolderContentsEmitter(logger, user, DefaultFolderId.REMOTE, {
      fanOut: false,
    })("folder-created", {
      responseData: { items: [folderItem] },
    });
  }

  /**
   * Cross-instance applier for `folder-updated`: folders sync by SAME id —
   * update the mirror row directly and re-emit locally. Only
   * private/background origin roots sync.
   */
  static async applyRemoteFolderUpdated(
    props: RemoteEventHandlerProps<typeof definitions.GET, "folder-updated">,
  ): Promise<void> {
    const { responseData, user, logger } = props;
    const userId = "id" in user && typeof user.id === "string" ? user.id : null;
    const item = responseData.items?.[0];
    if (
      !userId ||
      !item?.id ||
      (item.rootFolderId !== DefaultFolderId.PRIVATE &&
        item.rootFolderId !== DefaultFolderId.BACKGROUND)
    ) {
      return;
    }
    // Same-id sync: the mirror IS the same row id on this instance.
    const mirrorId = item.id;
    if (typeof item.name !== "string" || item.name.length === 0) {
      return;
    }
    const now = new Date();
    const [mirrorRow] = await db
      .update(chatFolders)
      .set({
        name: item.name,
        ...(item.icon !== undefined ? { icon: item.icon } : {}),
        ...(item.color !== undefined ? { color: item.color } : {}),
        updatedAt: now,
      })
      .where(and(eq(chatFolders.id, mirrorId), eq(chatFolders.userId, userId)))
      .returning({
        id: chatFolders.id,
        name: chatFolders.name,
        icon: chatFolders.icon,
        color: chatFolders.color,
        parentId: chatFolders.parentId,
        sortOrder: chatFolders.sortOrder,
        rootFolderId: chatFolders.rootFolderId,
        updatedAt: chatFolders.updatedAt,
      });
    if (!mirrorRow) {
      return;
    }
    const { createFolderContentsEmitter } = await import("./emitter");
    const { createEndpointEmitter } =
      await import("next-vibe/realtime/emitter");
    const updateItem = { ...mirrorRow, rootFolderId: DefaultFolderId.REMOTE };
    // Emit on the sub-folder channel where the mirror lives for live updates.
    createEndpointEmitter(definitions.GET, logger, user, {
      urlPathParams: { rootFolderId: DefaultFolderId.REMOTE },
      requestData: { subFolderId: mirrorRow.parentId, threadIds: undefined },
      kindOverride: FolderContentsRepository.emitChannelForFolder(
        DefaultFolderId.REMOTE,
      ).kind,
      fanOut: false,
    })("folder-updated", { responseData: { items: [updateItem] } });
    // Also emit on root so any root-level mirror gets updated.
    createFolderContentsEmitter(logger, user, DefaultFolderId.REMOTE, {
      fanOut: false,
    })("folder-updated", { responseData: { items: [updateItem] } });
  }

  /**
   * Cross-instance applier for `folder-deleted`: delete the mirror folder
   * (children cascade), re-emit locally.
   */
  static async applyRemoteFolderDeleted(
    props: RemoteEventHandlerProps<typeof definitions.GET, "folder-deleted">,
  ): Promise<void> {
    const { responseData, user, logger } = props;
    const userId = "id" in user && typeof user.id === "string" ? user.id : null;
    const item = responseData.items?.[0];
    if (
      !userId ||
      !item?.id ||
      (item.rootFolderId !== DefaultFolderId.PRIVATE &&
        item.rootFolderId !== DefaultFolderId.BACKGROUND)
    ) {
      return;
    }
    // Same-id sync: delete the mirror by the item's OWN id (children cascade).
    const mirrorId = item.id;

    // Load all REMOTE folders for this user to build the sub-tree.
    const allRemoteFolders = await db
      .select({
        id: chatFolders.id,
        parentId: chatFolders.parentId,
      })
      .from(chatFolders)
      .where(
        and(
          eq(chatFolders.userId, userId),
          eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
        ),
      );

    // Collect the deleted folder and all its descendants (mirrors share ids).
    const descendantIds: string[] = [];
    const queue = [mirrorId];
    const seen = new Set<string>();
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (seen.has(current)) {
        continue;
      }
      seen.add(current);
      descendantIds.push(current);
      for (const f of allRemoteFolders) {
        if (f.parentId === current) {
          queue.push(f.id);
        }
      }
    }

    // Find the direct parent of the deleted folder for channel targeting.
    const mirrorMeta = allRemoteFolders.find((f) => f.id === mirrorId);

    // Threads use folderId FK with onDelete:"set null" — must delete explicitly.
    // Collect threads before deletion so we can emit per-folder removal events.
    const affectedThreads =
      descendantIds.length > 0
        ? await db
            .select({
              id: chatThreads.id,
              folderId: chatThreads.folderId,
              rootFolderId: chatThreads.rootFolderId,
              userId: chatThreads.userId,
            })
            .from(chatThreads)
            .where(inArray(chatThreads.folderId, descendantIds))
        : [];

    if (affectedThreads.length > 0) {
      await db
        .delete(chatThreads)
        .where(inArray(chatThreads.folderId, descendantIds));
    }

    // Delete the top folder — FK cascade removes all descendant folders.
    await db
      .delete(chatFolders)
      .where(and(eq(chatFolders.id, mirrorId), eq(chatFolders.userId, userId)));

    const { createFolderContentsEmitter } = await import("./emitter");
    const { createEndpointEmitter } =
      await import("next-vibe/realtime/emitter");
    const remoteKind = FolderContentsRepository.emitChannelForFolder(
      DefaultFolderId.REMOTE,
    ).kind;

    // Emit thread-deleted per folder that contained threads.
    const threadsByFolder = new Map<string | null, string[]>();
    for (const t of affectedThreads) {
      const fid = t.folderId ?? null;
      const list = threadsByFolder.get(fid) ?? [];
      list.push(t.id);
      threadsByFolder.set(fid, list);
    }
    for (const [folderId, threadIds] of threadsByFolder) {
      createEndpointEmitter(definitions.GET, logger, user, {
        urlPathParams: { rootFolderId: DefaultFolderId.REMOTE },
        requestData: { subFolderId: folderId, threadIds: undefined },
        kindOverride: remoteKind,
        fanOut: false,
      })("thread-deleted", {
        responseData: { items: threadIds.map((id) => ({ id })) },
      });
    }

    // Emit thread-deleted on the threads endpoint (sidebar root cache) and kick
    // off cortex cleanup for each deleted remote thread.
    if (affectedThreads.length > 0) {
      const { default: threadsByIdDefinitions } =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
      const { removeVirtualNodesByEntityId } =
        await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
      for (const thread of affectedThreads) {
        if (thread.rootFolderId) {
          createEndpointEmitter(threadsByIdDefinitions.DELETE, logger, user, {
            urlPathParams: { threadId: thread.id },
            fanOut: false,
          })("thread-deleted", {
            requestData: { rootFolderId: thread.rootFolderId },
          });
        }
        if (thread.userId) {
          void removeVirtualNodesByEntityId(
            thread.userId,
            "/threads",
            thread.id,
          ).catch((err: Error) =>
            logger.warn("[applyRemoteFolderDeleted] cortex cleanup failed", {
              threadId: thread.id,
              error: err.message,
            }),
          );
        }
      }
    }

    // Emit folder-deleted for each descendant so nested expanded views update.
    for (const descId of descendantIds) {
      if (descId === mirrorId) {
        continue; // top-level handled below with correct parent channel
      }
      const descFolder = allRemoteFolders.find((f) => f.id === descId);
      createEndpointEmitter(definitions.GET, logger, user, {
        urlPathParams: { rootFolderId: DefaultFolderId.REMOTE },
        requestData: {
          subFolderId: descFolder?.parentId,
          threadIds: undefined,
        },
        kindOverride: remoteKind,
        fanOut: false,
      })("folder-deleted", {
        responseData: {
          items: [{ id: descId, rootFolderId: DefaultFolderId.REMOTE }],
        },
      });
    }

    // Emit folder-deleted for the top-level deleted folder.
    const deleteItem = { id: mirrorId, rootFolderId: DefaultFolderId.REMOTE };
    if (mirrorMeta) {
      createEndpointEmitter(definitions.GET, logger, user, {
        urlPathParams: { rootFolderId: DefaultFolderId.REMOTE },
        requestData: { subFolderId: mirrorMeta.parentId, threadIds: undefined },
        kindOverride: remoteKind,
        fanOut: false,
      })("folder-deleted", { responseData: { items: [deleteItem] } });
    }
    // Also emit on root channel for any root-level mirrors.
    createFolderContentsEmitter(logger, user, DefaultFolderId.REMOTE, {
      fanOut: false,
    })("folder-deleted", { responseData: { items: [deleteItem] } });
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
    const { responseData, urlPathParams, user, logger } = props;
    const item = responseData.items?.[0];
    if (!item?.id || !item.title) {
      return;
    }
    await db
      .update(chatThreads)
      .set({ title: item.title, updatedAt: new Date() })
      .where(eq(chatThreads.id, item.id))
      .catch((err: Error) => {
        logger.warn(
          "[folder-contents/repository] thread-title-updated: DB update failed",
          { threadId: item.id, error: err.message },
        );
      });
    const { createEndpointEmitter } =
      await import("next-vibe/realtime/emitter");
    createEndpointEmitter(definitions.GET, logger, user, {
      urlPathParams: { rootFolderId: urlPathParams.rootFolderId },
      requestData: { subFolderId: undefined, threadIds: undefined },
      kindOverride: FolderContentsRepository.emitChannelForFolder(
        urlPathParams.rootFolderId,
      ).kind,
      fanOut: false,
    })("thread-title-updated", {
      responseData: { items: [{ id: item.id, title: item.title }] },
    });
  }
}
