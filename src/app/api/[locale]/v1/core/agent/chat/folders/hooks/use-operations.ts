/**
 * Folder Operations Hook
 * Handles all folder-related CRUD operations (create, update, delete)
 * Located in folders/ folder as per architectural standards
 */

import { useCallback } from "react";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { DefaultFolderId } from "../../config";
import type { IconValue } from "../../model-access/icons";
import type { ChatFolder } from "../../hooks/store";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Folder update type
 */
export interface FolderUpdate {
  name?: string;
  icon?: IconValue | null;
  color?: string | null;
  parentId?: string | null;
  expanded?: boolean;
  sortOrder?: number;
  rolesView?: UserRoleValue[] | null;
  rolesManage?: UserRoleValue[] | null;
  rolesCreateThread?: UserRoleValue[] | null;
  rolesPost?: UserRoleValue[] | null;
  rolesModerate?: UserRoleValue[] | null;
  rolesAdmin?: UserRoleValue[] | null;
}

/**
 * Folder operations interface
 */
export interface FolderOperations {
  createFolder: (
    name: string,
    rootFolderId: DefaultFolderId,
    parentId: string | null,
    icon?: string,
  ) => Promise<string>;
  updateFolder: (folderId: string, updates: FolderUpdate) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
}

/**
 * Folder operations dependencies
 */
interface FolderOperationsDeps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  chatStore: {
    folders: Record<string, ChatFolder>;
    addFolder: (folder: ChatFolder) => void;
    updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
    deleteFolder: (folderId: string) => void;
  };
}

/**
 * Hook for folder operations
 */
export function useFolderOperations(
  deps: FolderOperationsDeps,
): FolderOperations {
  const { locale, logger, chatStore } = deps;

  const createFolder = useCallback(
    async (
      name: string,
      rootFolderId: DefaultFolderId,
      parentId: string | null,
      icon?: string,
    ): Promise<string> => {
      logger.debug("Folder operations: Creating folder", {
        name,
        rootFolderId,
        parentId,
        icon,
      });

      // Handle incognito folder creation
      if (rootFolderId === "incognito") {
        logger.debug(
          "Folder operations: Creating incognito folder (localStorage only)",
          { name, rootFolderId, parentId },
        );

        const { generateIncognitoId, saveFolder } =
          await import("../../incognito/storage");

        const folder: ChatFolder = {
          id: generateIncognitoId("folder"),
          userId: "incognito",
          rootFolderId,
          name,
          icon: (icon as IconValue) || null,
          color: null,
          parentId,
          expanded: true,
          sortOrder: 0,
          metadata: {},
          rolesView: [],
          rolesManage: [],
          rolesCreateThread: [],
          rolesPost: [],
          rolesModerate: [],
          rolesAdmin: [],
          // Incognito folders: everyone has full permissions locally
          // BUT canManagePermissions is false because permissions don't apply to local-only content
          canManage: true,
          canCreateThread: true,
          canModerate: true,
          canDelete: true,
          canManagePermissions: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        saveFolder(folder);
        chatStore.addFolder(folder);

        return folder.id;
      }

      // Handle server-side folder creation
      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/folders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              folder: {
                name,
                rootFolderId,
                ...(parentId && { parentId }),
                ...(icon && { icon }),
              },
            }),
          },
        );

        if (!response.ok) {
          const errorData = (await response
            .json()
            // eslint-disable-next-line no-restricted-syntax
            .catch(() => ({}))) as Record<
            string,
            string | number | boolean | null
          >;
          logger.error("Folder operations: Failed to create folder", {
            status: response.status,
            error: parseError(errorData).message,
          });
          return "";
        }

        const data = (await response.json()) as {
          success: boolean;
          data: { response: { folder: ChatFolder } };
        };
        const folder = data.data.response.folder;

        chatStore.addFolder(folder);

        return folder.id;
      } catch (error) {
        logger.error(
          "Folder operations: Failed to create folder",
          parseError(error),
        );
        return "";
      }
    },
    [logger, chatStore, locale],
  );

  const updateFolder = useCallback(
    async (folderId: string, updates: FolderUpdate): Promise<void> => {
      logger.debug("Folder operations: Updating folder", {
        folderId,
        updatedFields: Object.keys(updates).join(", "),
      });

      const folder = chatStore.folders[folderId];
      if (folder && folder.rootFolderId === "incognito") {
        logger.debug(
          "Folder operations: Updating incognito folder (localStorage only)",
          { folderId },
        );

        const { saveFolder } = await import("../../incognito/storage");

        const updatedFolder = {
          ...folder,
          ...updates,
          updatedAt: new Date(),
        };
        saveFolder(updatedFolder);
        chatStore.updateFolder(folderId, updates);

        return;
      }

      // Handle server-side folder update
      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/folders/${folderId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates }),
          },
        );

        if (!response.ok) {
          logger.error("Folder operations: Failed to update folder", {
            status: response.status,
          });
          return;
        }

        chatStore.updateFolder(folderId, updates);
      } catch (error) {
        logger.error(
          "Folder operations: Failed to update folder",
          parseError(error),
        );
      }
    },
    [logger, chatStore, locale],
  );

  const deleteFolder = useCallback(
    async (folderId: string): Promise<void> => {
      logger.debug("Folder operations: Deleting folder", { folderId });

      const folder = chatStore.folders[folderId];
      if (folder && folder.rootFolderId === "incognito") {
        logger.debug(
          "Folder operations: Deleting incognito folder (localStorage only)",
          { folderId },
        );

        const { deleteFolder: deleteIncognitoFolder } =
          await import("../../incognito/storage");

        deleteIncognitoFolder(folderId);
        chatStore.deleteFolder(folderId);

        return;
      }

      // Handle server-side folder deletion
      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/folders/${folderId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          logger.error("Folder operations: Failed to delete folder", {
            status: response.status,
          });
          return;
        }

        chatStore.deleteFolder(folderId);
      } catch (error) {
        logger.error(
          "Folder operations: Failed to delete folder",
          parseError(error),
        );
      }
    },
    [logger, chatStore, locale],
  );

  return {
    createFolder,
    updateFolder,
    deleteFolder,
  };
}
