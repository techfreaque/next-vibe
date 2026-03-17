/**
 * Retry Message Operation
 * Handles retrying messages in both incognito and server modes
 */

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import messagesDefinition from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { createAndSendUserMessage } from "./shared";
import type { StartStreamFn } from "./shared";

export interface RetryMessageDeps {
  logger: EndpointLogger;
  startStream: StartStreamFn;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  /** Active thread ID — needed to look up message in apiClient cache */
  activeThreadId: string | null;
  settings: {
    selectedModel: ModelId;
    selectedSkill: string;
    availableTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
    ttsAutoplay: boolean;
    ttsVoice: typeof TtsVoiceValue;
  };
  setLeafMessageId?: (messageId: string) => void;
}

export async function retryMessage(
  messageId: string,
  attachments: File[] | undefined,
  deps: RetryMessageDeps,
): Promise<void> {
  const { logger, currentRootFolderId, activeThreadId } = deps;

  if (!activeThreadId) {
    logger.error("retryMessage: no active thread", { messageId });
    return;
  }

  // Look up message from apiClient cache
  const cached = apiClient.getEndpointData(messagesDefinition.GET, logger, {
    urlPathParams: { threadId: activeThreadId },
    requestData: { rootFolderId: currentRootFolderId },
  });
  let message = cached?.success
    ? cached.data.messages.find((m) => m.id === messageId)
    : undefined;

  // Fallback: incognito storage (not in apiClient cache after page reload)
  if (!message && currentRootFolderId === DefaultFolderId.INCOGNITO) {
    const { getMessagesForThread } =
      await import("@/app/api/[locale]/agent/chat/incognito/storage");
    const msgs = await getMessagesForThread(activeThreadId);
    message = msgs.find((m) => m.id === messageId);
  }

  if (!message) {
    logger.error("retryMessage: message not found", {
      messageId,
      activeThreadId,
    });
    return;
  }

  await createAndSendUserMessage(
    {
      content: message.content ?? "",
      parentMessageId: message.parentId,
      threadId: message.threadId,
      attachments,
      operation: "retry",
    },
    deps,
  );
}
