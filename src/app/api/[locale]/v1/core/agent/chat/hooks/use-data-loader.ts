/**
 * Data Loading Hook
 * Handles initial loading of threads, folders, and messages from server and localStorage
 */

import { useEffect, useRef } from "react";

import { AUTH_STATUS_COOKIE_PREFIX } from "@/config/constants";
import { parseError } from "next-vibe/shared/utils";

import { apiClient } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { DefaultFolderId } from "../config";
import type { FolderListResponseOutput } from "../folders/definition";
import { GET as foldersGetEndpoint } from "../folders/definition";
import type { ChatFolder, ChatMessage, ChatThread } from "./store";
import { GET as threadsGetEndpoint } from "../threads/definition";

/**
 * Check if user is authenticated
 */
function isUserAuthenticated(): boolean {
  const authStatusCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(AUTH_STATUS_COOKIE_PREFIX));
  return authStatusCookie !== undefined;
}

/**
 * Load incognito data from localStorage
 */
async function loadIncognitoData(
  logger: EndpointLogger,
  addThread: (thread: ChatThread) => void,
  addMessage: (message: ChatMessage) => void,
  addFolder: (folder: ChatFolder) => void,
): Promise<void> {
  try {
    const { loadIncognitoState } = await import("../incognito/storage");
    const incognitoState = loadIncognitoState();

    logger.debug("Chat: Loading incognito data from localStorage", {
      threadCount: Object.keys(incognitoState.threads).length,
      messageCount: Object.keys(incognitoState.messages).length,
      folderCount: Object.keys(incognitoState.folders).length,
    });

    // Load threads with full permissions (incognito is local-only, everyone has full access)
    Object.values(incognitoState.threads).forEach((thread) => {
      addThread({
        ...thread,
        createdAt: new Date(thread.createdAt),
        updatedAt: new Date(thread.updatedAt),
        // Incognito threads: everyone has full permissions locally
        // BUT canManagePermissions is false because permissions don't apply to local-only content
        canPost: true,
        canEdit: true,
        canModerate: true,
        canDelete: true,
        canManagePermissions: false,
      });
    });

    // Load messages
    Object.values(incognitoState.messages).forEach((message) => {
      addMessage({
        ...message,
        createdAt: new Date(message.createdAt),
        updatedAt: new Date(message.updatedAt),
      });
    });

    // Load folders with full permissions (incognito is local-only, everyone has full access)
    Object.values(incognitoState.folders).forEach((folder) => {
      addFolder({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
        // Incognito folders: everyone has full permissions locally
        // BUT canManagePermissions is false because permissions don't apply to local-only content
        canManage: true,
        canCreateThread: true,
        canModerate: true,
        canDelete: true,
        canManagePermissions: false,
      });
    });

    logger.info("Chat: Incognito data loaded successfully", {
      threadCount: Object.keys(incognitoState.threads).length,
      messageCount: Object.keys(incognitoState.messages).length,
      folderCount: Object.keys(incognitoState.folders).length,
    });
  } catch (error) {
    logger.error(
      "useDataLoader",
      "Failed to load incognito data",
      parseError(error),
    );
  }
}

/**
 * Load threads from server
 */
async function loadThreadsFromServer(
  logger: EndpointLogger,
  locale: CountryLanguage,
  addThread: (thread: ChatThread) => void,
): Promise<void> {
  try {
    const threadsResponse = await apiClient.fetch(
      threadsGetEndpoint,
      logger,
      {
        page: 1,
        limit: 100,
      },
      {},
      locale,
      {
        disableLocalCache: true,
      },
    );

    logger.debug("Chat: Loaded threads", {
      success: threadsResponse.success,
      hasData: threadsResponse.success && !!threadsResponse.data,
    });

    if (threadsResponse.success) {
      const responseData = threadsResponse.data as {
        response: {
          threads: Array<{
            id: string;
            title: string;
            rootFolderId: DefaultFolderId;
            folderId: string | null;
            status: "active" | "archived" | "deleted";
            pinned: boolean;
            preview: string | null;
            rolesView?: (typeof UserRoleValue)[] | null;
            rolesEdit?: (typeof UserRoleValue)[] | null;
            rolesPost?: (typeof UserRoleValue)[] | null;
            rolesModerate?: (typeof UserRoleValue)[] | null;
            rolesAdmin?: (typeof UserRoleValue)[] | null;
            canEdit?: boolean;
            canPost?: boolean;
            canModerate?: boolean;
            canDelete?: boolean;
            canManagePermissions?: boolean;
            createdAt: Date;
            updatedAt: Date;
          }>;
          totalCount: number;
          pageCount: number;
          page: number;
          limit: number;
        };
      };

      if (responseData.response?.threads) {
        responseData.response.threads.forEach((thread) => {
          addThread({
            id: thread.id,
            userId: "",
            title: thread.title,
            rootFolderId: thread.rootFolderId,
            folderId: thread.folderId,
            status: thread.status,
            defaultModel: null,
            defaultPersona: null,
            systemPrompt: null,
            pinned: thread.pinned,
            archived: false,
            tags: [],
            preview: thread.preview,
            rolesView: thread.rolesView,
            rolesEdit: thread.rolesEdit,
            rolesPost: thread.rolesPost,
            rolesModerate: thread.rolesModerate,
            rolesAdmin: thread.rolesAdmin,
            canEdit: thread.canEdit,
            canPost: thread.canPost,
            canModerate: thread.canModerate,
            canDelete: thread.canDelete,
            canManagePermissions: thread.canManagePermissions,
            createdAt: new Date(thread.createdAt),
            updatedAt: new Date(thread.updatedAt),
          });
        });
        logger.debug("Chat: Threads loaded successfully", {
          count: responseData.response.threads.length,
        });
      }
    }
  } catch (error) {
    logger.error("Chat: Failed to load threads", parseError(error));
  }
}

/**
 * Load folders from server
 */
async function loadFoldersFromServer(
  logger: EndpointLogger,
  locale: CountryLanguage,
  addFolder: (folder: ChatFolder) => void,
): Promise<void> {
  try {
    const foldersResponse = await apiClient.fetch(
      foldersGetEndpoint,
      logger,
      {},
      {},
      locale,
      {
        disableLocalCache: true,
      },
    );

    logger.debug("Chat: Loaded folders", {
      success: foldersResponse.success,
      hasData: foldersResponse.success && !!foldersResponse.data,
    });

    if (foldersResponse.success && foldersResponse.data) {
      const responseData = foldersResponse.data as FolderListResponseOutput;

      if (responseData.folders) {
        responseData.folders.forEach((folder) => {
          addFolder({
            id: folder.id,
            userId: folder.userId,
            rootFolderId: folder.rootFolderId,
            name: folder.name,
            icon: folder.icon,
            color: folder.color,
            parentId: folder.parentId,
            expanded: folder.expanded,
            sortOrder: folder.sortOrder,
            metadata: folder.metadata,
            rolesView: folder.rolesView || [],
            rolesManage: folder.rolesManage || [],
            rolesCreateThread: folder.rolesCreateThread || [],
            rolesPost: folder.rolesPost || [],
            rolesModerate: folder.rolesModerate || [],
            rolesAdmin: folder.rolesAdmin || [],
            canManage: folder.canManage,
            canCreateThread: folder.canCreateThread,
            canModerate: folder.canModerate,
            canDelete: folder.canDelete,
            canManagePermissions: folder.canManagePermissions,
            createdAt: new Date(folder.createdAt),
            updatedAt: new Date(folder.updatedAt),
          });
        });
        logger.debug("Chat: Folders loaded successfully", {
          count: responseData.folders.length,
        });
      }
    }
  } catch (error) {
    logger.error("Chat: Failed to load folders", parseError(error));
  }
}

/**
 * Hook for loading initial chat data (threads, folders, messages)
 * NOTE: Root folder permissions are now computed server-side and passed as props
 */
export function useDataLoader(
  locale: CountryLanguage,
  logger: EndpointLogger,
  addThread: (thread: ChatThread) => void,
  addMessage: (message: ChatMessage) => void,
  addFolder: (folder: ChatFolder) => void,
): void {
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    if (dataLoadedRef.current) {
      return;
    }

    dataLoadedRef.current = true;

    const loadData = async (): Promise<void> => {
      const isAuthenticated = isUserAuthenticated();

      logger.debug("Chat: Checking authentication before loading data", {
        isAuthenticated,
      });

      // ALWAYS load incognito data from localStorage
      await loadIncognitoData(logger, addThread, addMessage, addFolder);

      // Load server data in parallel
      logger.info("Chat: Loading server data", {
        isAuthenticated,
        loadingScope: isAuthenticated ? "all" : "public only",
      });

      await Promise.all([
        loadThreadsFromServer(logger, locale, addThread),
        loadFoldersFromServer(logger, locale, addFolder),
      ]);
    };

    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);
}
