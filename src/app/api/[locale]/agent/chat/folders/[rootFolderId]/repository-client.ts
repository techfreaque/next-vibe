/**
 * Folders Client Repository
 * Client-side operations for folders using localStorage
 * Mirrors server repository structure but runs in browser
 */

"use client";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { FolderContentsItem } from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition";
import folderContentsDefinitions from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition";
import { parseError } from "@/app/api/[locale]/shared/utils";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";

import type { DefaultFolderId } from "../../config";
import type { ChatFolder } from "../../db";
import {
  createIncognitoFolder,
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
   * Create folder (mirrors server createFolder)
   */
  static async createFolder(
    name: string,
    rootFolderId: DefaultFolderId,
    parentId: string | null,
    icon: IconKey | null,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ id: string }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const folder = await createIncognitoFolder(
        name,
        rootFolderId,
        parentId,
        icon ?? undefined,
      );

      logger.debug("Client: created incognito folder", { id: folder.id });

      return success({ id: folder.id });
    } catch (error) {
      logger.error("Failed to create incognito folder", parseError(error));
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
        return success({
          ...old.data,
          items: [newItem, ...old.data.items],
        });
      },
      {
        urlPathParams: {
          rootFolderId: newItem.rootFolderId as DefaultFolderId,
        },
        requestData: { subFolderId: newItem.parentId, threadIds: null },
      },
    );
  }

  /**
   * Optimistically update a folder's fields in the folder-contents cache.
   */
  static updateFolderInCache(
    folderId: string,
    rootFolderId: DefaultFolderId,
    parentId: string | null,
    updates: Partial<FolderContentsItem>,
    logger: EndpointLogger,
  ): void {
    apiClient.updateEndpointData(
      folderContentsDefinitions.GET,
      logger,
      (old) => {
        if (!old?.success) {
          return old;
        }
        return success({
          ...old.data,
          items: old.data.items.map((item) =>
            item.id === folderId ? { ...item, ...updates } : item,
          ),
        });
      },
      {
        urlPathParams: { rootFolderId },
        requestData: { subFolderId: parentId, threadIds: null },
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
