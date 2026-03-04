/**
 * Retry Message Operation
 * Handles retrying messages in both incognito and server modes
 */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { createAndSendUserMessage } from "./shared";
import type { UseAIStreamReturn } from "./use-ai-stream";

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
    allowedTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
    ttsAutoplay: boolean;
    ttsVoice: typeof TtsVoiceValue;
  };
}

export async function retryMessage(
  messageId: string,
  attachments: File[] | undefined,
  deps: RetryMessageDeps,
): Promise<void> {
  const message = deps.chatStore.messages[messageId];
  if (!message) {
    deps.logger.error("Message not found", { messageId });
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
