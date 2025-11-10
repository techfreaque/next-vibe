/**
 * Stream Synchronization Hook
 * Synchronizes streaming messages and threads to chat store
 */

import { useEffect } from "react";

import type { TFunction } from "@/i18n/core/static-types";

import { ChatMessageRole } from "../enum";
import type { ChatMessage, ChatThread } from "./store";
import type {
  StreamingMessage,
  StreamingThread,
} from "../../ai-stream/hooks/store";

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
      if (!existingMsg) {
        addMessage({
          id: streamMsg.messageId,
          threadId: streamMsg.threadId,
          role: streamMsg.role,
          content: streamMsg.content,
          parentId: streamMsg.parentId,
          depth: streamMsg.depth,
          authorId: null,
          authorName: null,
          isAI: streamMsg.role === ChatMessageRole.ASSISTANT,
          model: streamMsg.model || null,
          persona: null,
          errorType: streamMsg.error
            ? t("app.api.v1.core.agent.chat.aiStream.errorTypes.streamError")
            : null,
          errorMessage: streamMsg.error || null,
          edited: false,
          tokens: streamMsg.totalTokens || null,
          toolCalls: streamMsg.toolCalls || null,
          upvotes: null,
          downvotes: null,
          sequenceId: streamMsg.sequenceId ?? null,
          sequenceIndex: streamMsg.sequenceIndex ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        // Check if we need to update the message
        const needsUpdate =
          existingMsg.content !== streamMsg.content ||
          existingMsg.tokens !== (streamMsg.totalTokens || null) ||
          JSON.stringify(existingMsg.toolCalls) !==
            JSON.stringify(streamMsg.toolCalls || null);

        if (needsUpdate) {
          updateMessage(streamMsg.messageId, {
            content: streamMsg.content,
            tokens: streamMsg.totalTokens || null,
            toolCalls: streamMsg.toolCalls || null,
            errorType: streamMsg.error
              ? t("app.api.v1.core.agent.chat.aiStream.errorTypes.streamError")
              : null,
            errorMessage: streamMsg.error || null,
          });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamingMessages, t]);

  // Sync streaming threads to chat store
  useEffect(() => {
    Object.values(streamThreads).forEach((streamThread) => {
      const existingThread = chatThreads[streamThread.threadId];
      if (!existingThread) {
        addThread({
          id: streamThread.threadId,
          userId: "",
          title: streamThread.title,
          rootFolderId: streamThread.rootFolderId,
          folderId: streamThread.subFolderId,
          status: "active",
          defaultModel: null,
          defaultPersona: null,
          systemPrompt: null,
          pinned: false,
          archived: false,
          tags: [],
          preview: null,
          createdAt: streamThread.createdAt,
          updatedAt: streamThread.createdAt,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamThreads]);
}
