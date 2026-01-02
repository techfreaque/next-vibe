/**
 * Branch Message Operation
 * Handles branching/editing messages in both incognito and server modes
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UseAIStreamReturn } from "../../../../../../ai-stream/hooks/use-ai-stream";
import type { DefaultFolderId } from "../../../../../config";
import type { ChatMessage } from "../../../../../db";
import type { ModelId } from "../../../../../model-access/models";

import { createAndSendUserMessage } from "./shared";

export interface BranchMessageDeps {
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

export async function branchMessage(
  messageId: string,
  newContent: string,
  audioInput: { file: File } | undefined,
  attachments: File[] | undefined,
  deps: BranchMessageDeps,
): Promise<void> {
  const message = deps.chatStore.messages[messageId];
  if (!message) {
    deps.logger.error("Message not found", { messageId });
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
