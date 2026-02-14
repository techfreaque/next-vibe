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
import type { ChatMessage } from "../../../../../db";
import { ChatMessageRole } from "../../../../../enum";
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
    enabledTools: Array<{ id: string; requiresConfirmation: boolean }>;
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

    const parentDepth =
      threadMessages.find((msg) => msg.id === parentMessageId)?.depth ?? -1;

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

    // Skip user message creation for tool confirmations
    if (!hasToolConfirmations) {
      // Set loading state metadata (unified for both modes)
      let messageMetadata: ChatMessage["metadata"] = {};
      if (audioInput) {
        // Voice input: Show transcribing state until VOICE_TRANSCRIBED event arrives
        messageMetadata = { isTranscribing: true };
      } else if (attachments && attachments.length > 0) {
        // File attachments: Show uploading state
        // Server mode: FILES_UPLOADED event will update with storage URLs
        // Incognito mode: Client updates after API processes files
        messageMetadata = { isUploadingAttachments: true };

        logger.debug(`${operation} will process attachments via API`, {
          attachmentCount: attachments.length,
          mode:
            currentRootFolderId === DefaultFolderId.INCOGNITO
              ? "incognito"
              : "server",
        });
      }

      // Create user message
      const createdUserMessage: ChatMessage = {
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
        authorName: null,
        authorAvatar: null,
        authorColor: null,
        isAI: false,
        model: settings.selectedModel,
        character: settings.selectedCharacter,
        errorType: null,
        errorMessage: null,
        errorCode: null,
        edited: false,
        originalId: null,
        tokens: null,
        metadata: messageMetadata,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchVector: null,
      };

      chatStore.addMessage(createdUserMessage);

      // For incognito mode, clear input immediately since messages are stored locally
      // No need to wait for server confirmation
      if (
        currentRootFolderId === DefaultFolderId.INCOGNITO &&
        operation === "send"
      ) {
        setInput?.("");
        setAttachments?.([]);
      }

      // Save to localStorage (incognito only - server saves via API)
      if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
        // If there are attachments, use saveMessageWithAttachments to convert files to base64
        if (attachments && attachments.length > 0) {
          const { saveMessageWithAttachments } =
            await import("../../../../../incognito/storage");
          const { convertFilesToIncognitoAttachments } =
            await import("../../../../../incognito/file-utils");

          // Convert files to base64 attachments
          const incognitoAttachments =
            await convertFilesToIncognitoAttachments(attachments);

          // Save to localStorage
          await saveMessageWithAttachments(createdUserMessage, attachments);

          // Update chatStore with actual attachments (so UI shows them immediately)
          chatStore.updateMessage(createdUserMessage.id, {
            metadata: {
              attachments: incognitoAttachments,
            },
          });
        } else {
          const { saveMessage } =
            await import("../../../../../incognito/storage");
          await saveMessage(createdUserMessage);
        }
      }
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
        tools:
          settings.enabledTools?.map((tool) => ({
            toolId: tool.id,
            requiresConfirmation: tool.requiresConfirmation,
          })) ?? null,
        toolConfirmations: params.toolConfirmations ?? null,
        messageHistory: messageHistory ?? [],
        attachments: attachments && attachments.length > 0 ? attachments : null,
        voiceMode: effectiveVoiceMode,
        audioInput: audioInput ?? { file: null },
        timezone,
      },
      {
        onMessageCreated: (data) => {
          // Clear input when USER message is confirmed by server (for server threads only)
          // This means the message was successfully stored in the database
          if (
            data.role === ChatMessageRole.USER &&
            operation === "send" &&
            currentRootFolderId !== DefaultFolderId.INCOGNITO
          ) {
            logger.debug("[Message] User message created, clearing input", {
              messageId: data.messageId,
            });
            setInput?.("");
            setAttachments?.([]);
          }
        },
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
      },
    );
  } catch (error) {
    logger.error(`Failed to ${operation} message`, parseError(error));
  } finally {
    chatStore.setLoading(false);
  }
}
