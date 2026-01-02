/**
 * Shared logic for send/retry/branch operations
 * ALL three operations work identically - they create a new user message and stream AI response
 */

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UseAIStreamReturn } from "../../../../../../ai-stream/hooks/use-ai-stream";
import { DEFAULT_TTS_VOICE } from "../../../../../../text-to-speech/enum";
import { DefaultFolderId } from "../../../../../config";
import { createCreditUpdateCallback } from "../../../../../credit-updater";
import type { ChatMessage } from "../../../../../db";
import { ChatMessageRole } from "../../../../../enum";
import { useChatStore } from "../../../../../hooks/store";
import type { ModelId } from "../../../../../model-access/models";
import { useVoiceModeStore } from "../../../../../voice-mode/store";
import { getCallModeKey } from "../../../../../voice-mode/types";

export interface CreateMessageParams {
  content: string;
  parentMessageId: string | null; // Caller must determine correct parent based on operation
  threadId: string;
  audioInput?: { file: File };
  attachments?: File[];
  operation: "send" | "retry" | "edit";
  // Optional: for send operation with tool confirmation or explicit params
  messageHistory?: ChatMessage[] | null;
  toolConfirmation?: {
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  };
}

export interface MessageOperationDeps {
  logger: EndpointLogger;
  aiStream: UseAIStreamReturn;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  settings: {
    selectedModel: ModelId;
    selectedCharacter: string;
    temperature: number;
    maxTokens: number;
    enabledTools: Array<{ id: string; requiresConfirmation: boolean }>;
  };
  deductCredits: (creditCost: number, feature: string) => void;
}

/**
 * Create and send a new user message
 * Used by send, retry, and branch - all work identically
 */
export async function createAndSendUserMessage(
  params: CreateMessageParams,
  deps: MessageOperationDeps,
): Promise<void> {
  const { logger, aiStream, currentRootFolderId, currentSubFolderId, settings, deductCredits } =
    deps;

  const { content, parentMessageId, threadId, audioInput, attachments, operation } = params;

  logger.debug(`${operation} operation`, {
    hasAudioInput: !!audioInput,
    hasAttachments: !!attachments,
    attachmentCount: attachments?.length || 0,
  });

  const chatStore = useChatStore.getState();
  chatStore.setLoading(true);

  try {
    const newMessageId = crypto.randomUUID();

    // Load thread messages
    let threadMessages: ChatMessage[];
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const { getMessagesForThread } = await import("../../../../../incognito/storage");
      threadMessages = await getMessagesForThread(threadId);
    } else {
      threadMessages = chatStore.getThreadMessages(threadId);
    }

    const parentDepth = threadMessages.find((msg) => msg.id === parentMessageId)?.depth ?? -1;

    // Build message history (incognito only - server fetches from DB)
    // Use provided messageHistory if available (e.g., from send operation)
    let messageHistory: ChatMessage[] | null = params.messageHistory ?? null;
    if (!messageHistory && currentRootFolderId === DefaultFolderId.INCOGNITO && parentMessageId) {
      const parentIndex = threadMessages.findIndex((msg) => msg.id === parentMessageId);
      if (parentIndex !== -1) {
        messageHistory = threadMessages.slice(0, parentIndex + 1);
      }
    }

    // Handle attachments based on mode (BEFORE creating message)
    let messageMetadata: ChatMessage["metadata"] = {};
    if (audioInput) {
      messageMetadata = { isTranscribing: true };
    } else if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      // INCOGNITO MODE: Convert File objects to base64
      if (attachments && attachments.length > 0) {
        const { convertFilesToIncognitoAttachments } =
          await import("../../../../../incognito/file-utils");
        const attachmentMetadata = await convertFilesToIncognitoAttachments(attachments);
        messageMetadata = { attachments: attachmentMetadata };

        logger.debug(`Converted ${operation} attachments to base64 (incognito)`, {
          attachmentCount: attachmentMetadata.length,
        });
      }
    } else {
      // PRIVATE MODE: Set loading state, FILES_UPLOADED event will update with URLs
      if (attachments && attachments.length > 0) {
        messageMetadata = { isUploadingAttachments: true };

        logger.debug(`${operation} will upload attachments via AI stream (private)`, {
          attachmentCount: attachments.length,
        });
      }
    }

    // Create user message
    const createdUserMessage: ChatMessage = {
      id: newMessageId,
      threadId,
      role: ChatMessageRole.USER,
      content: audioInput ? "" : content,
      parentId: parentMessageId,
      depth: parentDepth + 1,
      sequenceId: null,
      authorId: currentRootFolderId === DefaultFolderId.INCOGNITO ? "incognito" : null,
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

    // Save to localStorage (incognito only - server saves via API)
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const { saveMessage } = await import("../../../../../incognito/storage");
      await saveMessage(createdUserMessage);
    }

    // Voice mode settings
    const voiceModeSettings = useVoiceModeStore.getState().settings;
    const callModeKey = getCallModeKey(settings.selectedModel, settings.selectedCharacter);
    const isCallModeEnabled = voiceModeSettings.callModeByConfig?.[callModeKey] ?? false;

    const effectiveVoiceMode = isCallModeEnabled
      ? {
          enabled: true,
          voice: DEFAULT_TTS_VOICE,
        }
      : null;

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
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        tools:
          settings.enabledTools?.map((tool) => ({
            toolId: tool.id,
            requiresConfirmation: tool.requiresConfirmation,
          })) ?? null,
        toolConfirmation: params.toolConfirmation ?? null,
        messageHistory: messageHistory ?? null,
        attachments: attachments && attachments.length > 0 ? attachments : null,
        voiceMode: effectiveVoiceMode,
        audioInput: audioInput ?? { file: null },
      },
      {
        onContentDone: createCreditUpdateCallback(settings.selectedModel, deductCredits),
      },
    );
  } catch (error) {
    logger.error(`Failed to ${operation} message`, parseError(error));
  } finally {
    chatStore.setLoading(false);
  }
}
