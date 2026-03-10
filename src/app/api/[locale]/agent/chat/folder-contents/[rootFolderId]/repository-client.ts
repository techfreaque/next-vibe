/**
 * Folder Contents Client Repository
 * Client-side operations for folder contents using localStorage
 * Mirrors server repository structure but runs in browser
 */

"use client";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { DefaultFolderId } from "../../config";
import { ThreadStatus } from "../../enum";
import {
  getFoldersForRoot,
  getThreadsForFolder,
} from "../../incognito/storage";
import type {
  FolderContentsRequestOutput,
  FolderContentsResponseOutput,
  FolderContentsUrlVariablesOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Chat Folder Contents Client Repository
 * Mirrors FolderContentsRepository but uses localStorage for incognito
 */
export class FolderContentsRepositoryClient {
  /**
   * Get folder contents (folders + threads merged) for incognito mode
   */
  static async getFolderContents(
    urlPathParams: FolderContentsUrlVariablesOutput,
    data: FolderContentsRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderContentsResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const rootFolderId = urlPathParams.rootFolderId as DefaultFolderId;
      const subFolderId = data.subFolderId ?? null;

      // Fetch folders at this level
      const allFolders = await getFoldersForRoot(rootFolderId);
      const levelFolders = allFolders.filter(
        (f) => (f.parentId ?? null) === subFolderId,
      );

      // Fetch threads at this level
      const threads = await getThreadsForFolder(rootFolderId, subFolderId);

      logger.debug("Client: incognito folder contents", {
        folders: levelFolders.length,
        threads: threads.length,
      });

      // Map folders to FolderContentsItem
      const folderItems: FolderContentsResponseOutput["items"] =
        levelFolders.map((f) => ({
          type: "folder" as const,
          sortOrder: f.sortOrder ?? 0,
          id: f.id,
          userId: null,
          rootFolderId: f.rootFolderId,
          createdAt: new Date(f.createdAt),
          updatedAt: new Date(f.updatedAt),
          // Folder fields
          name: f.name,
          icon: f.icon ?? null,
          color: f.color ?? null,
          parentId: f.parentId ?? null,
          expanded: f.expanded ?? false,
          canManage: true,
          canCreateThread: true,
          canModerate: false,
          canDelete: true,
          canManagePermissions: false,
          rolesView: [],
          rolesManage: [],
          rolesCreateThread: [],
          rolesPost: [],
          rolesModerate: [],
          rolesAdmin: [],
          pinned: f.pinned ?? false,
          // Thread-only fields — null for folders
          title: null,
          folderId: null,
          status: null,
          preview: null,
          archived: null,
          canEdit: null,
          canPost: null,
          isStreaming: null,
          rolesEdit: null,
        }));

      // Map threads to FolderContentsItem
      const threadItems: FolderContentsResponseOutput["items"] = threads.map(
        (thread) => ({
          type: "thread" as const,
          sortOrder: thread.sortOrder ?? 0,
          id: thread.id,
          userId: null,
          rootFolderId: thread.rootFolderId,
          createdAt: new Date(thread.createdAt),
          updatedAt: new Date(thread.updatedAt),
          // Thread fields
          title: thread.title,
          folderId: thread.folderId ?? null,
          status: thread.status ?? ThreadStatus.ACTIVE,
          preview: thread.preview ?? null,
          pinned: thread.pinned ?? false,
          archived: thread.archived ?? false,
          canEdit: true,
          canPost: true,
          canModerate: false,
          canDelete: true,
          canManagePermissions: false,
          isStreaming: false,
          rolesView: thread.rolesView ?? null,
          rolesEdit: thread.rolesEdit ?? null,
          rolesPost: thread.rolesPost ?? null,
          rolesModerate: thread.rolesModerate ?? null,
          rolesAdmin: thread.rolesAdmin ?? null,
          // Folder-only fields — null for threads
          name: null,
          icon: null,
          color: null,
          parentId: null,
          expanded: null,
          canManage: null,
          canCreateThread: null,
          rolesManage: null,
          rolesCreateThread: null,
        }),
      );

      // Merge and sort: pinned first, then by updatedAt descending
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

      return success({
        rootFolderPermissions: {
          canCreateThread: true,
          canCreateFolder: true,
        },
        items: allItems,
      });
    } catch (error) {
      logger.error(
        "Failed to load incognito folder contents",
        parseError(error),
      );
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
