/**
 * Folders Client Repository
 * Client-side operations for folders using localStorage
 * Mirrors server repository structure but runs in browser
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";

import type { ChatFolder } from "../../db";
import type { FolderContentsItem } from "../../folder-contents/[rootFolderId]/definition";
import folderContentsDefinitions from "../../folder-contents/[rootFolderId]/definition";
import {
  deleteFolder,
  getFoldersForRoot,
  updateIncognitoFolder,
} from "../../incognito/storage";
import type {
  FolderListResponseOutput,
  FolderListUrlVariablesOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Chat Folders Client Repository
 * Mirrors ChatFoldersRepository but uses localStorage for incognito
 */
export class ChatFoldersRepositoryClient {
  /**
   * Get folders list (mirrors server getFolders)
   */
  static async getFolders(
    urlPathParams: FolderListUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const folders = await getFoldersForRoot(urlPathParams.rootFolderId);

      logger.debug("Client: incognito folders", { count: folders.length });

      return success({
        rootFolderPermissions: {
          canCreateThread: true,
          canCreateFolder: true,
        },
        folders: folders
          .toSorted((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((f) => ({
            id: f.id,
            userId: null,
            rootFolderId: f.rootFolderId,
            name: f.name,
            icon: f.icon ?? null,
            color: f.color ?? null,
            parentId: f.parentId ?? null,
            expanded: f.expanded ?? false,
            sortOrder: f.sortOrder ?? 0,
            rolesView: null,
            rolesManage: null,
            rolesCreateThread: null,
            rolesPost: null,
            rolesModerate: null,
            rolesAdmin: null,
            canManage: true,
            canCreateThread: true,
            canModerate: false,
            canDelete: true,
            canManagePermissions: false,
            createdAt: new Date(f.createdAt),
            updatedAt: new Date(f.updatedAt),
          })),
      });
    } catch (error) {
      logger.error("Failed to load incognito folders", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update folder (mirrors server updateFolder)
   */
  static async updateFolder(
    folderId: string,
    updates: Partial<
      Pick<ChatFolder, "name" | "icon" | "parentId" | "sortOrder">
    >,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: string }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      await updateIncognitoFolder(folderId, updates);

      logger.debug("Client: updated incognito folder", { folderId });

      return success({ success: t("get.success.title") });
    } catch (error) {
      logger.error("Failed to update incognito folder", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Optimistically insert a newly created folder into the folder-contents cache.
   */
  static insertFolderIntoCache(
    newItem: FolderContentsItem,
    logger: EndpointLogger,
  ): void {
    apiClient.updateEndpointData(
      folderContentsDefinitions.GET,
      logger,
      (old) => {
        if (!old?.success) {
          return old;
        }
        if (old.data.items.some((it) => it.id === newItem.id)) {
          return old;
        }
        return success({
          ...old.data,
          items: [newItem, ...old.data.items],
        });
      },
      {
        urlPathParams: {
          rootFolderId: newItem.rootFolderId,
        },
        requestData: { subFolderId: newItem.parentId, threadIds: null },
      },
    );
  }

  /**
   * Delete folder (mirrors server deleteFolder)
   */
  static async deleteFolder(
    folderId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<never>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      await deleteFolder(folderId);

      logger.debug("Client: deleted incognito folder", { folderId });

      return success();
    } catch (error) {
      logger.error("Failed to delete incognito folder", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
