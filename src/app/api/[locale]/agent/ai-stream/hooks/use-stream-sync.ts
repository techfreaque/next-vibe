/**
 * Stream Synchronization Hook
 * Synchronizes streaming messages and threads to chat store
 */

import { useEffect } from "react";

import type { TFunction } from "@/i18n/core/static-types";

import type {
  StreamingMessage,
  StreamingThread,
} from "../../ai-stream/hooks/store";
import type { ChatMessage, ChatThread } from "../../chat/db";
import { ChatMessageRole, ThreadStatus } from "../../chat/enum";

/**
 * Dependencies for stream sync
 */
interface StreamSyncDeps {
  streamingMessages: Record<string, StreamingMessage>;
  streamThreads: Record<string, StreamingThread>;
  chatMessages: Record<string, ChatMessage>;
  chatThreads: Record<string, ChatThread>;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  addThread: (thread: ChatThread) => void;
  t: TFunction;
}

/**
 * Hook for synchronizing streaming state to chat store
 */
export function useStreamSync(deps: StreamSyncDeps): void {
  const {
    streamingMessages,
    streamThreads,
    chatMessages,
    chatThreads,
    addMessage,
    updateMessage,
    addThread,
    t,
  } = deps;

  // Sync streaming messages to chat store
  useEffect(() => {
    Object.values(streamingMessages).forEach((streamMsg) => {
      const existingMsg = chatMessages[streamMsg.messageId];
      if (existingMsg) {
        // Check if we need to update the message
        const needsUpdate =
          existingMsg.content !== streamMsg.content ||
          existingMsg.character !== (streamMsg.character || null) ||
          JSON.stringify(existingMsg.metadata?.toolCall) !==
            JSON.stringify(streamMsg.toolCall) ||
          existingMsg.metadata?.promptTokens !== streamMsg.promptTokens ||
          existingMsg.metadata?.completionTokens !== streamMsg.completionTokens;

        if (needsUpdate) {
          updateMessage(streamMsg.messageId, {
            content: streamMsg.content,
            character: streamMsg.character || null,
            metadata: {
              ...existingMsg.metadata,
              ...(streamMsg.toolCall ? { toolCall: streamMsg.toolCall } : {}),
              ...(streamMsg.promptTokens !== undefined
                ? { promptTokens: streamMsg.promptTokens }
                : {}),
              ...(streamMsg.completionTokens !== undefined
                ? { completionTokens: streamMsg.completionTokens }
                : {}),
              ...(streamMsg.totalTokens !== undefined
                ? { totalTokens: streamMsg.totalTokens }
                : {}),
              // Only include finishReason if it's a non-null string (MessageMetadata doesn't allow null)
              ...(streamMsg.finishReason
                ? { finishReason: streamMsg.finishReason }
                : {}),
            },
            errorType: streamMsg.error
              ? t("app.api.agent.chat.aiStream.errorTypes.streamError")
              : null,
            errorMessage: streamMsg.error || null,
          });
        }
      } else {
        addMessage({
          id: streamMsg.messageId,
          threadId: streamMsg.threadId,
          role: streamMsg.role,
          content: streamMsg.content,
          parentId: streamMsg.parentId,
          depth: streamMsg.depth,
          authorId: null,
          isAI: streamMsg.role === ChatMessageRole.ASSISTANT,
          model: streamMsg.model || null,
          character: streamMsg.character || null,
          errorType: streamMsg.error
            ? t("app.api.agent.chat.aiStream.errorTypes.streamError")
            : null,
          errorMessage: streamMsg.error || null,
          errorCode: null,
          metadata: {
            ...(streamMsg.toolCall ? { toolCall: streamMsg.toolCall } : {}),
            ...(streamMsg.promptTokens !== undefined
              ? { promptTokens: streamMsg.promptTokens }
              : {}),
            ...(streamMsg.completionTokens !== undefined
              ? { completionTokens: streamMsg.completionTokens }
              : {}),
            ...(streamMsg.totalTokens !== undefined
              ? { totalTokens: streamMsg.totalTokens }
              : {}),
            // Only include finishReason if it's a non-null string (MessageMetadata doesn't allow null)
            ...(streamMsg.finishReason
              ? { finishReason: streamMsg.finishReason }
              : {}),
          },
          upvotes: 0,
          downvotes: 0,
          sequenceId: streamMsg.sequenceId ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          searchVector: null,
        });
      }
    });
  }, [streamingMessages, chatMessages, addMessage, updateMessage, t]);

  // Sync streaming threads to chat store
  useEffect(() => {
    Object.values(streamThreads).forEach((streamThread) => {
      const existingThread = chatThreads[streamThread.threadId];
      if (!existingThread) {
        addThread({
          id: streamThread.threadId,
          userId: "",
          leadId: null,
          title: streamThread.title,
          rootFolderId: streamThread.rootFolderId,
          folderId: streamThread.subFolderId,
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
          published: false,
          createdAt: streamThread.createdAt,
          updatedAt: streamThread.createdAt,
          searchVector: null,
        });
      }
    });
  }, [streamThreads, chatThreads, addThread]);
}
