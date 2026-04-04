/**
 * Retry Message Operation
 * Handles retrying messages in both incognito and server modes
 */

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import messagesDefinition from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ModelProviderEnvAvailability } from "@/app/api/[locale]/agent/models/models";

import type { StartStreamFn } from "./shared";
import { createAndSendUserMessage } from "./shared";

export interface RetryMessageDeps {
  logger: EndpointLogger;
  startStream: StartStreamFn;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  /** Active thread ID - needed to look up message in apiClient cache */
  activeThreadId: string | null;
  user: JwtPayloadType;
  settings: {
    selectedModel: ChatModelId;
    selectedSkill: string;
    availableTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
    ttsAutoplay: boolean;
    voiceModelSelection: VoiceModelSelection | null | undefined;
  };
  setLeafMessageId?: (messageId: string) => void;
  locale: CountryLanguage;
  env: ModelProviderEnvAvailability;
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
