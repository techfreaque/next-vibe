/**
 * Shared logic for send/retry/branch operations
 * ALL three operations work identically - they create a new user message and stream AI response
 */

import { parseError } from "next-vibe/shared/utils";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { getDefaultToolIds } from "@/app/api/[locale]/agent/chat/constants";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { useChatStore } from "@/app/api/[locale]/agent/chat/hooks/store";
import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { DEFAULT_TTS_VOICE } from "@/app/api/[locale]/agent/text-to-speech/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UseAIStreamReturn } from "./use-ai-stream";

export interface CreateMessageParams {
  content: string;
  parentMessageId: string | null; // Caller must determine correct parent based on operation
  threadId: string;
  audioInput?: { file: File };
  attachments?: File[];
  operation: "send" | "retry" | "edit";
  // Optional: for send operation with tool confirmations or explicit params
  messageHistory?: ChatMessage[] | null;
  toolConfirmations?: Array<{
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  }>;
}

export interface MessageOperationDeps {
  logger: EndpointLogger;
  aiStream: UseAIStreamReturn;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  settings: {
    selectedModel: ModelId;
    selectedCharacter: string;
    allowedTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
    ttsAutoplay: boolean;
    ttsVoice: typeof TtsVoiceValue;
  };
  setInput?: (input: string) => void;
  setAttachments?: (attachments: File[] | ((prev: File[]) => File[])) => void;
  /** Called immediately after the optimistic user message is added — switches the visible branch */
  setLeafMessageId?: (messageId: string) => void;
}

/**
 * Create and send a new user message
 * Used by send, retry, and branch - all work identically
 */
export async function createAndSendUserMessage(
  params: CreateMessageParams,
  deps: MessageOperationDeps,
): Promise<boolean> {
  const {
    logger,
    aiStream,
    currentRootFolderId,
    currentSubFolderId,
    settings,
    setInput,
    setAttachments,
    setLeafMessageId,
  } = deps;

  const {
    content,
    parentMessageId,
    threadId,
    audioInput,
    attachments,
    operation,
  } = params;

  logger.debug(`${operation} operation`, {
    hasAudioInput: !!audioInput,
    hasAttachments: !!attachments,
    attachmentCount: attachments?.length || 0,
  });

  const chatStore = useChatStore.getState();
  chatStore.setLoading(true);

  try {
    // For tool confirmations, we don't create a new user message
    // We're just confirming existing tool calls
    const hasToolConfirmations =
      params.toolConfirmations && params.toolConfirmations.length > 0;
    const newMessageId = hasToolConfirmations ? null : crypto.randomUUID();

    // Build message history (incognito only - server fetches from DB for server threads)
    // Use provided messageHistory if available (e.g., pre-filtered from send operation)
    let messageHistory: ChatMessage[] | null = params.messageHistory ?? null;
    if (
      !messageHistory &&
      currentRootFolderId === DefaultFolderId.INCOGNITO &&
      parentMessageId
    ) {
      // Load incognito thread messages and walk up parent chain
      const { getMessagesForThread } =
        await import("@/app/api/[locale]/agent/chat/incognito/storage");
      const threadMessages = await getMessagesForThread(threadId);

      // Walk up parent chain to get only messages in this branch
      messageHistory = [];
      const messageMap = new Map(threadMessages.map((m) => [m.id, m]));
      let currentId: string | null = parentMessageId;

      while (currentId) {
        const msg = messageMap.get(currentId);
        if (!msg) {
          break;
        }
        messageHistory.push(msg);
        currentId = msg.parentId;
      }

      // Reverse to get chronological order (oldest first)
      messageHistory.reverse();
    }

    // Optimistically add user message to store for immediate UI feedback.
    // The server will emit USER MESSAGE_CREATED with the correct parentId/depth,
    // which will update (replace) this optimistic entry in the store.
    if (!hasToolConfirmations) {
      let messageMetadata: ChatMessage["metadata"] = {};
      if (audioInput) {
        messageMetadata = { isTranscribing: true };
      } else if (attachments && attachments.length > 0) {
        messageMetadata = { isUploadingAttachments: true };
      }

      const optimisticUserMessage: ChatMessage = {
        id: newMessageId!,
        threadId,
        role: ChatMessageRole.USER,
        content: audioInput ? "" : content,
        parentId: parentMessageId,
        sequenceId: null,
        authorId:
          currentRootFolderId === DefaultFolderId.INCOGNITO
            ? "incognito"
            : null,
        authorName: null,
        isAI: false,
        model: settings.selectedModel,
        character: settings.selectedCharacter,
        errorType: null,
        errorMessage: null,
        errorCode: null,
        metadata: messageMetadata,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchVector: null,
      };

      chatStore.addMessage(optimisticUserMessage);

      // Immediately switch the visible branch to the new message.
      // The auto-switch in useBranchManagement only fires when parentId === currentLeaf,
      // which doesn't hold for retry/branch (they use the grandparent as parentId).
      setLeafMessageId?.(newMessageId!);
    } else {
      logger.debug("Skipping user message creation for tool confirmations", {
        count: params.toolConfirmations?.length ?? 0,
      });
    }

    // Voice mode settings - use ttsAutoplay and ttsVoice from chat settings
    const effectiveVoiceMode = {
      enabled: settings.ttsAutoplay,
      voice: settings.ttsVoice ?? DEFAULT_TTS_VOICE,
    };

    // Get user's timezone from browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // allowedTools = permission layer (null = all tools allowed)
    // pinnedTools = context window layer (tools loaded into AI SDK context window)
    // Both stored in settings in the same format as ai-stream expects
    const allowedToolsPayload =
      settings.allowedTools?.map((t) => ({
        toolId: t.toolId,
        requiresConfirmation: t.requiresConfirmation ?? false,
      })) ?? null;
    const pinnedToolsPayload = (
      settings.pinnedTools ??
      getDefaultToolIds().map((id) => ({
        toolId: id,
        requiresConfirmation: false,
      }))
    ).map((t) => ({
      toolId: t.toolId,
      requiresConfirmation: t.requiresConfirmation ?? false,
    }));

    // Start AI stream (same for all operations)
    // POST is fire-and-forget — WS events handled by useMessagesSubscription
    const streamStarted = await aiStream.startStream({
      operation,
      rootFolderId: currentRootFolderId,
      subFolderId: currentSubFolderId ?? null,
      threadId: threadId ?? null,
      userMessageId: newMessageId,
      parentMessageId: parentMessageId ?? null,
      content,
      role: ChatMessageRole.USER,
      model: settings.selectedModel,
      character: settings.selectedCharacter ?? null,
      allowedTools: allowedToolsPayload,
      tools: pinnedToolsPayload,
      toolConfirmations: params.toolConfirmations ?? null,
      messageHistory: messageHistory ?? [],
      attachments: attachments && attachments.length > 0 ? attachments : null,
      voiceMode: effectiveVoiceMode,
      audioInput: audioInput ?? { file: null },
      timezone,
    });

    if (!streamStarted) {
      // addErrorMessageToChat (called inside startStream on failure) already
      // reverts the optimistic user message and adds an error message in its place.
      // Nothing to clean up here.
      return false;
    }

    // Clear input after POST succeeds (server accepted the message)
    if (operation === "send") {
      setInput?.("");
      setAttachments?.([]);
    }
    return true;
  } catch (error) {
    logger.error(`Failed to ${operation} message`, parseError(error));
    return false;
  } finally {
    chatStore.setLoading(false);
  }
}
