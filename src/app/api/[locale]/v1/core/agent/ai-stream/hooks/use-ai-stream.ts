/**
 * AI Stream Hooks
 * Client-side hooks for AI streaming operations using SSE
 * NO Vercel AI SDK - custom implementation with 100% type safety
 */

import { parseError } from "next-vibe/shared/utils";
import { useCallback, useRef } from "react";

import type {
  EndpointLogger,
  LoggerMetadata,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { ChatMessageRole } from "../../chat/enum";
import type { AiStreamPostRequestOutput } from "../definition";
import {
  type ContentDeltaEventData,
  type ContentDoneEventData,
  type ErrorEventData,
  type MessageCreatedEventData,
  parseSSEEvent,
  type ReasoningDeltaEventData,
  type ReasoningDoneEventData,
  StreamEventType,
  type ThreadCreatedEventData,
  type ToolCallEventData,
  type ToolResultEventData,
} from "../events";
import type { StreamingMessage, StreamingThread } from "./store";
import { useAIStreamStore } from "./store";

/**
 * SSE Stream Options
 */
export interface StreamOptions {
  onThreadCreated?: (data: ThreadCreatedEventData) => void;
  onMessageCreated?: (data: MessageCreatedEventData) => void;
  onContentDelta?: (data: ContentDeltaEventData) => void;
  onContentDone?: (data: ContentDoneEventData) => void;
  onToolCall?: (data: ToolCallEventData) => void;
  onToolResult?: (data: ToolResultEventData) => void;
  onError?: (data: ErrorEventData) => void;
  signal?: AbortSignal;
}

/**
 * Hook return type
 */
export interface UseAIStreamReturn {
  startStream: (
    data: AiStreamPostRequestOutput,
    options?: StreamOptions,
  ) => Promise<void>;
  stopStream: () => void;
  isStreaming: boolean;
  error: string | null;
  streamingMessages: Record<string, StreamingMessage>;
  threads: Record<string, StreamingThread>;
}

/**
 * Handle MESSAGE_CREATED SSE event
 * Adds message to stream store and optionally to chat store for incognito mode
 */
function handleMessageCreatedEvent(params: {
  eventData: MessageCreatedEventData;
  store: {
    addMessage: (message: StreamingMessage) => void;
  };
  logger: EndpointLogger;
  onMessageCreated?: (data: MessageCreatedEventData) => void;
}): void {
  const { eventData, store, logger, onMessageCreated } = params;

  logger.debug("[DEBUG] MESSAGE_CREATED event received", {
    messageId: eventData.messageId,
    role: eventData.role,
    threadId: eventData.threadId,
    content: eventData.content,
    contentType: typeof eventData.content,
    contentLength: eventData.content?.length,
  });

  store.addMessage({
    messageId: eventData.messageId,
    threadId: eventData.threadId,
    role: eventData.role,
    content: eventData.content || "",
    parentId: eventData.parentId,
    depth: eventData.depth,
    model: eventData.model,
    persona: eventData.persona,
    isStreaming: eventData.role === ChatMessageRole.ASSISTANT,
    sequenceId: eventData.sequenceId,
    sequenceIndex: eventData.sequenceIndex,
  });

  const streamThread = useAIStreamStore.getState().threads[eventData.threadId];
  const isIncognitoFromStream = streamThread?.rootFolderId === "incognito";

  logger.info("[DEBUG] Checking incognito status", {
    messageId: eventData.messageId,
    streamThread: streamThread ? "found" : "not found",
    isIncognitoFromStream,
  });

  void (async (): Promise<void> => {
    try {
      const { useChatStore } = await import("../../chat/hooks/store");
      const chatThread = useChatStore.getState().threads[eventData.threadId];
      const isIncognito =
        isIncognitoFromStream || chatThread?.rootFolderId === "incognito";

      logger.info("[DEBUG] Incognito check result", {
        messageId: eventData.messageId,
        chatThread: chatThread ? "found" : "not found",
        isIncognito,
      });

      if (isIncognito) {
        logger.info("[DEBUG] Adding message to chat store", {
          messageId: eventData.messageId,
          role: eventData.role,
          content: eventData.content.substring(0, 50),
        });
        useChatStore.getState().addMessage({
          id: eventData.messageId,
          threadId: eventData.threadId,
          role: eventData.role,
          content: eventData.content || "",
          parentId: eventData.parentId,
          depth: eventData.depth,
          authorId: "incognito",
          authorName: null,
          isAI:
            eventData.role === ChatMessageRole.ASSISTANT ||
            eventData.role === ChatMessageRole.TOOL,
          model: eventData.model ?? null,
          persona: eventData.persona ?? null,
          errorType: null,
          errorMessage: null,
          edited: false,
          tokens: null,
          toolCalls: eventData.toolCalls ?? null,
          upvotes: null,
          downvotes: null,
          sequenceId: eventData.sequenceId ?? null,
          sequenceIndex: eventData.sequenceIndex ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        logger.info("[DEBUG] Message added to chat store", {
          messageId: eventData.messageId,
          totalMessages: Object.keys(useChatStore.getState().messages).length,
        });

        void import("../../chat/incognito/storage")
          .then(({ saveMessage }) => {
            saveMessage({
              id: eventData.messageId,
              threadId: eventData.threadId,
              role: eventData.role,
              content: eventData.content || "",
              parentId: eventData.parentId,
              depth: eventData.depth,
              authorId: "incognito",
              authorName: null,
              isAI:
                eventData.role === ChatMessageRole.ASSISTANT ||
                eventData.role === ChatMessageRole.TOOL,
              model: eventData.model ?? null,
              persona: eventData.persona ?? null,
              errorType: null,
              errorMessage: null,
              edited: false,
              tokens: null,
              toolCalls: eventData.toolCalls ?? null,
              upvotes: null,
              downvotes: null,
              sequenceId: eventData.sequenceId ?? null,
              sequenceIndex: eventData.sequenceIndex ?? 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            return;
          })
          .catch((error: Error) => {
            logger.error("Failed to save incognito message", {
              error,
            });
            return;
          });
      }
    } catch (error) {
      logger.error("Failed to process message creation", parseError(error));
    }
  })();

  onMessageCreated?.(eventData);
}

/**
 * Hook for AI streaming operations
 * Uses fetch + SSE parsing with Zustand state management
 */
export function useAIStream(
  locale: CountryLanguage,
  logger: EndpointLogger,
  t: TFunction,
): UseAIStreamReturn {
  const store = useAIStreamStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Start an AI stream
   */
  const startStream = useCallback(
    async (
      data: AiStreamPostRequestOutput,
      options: StreamOptions = {},
    ): Promise<void> => {
      // Cancel any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Generate stream ID
      const streamId = crypto.randomUUID();
      store.startStream(streamId);

      try {
        // Make fetch request
        const response = await fetch(`/api/${locale}/v1/core/agent/ai-stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          signal: options.signal || abortController.signal,
        });

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData = (await response.json()) as {
              message?: string;
              error?: { message?: string };
            };
            // Extract user-friendly error message from API response
            errorMessage =
              errorData.message ?? errorData.error?.message ?? errorMessage;
          } catch {
            // If JSON parsing fails, try to get text
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
            } catch {
              // Keep default error message
            }
          }

          logger.error("Stream request failed", {
            status: response.status,
            errorMessage,
          });
          store.setError(errorMessage);
          // Don't create error messages as chat messages - they're displayed in the global error banner
          store.stopStream();
          return;
        }

        if (!response.body) {
          const errorMessage = t(
            "app.api.v1.core.agent.chat.aiStream.route.errors.noResponseBody",
          );
          logger.error("Stream response has no body");
          store.setError(errorMessage);
          // Don't create error messages as chat messages - they're displayed in the global error banner
          store.stopStream();
          return;
        }

        // Process SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode chunk
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Process complete events (separated by \n\n)
          const events = buffer.split("\n\n");
          buffer = events.pop() || ""; // Keep incomplete event in buffer

          for (const eventString of events) {
            if (!eventString.trim()) {
              continue;
            }

            // Log raw event string for debugging
            logger.info("[DEBUG] Raw SSE event string", {
              eventString: eventString.substring(0, 200),
            });

            // Parse SSE event
            const event = parseSSEEvent(eventString);
            if (!event) {
              logger.warn("Failed to parse SSE event", { eventString });
              continue;
            }

            // Log all received events for debugging
            logger.info("[DEBUG] SSE event received", {
              type: event.type,
              hasData: Boolean(event.data),
            });

            // Handle event based on type
            switch (event.type) {
              case StreamEventType.THREAD_CREATED: {
                const eventData = event.data as ThreadCreatedEventData;
                logger.info("[DEBUG] THREAD_CREATED event received", {
                  threadId: eventData.threadId,
                  rootFolderId: eventData.rootFolderId,
                });

                store.addThread({
                  threadId: eventData.threadId,
                  title: eventData.title,
                  rootFolderId: eventData.rootFolderId,
                  subFolderId: eventData.subFolderId,
                  createdAt: new Date(),
                });

                // CRITICAL: Do NOT set active thread here
                // The onThreadCreated callback will trigger navigation to the new thread URL
                // The URL sync effect in chat-interface.tsx will then set the active thread
                // based on the new URL. This prevents race conditions where store updates
                // before URL navigation completes, causing the wrong thread to be active.

                // Save to localStorage if incognito mode
                if (eventData.rootFolderId === "incognito") {
                  void import("../../chat/incognito/storage")
                    .then(({ saveThread }) => {
                      saveThread({
                        id: eventData.threadId,
                        userId: "incognito",
                        title: eventData.title,
                        rootFolderId: eventData.rootFolderId,
                        folderId: eventData.subFolderId,
                        status: "active",
                        defaultModel: null,
                        defaultPersona: null,
                        systemPrompt: null,
                        pinned: false,
                        archived: false,
                        tags: [],
                        preview: null,
                        // Incognito threads: everyone has full permissions locally
                        // BUT canManagePermissions is false because permissions don't apply to local-only content
                        canPost: true,
                        canEdit: true,
                        canModerate: true,
                        canDelete: true,
                        canManagePermissions: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      });
                      return;
                    })
                    .catch((error: Error) => {
                      logger.error("Failed to save incognito thread", {
                        error,
                      });
                      return;
                    });
                }

                options.onThreadCreated?.(eventData);
                break;
              }

              case StreamEventType.MESSAGE_CREATED: {
                handleMessageCreatedEvent({
                  eventData: event.data as MessageCreatedEventData,
                  store,
                  logger,
                  onMessageCreated: options.onMessageCreated,
                });
                break;
              }

              case StreamEventType.CONTENT_DELTA: {
                const eventData = event.data as ContentDeltaEventData;
                // Get fresh state from store to avoid stale closure
                let currentMessage =
                  useAIStreamStore.getState().streamingMessages[
                    eventData.messageId
                  ];

                logger.info("[DEBUG] CONTENT_DELTA event received", {
                  messageId: eventData.messageId,
                  delta: eventData.delta,
                  deltaLength: eventData.delta?.length,
                  hasCurrentMessage: Boolean(currentMessage),
                  currentContent: currentMessage?.content,
                  currentContentType: typeof currentMessage?.content,
                });

                // If message doesn't exist yet, create it (race condition fix)
                if (!currentMessage) {
                  logger.warn(
                    "[DEBUG] CONTENT_DELTA received before MESSAGE_CREATED, creating placeholder",
                    {
                      messageId: eventData.messageId,
                    },
                  );

                  // Create a placeholder message
                  store.addMessage({
                    messageId: eventData.messageId,
                    threadId: data.threadId || "",
                    role: ChatMessageRole.ASSISTANT,
                    content: "",
                    parentId: null,
                    depth: 0,
                    model: null,
                    persona: null,
                    isStreaming: true,
                    sequenceId: null,
                    sequenceIndex: 0,
                  });

                  // Get the message we just created
                  currentMessage =
                    useAIStreamStore.getState().streamingMessages[
                      eventData.messageId
                    ];
                }

                if (currentMessage && eventData.delta) {
                  const newContent =
                    (currentMessage.content || "") + eventData.delta;
                  useAIStreamStore
                    .getState()
                    .updateMessageContent(eventData.messageId, newContent);

                  // Save to localStorage incrementally for incognito mode
                  void (async (): Promise<void> => {
                    try {
                      const { useChatStore } = await import(
                        "../../chat/hooks/store"
                      );
                      const chatThread =
                        useChatStore.getState().threads[
                          currentMessage.threadId
                        ];
                      const isIncognito =
                        chatThread?.rootFolderId === "incognito";

                      if (isIncognito) {
                        const { saveMessage } = await import(
                          "../../chat/incognito/storage"
                        );
                        saveMessage({
                          id: eventData.messageId,
                          threadId: currentMessage.threadId,
                          role: currentMessage.role,
                          content: newContent,
                          parentId: currentMessage.parentId,
                          depth: currentMessage.depth,
                          authorId: "incognito",
                          authorName: null,
                          isAI:
                            currentMessage.role === ChatMessageRole.ASSISTANT,
                          model: currentMessage.model ?? null,
                          persona: currentMessage.persona ?? null,
                          errorType: null,
                          errorMessage: null,
                          edited: false,
                          tokens: currentMessage.totalTokens ?? null,
                          toolCalls: currentMessage.toolCalls ?? null,
                          upvotes: null,
                          downvotes: null,
                          sequenceId: currentMessage.sequenceId ?? null,
                          sequenceIndex: currentMessage.sequenceIndex ?? 0,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        });

                        // Also update chat store
                        useChatStore
                          .getState()
                          .updateMessage(eventData.messageId, {
                            content: newContent,
                          });
                      }
                    } catch (error) {
                      logger.error(
                        "Failed to save content delta to localStorage",
                        {
                          error: parseError(error).message,
                        },
                      );
                    }
                  })();
                }
                options.onContentDelta?.(eventData);
                break;
              }

              case StreamEventType.REASONING_DELTA: {
                const eventData = event.data as ReasoningDeltaEventData;
                // Get fresh state from store to avoid stale closure
                const currentMessage =
                  useAIStreamStore.getState().streamingMessages[
                    eventData.messageId
                  ];

                logger.info("[DEBUG] REASONING_DELTA event received", {
                  messageId: eventData.messageId,
                  delta: eventData.delta,
                  deltaLength: eventData.delta?.length,
                  hasCurrentMessage: Boolean(currentMessage),
                });

                if (currentMessage && eventData.delta) {
                  const newContent =
                    (currentMessage.content || "") + eventData.delta;

                  // Update streaming store
                  useAIStreamStore
                    .getState()
                    .updateMessageContent(eventData.messageId, newContent);

                  // Also update chat store and localStorage for incognito mode
                  void (async (): Promise<void> => {
                    try {
                      const { useChatStore } = await import(
                        "../../chat/hooks/store"
                      );
                      const chatMessage =
                        useChatStore.getState().messages[eventData.messageId];

                      if (chatMessage) {
                        useChatStore
                          .getState()
                          .updateMessage(eventData.messageId, {
                            content: newContent,
                          });

                        // Save to localStorage for incognito mode
                        const chatThread =
                          useChatStore.getState().threads[
                            currentMessage.threadId
                          ];
                        const isIncognito =
                          chatThread?.rootFolderId === "incognito";

                        if (isIncognito) {
                          const { saveMessage } = await import(
                            "../../chat/incognito/storage"
                          );
                          saveMessage({
                            id: eventData.messageId,
                            threadId: currentMessage.threadId,
                            role: currentMessage.role,
                            content: newContent,
                            parentId: currentMessage.parentId,
                            depth: currentMessage.depth,
                            authorId: "incognito",
                            authorName: null,
                            isAI:
                              currentMessage.role === ChatMessageRole.ASSISTANT,
                            model: currentMessage.model ?? null,
                            persona: currentMessage.persona ?? null,
                            errorType: null,
                            errorMessage: null,
                            edited: false,
                            tokens: currentMessage.totalTokens ?? null,
                            toolCalls: currentMessage.toolCalls ?? null,
                            upvotes: null,
                            downvotes: null,
                            sequenceId: currentMessage.sequenceId ?? null,
                            sequenceIndex: currentMessage.sequenceIndex ?? 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                          });
                        }
                      }
                    } catch (error) {
                      logger.error(
                        "Failed to update reasoning in chat store",
                        error as LoggerMetadata,
                      );
                    }
                  })();
                }

                break;
              }

              case StreamEventType.REASONING_DONE: {
                const eventData = event.data as ReasoningDoneEventData;
                logger.info("[DEBUG] REASONING_DONE event received", {
                  messageId: eventData.messageId,
                  contentLength: eventData.content?.length,
                });

                // Mark reasoning message as complete
                const currentMessage =
                  useAIStreamStore.getState().streamingMessages[
                    eventData.messageId
                  ];
                if (currentMessage) {
                  // Update streaming store
                  useAIStreamStore
                    .getState()
                    .updateMessageContent(
                      eventData.messageId,
                      eventData.content,
                    );

                  // Also update chat store so reasoning content is persisted
                  void (async (): Promise<void> => {
                    try {
                      const { useChatStore } = await import(
                        "../../chat/hooks/store"
                      );
                      const chatMessage =
                        useChatStore.getState().messages[eventData.messageId];

                      if (chatMessage) {
                        useChatStore
                          .getState()
                          .updateMessage(eventData.messageId, {
                            content: eventData.content,
                          });
                      }
                    } catch (error) {
                      logger.error(
                        "Failed to finalize reasoning in chat store",
                        error as LoggerMetadata,
                      );
                    }
                  })();
                }

                break;
              }

              case StreamEventType.TOOL_CALL: {
                // NEW ARCHITECTURE: Tool calls are separate TOOL messages now
                // TOOL_CALL event is redundant - MESSAGE_CREATED already creates the TOOL message
                // Keep event for backward compatibility but don't process it
                const eventData = event.data as ToolCallEventData;
                logger.debug(
                  "Tool call event received (ignored in new architecture)",
                  {
                    messageId: eventData.messageId,
                    toolName: eventData.toolName,
                  },
                );

                options.onToolCall?.(eventData);
                break;
              }

              case StreamEventType.TOOL_RESULT: {
                // NEW ARCHITECTURE: Update TOOL message with result data
                const eventData = event.data as ToolResultEventData;
                logger.debug(
                  "Tool result event received - updating TOOL message",
                  {
                    messageId: eventData.messageId,
                    toolName: eventData.toolName,
                    hasResult: !!eventData.result,
                    hasError: !!eventData.error,
                    hasToolCall: !!eventData.toolCall,
                  },
                );

                // Update streaming message with tool call result
                const currentMessage =
                  useAIStreamStore.getState().streamingMessages[
                    eventData.messageId
                  ];
                if (currentMessage && eventData.toolCall) {
                  // Update the tool call with result
                  store.updateMessageContent(
                    eventData.messageId,
                    currentMessage.content,
                  );

                  // Update toolCalls array with result
                  const updatedToolCalls = currentMessage.toolCalls?.map(
                    (tc) =>
                      tc.toolName === eventData.toolName
                        ? eventData.toolCall!
                        : tc,
                  ) || [eventData.toolCall];

                  // Update message in stream store
                  useAIStreamStore.setState((state) => ({
                    streamingMessages: {
                      ...state.streamingMessages,
                      [eventData.messageId]: {
                        ...currentMessage,
                        toolCalls: updatedToolCalls,
                      },
                    },
                  }));

                  // Update message in chat store if incognito
                  const streamThread =
                    useAIStreamStore.getState().threads[
                      currentMessage.threadId
                    ];
                  const isIncognitoFromStream =
                    streamThread?.rootFolderId === "incognito";

                  if (isIncognitoFromStream) {
                    void import("../../chat/hooks/store")
                      .then(({ useChatStore }) => {
                        useChatStore
                          .getState()
                          .updateMessage(eventData.messageId, {
                            toolCalls: updatedToolCalls,
                          });

                        // Also update localStorage
                        return import("../../chat/incognito/storage").then(
                          ({ saveMessage }) => {
                            const chatMessage =
                              useChatStore.getState().messages[
                                eventData.messageId
                              ];
                            if (chatMessage) {
                              saveMessage(chatMessage);
                            }
                            return Promise.resolve();
                          },
                        );
                      })
                      .catch((error) => {
                        logger.error(
                          "Failed to update tool result in chat store",
                          {
                            error:
                              error instanceof Error
                                ? error.message
                                : String(error),
                          },
                        );
                      });
                  }

                  logger.debug("Tool result updated in message", {
                    messageId: eventData.messageId,
                    toolCallsCount: updatedToolCalls.length,
                  });
                }

                options.onToolResult?.(eventData);
                break;
              }

              case StreamEventType.CONTENT_DONE: {
                const eventData = event.data as ContentDoneEventData;
                store.finalizeMessage(
                  eventData.messageId,
                  eventData.content,
                  eventData.totalTokens,
                  eventData.finishReason,
                );

                // Update message in localStorage if incognito mode
                const streamState = useAIStreamStore.getState();
                const message =
                  streamState.streamingMessages[eventData.messageId];
                const streamThread = message
                  ? streamState.threads[message.threadId]
                  : null;
                const isIncognitoFromStream =
                  streamThread?.rootFolderId === "incognito";

                // NEW ARCHITECTURE: Tool calls are separate TOOL messages now
                // No need to handle tool calls in CONTENT_DONE

                // Check chat store asynchronously (for existing threads)
                if (message) {
                  void (async (): Promise<void> => {
                    try {
                      const { useChatStore } = await import(
                        "../../chat/hooks/store"
                      );
                      const chatThread =
                        useChatStore.getState().threads[message.threadId];
                      const isIncognito =
                        isIncognitoFromStream ||
                        chatThread?.rootFolderId === "incognito";

                      if (isIncognito) {
                        // Save to localStorage
                        try {
                          const { saveMessage } = await import(
                            "../../chat/incognito/storage"
                          );
                          logger.info("[DEBUG] Saving incognito message", {
                            messageId: message.messageId,
                            contentPreview: eventData.content.substring(0, 50),
                          });
                          const savedMessage = {
                            id: message.messageId,
                            threadId: message.threadId,
                            role: message.role,
                            content: eventData.content,
                            parentId: message.parentId,
                            depth: message.depth,
                            authorId: "incognito",
                            authorName: null,
                            authorAvatar: null,
                            authorColor: null,
                            isAI: message.role === ChatMessageRole.ASSISTANT,
                            model: message.model ?? null,
                            persona: message.persona ?? null,
                            errorType: null,
                            errorMessage: null,
                            errorCode: null,
                            edited: false,
                            originalId: null,
                            tokens: eventData.totalTokens ?? null,
                            toolCalls: null,
                            collapsed: false,
                            metadata: {},
                            upvotes: 0,
                            downvotes: 0,
                            sequenceId: message.sequenceId ?? null,
                            sequenceIndex: message.sequenceIndex ?? 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            searchVector: null,
                          };
                          saveMessage(savedMessage);

                          // Also add to chat store so it appears in the UI immediately
                          useChatStore
                            .getState()
                            .updateMessage(message.messageId, {
                              content: eventData.content,
                              tokens: eventData.totalTokens ?? null,
                              toolCalls: null,
                            });
                        } catch (storageError) {
                          logger.error("Failed to update incognito message", {
                            error: parseError(storageError).message,
                          });
                        }
                      } else {
                        // Non-incognito message - update chat store
                        useChatStore
                          .getState()
                          .updateMessage(message.messageId, {
                            content: eventData.content,
                            tokens: eventData.totalTokens,
                            toolCalls: null,
                          });
                      }
                    } catch (error) {
                      logger.error(
                        "Failed to check chat store for incognito thread",
                        { error: parseError(error).message },
                      );
                    }
                  })();
                }

                // Call the onContentDone callback for credit deduction (only once!)
                options.onContentDone?.(eventData);
                break;
              }

              case StreamEventType.ERROR: {
                const eventData = event.data as ErrorEventData;
                store.setError(eventData.message);

                // Create ERROR message in chat so users can see what went wrong
                // Get the current thread ID from the active stream
                const activeThreadId =
                  store.threads[Object.keys(store.threads)[0]]?.threadId;

                if (activeThreadId) {
                  // Import chat store dynamically to avoid circular dependencies
                  void import("../../chat/hooks/store")
                    .then(({ useChatStore }) => {
                      const errorMessageId = crypto.randomUUID();

                      // Add error message to chat store
                      useChatStore.getState().addMessage({
                        id: errorMessageId,
                        threadId: activeThreadId,
                        role: ChatMessageRole.ERROR,
                        content: eventData.message,
                        parentId: null,
                        depth: 0,
                        authorId: "system",
                        authorName: null,
                        isAI: false,
                        model: null,
                        persona: null,
                        errorType: eventData.code ?? "STREAM_ERROR",
                        errorMessage: eventData.message,
                        edited: false,
                        tokens: null,
                        toolCalls: null,
                        upvotes: null,
                        downvotes: null,
                        sequenceId: null,
                        sequenceIndex: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      });

                      logger.info("Created ERROR message in chat", {
                        messageId: errorMessageId,
                        threadId: activeThreadId,
                        error: eventData.message,
                      });
                      return;
                    })
                    .catch((error: Error) => {
                      logger.error("Failed to create error message in chat", {
                        error: parseError(error).message,
                      });
                      return;
                    });
                }

                options.onError?.(eventData);
                break;
              }
            }
          }
        }

        // Stream completed successfully
        store.stopStream();
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            logger.info("Stream aborted");
          } else {
            logger.error("Stream error", { error: error.message });
            store.setError(error.message);
            // Don't create error messages as chat messages - they're displayed in the global error banner
          }
        }
        store.stopStream();
      } finally {
        // eslint-disable-next-line require-atomic-updates
        abortControllerRef.current = null;
      }
    },
    [locale, logger, store, t],
  );

  /**
   * Stop the current stream
   */
  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    store.stopStream();
  }, [store]);

  return {
    startStream,
    stopStream,
    isStreaming: store.isStreaming,
    error: store.error,
    streamingMessages: store.streamingMessages,
    threads: store.threads,
  };
}
