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

import { DefaultFolderId } from "../config";
import type { ChatFolder, ChatMessage, ChatThread } from "../db";
import type { FolderListResponseOutput } from "../folders/definition";
import foldersDefinition from "../folders/definition";
import threadsDefinition, {
  type ThreadListResponseOutput,
} from "../threads/definition";

/**
 * Seed Zustand store from SSR-prefetched threads data.
 * Same mapping logic as loadThreadsFromServer but from in-memory data.
 */
function seedThreadsFromSSR(
  data: ThreadListResponseOutput,
  addThread: (thread: ChatThread) => void,
): void {
  data.threads?.forEach((thread) => {
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
      rolesView: thread.rolesView ?? null,
      rolesEdit: thread.rolesEdit ?? null,
      rolesPost: thread.rolesPost ?? null,
      rolesModerate: thread.rolesModerate ?? null,
      rolesAdmin: thread.rolesAdmin ?? null,
      published: false,
      isStreaming: false,
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
}

/**
 * Seed Zustand store from SSR-prefetched folders data.
 */
function seedFoldersFromSSR(
  data: FolderListResponseOutput,
  addFolder: (folder: ChatFolder) => void,
): void {
  data.folders?.forEach((folder) => {
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
      rolesView: folder.rolesView ?? null,
      rolesManage: folder.rolesManage ?? null,
      rolesCreateThread: folder.rolesCreateThread ?? null,
      rolesPost: folder.rolesPost ?? null,
      rolesModerate: folder.rolesModerate ?? null,
      rolesAdmin: folder.rolesAdmin ?? null,
      createdAt: new Date(folder.createdAt),
      updatedAt: new Date(folder.updatedAt),
      canManage: folder.canManage,
      canCreateThread: folder.canCreateThread,
      canModerate: folder.canModerate,
      canDelete: folder.canDelete,
      canManagePermissions: folder.canManagePermissions,
    });
  });
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
  rootFolderId:
    | DefaultFolderId.PRIVATE
    | DefaultFolderId.SHARED
    | DefaultFolderId.PUBLIC
    | DefaultFolderId.CRON,
  addThread: (thread: ChatThread) => void,
  user: JwtPayloadType,
): Promise<void> {
  try {
    const threadsResponse = await apiClient.fetch(
      threadsDefinition.GET,
      logger,
      user,
      {
        page: 1,
        limit: 100,
        rootFolderId,
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
      if (data.threads) {
        data.threads.forEach((thread) => {
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
            rolesView: thread.rolesView ?? null,
            rolesEdit: thread.rolesEdit ?? null,
            rolesPost: thread.rolesPost ?? null,
            rolesModerate: thread.rolesModerate ?? null,
            rolesAdmin: thread.rolesAdmin ?? null,
            published: false,
            isStreaming: false,
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
          count: data.threads.length,
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
  rootFolderId:
    | DefaultFolderId.PRIVATE
    | DefaultFolderId.SHARED
    | DefaultFolderId.PUBLIC
    | DefaultFolderId.CRON,
  addFolder: (folder: ChatFolder) => void,
  user: JwtPayloadType,
): Promise<void> {
  try {
    const foldersResponse = await apiClient.fetch(
      foldersDefinition.GET,
      logger,
      user,
      {
        rootFolderId,
      },
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
            rolesView: folder.rolesView ?? null,
            rolesManage: folder.rolesManage ?? null,
            rolesCreateThread: folder.rolesCreateThread ?? null,
            rolesPost: folder.rolesPost ?? null,
            rolesModerate: folder.rolesModerate ?? null,
            rolesAdmin: folder.rolesAdmin ?? null,
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
 *
 * When SSR data is provided for the initial rootFolderId, seeds the store from
 * it directly without any client-side fetch. Falls back to fetching on tab switches.
 */
export function useDataLoader(
  locale: CountryLanguage,
  logger: EndpointLogger,
  currentRootFolderId: DefaultFolderId,
  addThread: (thread: ChatThread) => void,
  addMessage: (message: ChatMessage) => void,
  addFolder: (folder: ChatFolder) => void,
  setDataLoaded: (loaded: boolean) => void,
  user: JwtPayloadType,
  /** SSR-prefetched initial data — skips fetch for the initial root folder */
  initialData?: {
    rootFolderId: DefaultFolderId;
    threadsData: ThreadListResponseOutput | null;
    foldersData: FolderListResponseOutput | null;
  } | null,
): void {
  const loadedForFolderRef = useRef<DefaultFolderId | null>(null);

  useEffect(() => {
    if (loadedForFolderRef.current === currentRootFolderId) {
      return;
    }

    loadedForFolderRef.current = currentRootFolderId;

    const loadData = async (): Promise<void> => {
      setDataLoaded(false);

      // ALWAYS load incognito data from localStorage (for incognito mode only)
      if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
        await loadIncognitoData(logger, addThread, addMessage, addFolder);
        // Skip server calls for incognito mode - everything is local-only
        setDataLoaded(true);
        return;
      }

      // If SSR data is available for the current folder, seed store from it — no fetch needed
      if (
        initialData &&
        initialData.rootFolderId === currentRootFolderId &&
        (initialData.threadsData || initialData.foldersData)
      ) {
        if (initialData.threadsData) {
          seedThreadsFromSSR(initialData.threadsData, addThread);
        }
        if (initialData.foldersData) {
          seedFoldersFromSSR(initialData.foldersData, addFolder);
        }
        setDataLoaded(true);
        return;
      }

      // TypeScript now knows currentRootFolderId is PRIVATE | SHARED | PUBLIC | CRON
      await Promise.all([
        loadThreadsFromServer(
          logger,
          locale,
          currentRootFolderId,
          addThread,
          user,
        ),
        loadFoldersFromServer(
          logger,
          locale,
          currentRootFolderId,
          addFolder,
          user,
        ),
      ]);

      // Mark data as loaded
      setDataLoaded(true);
    };

    void loadData();
  }, [
    locale,
    user,
    logger,
    currentRootFolderId,
    addThread,
    addMessage,
    addFolder,
    setDataLoaded,
    initialData,
  ]);
}
