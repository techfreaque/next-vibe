"use client";

/**
 * Streaming Messages Store
 *
 * Manages the in-flight content of messages being streamed.
 * Colocated with messages because this IS message state:
 * partial content, tool calls, token counts, reasoning text.
 *
 * The ai-stream module only tracks lifecycle (which threads are
 * streaming, local vs remote, draining). It never touches content.
 */

import { create } from "zustand";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";

import type { ToolCall } from "../../../../db";
import type { ChatMessageRole } from "../../../../enum";

/**
 * Streaming message state — a partial message being assembled from WS deltas.
 */
export interface StreamingMessage {
  messageId: string;
  threadId: string;
  role: ChatMessageRole;
  content: string;
  reasoning?: string;
  parentId: string | null;
  model: ModelId | null;
  character: string | null;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  finishReason?: string | null;
  creditCost?: number;
  isStreaming: boolean;
  error?: string;
  toolCall?: ToolCall;
  sequenceId?: string | null;

  // Compacting metadata
  isCompacting?: boolean;
  compactedMessageCount?: number;
}

interface StreamingMessagesState {
  streamingMessages: Record<string, StreamingMessage>;

  // Actions
  addMessage: (message: StreamingMessage) => void;
  updateMessageContent: (messageId: string, content: string) => void;
  setToolCall: (messageId: string, toolCall: ToolCall) => void;
  updateTokens: (
    messageId: string,
    promptTokens: number,
    completionTokens: number,
    totalTokens: number,
    creditCost: number,
    finishReason: string | null,
  ) => void;
  finalizeMessage: (
    messageId: string,
    content: string,
    totalTokens?: number | null,
    finishReason?: string | null,
  ) => void;
  setMessageError: (messageId: string, error: string) => void;
  reset: () => void;
}

export const useStreamingMessagesStore = create<StreamingMessagesState>(
  (set, get) => ({
    streamingMessages: {},

    addMessage: (message: StreamingMessage): void =>
      set((state) => ({
        streamingMessages: {
          ...state.streamingMessages,
          [message.messageId]: message,
        },
      })),

    updateMessageContent: (messageId: string, content: string): void =>
      set((state) => {
        const message = state.streamingMessages[messageId];
        if (!message) {
          return state;
        }
        return {
          streamingMessages: {
            ...state.streamingMessages,
            [messageId]: { ...message, content },
          },
        };
      }),

    setToolCall: (messageId: string, toolCall: ToolCall): void =>
      set((state) => {
        const message = state.streamingMessages[messageId];
        if (!message) {
          return state;
        }
        return {
          streamingMessages: {
            ...state.streamingMessages,
            [messageId]: { ...message, toolCall },
          },
        };
      }),

    updateTokens: (
      messageId: string,
      promptTokens: number,
      completionTokens: number,
      totalTokens: number,
      creditCost: number,
      finishReason: string | null,
    ): void =>
      set((state) => {
        const message = state.streamingMessages[messageId];
        if (!message) {
          return state;
        }
        return {
          streamingMessages: {
            ...state.streamingMessages,
            [messageId]: {
              ...message,
              promptTokens,
              completionTokens,
              totalTokens,
              creditCost,
              finishReason,
            },
          },
        };
      }),

    finalizeMessage: (
      messageId: string,
      content: string,
      totalTokens?: number | null,
      finishReason?: string | null,
    ): void =>
      set((state) => {
        const message = state.streamingMessages[messageId];
        if (!message) {
          return state;
        }
        return {
          streamingMessages: {
            ...state.streamingMessages,
            [messageId]: {
              ...message,
              content,
              totalTokens: totalTokens ?? undefined,
              finishReason,
              isStreaming: false,
            },
          },
        };
      }),

    setMessageError: (messageId: string, error: string): void =>
      set((state) => {
        const message = state.streamingMessages[messageId];
        if (!message) {
          return state;
        }
        return {
          streamingMessages: {
            ...state.streamingMessages,
            [messageId]: { ...message, error, isStreaming: false },
          },
        };
      }),

    reset: (): void => set({ streamingMessages: {} }),

    // Selector helper — not stored, computed inline
    getMessage: (messageId: string): StreamingMessage | undefined =>
      get().streamingMessages[messageId],
  }),
);
