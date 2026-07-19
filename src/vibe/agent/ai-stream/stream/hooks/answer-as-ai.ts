/**
 * Answer As AI Operation
 * Handles answering as AI in both incognito and server modes
 */

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { DefaultFolderId } from "next-vibe/agent/chat/config";
import type { ChatMessage } from "next-vibe/agent/chat/db";
import { ChatMessageRole } from "next-vibe/agent/chat/enum";
import messagesDefinition from "next-vibe/agent/chat/threads/[threadId]/messages/definition";
import type { FavoriteConfig } from "next-vibe/agent/skills/favorites/db";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";

import type { AiStreamPostRequestOutput } from "../definition";
import type { StartStreamFn } from "./shared";

export interface AnswerAsAIDeps {
  logger: EndpointLogger;
  startStream: StartStreamFn;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  /** Active thread ID - needed to look up message in apiClient cache */
  activeThreadId: string | null;
  settings: {
    selectedModel: ChatModelId;
    selectedSkill: string;
  };
  /** Active favorite config for model/tool resolution */
  favoriteConfig: FavoriteConfig | null;
  /** How this stream executes — the ai-stream POST executionContext union
   * (normal client chat uses `{ mode: "local" }`). */
  executionContext: AiStreamPostRequestOutput["executionContext"];
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
    favoriteConfig,
    executionContext,
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
      await import("next-vibe/agent/chat/incognito/storage");
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
    let incognitoThreadTitle: string | null = null;
    let incognitoThreadDescription: string | null = null;
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const parentIndex = allMessages.findIndex((msg) => msg.id === messageId);
      if (parentIndex !== -1) {
        messageHistory = allMessages.slice(0, parentIndex + 1);
      }
      // Incognito threads live only in localStorage - send their current
      // title/description so the server-side rename prompt fragment sees them.
      const { getIncognitoThread } =
        await import("next-vibe/agent/chat/incognito/storage");
      const incognitoThread = await getIncognitoThread(activeThreadId);
      incognitoThreadTitle = incognitoThread?.title ?? null;
      incognitoThreadDescription = incognitoThread?.description ?? null;
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
      favoriteConfig,
      messageHistory: messageHistory ?? [],
      incognitoThreadTitle,
      incognitoThreadDescription,
      attachments: attachments && attachments.length > 0 ? attachments : null,
      toolConfirmations: null,
      voiceMode: { enabled: false },
      audioInput: { file: null },
      timezone,
      executionContext,
    });
  } catch (error) {
    logger.error("Failed to answer as AI", parseError(error));
  }
}
