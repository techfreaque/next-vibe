/**
 * Shared logic for send/retry/branch operations
 * ALL three operations work identically - they create a new user message and stream AI response
 */

import { parseError } from "next-vibe/shared/utils";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UseAIStreamReturn } from "../../../../../../ai-stream/hooks/use-ai-stream";
import type { TtsVoiceValue } from "../../../../../../text-to-speech/enum";
import { DefaultFolderId } from "../../../../../config";
import { DEFAULT_TOOL_IDS } from "../../../../../constants";
import type { ChatMessage } from "../../../../../db";
import { ChatMessageRole } from "../../../../../enum";
import type { EnabledTool } from "../../../../../hooks/store";
import { useChatStore } from "../../../../../hooks/store";

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
    enabledTools: EnabledTool[] | null;
    ttsAutoplay: boolean;
    ttsVoice: typeof TtsVoiceValue;
  };
  deductCredits: (creditCost: number, feature: string) => void;
  setInput?: (input: string) => void;
  setAttachments?: (attachments: File[] | ((prev: File[]) => File[])) => void;
}

/**
 * Create and send a new user message
 * Used by send, retry, and branch - all work identically
 */
export async function createAndSendUserMessage(
  params: CreateMessageParams,
  deps: MessageOperationDeps,
): Promise<void> {
  const {
    logger,
    aiStream,
    currentRootFolderId,
    currentSubFolderId,
    settings,
    deductCredits,
    setInput,
    setAttachments,
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

    // Load thread messages
    let threadMessages: ChatMessage[];
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const { getMessagesForThread } =
        await import("../../../../../incognito/storage");
      threadMessages = await getMessagesForThread(threadId);
    } else {
      threadMessages = chatStore.getThreadMessages(threadId);
    }

    // Build message history (incognito only - server fetches from DB)
    // Use provided messageHistory if available (e.g., from send operation)
    let messageHistory: ChatMessage[] | null = params.messageHistory ?? null;
    if (
      !messageHistory &&
      currentRootFolderId === DefaultFolderId.INCOGNITO &&
      parentMessageId
    ) {
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

      const parentDepth =
        threadMessages.find((msg) => msg.id === parentMessageId)?.depth ?? -1;

      const optimisticUserMessage: ChatMessage = {
        id: newMessageId!,
        threadId,
        role: ChatMessageRole.USER,
        content: audioInput ? "" : content,
        parentId: parentMessageId,
        depth: parentDepth + 1,
        sequenceId: null,
        authorId:
          currentRootFolderId === DefaultFolderId.INCOGNITO
            ? "incognito"
            : null,
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
    } else {
      logger.debug("Skipping user message creation for tool confirmations", {
        count: params.toolConfirmations?.length ?? 0,
      });
    }

    // Voice mode settings - use ttsAutoplay and ttsVoice from chat settings
    const effectiveVoiceMode = settings.ttsAutoplay
      ? {
          enabled: true,
          voice: settings.ttsVoice,
        }
      : null;

    // Get user's timezone from browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Build tool arrays from settings:
    // activeTools = permission layer (null = all tools allowed)
    // tools = visibility layer (tools loaded into AI SDK context window)
    const activeToolsPayload = settings.enabledTools
      ? settings.enabledTools.map((tool) => ({
          toolId: tool.id,
          requiresConfirmation: tool.requiresConfirmation,
        }))
      : null; // null = all tools allowed

    const toolsPayload = settings.enabledTools
      ? settings.enabledTools
          .filter((tool) => tool.active)
          .map((tool) => ({
            toolId: tool.id,
            requiresConfirmation: tool.requiresConfirmation,
          }))
      : // null enabledTools = default: core 8 visible, server reads requiresConfirmation from definitions
        DEFAULT_TOOL_IDS.map((id) => ({
          toolId: id,
          requiresConfirmation: false,
        }));

    // Start AI stream (same for all operations)
    await aiStream.startStream(
      {
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
        activeTools: activeToolsPayload,
        tools: toolsPayload,
        toolConfirmations: params.toolConfirmations ?? null,
        messageHistory: messageHistory ?? [],
        attachments: attachments && attachments.length > 0 ? attachments : null,
        voiceMode: effectiveVoiceMode,
        audioInput: audioInput ?? { file: null },
        timezone,
      },
      {
        onCreditsDeducted: (data) => {
          // Optimistically deduct credits when server emits CREDITS_DEDUCTED event
          logger.debug("[Credits] Deducting credits from SSE event", {
            amount: data.amount,
            feature: data.feature,
            type: data.type,
            partial: data.partial,
          });
          deductCredits(data.amount, data.feature);
        },
        // Clear input when the user message arrives via SSE.
        // The user message is emitted before the AI response starts streaming,
        // so clearing here feels immediate while ensuring the server accepted the message.
        onMessageCreated:
          operation === "send"
            ? (() => {
                let cleared = false;
                return (data: { role: string }): void => {
                  if (!cleared && data.role === ChatMessageRole.USER) {
                    cleared = true;
                    setInput?.("");
                    setAttachments?.([]);
                  }
                };
              })()
            : undefined,
      },
    );
  } catch (error) {
    logger.error(`Failed to ${operation} message`, parseError(error));
  } finally {
    chatStore.setLoading(false);
  }
}
