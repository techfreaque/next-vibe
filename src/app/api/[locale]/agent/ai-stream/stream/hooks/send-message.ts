/**
 * Send Message Operation
 * Handles sending new messages in both incognito and server modes
 */

import { success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ThreadStatus } from "@/app/api/[locale]/agent/chat/enum";
import folderContentsDefinition from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition";
import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import messagesDefinition from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import pathDefinitions from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/path/definition";
import threadsDefinition from "@/app/api/[locale]/agent/chat/threads/definition";
import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ModelProviderEnvAvailability } from "@/app/api/[locale]/agent/models/models";

import type { StartStreamFn } from "./shared";
import { createAndSendUserMessage } from "./shared";

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
  /** Image generation settings */
  imageSize?: string;
  imageQuality?: string;
  /** Music generation settings */
  musicDuration?: string;
}

export interface SendMessageDeps {
  logger: EndpointLogger;
  startStream: StartStreamFn;
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  /** leafMessageId from the navigation store - used as starting point for branch-aware parent resolution */
  leafMessageId: string | null;
  user: JwtPayloadType;
  settings: {
    selectedModel: ChatModelId;
    selectedSkill: string;
    availableTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
    ttsAutoplay: boolean;
    voiceModelSelection: VoiceModelSelection | null | undefined;
  };
  locale: CountryLanguage;
  env: ModelProviderEnvAvailability;
}

export async function sendMessage(
  params: SendMessageParams,
  deps: SendMessageDeps,
  onThreadCreated?: (
    threadId: string,
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void,
): Promise<{ success: boolean; createdThreadId: string | null }> {
  const {
    logger,
    startStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    leafMessageId,
    user,
    settings,
    locale,
    env,
  } = deps;
  const { content } = params;

  logger.debug("Send message operation", {
    content: content.slice(0, 50),
    activeThreadId,
    currentRootFolderId,
  });

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
        // Read from apiClient cache
        const cached = apiClient.getEndpointData(
          messagesDefinition.GET,
          logger,
          {
            urlPathParams: { threadId: threadIdToUse },
            requestData: { rootFolderId: currentRootFolderId },
          },
        );
        threadMessages = cached?.success ? cached.data.messages : [];
      }

      if (params.parentId) {
        parentMessageId = params.parentId;
      } else if (threadMessages.length > 0) {
        // Walk DOWN from leafMessageId following the latest child at each level.
        // leafMessageId is kept up-to-date by auto-switch (including wakeUp revival chains),
        // so it always points to the current branch's true leaf.
        const byId = new Map(threadMessages.map((m) => [m.id, m]));
        const childrenByParent = new Map<string | null, ChatMessage[]>();
        for (const msg of threadMessages) {
          const key = msg.parentId ?? null;
          const arr = childrenByParent.get(key) ?? [];
          arr.push(msg);
          childrenByParent.set(key, arr);
        }
        for (const [key, arr] of childrenByParent.entries()) {
          childrenByParent.set(
            key,
            arr.toSorted(
              (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
            ),
          );
        }

        // Start from leafMessageId if present, otherwise last by createdAt
        const startMsg = leafMessageId ? byId.get(leafMessageId) : null;
        const startId = startMsg
          ? startMsg.id
          : (threadMessages.toSorted(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            )[0]?.id ?? null);

        if (startId) {
          let currentId: string = startId;
          while (true) {
            const kids = childrenByParent.get(currentId);
            if (!kids || kids.length === 0) {
              break;
            }
            const latestKid = kids[kids.length - 1];
            if (!latestKid) {
              break;
            }
            currentId = latestKid.id;
          }
          parentMessageId = currentId;
        }
      }

      // Server threads: never send messageHistory - server fetches from DB.
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

      // Pre-seed both caches with empty data so queries find existing cache
      // entries on mount and staleTime prevents an immediate refetch.
      if (currentRootFolderId !== DefaultFolderId.INCOGNITO) {
        apiClient.updateEndpointData(
          messagesDefinition.GET,
          logger,
          (old) => old ?? success({ backgroundTasks: [], messages: [] }),
          {
            urlPathParams: { threadId: newThreadId },
            requestData: { rootFolderId: currentRootFolderId },
          },
        );
        apiClient.updateEndpointData(
          pathDefinitions.GET,
          logger,
          (old) =>
            old ??
            success({
              messages: [],
              hasOlderHistory: false,
              hasNewerMessages: false,
              resolvedLeafMessageId: null,
              oldestLoadedMessageId: null,
              compactionBoundaryId: null,
              newerChunkAnchorId: null,
            }),
          {
            urlPathParams: { threadId: newThreadId },
          },
        );
      }

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
      // urlPathParams must match what the sidebar passes - { rootFolderId, subFolderId, search }.
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
            streamingState: "idle" as const,
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
        streamingState: "idle" as const,
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
      return { success: false, createdThreadId: createdThreadIdForNewThread };
    }

    // Snapshot URL before navigation - needed for revert on failure
    const preNavigationUrl = window.location.href;

    // Navigate immediately BEFORE creating messages - only for new threads
    if (onThreadCreated && createdThreadIdForNewThread) {
      onThreadCreated(finalThreadId, currentRootFolderId, currentSubFolderId);
    }

    // Use shared function for message creation and sending
    const streamStarted = await createAndSendUserMessage(
      {
        content,
        parentMessageId,
        threadId: finalThreadId,
        audioInput: params.audioInput,
        attachments: params.attachments,
        operation: "send",
        messageHistory, // Pass pre-loaded message history for incognito mode
        toolConfirmations: params.toolConfirmations,
        imageSize: params.imageSize,
        imageQuality: params.imageQuality,
        musicDuration: params.musicDuration,
      },
      {
        logger,
        startStream,
        currentRootFolderId,
        currentSubFolderId,
        user,
        settings,
        locale,
        env,
      },
    );

    // If stream failed and we created a new thread optimistically, revert everything
    if (!streamStarted && createdThreadIdForNewThread) {
      logger.warn("Stream failed - reverting optimistic new thread", {
        threadId: createdThreadIdForNewThread,
      });

      // Remove from threads sidebar cache
      apiClient.updateEndpointData(
        threadsDefinition.GET,
        logger,
        (oldData) => {
          if (!oldData?.success) {
            return oldData;
          }
          return success({
            ...oldData.data,
            threads: oldData.data.threads.filter(
              (t) => t.id !== createdThreadIdForNewThread,
            ),
            totalCount: Math.max(0, oldData.data.totalCount - 1),
          });
        },
        {
          requestData: {
            subFolderId: currentSubFolderId,
            rootFolderId: currentRootFolderId,
          },
        },
      );

      // Remove from folder-contents cache
      apiClient.updateEndpointData(
        folderContentsDefinition.GET,
        logger,
        (old) => {
          if (!old?.success) {
            return old;
          }
          return success({
            ...old.data,
            items: old.data.items.filter(
              (item) => item.id !== createdThreadIdForNewThread,
            ),
          });
        },
        {
          urlPathParams: { rootFolderId: currentRootFolderId },
          requestData: { subFolderId: currentSubFolderId },
        },
      );

      // Revert navigation back to where the user was
      window.history.replaceState(null, "", preNavigationUrl);
      return { success: false, createdThreadId: createdThreadIdForNewThread };
    }

    return {
      success: streamStarted,
      createdThreadId: createdThreadIdForNewThread,
    };
  } catch (error) {
    logger.error("Failed to send message", parseError(error));
    return { success: false, createdThreadId: null };
  }
}
