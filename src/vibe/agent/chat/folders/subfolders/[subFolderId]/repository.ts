import "server-only";

import { eq, inArray } from "drizzle-orm";
import { chatFolders, chatThreads } from "../../../db";
import { canManageFolder } from "../../../permissions/permissions";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { createFolderContentsEmitter } from "../../../folder-contents/[rootFolderId]/emitter";
import type {
  FolderDeleteResponseOutput,
  FolderGetResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import type {
  FolderUpdateRequestOutput,
  FolderUpdateResponseOutput,
} from "./update/definition";

/**
 * Collect the given folder ID and all its descendants recursively.
 */
function collectDescendantIds(
  rootId: string,
  allFolders: { id: string; parentId: string | null }[],
): string[] {
  const result: string[] = [rootId];
  const queue = [rootId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const f of allFolders) {
      if (f.parentId === current) {
        result.push(f.id);
        queue.push(f.id);
      }
    }
  }
  return result;
}

/**
 * Folder Repository - Static class pattern
 */
export class FolderRepository {
  static async getFolder(
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (user.isPublic) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const [folder] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, data.id))
        .limit(1);

      if (!folder) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const canManage = await canManageFolder(user, folder, logger, locale);
      if (!canManage) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return success({
        id: folder.id,
        name: folder.name,
        icon: folder.icon,
        color: folder.color,
        parentId: folder.parentId,
        rootFolderId: folder.rootFolderId,
        expanded: folder.expanded,
        sortOrder: folder.sortOrder,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      });
    } catch {
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateFolder(
    user: JwtPayloadType,
    data: FolderUpdateRequestOutput & { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (user.isPublic) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const [existing] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, data.id))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const canManage = await canManageFolder(user, existing, logger, locale);
      if (!canManage) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const now = new Date();
      const [updated] = await db
        .update(chatFolders)
        .set({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.icon !== undefined && { icon: data.icon }),
          ...(data.color !== undefined && { color: data.color }),
          ...(data.parentId !== undefined && { parentId: data.parentId }),
          ...(data.expanded !== undefined && { expanded: data.expanded }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
          ...(data.rolesView !== undefined && { rolesView: data.rolesView }),
          ...(data.rolesManage !== undefined && {
            rolesManage: data.rolesManage,
          }),
          ...(data.rolesCreateThread !== undefined && {
            rolesCreateThread: data.rolesCreateThread,
          }),
          ...(data.rolesPost !== undefined && { rolesPost: data.rolesPost }),
          ...(data.rolesModerate !== undefined && {
            rolesModerate: data.rolesModerate,
          }),
          ...(data.rolesAdmin !== undefined && { rolesAdmin: data.rolesAdmin }),
          ...(data.pinned !== undefined && { pinned: data.pinned }),
          updatedAt: now,
        })
        .where(eq(chatFolders.id, data.id))
        .returning();

      logger.info("Folder updated", { folderId: data.id });

      // Emit WS event so all open tabs update the folder in the sidebar
      // immediately. Folder CRUD SYNCS by SAME id — regular fields only.
      const emitFolderContents = createFolderContentsEmitter(
        logger,
        user,
        updated.rootFolderId,
      );
      emitFolderContents("folder-updated", {
        responseData: {
          items: [
            {
              id: updated.id,
              name: updated.name,
              icon: updated.icon,
              color: updated.color,
              sortOrder: updated.sortOrder,
              rootFolderId: updated.rootFolderId,
              updatedAt: updated.updatedAt,
            },
          ],
        },
      });

      return success({
        folderId: updated.id,
        updatedAt: updated.updatedAt,
      });
    } catch {
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async deleteFolder(
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (user.isPublic) {
      return fail({
        message: t("delete.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const [folder] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, data.id))
        .limit(1);

      if (!folder) {
        return fail({
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const canManage = await canManageFolder(user, folder, logger, locale);
      if (!canManage) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Collect all descendant folder IDs (the folder itself + all nested children)
      // We need to delete their threads first since chatThreads.folderId has onDelete: "set null"
      const allFolders = await db.select().from(chatFolders);
      const descendantIds = collectDescendantIds(data.id, allFolders);

      // Collect threads before deletion to emit per-folder removal events.
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

      // Delete all threads in this folder and all descendant folders
      // Cascade from chatThreads → chatMessages is handled by FK onDelete: "cascade"
      if (affectedThreads.length > 0) {
        await db
          .delete(chatThreads)
          .where(inArray(chatThreads.folderId, descendantIds));
      }

      await db.delete(chatFolders).where(eq(chatFolders.id, data.id));

      logger.info("Folder deleted", { folderId: data.id });

      const { createEndpointEmitter } =
        await import("next-vibe/realtime/core/emitter");
      const { default: folderContentsDefinitions } =
        await import("../../../folder-contents/[rootFolderId]/definition");
      const { FolderContentsRepository } =
        await import("../../../folder-contents/[rootFolderId]/repository");
      const rootFolderKind = FolderContentsRepository.emitChannelForFolder(
        folder.rootFolderId,
      ).kind;

      // Emit thread-deleted per folder so open sidebar views remove threads.
      const threadsByFolder = new Map<string | null, string[]>();
      for (const thread of affectedThreads) {
        const fid = thread.folderId ?? null;
        const list = threadsByFolder.get(fid) ?? [];
        list.push(thread.id);
        threadsByFolder.set(fid, list);
      }
      for (const [folderId, threadIds] of threadsByFolder) {
        createEndpointEmitter(folderContentsDefinitions.GET, logger, user, {
          urlPathParams: { rootFolderId: folder.rootFolderId },
          requestData: { subFolderId: folderId, threadIds: undefined },
          kindOverride: rootFolderKind,
          fanOut: true,
        })("thread-deleted", {
          responseData: { items: threadIds.map((id) => ({ id })) },
        });
      }

      // Emit thread-deleted on the threads endpoint (cross-instance relay + sidebar
      // root cache) and kick off cortex cleanup for each deleted thread.
      if (affectedThreads.length > 0) {
        const { default: threadsByIdDefinitions } =
          await import("../../../threads/[threadId]/definition");
        const { removeVirtualNodesByEntityId } =
          await import("../../../../cortex/embeddings/sync-virtual");
        for (const thread of affectedThreads) {
          if (thread.rootFolderId) {
            createEndpointEmitter(threadsByIdDefinitions.DELETE, logger, user, {
              urlPathParams: { threadId: thread.id },
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
              logger.warn("[folder-delete] cortex cleanup failed", {
                threadId: thread.id,
                error: err.message,
              }),
            );
          }
        }
      }

      // Emit folder-deleted for each descendant so nested expanded views update.
      const folderById = new Map(allFolders.map((f) => [f.id, f]));
      for (const descId of descendantIds) {
        if (descId === data.id) {
          continue; // top-level handled separately below
        }
        const descEntry = folderById.get(descId);
        createEndpointEmitter(folderContentsDefinitions.GET, logger, user, {
          urlPathParams: { rootFolderId: folder.rootFolderId },
          requestData: {
            subFolderId: descEntry?.parentId,
            threadIds: undefined,
          },
          kindOverride: rootFolderKind,
          fanOut: true,
        })("folder-deleted", {
          responseData: {
            items: [{ id: descId, rootFolderId: folder.rootFolderId }],
          },
        });
      }

      // Emit folder-deleted for the top-level deleted folder.
      createEndpointEmitter(folderContentsDefinitions.GET, logger, user, {
        urlPathParams: { rootFolderId: folder.rootFolderId },
        requestData: { subFolderId: folder.parentId, threadIds: undefined },
        kindOverride: rootFolderKind,
        fanOut: true,
      })("folder-deleted", {
        responseData: {
          items: [{ id: folder.id, rootFolderId: folder.rootFolderId }],
        },
      });

      return success({
        id: folder.id,
        name: folder.name,
        updatedAt: new Date(),
      });
    } catch {
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Type for native repository type checking
export type FolderRepositoryType = Pick<
  typeof FolderRepository,
  keyof typeof FolderRepository
>;
