/**
 * Answer As AI Operation
 * Handles answering as AI in both incognito and server modes
 */

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UseAIStreamReturn } from "../../../../../../ai-stream/hooks/use-ai-stream";
import { DefaultFolderId } from "../../../../../config";
import { createCreditUpdateCallback } from "../../../../../credit-updater";
import type { ChatMessage } from "../../../../../db";
import { ChatMessageRole } from "../../../../../enum";
import type { ModelId } from "../../../../../model-access/models";

export interface AnswerAsAIDeps {
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
    enabledTools: Array<{ id: string; requiresConfirmation: boolean }>;
  };
  deductCredits: (creditCost: number, feature: string) => void;
}

export async function answerAsAI(
  messageId: string,
  content: string,
  attachments: File[] | undefined,
  deps: AnswerAsAIDeps,
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

  logger.debug("Answer as AI operation", {
    messageId,
    content,
  });

  const message = chatStore.messages[messageId];
  if (!message) {
    logger.error("Message not found", { messageId });
    return;
  }

  chatStore.setLoading(true);

  try {
    const aiMessageId = crypto.randomUUID();

    // Load thread messages
    let threadMessages: ChatMessage[];
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const { getMessagesForThread } = await import("../../../../../incognito/storage");
      threadMessages = await getMessagesForThread(message.threadId);
    } else {
      threadMessages = chatStore.getThreadMessages(message.threadId);
    }

    // Build message history (incognito only - server fetches from DB)
    let messageHistory: ChatMessage[] | null = null;
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const parentIndex = threadMessages.findIndex((msg) => msg.id === messageId);
      if (parentIndex !== -1) {
        messageHistory = threadMessages.slice(0, parentIndex + 1);
      }
    }

    // Start AI stream
    await aiStream.startStream(
      {
        operation: "answer-as-ai" as const,
        rootFolderId: currentRootFolderId,
        subFolderId: currentSubFolderId ?? null,
        threadId: message.threadId ?? null,
        userMessageId: aiMessageId,
        parentMessageId: messageId ?? null,
        content,
        role: ChatMessageRole.ASSISTANT,
        model: settings.selectedModel,
        character: settings.selectedCharacter ?? null,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        tools:
          settings.enabledTools?.map((tool) => ({
            toolId: tool.id,
            requiresConfirmation: tool.requiresConfirmation,
          })) ?? null,
        messageHistory: messageHistory ?? null,
        attachments: attachments && attachments.length > 0 ? attachments : null,
        voiceMode: null,
        audioInput: { file: null },
      },
      {
        onContentDone: createCreditUpdateCallback(settings.selectedModel, deductCredits),
      },
    );
  } catch (error) {
    logger.error("Failed to answer as AI", parseError(error));
  } finally {
    chatStore.setLoading(false);
  }
}
