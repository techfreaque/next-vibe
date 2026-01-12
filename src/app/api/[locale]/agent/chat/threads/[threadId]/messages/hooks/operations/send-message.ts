/**
 * Send Message Operation
 * Handles sending new messages in both incognito and server modes
 */

import { parseError } from "next-vibe/shared/utils";

import { getLastMessageInBranch } from "@/app/[locale]/chat/lib/utils/thread-builder";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UseAIStreamReturn } from "../../../../../../ai-stream/hooks/use-ai-stream";
import { DefaultFolderId } from "../../../../../config";
import type { ChatMessage, ChatThread } from "../../../../../db";
import { ThreadStatus } from "../../../../../enum";
import { useChatStore } from "../../../../../hooks/store";
import { createAndSendUserMessage } from "./shared";

export interface SendMessageParams {
  content: string;
  threadId?: string;
  parentId?: string;
  toolConfirmations?: Array<{
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  }>;
  audioInput?: { file: File };
  attachments: File[];
}

export interface SendMessageDeps {
  logger: EndpointLogger;
  aiStream: UseAIStreamReturn;
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  chatStore: {
    messages: Record<string, ChatMessage>;
    threads: Record<string, { rootFolderId: DefaultFolderId }>;
    setLoading: (loading: boolean) => void;
    getThreadMessages: (threadId: string) => ChatMessage[];
    getBranchIndices: (threadId: string) => Record<string, number>;
  };
  settings: {
    selectedModel: ModelId;
    selectedCharacter: string;
    temperature: number;
    maxTokens: number;
    enabledTools: Array<{ id: string; requiresConfirmation: boolean }>;
  };
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
  deductCredits: (creditCost: number, feature: string) => void;
}

export async function sendMessage(
  params: SendMessageParams,
  deps: SendMessageDeps,
  onThreadCreated?: (
    threadId: string,
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void,
): Promise<void> {
  const {
    logger,
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore,
    settings,
    setInput,
    setAttachments,
    deductCredits,
  } = deps;
  const { content } = params;

  logger.debug("Send message operation", {
    content: content.slice(0, 50),
    activeThreadId,
    currentRootFolderId,
  });

  chatStore.setLoading(true);

  try {
    // Determine thread ID to use
    let threadIdToUse: string | null;
    const hasToolConfirmations =
      params.toolConfirmations && params.toolConfirmations.length > 0;
    if (hasToolConfirmations) {
      threadIdToUse = params.threadId ?? null;
    } else {
      threadIdToUse = activeThreadId === "new" ? null : activeThreadId;
    }

    if (threadIdToUse && currentRootFolderId !== "incognito") {
      const threadExists = chatStore.threads[threadIdToUse];
      if (!threadExists) {
        threadIdToUse = null;
      }
    }

    let parentMessageId: string | null = null;
    let messageHistory: ChatMessage[] | null | undefined;

    // Load messages and determine parent
    if (threadIdToUse) {
      let threadMessages: ChatMessage[];
      if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
        const { getMessagesForThread } =
          await import("../../../../../incognito/storage");
        threadMessages = await getMessagesForThread(threadIdToUse);
      } else {
        threadMessages = chatStore.getThreadMessages(threadIdToUse);
      }

      if (hasToolConfirmations && params.parentId) {
        parentMessageId = params.parentId;
      } else if (threadMessages.length > 0) {
        const branchIndices = chatStore.getBranchIndices(threadIdToUse);
        const lastMessage = getLastMessageInBranch(
          threadMessages,
          branchIndices,
        );

        if (lastMessage) {
          parentMessageId = lastMessage.id;
        } else {
          const fallbackMessage = threadMessages[threadMessages.length - 1];
          parentMessageId = fallbackMessage.id;
        }
      }

      messageHistory =
        currentRootFolderId === DefaultFolderId.INCOGNITO
          ? threadMessages
          : null;
    }

    let createdThreadIdForNewThread: string | null = null;

    // Ensure thread ID (create for new threads)
    if (!threadIdToUse) {
      createdThreadIdForNewThread = crypto.randomUUID();

      // CRITICAL: Add thread to store BEFORE navigation and BEFORE creating messages
      // This ensures the thread exists when messages are filtered by thread ID
      const newThread: ChatThread = {
        id: createdThreadIdForNewThread,
        userId: null,
        leadId: null,
        title: content.slice(0, 50) || "New Chat",
        rootFolderId: currentRootFolderId,
        folderId: currentSubFolderId,
        status: ThreadStatus.ACTIVE,
        defaultModel: null,
        defaultCharacter: null,
        systemPrompt: null,
        pinned: false,
        archived: false,
        tags: [],
        preview: null,
        metadata: {},
        rolesView: null,
        rolesEdit: null,
        rolesPost: null,
        rolesModerate: null,
        rolesAdmin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchVector: null,
        published: false,
      };
      useChatStore.getState().addThread(newThread);

      if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
        const { createIncognitoThread } =
          await import("../../../../../incognito/storage");
        await createIncognitoThread(
          content.slice(0, 50) || "New Chat",
          currentRootFolderId,
          currentSubFolderId,
          createdThreadIdForNewThread,
        );
      }
    }

    const finalThreadId = threadIdToUse || createdThreadIdForNewThread;

    if (!finalThreadId) {
      logger.error("No thread ID available");
      return;
    }

    // Navigate immediately BEFORE creating messages
    if (onThreadCreated) {
      onThreadCreated(finalThreadId, currentRootFolderId, currentSubFolderId);
    }

    // Use shared function for message creation and sending
    await createAndSendUserMessage(
      {
        content,
        parentMessageId,
        threadId: finalThreadId,
        audioInput: params.audioInput,
        attachments: params.attachments,
        operation: "send",
        messageHistory, // Pass pre-loaded message history for incognito mode
        toolConfirmations: params.toolConfirmations,
      },
      {
        logger,
        aiStream,
        currentRootFolderId,
        currentSubFolderId,
        settings,
        deductCredits,
      },
    );

    // Clear input on success
    const { useAIStreamStore } =
      await import("../../../../../../ai-stream/hooks/store");
    const streamError = useAIStreamStore.getState().error;
    if (!streamError) {
      setInput("");
      setAttachments([]);
    }
  } catch (error) {
    logger.error("Failed to send message", parseError(error));
  } finally {
    chatStore.setLoading(false);
  }
}
