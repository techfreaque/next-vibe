/**
 * Retry Message Operation
 * Handles retrying messages in both incognito and server modes
 */

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UseAIStreamReturn } from "../../../../../../ai-stream/hooks/use-ai-stream";
import type { DefaultFolderId } from "../../../../../config";
import type { ChatMessage } from "../../../../../db";
import { createAndSendUserMessage } from "./shared";

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
    enabledTools: Array<{ id: string; requiresConfirmation: boolean }>;
  };
  deductCredits: (creditCost: number, feature: string) => void;
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
