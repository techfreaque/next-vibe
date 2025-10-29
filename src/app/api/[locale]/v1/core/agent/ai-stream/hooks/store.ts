/**
 * Zustand store for AI streaming state
 * Manages streaming messages, threads, and UI state
 */

import { create } from "zustand";

import type { DefaultFolderId } from "../../chat/config";
import type { ToolCall, ToolCallResult } from "../../chat/db";
import type { ChatMessageRole } from "../../chat/enum";
import type { ModelId } from "../../chat/model-access/models";

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
  model?: ModelId | null;
  persona?: string | null;
  totalTokens?: number;
  finishReason?: string | null;
  isStreaming: boolean;
  error?: string;
  toolCalls?: ToolCall[];
  sequenceId?: string | null; // Links messages in the same AI response sequence
  sequenceIndex?: number; // Order within sequence
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
  error: string | null;

  // Actions
  startStream: (streamId: string) => void;
  stopStream: () => void;

  // Thread actions
  addThread: (thread: StreamingThread) => void;

  // Message actions
  addMessage: (message: StreamingMessage) => void;
  updateMessageContent: (messageId: string, content: string) => void;
  addToolCall: (messageId: string, toolCall: ToolCall) => void;
  updateToolCallResult: (
    messageId: string,
    toolCallIndex: number,
    result: ToolCallResult,
  ) => void;
  finalizeMessage: (
    messageId: string,
    content: string,
    totalTokens?: number | null,
    finishReason?: string | null,
  ) => void;
  setMessageError: (messageId: string, error: string) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

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
  error: null,

  // Stream control
  startStream: (streamId: string): void =>
    set({
      activeStreamId: streamId,
      isStreaming: true,
      error: null,
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

  addToolCall: (messageId: string, toolCall: ToolCall): void =>
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
            toolCalls: [...(message.toolCalls || []), toolCall],
          },
        },
      };
    }),

  updateToolCallResult: (
    messageId: string,
    toolCallIndex: number,
    result: ToolCallResult,
  ): void =>
    set((state) => {
      const message = state.streamingMessages[messageId];
      if (!message?.toolCalls?.[toolCallIndex]) {
        return state;
      }

      const updatedToolCalls = [...message.toolCalls];
      updatedToolCalls[toolCallIndex] = {
        ...updatedToolCalls[toolCallIndex],
        result,
      };

      return {
        streamingMessages: {
          ...state.streamingMessages,
          [messageId]: {
            ...message,
            toolCalls: updatedToolCalls,
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
        error,
      };
    }),

  // Error handling
  setError: (error: string | null): void =>
    set({
      error,
      isStreaming: false,
    }),

  clearError: (): void =>
    set({
      error: null,
    }),

  // Reset
  reset: (): void =>
    set({
      activeStreamId: null,
      streamingMessages: {},
      threads: {},
      isStreaming: false,
      error: null,
    }),
}));
