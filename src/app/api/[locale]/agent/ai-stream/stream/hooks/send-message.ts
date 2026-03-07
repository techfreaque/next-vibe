/**
 * Send Message Operation
 * Handles sending new messages in both incognito and server modes
 */

import { success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage, ChatThread } from "@/app/api/[locale]/agent/chat/db";
import { ThreadStatus } from "@/app/api/[locale]/agent/chat/enum";
import folderContentsDefinition from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition";
import { useChatStore } from "@/app/api/[locale]/agent/chat/hooks/store";
import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import threadsDefinition from "@/app/api/[locale]/agent/chat/threads/definition";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { createAndSendUserMessage } from "./shared";
import type { UseAIStreamReturn } from "./use-ai-stream";

export interface SendMessageParams {
  content: string;
  threadId?: string;
  parentId?: string;
  toolConfirmations?: Array<{
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  }>;
  audioInput?: { file: File };
  attachments: File[];
}

export interface SendMessageDeps {
  logger: EndpointLogger;
  aiStream: UseAIStreamReturn;
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  chatStore: {
    messages: Record<string, ChatMessage>;
    threads: Record<string, { rootFolderId: DefaultFolderId }>;
    setLoading: (loading: boolean) => void;
    getThreadMessages: (threadId: string) => ChatMessage[];
  };
  settings: {
    selectedModel: ModelId;
    selectedCharacter: string;
    allowedTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
    ttsAutoplay: boolean;
    ttsVoice: typeof TtsVoiceValue;
  };
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
}

export async function sendMessage(
  params: SendMessageParams,
  deps: SendMessageDeps,
  onThreadCreated?: (
    threadId: string,
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void,
): Promise<void> {
  const {
    logger,
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore,
    settings,
    setInput,
    setAttachments,
  } = deps;
  const { content } = params;

  logger.debug("Send message operation", {
    content: content.slice(0, 50),
    activeThreadId,
    currentRootFolderId,
  });

  chatStore.setLoading(true);

  try {
    // Determine thread ID to use
    let threadIdToUse: string | null;
    const hasToolConfirmations =
      params.toolConfirmations && params.toolConfirmations.length > 0;
    if (hasToolConfirmations) {
      threadIdToUse = params.threadId ?? null;
    } else {
      threadIdToUse = activeThreadId === "new" ? null : activeThreadId;
    }

    // Note: we intentionally do NOT null-out threadIdToUse if it's missing from the store.
    // The thread may exist in the DB but not yet in the client store (e.g., direct URL navigation).
    // The server-side ensureThread() will verify existence and permissions.
    // We only use the store to load message history for the parent message ID resolution.

    let parentMessageId: string | null = null;
    let messageHistory: ChatMessage[] | null | undefined;

    // Load messages and determine parent
    if (threadIdToUse) {
      let threadMessages: ChatMessage[];
      if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
        const { getMessagesForThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        threadMessages = await getMessagesForThread(threadIdToUse);
      } else {
        threadMessages = chatStore.getThreadMessages(threadIdToUse);
      }

      if (hasToolConfirmations && params.parentId) {
        parentMessageId = params.parentId;
      } else if (threadMessages.length > 0) {
        // leafMessageId is synced from URL ?message= by useBranchManagement.
        // It IS the parent for new messages — no branch map traversal needed.
        const leafMessageId =
          useChatStore.getState().leafMessageIds[threadIdToUse] ?? null;
        const leafMsg = leafMessageId
          ? chatStore.messages[leafMessageId]
          : null;
        if (leafMsg) {
          parentMessageId = leafMessageId;
        } else {
          // Fall back to last message in thread
          const fallback = threadMessages[threadMessages.length - 1];
          parentMessageId = fallback?.id ?? null;
        }
      }

      // Server threads: never send messageHistory — server fetches from DB.
      // Incognito: send full message history.
      messageHistory =
        currentRootFolderId === DefaultFolderId.INCOGNITO
          ? threadMessages
          : null;
    }

    let createdThreadIdForNewThread: string | null = null;

    // Ensure thread ID (create for new threads)
    if (!threadIdToUse) {
      createdThreadIdForNewThread = crypto.randomUUID();
      const newThreadId: string = createdThreadIdForNewThread;

      // CRITICAL: Add thread to store BEFORE navigation and BEFORE creating messages
      // This ensures the thread exists when messages are filtered by thread ID
      const newThread: ChatThread = {
        id: createdThreadIdForNewThread,
        userId: null,
        leadId: null,
        title: content.slice(0, 50) || "New Chat",
        rootFolderId: currentRootFolderId,
        folderId: currentSubFolderId,
        status: ThreadStatus.ACTIVE,
        defaultModel: null,
        defaultCharacter: null,
        systemPrompt: null,
        pinned: false,
        archived: false,
        tags: [],
        preview: null,
        metadata: {},
        rolesView: null,
        rolesEdit: null,
        rolesPost: null,
        rolesModerate: null,
        rolesAdmin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchVector: null,
        published: false,
        isStreaming: false,
        sortOrder: 0,
      };
      useChatStore.getState().addThread(newThread);
      useChatStore
        .getState()
        .markThreadPendingCreate(createdThreadIdForNewThread);

      if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
        const { createIncognitoThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        await createIncognitoThread(
          content.slice(0, 50) || "New Chat",
          currentRootFolderId,
          currentSubFolderId,
          createdThreadIdForNewThread,
        );
      }
      // Optimistically add new thread to sidebar cache.
      // urlPathParams must match what the sidebar passes — { rootFolderId, subFolderId, search }.
      const now = new Date();
      apiClient.updateEndpointData(
        threadsDefinition.GET,
        logger,
        (oldData) => {
          if (!oldData?.success) {
            return oldData;
          }
          type ThreadItem = (typeof oldData.data.threads)[number];
          const newThreadItem: ThreadItem = {
            id: newThreadId,
            title: content.slice(0, 50) || "New Chat",
            rootFolderId: currentRootFolderId,
            folderId: currentSubFolderId,
            status: ThreadStatus.ACTIVE,
            preview: null,
            pinned: false,
            archived: false,
            isStreaming: false,
            rolesView: null,
            rolesEdit: null,
            rolesPost: null,
            rolesModerate: null,
            rolesAdmin: null,
            canEdit: true,
            canPost: true,
            canModerate: false,
            canDelete: true,
            canManagePermissions: false,
            createdAt: now,
            updatedAt: now,
          };
          return success({
            ...oldData.data,
            threads: [newThreadItem, ...oldData.data.threads],
            totalCount: oldData.data.totalCount + 1,
          });
        },
        {
          requestData: {
            subFolderId: currentSubFolderId,
            rootFolderId: currentRootFolderId,
          },
        },
      );

      // Optimistically add new thread to folder-contents cache
      type FolderItem =
        (typeof folderContentsDefinition.GET.types.ResponseOutput)["items"][number];
      const newFolderItem: FolderItem = {
        type: "thread",
        sortOrder: 0,
        id: newThreadId,
        userId: null,
        rootFolderId: currentRootFolderId,
        createdAt: now,
        updatedAt: now,
        // thread fields
        title: content.slice(0, 50) || "New Chat",
        folderId: currentSubFolderId,
        status: ThreadStatus.ACTIVE,
        preview: null,
        pinned: false,
        archived: false,
        isStreaming: false,
        canEdit: true,
        canPost: true,
        canDelete: true,
        canModerate: false,
        canManagePermissions: false,
        rolesView: null,
        rolesEdit: null,
        rolesPost: null,
        rolesModerate: null,
        rolesAdmin: null,
        // folder-only fields (null for thread)
        name: null,
        icon: null,
        color: null,
        parentId: null,
        expanded: null,
        canManage: null,
        canCreateThread: null,
        rolesManage: null,
        rolesCreateThread: null,
      };
      apiClient.updateEndpointData(
        folderContentsDefinition.GET,
        logger,
        (old) => {
          if (!old?.success) {
            return old;
          }
          return success({
            ...old.data,
            items: [newFolderItem, ...old.data.items],
          });
        },
        {
          urlPathParams: { rootFolderId: currentRootFolderId },
          requestData: { subFolderId: currentSubFolderId },
        },
      );
    }

    const finalThreadId = threadIdToUse || createdThreadIdForNewThread;

    if (!finalThreadId) {
      logger.error("No thread ID available");
      return;
    }

    // Navigate immediately BEFORE creating messages — only for new threads
    if (onThreadCreated && createdThreadIdForNewThread) {
      onThreadCreated(finalThreadId, currentRootFolderId, currentSubFolderId);
    }

    // Use shared function for message creation and sending
    await createAndSendUserMessage(
      {
        content,
        parentMessageId,
        threadId: finalThreadId,
        audioInput: params.audioInput,
        attachments: params.attachments,
        operation: "send",
        messageHistory, // Pass pre-loaded message history for incognito mode
        toolConfirmations: params.toolConfirmations,
      },
      {
        logger,
        aiStream,
        currentRootFolderId,
        currentSubFolderId,
        settings,
        setInput,
        setAttachments,
      },
    );
  } catch (error) {
    logger.error("Failed to send message", parseError(error));
  } finally {
    chatStore.setLoading(false);
  }
}
