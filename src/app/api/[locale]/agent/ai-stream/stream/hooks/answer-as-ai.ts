/**
 * Answer As AI Operation
 * Handles answering as AI in both incognito and server modes
 */

import { parseError } from "next-vibe/shared/utils";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import messagesDefinition from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { DEFAULT_TTS_VOICE } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { StartStreamFn } from "./shared";

export interface AnswerAsAIDeps {
  logger: EndpointLogger;
  startStream: StartStreamFn;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  /** Active thread ID - needed to look up message in apiClient cache */
  activeThreadId: string | null;
  settings: {
    selectedModel: ModelId;
    selectedSkill: string;
    availableTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
  };
}

export async function answerAsAI(
  messageId: string,
  content: string,
  attachments: File[] | undefined,
  deps: AnswerAsAIDeps,
): Promise<void> {
  const {
    logger,
    startStream,
    currentRootFolderId,
    currentSubFolderId,
    activeThreadId,
    settings,
  } = deps;

  logger.debug("Answer as AI operation", { messageId, content });

  if (!activeThreadId) {
    logger.error("answerAsAI: no active thread", { messageId });
    return;
  }

  // Look up message from apiClient cache
  const cached = apiClient.getEndpointData(messagesDefinition.GET, logger, {
    urlPathParams: { threadId: activeThreadId },
    requestData: { rootFolderId: currentRootFolderId },
  });
  let allMessages: ChatMessage[] = cached?.success ? cached.data.messages : [];

  // Fallback: incognito storage
  if (
    allMessages.length === 0 &&
    currentRootFolderId === DefaultFolderId.INCOGNITO
  ) {
    const { getMessagesForThread } =
      await import("@/app/api/[locale]/agent/chat/incognito/storage");
    allMessages = await getMessagesForThread(activeThreadId);
  }

  const message = allMessages.find((m) => m.id === messageId);
  if (!message) {
    logger.error("answerAsAI: message not found", {
      messageId,
      activeThreadId,
    });
    return;
  }

  try {
    const aiMessageId = crypto.randomUUID();

    // Build message history (incognito only - server fetches from DB)
    let messageHistory: ChatMessage[] | null = null;
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const parentIndex = allMessages.findIndex((msg) => msg.id === messageId);
      if (parentIndex !== -1) {
        messageHistory = allMessages.slice(0, parentIndex + 1);
      }
    }

    // Get user's timezone from browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Start AI stream
    await startStream({
      operation: "answer-as-ai" as const,
      rootFolderId: currentRootFolderId,
      subFolderId: currentSubFolderId ?? null,
      threadId: message.threadId ?? null,
      userMessageId: aiMessageId,
      parentMessageId: messageId ?? null,
      content,
      role: ChatMessageRole.ASSISTANT,
      model: settings.selectedModel,
      skill: settings.selectedSkill ?? null,
      availableTools:
        settings.availableTools?.map((t) => ({
          toolId: t.toolId,
          requiresConfirmation: t.requiresConfirmation ?? false,
        })) ?? null,
      pinnedTools:
        settings.pinnedTools?.map((t) => ({
          toolId: t.toolId,
          requiresConfirmation: t.requiresConfirmation ?? false,
        })) ?? null,
      messageHistory: messageHistory ?? [],
      attachments: attachments && attachments.length > 0 ? attachments : null,
      toolConfirmations: null,
      voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE },
      audioInput: { file: null },
      timezone,
    });
  } catch (error) {
    logger.error("Failed to answer as AI", parseError(error));
  }
}
