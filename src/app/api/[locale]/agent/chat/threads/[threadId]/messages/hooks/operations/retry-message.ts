/**
 * Retry Message Operation
 * Handles retrying messages in both incognito and server modes
 */

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { DEFAULT_TTS_VOICE } from "../../../../../../text-to-speech/enum";
import type { UseAIStreamReturn } from "../../../../../../ai-stream/hooks/use-ai-stream";
import { DefaultFolderId } from "../../../../../config";
import { createCreditUpdateCallback } from "../../../../../credit-updater";
import type { ChatMessage } from "../../../../../db";
import { ChatMessageRole } from "../../../../../enum";
import { useChatStore } from "../../../../../hooks/store";
import type { ModelId } from "../../../../../model-access/models";
import { useVoiceModeStore } from "../../../../../voice-mode/store";
import { getCallModeKey } from "../../../../../voice-mode/types";
import { REQUIRE_TOOL_CONFIRMATION } from "./answer-as-ai";

export interface RetryMessageDeps {
  logger: EndpointLogger;
  aiStream: UseAIStreamReturn;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  chatStore: {
    messages: Record<string, ChatMessage>;
    setLoading: (loading: boolean) => void;
    getThreadMessages: (threadId: string) => ChatMessage[];
  };
  settings: {
    selectedModel: ModelId;
    selectedCharacter: string;
    temperature: number;
    maxTokens: number;
    enabledToolIds: string[];
  };
  deductCredits: (creditCost: number, feature: string) => void;
}

export async function retryMessage(
  messageId: string,
  attachments: File[] | undefined,
  deps: RetryMessageDeps,
): Promise<void> {
  const {
    logger,
    aiStream,
    currentRootFolderId,
    currentSubFolderId,
    chatStore,
    settings,
    deductCredits,
  } = deps;

  logger.debug("Retry message operation", {
    messageId,
    hasAttachments: !!attachments,
    attachmentCount: attachments?.length || 0,
  });

  const message = chatStore.messages[messageId];
  if (!message) {
    logger.error("Message not found", { messageId });
    return;
  }

  chatStore.setLoading(true);

  try {
    const retryParentId = message.parentId;
    const newMessageId = crypto.randomUUID();

    // Load thread messages
    let threadMessages: ChatMessage[];
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const { getMessagesForThread } = await import(
        "../../../../../incognito/storage"
      );
      threadMessages = await getMessagesForThread(message.threadId);
    } else {
      threadMessages = chatStore.getThreadMessages(message.threadId);
    }

    const parentDepth =
      threadMessages.find((msg) => msg.id === retryParentId)?.depth ?? 0;

    // Build message history (incognito only - server fetches from DB)
    let messageHistory: ChatMessage[] | null = null;
    if (currentRootFolderId === DefaultFolderId.INCOGNITO && retryParentId) {
      const parentIndex = threadMessages.findIndex(
        (msg) => msg.id === retryParentId,
      );
      if (parentIndex !== -1) {
        messageHistory = threadMessages.slice(0, parentIndex + 1);
      }
    }

    // Create user message
    const createdUserMessage: ChatMessage = {
      id: newMessageId,
      threadId: message.threadId,
      role: ChatMessageRole.USER,
      content: message.content,
      parentId: retryParentId,
      depth: parentDepth + 1,
      sequenceId: null,
      authorId:
        currentRootFolderId === DefaultFolderId.INCOGNITO ? "incognito" : null,
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
      metadata: {},
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      searchVector: null,
    };

    useChatStore.getState().addMessage(createdUserMessage);

    // Save to localStorage (incognito only - server saves via API)
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const { saveMessageWithAttachments } = await import(
        "../../../../../incognito/storage"
      );
      await saveMessageWithAttachments(createdUserMessage, attachments ?? []);
    }

    // Voice mode settings
    const voiceModeSettings = useVoiceModeStore.getState().settings;
    const callModeKey = getCallModeKey(
      settings.selectedModel,
      settings.selectedCharacter,
    );
    const isCallModeEnabled =
      voiceModeSettings.callModeByConfig?.[callModeKey] ?? false;

    const effectiveVoiceMode = isCallModeEnabled
      ? {
          enabled: true,
          voice: DEFAULT_TTS_VOICE,
        }
      : null;

    // Start AI stream
    await aiStream.startStream(
      {
        operation: "retry" as const,
        rootFolderId: currentRootFolderId,
        subFolderId: currentSubFolderId ?? null,
        threadId: message.threadId ?? null,
        userMessageId: newMessageId,
        parentMessageId: retryParentId ?? null,
        content: message.content,
        role: message.role,
        model: settings.selectedModel,
        character: settings.selectedCharacter ?? null,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        tools:
          settings.enabledToolIds?.map((toolId) => ({
            toolId,
            requiresConfirmation: REQUIRE_TOOL_CONFIRMATION,
          })) ?? null,
        messageHistory: messageHistory ?? null,
        voiceMode: effectiveVoiceMode,
        audioInput: { file: null },
        attachments: attachments && attachments.length > 0 ? attachments : null,
      },
      {
        onContentDone: createCreditUpdateCallback(
          settings.selectedModel,
          deductCredits,
        ),
      },
    );
  } catch (error) {
    logger.error("Failed to retry message", parseError(error));
  } finally {
    chatStore.setLoading(false);
  }
}
