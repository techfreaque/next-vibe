/**
 * Folder Operations Hook
 * Handles all folder-related CRUD operations (create, update, delete)
 * Located in folders/ folder as per architectural standards
 */

import { parseError } from "next-vibe/shared/utils";
import { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { type UserPermissionRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { DefaultFolderId } from "../../config";
import type { ChatFolder } from "../../hooks/store";
import {
  type IconKey,
  type IconValue,
  isIconKey,
} from "../../model-access/icons";

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
  rolesView?: (typeof UserPermissionRoleValue)[] | null;
  rolesManage?: (typeof UserPermissionRoleValue)[] | null;
  rolesCreateThread?: (typeof UserPermissionRoleValue)[] | null;
  rolesPost?: (typeof UserPermissionRoleValue)[] | null;
  rolesModerate?: (typeof UserPermissionRoleValue)[] | null;
  rolesAdmin?: (typeof UserPermissionRoleValue)[] | null;
}

/**
 * Folder operations interface
 */
export interface FolderOperations {
  createFolder: (
    name: string,
    rootFolderId: DefaultFolderId,
    parentId: string | null,
    icon?: IconValue,
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
      icon?: IconValue,
    ): Promise<string> => {
      // Convert IconValue to IconKey for API (only IconKey strings allowed)
      const iconKey: IconKey | undefined =
        icon && isIconKey(icon) ? icon : undefined;

      logger.debug("Folder operations: Creating folder", {
        name,
        rootFolderId,
        parentId,
        icon: iconKey,
      });

      // Handle incognito folder creation
      if (rootFolderId === DefaultFolderId.INCOGNITO) {
        logger.debug(
          "Folder operations: Creating incognito folder (localStorage only)",
          { name, rootFolderId, parentId },
        );

        const { generateIncognitoId, saveFolder } = await import(
          "../../incognito/storage"
        );

        const folder: ChatFolder = {
          id: generateIncognitoId("folder"),
          userId: "incognito",
          leadId: null,
          rootFolderId,
          name,
          icon: iconKey ?? null,
          color: null,
          parentId,
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
          canManage: true,
          canCreateThread: true,
          canModerate: true,
          canDelete: true,
          canManagePermissions: false,
        };

        saveFolder(folder);
        chatStore.addFolder(folder);

        return folder.id;
      }

      // Handle server-side folder creation
      try {
        const response = await fetch(`/api/${locale}/agent/chat/folders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            folder: {
              name,
              rootFolderId,
              ...(parentId && { parentId }),
              ...(iconKey && { icon: iconKey }),
            },
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as Record<
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

      // Convert IconValue to IconKey for storage/API
      const storeUpdates: Partial<ChatFolder> = {};

      // Handle icon separately (IconValue -> IconKey conversion)
      if ("icon" in updates) {
        const iconValue = updates.icon;
        if (iconValue === null) {
          storeUpdates.icon = null;
        } else if (iconValue !== undefined && isIconKey(iconValue)) {
          storeUpdates.icon = iconValue;
        }
      }

      // Handle other fields that don't need conversion
      if (updates.name !== undefined) {
        storeUpdates.name = updates.name;
      }
      if (updates.color !== undefined) {
        storeUpdates.color = updates.color;
      }
      if (updates.parentId !== undefined) {
        storeUpdates.parentId = updates.parentId;
      }

      const folder = chatStore.folders[folderId];
      if (folder && folder.rootFolderId === "incognito") {
        logger.debug(
          "Folder operations: Updating incognito folder (localStorage only)",
          { folderId },
        );

        const { saveFolder } = await import("../../incognito/storage");

        const updatedFolder = {
          ...folder,
          ...storeUpdates,
          updatedAt: new Date(),
        };
        saveFolder(updatedFolder);
        chatStore.updateFolder(folderId, storeUpdates);

        return;
      }

      // Handle server-side folder update
      try {
        const response = await fetch(
          `/api/${locale}/agent/chat/folders/${folderId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates: storeUpdates }),
          },
        );

        if (!response.ok) {
          logger.error("Folder operations: Failed to update folder", {
            status: response.status,
          });
          return;
        }

        chatStore.updateFolder(folderId, storeUpdates);
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

        const { deleteFolder: deleteIncognitoFolder } = await import(
          "../../incognito/storage"
        );

        deleteIncognitoFolder(folderId);
        chatStore.deleteFolder(folderId);

        return;
      }

      // Handle server-side folder deletion
      try {
        const response = await fetch(
          `/api/${locale}/agent/chat/folders/${folderId}`,
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
