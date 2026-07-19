/**
 * Branch Message Operation
 * Handles branching/editing messages in both incognito and server modes
 */

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { DefaultFolderId } from "next-vibe/agent/chat/config";
import messagesDefinition from "next-vibe/agent/chat/threads/[threadId]/messages/definition";
import type { FavoriteConfig } from "next-vibe/agent/skills/favorites/db";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";

import type { StartStreamFn } from "./shared";
import { createAndSendUserMessage } from "./shared";

export interface BranchMessageDeps {
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
    ttsAutoplay: boolean;
  };
  favoriteConfig: FavoriteConfig | null;
  setLeafMessageId?: (messageId: string) => void;
  locale: CountryLanguage;
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
      await import("next-vibe/agent/chat/incognito/storage");
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
