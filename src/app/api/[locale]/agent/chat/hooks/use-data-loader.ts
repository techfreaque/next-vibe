/**
 * Data Loading Hook
 * Handles initial loading of threads, folders, and messages from server and localStorage
 */

import { parseError } from "next-vibe/shared/utils";
import { useEffect, useRef } from "react";

import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatFolder, ChatMessage, ChatThread } from "../db";
import type { FolderListResponseOutput } from "../folders/definition";
import { GET as foldersGetEndpoint } from "../folders/definition";
import threadsDefinition, {
  type ThreadListResponseOutput,
} from "../threads/definition";

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
    const incognitoState = await loadIncognitoState();

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
      logger.debug("Chat: Loading incognito message", {
        messageId: message.id,
        threadId: message.threadId,
        role: message.role,
        contentLength: message.content?.length || 0,
        hasToolCall: !!message.metadata?.toolCall,
      });

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
      threadsDefinition.GET,
      logger,
      {
        page: 1,
        limit: 100,
      },
      undefined,
      locale,
      {
        disableLocalCache: true,
      },
    );

    logger.debug("Chat: Loaded threads", {
      success: threadsResponse.success,
      hasData: threadsResponse.success && !!threadsResponse.data,
    });

    if (threadsResponse.success && threadsResponse.data) {
      const data = threadsResponse.data as ThreadListResponseOutput;
      if (data.response?.threads) {
        data.response.threads.forEach((thread) => {
          addThread({
            id: thread.id,
            userId: "",
            leadId: null,
            title: thread.title,
            rootFolderId: thread.rootFolderId,
            folderId: thread.folderId,
            status: thread.status,
            defaultModel: null,
            defaultCharacter: null,
            systemPrompt: null,
            pinned: thread.pinned,
            archived: false,
            tags: [],
            preview: thread.preview,
            metadata: {},
            rolesView: thread.rolesView,
            rolesEdit: thread.rolesEdit,
            rolesPost: thread.rolesPost,
            rolesModerate: thread.rolesModerate,
            rolesAdmin: thread.rolesAdmin,
            published: false,
            createdAt: new Date(thread.createdAt),
            updatedAt: new Date(thread.updatedAt),
            searchVector: null,
            canEdit: thread.canEdit,
            canPost: thread.canPost,
            canModerate: thread.canModerate,
            canDelete: thread.canDelete,
            canManagePermissions: thread.canManagePermissions,
          });
        });
        logger.debug("Chat: Threads loaded successfully", {
          count: data.response.threads.length,
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
      undefined,
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
            leadId: null,
            rootFolderId: folder.rootFolderId,
            name: folder.name,
            icon: folder.icon,
            color: folder.color,
            parentId: folder.parentId,
            expanded: folder.expanded,
            sortOrder: folder.sortOrder,
            rolesView: folder.rolesView,
            rolesManage: folder.rolesManage,
            rolesCreateThread: folder.rolesCreateThread,
            rolesPost: folder.rolesPost,
            rolesModerate: folder.rolesModerate,
            rolesAdmin: folder.rolesAdmin,
            createdAt: new Date(folder.createdAt),
            updatedAt: new Date(folder.updatedAt),
            canManage: folder.canManage,
            canCreateThread: folder.canCreateThread,
            canModerate: folder.canModerate,
            canDelete: folder.canDelete,
            canManagePermissions: folder.canManagePermissions,
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
  user: JwtPayloadType | undefined,
  locale: CountryLanguage,
  logger: EndpointLogger,
  addThread: (thread: ChatThread) => void,
  addMessage: (message: ChatMessage) => void,
  addFolder: (folder: ChatFolder) => void,
  setDataLoaded: (loaded: boolean) => void,
): void {
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    if (dataLoadedRef.current) {
      return;
    }

    dataLoadedRef.current = true;

    const loadData = async (): Promise<void> => {
      // Determine if user is authenticated from passed user prop
      const isAuthenticated = user !== undefined && !user.isPublic;

      logger.debug("Chat: Checking authentication before loading data", {
        isAuthenticated,
        isPublic: user?.isPublic ?? true,
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

      // Mark data as loaded
      setDataLoaded(true);
    };

    void loadData();
  }, [locale, user, logger, addThread, addMessage, addFolder, setDataLoaded]);
}
