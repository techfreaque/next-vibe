/**
 * Branch Message Operation
 * Handles branching/editing messages in both incognito and server modes
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

export interface BranchMessageDeps {
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

export async function branchMessage(
  messageId: string,
  newContent: string,
  audioInput: { file: File } | undefined,
  attachments: File[] | undefined,
  deps: BranchMessageDeps,
): Promise<void> {
  const { logger, currentRootFolderId, activeThreadId } = deps;

  if (!activeThreadId) {
    logger.error("branchMessage: no active thread", { messageId });
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

  // Fallback: incognito storage
  if (!message && currentRootFolderId === DefaultFolderId.INCOGNITO) {
    const { getMessagesForThread } =
      await import("@/app/api/[locale]/agent/chat/incognito/storage");
    const msgs = await getMessagesForThread(activeThreadId);
    message = msgs.find((m) => m.id === messageId);
  }

  if (!message) {
    logger.error("branchMessage: message not found", {
      messageId,
      activeThreadId,
    });
    return;
  }

  // Branch uses the SAME parent as the original message (creates alternative path)
  await createAndSendUserMessage(
    {
      content: newContent,
      parentMessageId: message.parentId,
      threadId: message.threadId,
      audioInput,
      attachments,
      operation: "edit",
    },
    deps,
  );
}
