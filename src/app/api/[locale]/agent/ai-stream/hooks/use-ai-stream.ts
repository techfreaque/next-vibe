/**
 * AI Stream Hooks
 * Client-side hooks for AI streaming operations using SSE
 * NO Vercel AI SDK - custom implementation with 100% type safety
 */

import { parseError } from "next-vibe/shared/utils";
import { toast } from "next-vibe-ui/hooks/use-toast";
import { useCallback, useRef } from "react";

import type {
  EndpointLogger,
  LoggerMetadata,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { ChatMessageRole } from "../../chat/enum";
import { useChatStore } from "../../chat/hooks/store";
import type { AiStreamPostRequestOutput } from "../definition";
import {
  type AudioChunkEventData,
  type ContentDeltaEventData,
  type ContentDoneEventData,
  type CreditsDeductedEventData,
  type ErrorEventData,
  type FilesUploadedEventData,
  type MessageCreatedEventData,
  parseSSEEvent,
  type ReasoningDeltaEventData,
  type ReasoningDoneEventData,
  StreamEventType,
  type ToolCallEventData,
  type ToolResultEventData,
  type ToolWaitingEventData,
  type VoiceTranscribedEventData,
} from "../events";
import { getAudioQueue } from "./audio-queue";
import type { StreamingMessage, StreamingThread } from "./store";
import { useAIStreamStore } from "./store";

/**
 * SSE Stream Options
 */
export interface StreamOptions {
  onMessageCreated?: (data: MessageCreatedEventData) => void;
  onContentDelta?: (data: ContentDeltaEventData) => void;
  onContentDone?: (data: ContentDoneEventData) => void;
  onToolCall?: (data: ToolCallEventData) => void;
  onToolWaiting?: (data: ToolWaitingEventData) => void;
  onToolResult?: (data: ToolResultEventData) => void;
  onCreditsDeducted?: (data: CreditsDeductedEventData) => void;
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

  logger.debug("[MESSAGE_CREATED] Event received", {
    messageId: eventData.messageId,
    role: eventData.role,
    hasToolCall: !!eventData.toolCall,
  });

  const toolCall = eventData.toolCall;

  store.addMessage({
    messageId: eventData.messageId,
    threadId: eventData.threadId,
    role: eventData.role,
    content: eventData.content || "",
    parentId: eventData.parentId,
    depth: eventData.depth,
    model: eventData.model,
    character: eventData.character,
    isStreaming: eventData.role === ChatMessageRole.ASSISTANT,
    sequenceId: eventData.sequenceId,
    toolCall,
  });

  const streamThread = useAIStreamStore.getState().threads[eventData.threadId];
  const isIncognitoFromStream = streamThread?.rootFolderId === "incognito";

  void (async (): Promise<void> => {
    try {
      const { useChatStore } = await import("../../chat/hooks/store");
      const chatThread = useChatStore.getState().threads[eventData.threadId];
      const isIncognito =
        isIncognitoFromStream || chatThread?.rootFolderId === "incognito";

      // CRITICAL: Always add TOOL and ASSISTANT messages to chat store (both incognito and non-incognito)
      // - TOOL messages: allows TOOL_RESULT events to update them later
      // - ASSISTANT messages: needed for real-time streaming display (maintains parent chain)
      const shouldAddToStore =
        isIncognito ||
        eventData.role === ChatMessageRole.TOOL ||
        eventData.role === ChatMessageRole.ASSISTANT;

      if (shouldAddToStore) {
        // Check if message already exists (created client-side for incognito text mode)
        const existingMessage =
          useChatStore.getState().messages[eventData.messageId];
        if (existingMessage) {
          logger.debug(
            "[MESSAGE_CREATED] Message already exists, skipping (client-side created)",
            {
              messageId: eventData.messageId,
              role: eventData.role,
            },
          );
          return; // Skip - message was created client-side
        }

        logger.debug("[MESSAGE_CREATED] Saving to chat store", {
          messageId: eventData.messageId,
          role: eventData.role,
          hasToolCall: !!toolCall,
          isIncognito,
          isTool: eventData.role === ChatMessageRole.TOOL,
        });

        useChatStore.getState().addMessage({
          id: eventData.messageId,
          threadId: eventData.threadId,
          role: eventData.role,
          content: eventData.content || "",
          parentId: eventData.parentId,
          depth: eventData.depth,
          sequenceId: eventData.sequenceId ?? null,
          authorId: isIncognito ? "incognito" : "system", // Use "system" for non-incognito TOOL messages
          authorName: null,
          authorAvatar: null,
          authorColor: null,
          isAI:
            eventData.role === ChatMessageRole.ASSISTANT ||
            eventData.role === ChatMessageRole.TOOL,
          model: eventData.model ?? null,
          character: eventData.character ?? null,
          errorType:
            eventData.role === ChatMessageRole.ERROR ? "STREAM_ERROR" : null,
          errorMessage:
            eventData.role === ChatMessageRole.ERROR ? eventData.content : null,
          errorCode: null,
          edited: false,
          originalId: null,
          tokens: null,
          metadata: {
            ...(eventData.metadata || {}),
            ...(toolCall ? { toolCall } : {}),
          },
          upvotes: 0,
          downvotes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          searchVector: null,
        });

        // Only save to localStorage for incognito mode
        if (isIncognito) {
          void import("../../chat/incognito/storage")
            .then(({ saveMessage }) => {
              logger.debug("[MESSAGE_CREATED] Saving to localStorage", {
                messageId: eventData.messageId,
                role: eventData.role,
                hasToolCall: !!toolCall,
              });

              saveMessage({
                id: eventData.messageId,
                threadId: eventData.threadId,
                role: eventData.role,
                content: eventData.content || "",
                parentId: eventData.parentId,
                depth: eventData.depth,
                sequenceId: eventData.sequenceId ?? null,
                authorId: "incognito",
                authorName: null,
                authorAvatar: null, // Incognito has no avatar
                authorColor: null, // Incognito has no color
                isAI:
                  eventData.role === ChatMessageRole.ASSISTANT ||
                  eventData.role === ChatMessageRole.TOOL,
                model: eventData.model ?? null,
                character: eventData.character ?? null,
                errorType:
                  eventData.role === ChatMessageRole.ERROR
                    ? "STREAM_ERROR"
                    : null,
                errorMessage:
                  eventData.role === ChatMessageRole.ERROR
                    ? eventData.content
                    : null,
                errorCode: null,
                edited: false,
                originalId: null,
                tokens: null,
                metadata: eventData.metadata
                  ? { ...eventData.metadata, ...(toolCall ? { toolCall } : {}) }
                  : toolCall
                    ? { toolCall }
                    : {},
                upvotes: 0,
                downvotes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                searchVector: null,
              });
              return undefined;
            })
            .catch((error: Error) => {
              logger.error("Failed to save incognito message", {
                error,
              });
            });
        }
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

      // Reset audio queue to prevent old audio from playing
      const audioQueue = getAudioQueue();
      audioQueue.stop();

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Generate stream ID
      const streamId = crypto.randomUUID();
      store.startStream(streamId);

      try {
        // Make fetch request
        logger.info("Making AI stream request", {
          operation: data.operation,
          model: data.model,
          hasAudioInput: !!data.audioInput?.file,
          messageHistoryLength: data.messageHistory?.length ?? 0,
        });

        // Determine if we need FormData (when there's a file to upload)
        const hasAudioFile = data.audioInput?.file instanceof File;
        const hasAttachments = data.attachments && data.attachments.length > 0;
        const hasFileUpload = hasAudioFile || hasAttachments;

        let requestBody: BodyInit;
        let headers: HeadersInit;

        if (hasFileUpload) {
          // Use FormData for file uploads
          const formData = new FormData();

          // Add all non-file fields as JSON in a 'data' field
          const { audioInput, attachments, ...restData } = data;
          formData.append(
            "data",
            JSON.stringify({
              ...restData,
              audioInput: { file: null },
              attachments: null,
            }),
          );

          // Add the audio file
          if (audioInput?.file) {
            formData.append(
              "audioInput.file",
              audioInput.file,
              audioInput.file.name,
            );
          }

          // Add attachment files
          if (attachments) {
            for (const attachment of attachments) {
              if (attachment instanceof File) {
                formData.append("attachments", attachment, attachment.name);
              }
            }
          }

          requestBody = formData;
          headers = {}; // Let browser set Content-Type with boundary
        } else {
          // Use JSON for regular requests
          requestBody = JSON.stringify(data);
          headers = { "Content-Type": "application/json" };
        }

        const response = await fetch(`/api/${locale}/agent/ai-stream`, {
          method: "POST",
          headers,
          body: requestBody,
          signal: options.signal || abortController.signal,
        });

        logger.info("Received response", {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
        });

        if (!response.ok) {
          logger.error("RESPONSE NOT OK - STATUS:", {
            status: response.status,
          });
          let errorMessage = `HTTP ${response.status}`;
          let errorCode: string | null = null;
          try {
            const errorData = (await response.json()) as {
              message?: string;
              errorMessage?: string;
              error?: { message?: string };
              status?: number;
            };

            logger.error("ERROR DATA RECEIVED", { errorData });

            // DEBUG: Log the full error response
            logger.error("ERROR RESPONSE DATA", {
              fullErrorData: errorData,
              keys:
                errorData && typeof errorData === "object"
                  ? Object.keys(errorData)
                  : [],
            });

            // Extract user-friendly error message from API response
            errorMessage =
              errorData.message ??
              errorData.errorMessage ??
              errorData.error?.message ??
              errorMessage;
            errorCode =
              errorData.status?.toString() ?? response.status.toString();
          } catch (parseError) {
            logger.error("Failed to parse error JSON", {
              parseError:
                parseError instanceof Error
                  ? parseError.message
                  : String(parseError),
            });
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
            errorCode,
          });

          store.setError(errorMessage);

          // Show persistent toast notification for stream errors
          // The errorMessage from the server is already a translation key, just use t()
          toast({
            title: t("app.api.agent.chat.aiStream.error.title"),
            description: t(errorMessage as Parameters<typeof t>[0]),
            variant: "destructive",
            duration: Infinity, // Never auto-dismiss
          });

          store.stopStream();
          return;
        }

        if (!response.body) {
          const errorMessage = t(
            "app.api.agent.chat.aiStream.route.errors.noResponseBody",
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

            // Parse SSE event
            const event = parseSSEEvent(eventString);
            if (!event) {
              logger.warn("Failed to parse SSE event", { eventString });
              continue;
            }

            // Handle event based on type
            switch (event.type) {
              case StreamEventType.MESSAGE_CREATED: {
                handleMessageCreatedEvent({
                  eventData: event.data as MessageCreatedEventData,
                  store,
                  logger,
                  onMessageCreated: options.onMessageCreated,
                });
                break;
              }

              case StreamEventType.VOICE_TRANSCRIBED: {
                const eventData = event.data as VoiceTranscribedEventData;
                logger.debug(
                  "[VOICE_TRANSCRIBED] Updating message with transcription",
                  {
                    messageId: eventData.messageId,
                    text: eventData.text.slice(0, 50),
                  },
                );

                // Update the user message with transcribed text
                // Preserve existing metadata (like attachments) while removing isTranscribing flag
                const currentMessage =
                  useChatStore.getState().messages[eventData.messageId];
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { isTranscribing, ...preservedMetadata } =
                  currentMessage?.metadata ?? {};

                useChatStore.getState().updateMessage(eventData.messageId, {
                  content: eventData.text,
                  metadata: preservedMetadata,
                });
                break;
              }

              case StreamEventType.FILES_UPLOADED: {
                const eventData = event.data as FilesUploadedEventData;
                logger.debug(
                  "[FILES_UPLOADED] Updating message with attachment metadata",
                  {
                    messageId: eventData.messageId,
                    attachmentCount: eventData.attachments.length,
                  },
                );

                // Update the user message with uploaded attachment metadata
                // Remove isUploadingAttachments flag and add actual attachment data
                const currentMessage =
                  useChatStore.getState().messages[eventData.messageId];
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { isUploadingAttachments, ...preservedMetadata } =
                  currentMessage?.metadata ?? {};

                useChatStore.getState().updateMessage(eventData.messageId, {
                  metadata: {
                    ...preservedMetadata,
                    attachments: eventData.attachments,
                  },
                });

                logger.info(
                  "[FILES_UPLOADED] Message updated with attachments",
                  {
                    messageId: eventData.messageId,
                    attachmentCount: eventData.attachments.length,
                  },
                );
                break;
              }

              case StreamEventType.CONTENT_DELTA: {
                const eventData = event.data as ContentDeltaEventData;
                // Get fresh state from store to avoid stale closure
                let currentMessage =
                  useAIStreamStore.getState().streamingMessages[
                    eventData.messageId
                  ];

                // If message doesn't exist yet, create it (race condition fix)
                if (!currentMessage) {
                  // Create a placeholder message
                  store.addMessage({
                    messageId: eventData.messageId,
                    threadId: data.threadId || "",
                    role: ChatMessageRole.ASSISTANT,
                    content: "",
                    parentId: null,
                    depth: 0,
                    model: null,
                    character: null,
                    isStreaming: true,
                    sequenceId: null,
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
                      const { useChatStore } =
                        await import("../../chat/hooks/store");
                      const chatThread =
                        useChatStore.getState().threads[
                          currentMessage.threadId
                        ];
                      const isIncognito =
                        chatThread?.rootFolderId === "incognito";

                      if (isIncognito) {
                        const { saveMessage } =
                          await import("../../chat/incognito/storage");
                        saveMessage({
                          id: eventData.messageId,
                          threadId: currentMessage.threadId,
                          role: currentMessage.role,
                          content: newContent,
                          parentId: currentMessage.parentId,
                          depth: currentMessage.depth,
                          sequenceId: currentMessage.sequenceId ?? null,
                          authorId: "incognito",
                          authorName: null,
                          authorAvatar: null, // Incognito has no avatar
                          authorColor: null, // Incognito has no color
                          isAI:
                            currentMessage.role === ChatMessageRole.ASSISTANT,
                          model: currentMessage.model ?? null,
                          character: currentMessage.character ?? null,
                          errorType: null,
                          errorMessage: null,
                          errorCode: null,
                          edited: false,
                          originalId: null,
                          tokens: currentMessage.totalTokens ?? null,
                          metadata: {},
                          upvotes: 0,
                          downvotes: 0,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                          searchVector: null,
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
                      const { useChatStore } =
                        await import("../../chat/hooks/store");
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
                          const { saveMessage } =
                            await import("../../chat/incognito/storage");
                          saveMessage({
                            id: eventData.messageId,
                            threadId: currentMessage.threadId,
                            role: currentMessage.role,
                            content: newContent,
                            parentId: currentMessage.parentId,
                            depth: currentMessage.depth,
                            sequenceId: currentMessage.sequenceId ?? null,
                            authorId: "incognito",
                            authorName: null,
                            authorAvatar: null, // Incognito has no avatar
                            authorColor: null, // Incognito has no color
                            isAI:
                              currentMessage.role === ChatMessageRole.ASSISTANT,
                            model: currentMessage.model ?? null,
                            character: currentMessage.character ?? null,
                            errorType: null,
                            errorMessage: null,
                            errorCode: null,
                            edited: false,
                            originalId: null,
                            tokens: currentMessage.totalTokens ?? null,
                            metadata: {},
                            upvotes: 0,
                            downvotes: 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            searchVector: null,
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
                      const { useChatStore } =
                        await import("../../chat/hooks/store");
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
                const eventData = event.data as ToolCallEventData;
                logger.debug("Tool call event received", {
                  messageId: eventData.messageId,
                  toolName: eventData.toolName,
                });

                options.onToolCall?.(eventData);
                break;
              }

              case StreamEventType.TOOL_WAITING: {
                // Tool requires user confirmation before execution
                const eventData = event.data as ToolWaitingEventData;
                logger.info("Tool waiting for confirmation - stream paused", {
                  messageId: eventData.messageId,
                  toolName: eventData.toolName,
                  toolCallId: eventData.toolCallId,
                });

                options.onToolWaiting?.(eventData);
                break;
              }

              case StreamEventType.TOOL_RESULT: {
                // NEW ARCHITECTURE: Update TOOL message with result data
                const eventData = event.data as ToolResultEventData;
                logger.info(
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
                if (eventData.toolCall) {
                  // Store toolCall in const to avoid TypeScript narrowing issues in Promise chains
                  const toolCall = eventData.toolCall;

                  // Update stream store with toolCall result
                  store.setToolCall(eventData.messageId, toolCall);

                  // CRITICAL FIX: Update chat store for BOTH incognito AND non-incognito threads
                  // The UI reads from chat store, so we MUST update it regardless of incognito status
                  const currentMessage =
                    useAIStreamStore.getState().streamingMessages[
                      eventData.messageId
                    ];
                  const streamThread = currentMessage
                    ? useAIStreamStore.getState().threads[
                        currentMessage.threadId
                      ]
                    : null;
                  const isIncognitoFromStream =
                    streamThread?.rootFolderId === "incognito";

                  logger.info("Updating tool result in chat store", {
                    messageId: eventData.messageId,
                    isIncognito: isIncognitoFromStream,
                  });

                  void import("../../chat/hooks/store")
                    .then(({ useChatStore }) => {
                      // Check if message exists in chat store before updating
                      const chatMessage =
                        useChatStore.getState().messages[eventData.messageId];

                      if (chatMessage) {
                        // Update chat store with tool result (works for both incognito and non-incognito)
                        useChatStore
                          .getState()
                          .updateMessage(eventData.messageId, {
                            metadata: { toolCall },
                          });

                        logger.info("Tool result updated in chat store", {
                          messageId: eventData.messageId,
                          hasResult: !!toolCall.result,
                          hasError: !!toolCall.error,
                        });
                      } else {
                        logger.warn(
                          "Tool result event: message not in chat store (will be loaded from DB)",
                          {
                            messageId: eventData.messageId,
                            hasResult: !!toolCall.result,
                            hasError: !!toolCall.error,
                          },
                        );
                      }

                      // Also update localStorage for incognito mode
                      if (isIncognitoFromStream) {
                        return import("../../chat/incognito/storage").then(
                          ({ saveMessage }) => {
                            const chatMessage =
                              useChatStore.getState().messages[
                                eventData.messageId
                              ];
                            if (chatMessage) {
                              saveMessage(chatMessage);
                            }
                            return undefined;
                          },
                        );
                      }
                      return undefined;
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

                  logger.info("Tool result event processing complete", {
                    messageId: eventData.messageId,
                    hasResult: !!eventData.toolCall.result,
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
                      const { useChatStore } =
                        await import("../../chat/hooks/store");
                      const chatThread =
                        useChatStore.getState().threads[message.threadId];
                      const isIncognito =
                        isIncognitoFromStream ||
                        chatThread?.rootFolderId === "incognito";

                      if (isIncognito) {
                        // Save to localStorage
                        try {
                          const { saveMessage } =
                            await import("../../chat/incognito/storage");
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
                            character: message.character ?? null,
                            errorType: null,
                            errorMessage: null,
                            errorCode: null,
                            edited: false,
                            originalId: null,
                            tokens: eventData.totalTokens ?? null,
                            metadata: {},
                            upvotes: 0,
                            downvotes: 0,
                            sequenceId: message.sequenceId ?? null,
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
                          });
                      }
                    } catch (error) {
                      logger.error(
                        "Failed to check chat store for incognito thread",
                        {
                          error: parseError(error).message,
                        },
                      );
                    }
                  })();
                }

                // Call the onContentDone callback for credit deduction (only once!)
                options.onContentDone?.(eventData);
                break;
              }

              case StreamEventType.AUDIO_CHUNK: {
                const eventData = event.data as AudioChunkEventData;
                logger.debug("[AUDIO_CHUNK] Received", {
                  messageId: eventData.messageId,
                  chunkIndex: eventData.chunkIndex,
                  isFinal: eventData.isFinal,
                  textLength: eventData.text.length,
                  callModeEnabled: data.voiceMode?.enabled,
                });

                // Only queue audio for auto-playback if call mode is enabled
                // Otherwise TTS is generated but not played (user can manually play)
                if (
                  eventData.audioData &&
                  !eventData.isFinal &&
                  data.voiceMode?.enabled
                ) {
                  const audioQueue = getAudioQueue();
                  audioQueue.enqueue(eventData.audioData, eventData.chunkIndex);
                  logger.debug(
                    "[AUDIO_CHUNK] Queued for playback (call mode)",
                    {
                      chunkIndex: eventData.chunkIndex,
                    },
                  );
                }
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
                        sequenceId: null,
                        authorId: "system",
                        authorName: null,
                        authorAvatar: null,
                        authorColor: null,
                        isAI: false,
                        model: null,
                        character: null,
                        errorType: eventData.code ?? "STREAM_ERROR",
                        errorMessage: eventData.message,
                        errorCode: eventData.code ?? null,
                        edited: false,
                        originalId: null,
                        tokens: null,
                        metadata: {},
                        upvotes: 0,
                        downvotes: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        searchVector: null,
                      });

                      logger.info("Created ERROR message in chat", {
                        messageId: errorMessageId,
                        threadId: activeThreadId,
                        error: eventData.message,
                      });
                      return undefined;
                    })
                    .catch((error: Error) => {
                      logger.error("Failed to create error message in chat", {
                        error: parseError(error).message,
                      });
                    });
                }

                options.onError?.(eventData);
                break;
              }

              case StreamEventType.CREDITS_DEDUCTED: {
                const eventData = event.data as CreditsDeductedEventData;
                logger.debug("[CREDITS_DEDUCTED] Event received", {
                  amount: eventData.amount,
                  feature: eventData.feature,
                  type: eventData.type,
                  partial: eventData.partial,
                });

                // Call the callback to trigger optimistic credit update
                options.onCreditsDeducted?.(eventData);
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
            logger.info("Stream aborted by user - finalizing messages");
            // Finalize any streaming messages that are still in progress
            const streamingMessages = store.streamingMessages;
            Object.values(streamingMessages).forEach((msg) => {
              if (msg.isStreaming) {
                store.finalizeMessage(
                  msg.messageId,
                  msg.content,
                  msg.totalTokens,
                  "stop", // User stopped generation
                );
              }
            });
          } else {
            logger.error("Stream error", { error: error.message });
            store.setError(error.message);
            // Don't create error messages as chat messages - they're displayed in the global error banner
          }
        }
        store.stopStream();
      } finally {
        abortControllerRef.current = null;
      }
    },
    [locale, logger, store, t],
  );

  /**
   * Stop the current stream
   */
  const stopStream = useCallback(() => {
    logger.info("Stop stream requested by user");

    // Finalize any streaming messages immediately for UI feedback
    const streamingMessages = store.streamingMessages;
    Object.values(streamingMessages).forEach((msg) => {
      if (msg.isStreaming) {
        store.finalizeMessage(
          msg.messageId,
          msg.content,
          msg.totalTokens,
          "stop", // User stopped generation
        );
      }
    });

    // Abort the fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    store.stopStream();
  }, [store, logger]);

  return {
    startStream,
    stopStream,
    isStreaming: store.isStreaming,
    error: store.error,
    streamingMessages: store.streamingMessages,
    threads: store.threads,
  };
}
