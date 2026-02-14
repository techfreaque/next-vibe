/**
 * Zustand store for AI streaming state
 * Manages streaming messages, threads, and UI state
 */

import { create } from "zustand";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";

import type { DefaultFolderId } from "../../chat/config";
import type { ToolCall } from "../../chat/db";
import type { ChatMessageRole } from "../../chat/enum";

/**
 * Streaming message state
 */
export interface StreamingMessage {
  messageId: string;
  threadId: string;
  role: ChatMessageRole;
  content: string;
  reasoning?: string; // Reasoning/thinking content (o1-style models)
  parentId: string | null;
  depth: number;
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
  sequenceId?: string | null; // Links messages in the same AI response sequence

  // Compacting metadata
  isCompacting?: boolean;
  compactedMessageCount?: number;
}

/**
 * Thread state
 */
export interface StreamingThread {
  threadId: string;
  title: string;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  createdAt: Date;
}

/**
 * AI Stream Store State
 */
interface AIStreamState {
  // Streaming state
  activeStreamId: string | null;
  streamingMessages: Record<string, StreamingMessage>;
  threads: Record<string, StreamingThread>;

  // UI state
  isStreaming: boolean;

  // Actions
  startStream: (streamId: string) => void;
  stopStream: () => void;

  // Thread actions
  addThread: (thread: StreamingThread) => void;

  // Message actions
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

  // Reset
  reset: () => void;
}

/**
 * Create AI Stream Store
 */
export const useAIStreamStore = create<AIStreamState>((set) => ({
  // Initial state
  activeStreamId: null,
  streamingMessages: {},
  threads: {},
  isStreaming: false,

  // Stream control
  startStream: (streamId: string): void =>
    set({
      activeStreamId: streamId,
      isStreaming: true,
    }),

  stopStream: (): void =>
    set({
      activeStreamId: null,
      isStreaming: false,
    }),

  // Thread actions
  addThread: (thread: StreamingThread): void =>
    set((state) => ({
      threads: {
        ...state.threads,
        [thread.threadId]: thread,
      },
    })),

  // Message actions
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
          [messageId]: {
            ...message,
            content,
          },
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
          [messageId]: {
            ...message,
            toolCall,
          },
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
          [messageId]: {
            ...message,
            error,
            isStreaming: false,
          },
        },
        isStreaming: false,
      };
    }),

  // Reset
  reset: (): void =>
    set({
      activeStreamId: null,
      streamingMessages: {},
      threads: {},
      isStreaming: false,
    }),
}));
