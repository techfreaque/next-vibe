/**
 * AI Stream Hooks
 * Client-side hooks for AI streaming operations using SSE
 * NO Vercel AI SDK - custom implementation with 100% type safety
 */

import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { toast } from "next-vibe-ui/hooks/use-toast";
import { useCallback, useRef } from "react";

import type {
  EndpointLogger,
  LoggerMetadata,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { serializeError } from "../../ai-stream/error-utils";
import { ChatMessageRole } from "../../chat/enum";
import { useChatStore } from "../../chat/hooks/store";
import type { AiStreamPostRequestOutput } from "../definition";
import {
  type AudioChunkEventData,
  type CompactingDeltaEventData,
  type CompactingDoneEventData,
  type ContentDeltaEventData,
  type ContentDoneEventData,
  type CreditsDeductedEventData,
  type FilesUploadedEventData,
  type MessageCreatedEventData,
  parseSSEEvent,
  type ReasoningDeltaEventData,
  type ReasoningDoneEventData,
  StreamEventType,
  type TokensUpdatedEventData,
  type ToolCallEventData,
  type ToolResultEventData,
  type ToolWaitingEventData,
  type VoiceTranscribedEventData,
} from "../events";
import { getAudioQueue } from "./audio-queue";
import type { StreamingMessage, StreamingThread } from "./store";
import { useAIStreamStore } from "./store";

/**
 * Get last message in current branch to use as parent for error messages
 * This ensures errors are attached to the correct branch
 */
function getLastMessageForErrorParent(threadId: string): {
  parentId: string | null;
  depth: number;
} {
  const chatStore = useChatStore.getState();
  const threadMessages = Object.values(chatStore.messages).filter(
    (msg) => msg.threadId === threadId,
  );

  if (threadMessages.length === 0) {
    return { parentId: null, depth: 0 };
  }

  // Get branch indices and find last message in current branch
  const branchIndices = chatStore.getBranchIndices(threadId);

  // Use the thread-builder utility to find the last message in the branch
  // This needs to be a synchronous import since we're in a sync function
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const threadBuilder = require("@/app/[locale]/chat/lib/utils/thread-builder");
  const lastMessage = threadBuilder.getLastMessageInBranch(
    threadMessages,
    branchIndices,
  );

  if (lastMessage) {
    return {
      parentId: lastMessage.id,
      depth: lastMessage.depth + 1,
    };
  }

  // Fallback: use the most recent message
  const fallbackMessage = threadMessages[threadMessages.length - 1];
  return {
    parentId: fallbackMessage.id,
    depth: fallbackMessage.depth + 1,
  };
}

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
  stopStream: (threadId?: string) => void;
  isStreaming: boolean;
  isStreamingThread: (threadId: string) => boolean;
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
    isCompacting: eventData.metadata?.isCompacting,
    compactedMessageCount: eventData.metadata?.compactedMessageCount,
  });

  const streamThread = useAIStreamStore.getState().threads[eventData.threadId];
  const isIncognitoFromStream = streamThread?.rootFolderId === "incognito";

  void (async (): Promise<void> => {
    try {
      const { useChatStore } = await import("../../chat/hooks/store");
      const chatThread = useChatStore.getState().threads[eventData.threadId];
      const isIncognito =
        isIncognitoFromStream || chatThread?.rootFolderId === "incognito";

      const isUserRole = eventData.role === ChatMessageRole.USER;
      const isAssistantOrTool =
        eventData.role === ChatMessageRole.ASSISTANT ||
        eventData.role === ChatMessageRole.TOOL;

      // Always add USER, ASSISTANT, and TOOL messages to chat store.
      // USER: an optimistic entry was added client-side for immediate feedback;
      //       the server's event carries the authoritative parentId/depth so we
      //       replace (updateMessage) the optimistic entry rather than add a duplicate.
      // TOOL: allows TOOL_RESULT events to update them later.
      // ASSISTANT: needed for real-time streaming display.
      // Incognito: also add all messages (they're stored in localStorage).
      const shouldAddToStore = isUserRole || isAssistantOrTool || isIncognito;

      if (shouldAddToStore) {
        logger.debug("[MESSAGE_CREATED] Saving to chat store", {
          messageId: eventData.messageId,
          role: eventData.role,
          hasToolCall: !!toolCall,
          isIncognito,
          isUser: isUserRole,
        });

        const serverMetadata = {
          ...(eventData.metadata || {}),
          ...(toolCall ? { toolCall } : {}),
        };

        // For USER messages: replace the optimistic entry with the server's
        // authoritative parentId/depth. For all others: add fresh.
        const existingOptimistic =
          isUserRole && useChatStore.getState().messages[eventData.messageId];

        if (existingOptimistic) {
          useChatStore.getState().updateMessage(eventData.messageId, {
            parentId: eventData.parentId,
            depth: eventData.depth,
            content: eventData.content || "",
            metadata: serverMetadata,
          });
        } else {
          useChatStore.getState().addMessage({
            id: eventData.messageId,
            threadId: eventData.threadId,
            role: eventData.role,
            content: eventData.content || "",
            parentId: eventData.parentId,
            depth: eventData.depth,
            sequenceId: eventData.sequenceId ?? null,
            authorId: isIncognito ? "incognito" : "system",
            isAI: isAssistantOrTool,
            model: eventData.model ?? null,
            character: eventData.character ?? null,
            errorType:
              eventData.role === ChatMessageRole.ERROR ? "STREAM_ERROR" : null,
            errorMessage:
              eventData.role === ChatMessageRole.ERROR
                ? eventData.content
                : null,
            errorCode: null,
            metadata: serverMetadata,
            upvotes: 0,
            downvotes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            searchVector: null,
          });
        }

        // Save to localStorage for incognito mode — but NOT for USER messages yet.
        // The user message will be saved to localStorage once the AI response
        // MESSAGE_CREATED arrives, confirming the server accepted the request.
        // This prevents saving partial/pending user messages.
        if (isIncognito && !isUserRole) {
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
                isAI: isAssistantOrTool,
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

        // When the first ASSISTANT message arrives in incognito mode,
        // also save the pending user message to localStorage.
        if (isIncognito && eventData.role === ChatMessageRole.ASSISTANT) {
          void (async (): Promise<void> => {
            try {
              const { saveMessage } =
                await import("../../chat/incognito/storage");
              // Find the user message that is the parent of this assistant message
              const userMsg =
                useChatStore.getState().messages[eventData.parentId ?? ""];
              if (userMsg && userMsg.role === ChatMessageRole.USER) {
                saveMessage(userMsg);
                logger.debug(
                  "[MESSAGE_CREATED] Saved pending user message to localStorage",
                  { messageId: userMsg.id },
                );
              }
            } catch (error) {
              logger.error(
                "Failed to save pending user message to localStorage",
                parseError(error),
              );
            }
          })();
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
 * Supports concurrent streams across different threads.
 */
export function useAIStream(
  locale: CountryLanguage,
  logger: EndpointLogger,
  t: TFunction,
): UseAIStreamReturn {
  const store = useAIStreamStore();

  // All refs are Maps keyed by threadId so concurrent streams don't interfere.
  const readerRefs = useRef<
    Map<string, ReadableStreamDefaultReader<Uint8Array>>
  >(new Map());
  const abortControllerRefs = useRef<Map<string, AbortController>>(new Map());
  /**
   * When true for a given threadId the user has requested stop but we are
   * still draining remaining SSE events so DB writes / credit events land.
   * Audio enqueuing and UI streaming updates are suppressed in drain mode.
   */
  const isDrainingRefs = useRef<Map<string, boolean>>(new Map());

  /**
   * Start an AI stream.
   * Only cancels an existing stream for the SAME thread — other threads are unaffected.
   */
  const startStream = useCallback(
    async (
      data: AiStreamPostRequestOutput,
      options: StreamOptions = {},
    ): Promise<void> => {
      const threadId = data.threadId ?? "";

      // Cancel only the existing stream for THIS thread
      const existingReader = readerRefs.current.get(threadId);
      if (existingReader) {
        void existingReader.cancel();
        readerRefs.current.delete(threadId);
      }
      const existingController = abortControllerRefs.current.get(threadId);
      if (existingController) {
        existingController.abort();
        abortControllerRefs.current.delete(threadId);
      }

      // Reset drain flag for new stream on this thread
      isDrainingRefs.current.set(threadId, false);

      // Reset audio queue to prevent old audio from playing
      const audioQueue = getAudioQueue();
      audioQueue.stop();

      // Create new abort controller for this thread
      const abortController = new AbortController();
      abortControllerRefs.current.set(threadId, abortController);

      // Generate stream ID and register in store (per-thread)
      const streamId = crypto.randomUUID();
      store.startStream(threadId, streamId);

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

          // Create ERROR message in chat so users can see what went wrong
          const activeThreadId = data.threadId;

          if (activeThreadId) {
            // Create structured error response
            const errorResponse = fail({
              message: errorMessage as Parameters<typeof fail>[0]["message"],
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });

            // Import chat store dynamically to avoid circular dependencies
            void import("../../chat/hooks/store")
              .then(({ useChatStore }) => {
                const errorMessageId = crypto.randomUUID();
                const { parentId, depth } =
                  getLastMessageForErrorParent(activeThreadId);

                // Add error message to chat store with serialized ErrorResponseType
                useChatStore.getState().addMessage({
                  id: errorMessageId,
                  threadId: activeThreadId,
                  role: ChatMessageRole.ERROR,
                  content: serializeError(errorResponse),
                  parentId,
                  depth,
                  sequenceId: null,
                  authorId: "system",
                  isAI: false,
                  model: null,
                  character: null,
                  errorType: "HTTP_ERROR",
                  errorMessage,
                  errorCode: errorCode ?? null,
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
                  error: errorMessage,
                });
                return undefined;
              })
              .catch((error: Error) => {
                logger.error("Failed to create error message in chat", {
                  error: parseError(error).message,
                });
              });
          }

          // Show persistent toast notification for stream errors
          // The errorMessage from the server is already a translation key, just use t()
          toast({
            title: t("app.api.agent.chat.aiStream.error.title"),
            description: t(errorMessage as Parameters<typeof t>[0]),
            variant: "destructive",
            duration: Infinity, // Never auto-dismiss
          });

          store.stopStream(threadId);
          return;
        }

        if (!response.body) {
          logger.error("Stream response has no body");

          // Create ERROR message in chat so users can see what went wrong
          const activeThreadId = data.threadId;

          if (activeThreadId) {
            const errorResponse = fail({
              message:
                "app.api.agent.chat.aiStream.route.errors.noResponseBody",
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });

            void import("../../chat/hooks/store")
              .then(({ useChatStore }) => {
                const errorMessageId = crypto.randomUUID();
                const { parentId, depth } =
                  getLastMessageForErrorParent(activeThreadId);

                useChatStore.getState().addMessage({
                  id: errorMessageId,
                  threadId: activeThreadId,
                  role: ChatMessageRole.ERROR,
                  content: serializeError(errorResponse),
                  parentId,
                  depth,
                  sequenceId: null,
                  authorId: "system",
                  isAI: false,
                  model: null,
                  character: null,
                  errorType: "STREAM_ERROR",
                  errorMessage: errorResponse.message,
                  errorCode: null,
                  metadata: {},
                  upvotes: 0,
                  downvotes: 0,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  searchVector: null,
                });

                logger.info("Created ERROR message in chat (no body)", {
                  messageId: errorMessageId,
                  threadId: activeThreadId,
                });
                return undefined;
              })
              .catch((error: Error) => {
                logger.error("Failed to create error message in chat", {
                  error: parseError(error).message,
                });
              });
          }

          store.stopStream(threadId);
          return;
        }

        // Process SSE stream
        const reader = response.body.getReader();
        readerRefs.current.set(threadId, reader);
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

          const isDraining = isDrainingRefs.current.get(threadId) ?? false;

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

                // Update the user message with transcribed text.
                // Explicitly set isTranscribing: false so the merge in updateMessage
                // overwrites the existing true value — the store merges metadata, so
                // omitting the key would leave the old value in place.
                useChatStore.getState().updateMessage(eventData.messageId, {
                  content: eventData.text,
                  metadata: { isTranscribing: false },
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

                // Update the user message with uploaded attachment metadata.
                // Explicitly set isUploadingAttachments: false so the merge in
                // updateMessage overwrites the existing true value.
                useChatStore.getState().updateMessage(eventData.messageId, {
                  metadata: {
                    isUploadingAttachments: false,
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
                // Skip content deltas in drain mode - server is handling final DB writes
                if (isDraining) {
                  break;
                }

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
                    threadId: threadId || "",
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
                          isAI:
                            currentMessage.role === ChatMessageRole.ASSISTANT,
                          model: currentMessage.model ?? null,
                          character: currentMessage.character ?? null,
                          errorType: null,
                          errorMessage: null,
                          errorCode: null,
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
                // Skip in drain mode - UI already shows finalized content
                if (isDraining) {
                  break;
                }

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
                            authorId: "Anonymous",
                            isAI:
                              currentMessage.role === ChatMessageRole.ASSISTANT,
                            model: currentMessage.model ?? null,
                            character: currentMessage.character ?? null,
                            errorType: null,
                            errorMessage: null,
                            errorCode: null,
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
                            isAI: message.role === ChatMessageRole.ASSISTANT,
                            model: message.model ?? null,
                            character: message.character ?? null,
                            errorType: null,
                            errorMessage: null,
                            errorCode: null,
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

              case StreamEventType.TOKENS_UPDATED: {
                const eventData = event.data as TokensUpdatedEventData;
                logger.debug("[TOKENS_UPDATED] Updating message tokens", {
                  messageId: eventData.messageId,
                  promptTokens: eventData.promptTokens,
                  completionTokens: eventData.completionTokens,
                  totalTokens: eventData.totalTokens,
                  creditCost: eventData.creditCost,
                });

                // Update streaming store with token metadata
                store.updateTokens(
                  eventData.messageId,
                  eventData.promptTokens,
                  eventData.completionTokens,
                  eventData.totalTokens,
                  eventData.creditCost,
                  eventData.finishReason,
                );
                break;
              }

              case StreamEventType.AUDIO_CHUNK: {
                // Skip audio in drain mode
                if (isDraining) {
                  break;
                }

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

              case StreamEventType.COMPACTING_DELTA: {
                // Skip in drain mode
                if (isDraining) {
                  break;
                }

                const eventData = event.data as CompactingDeltaEventData;
                // Get fresh state from store
                const currentMessage =
                  useAIStreamStore.getState().streamingMessages[
                    eventData.messageId
                  ];

                if (currentMessage) {
                  currentMessage.content += eventData.delta;
                  store.updateMessageContent(
                    eventData.messageId,
                    currentMessage.content,
                  );
                }

                // Update chat store with delta for real-time display
                void (async (): Promise<void> => {
                  try {
                    const { useChatStore } =
                      await import("../../chat/hooks/store");
                    const chatMessage =
                      useChatStore.getState().messages[eventData.messageId];
                    if (chatMessage) {
                      const newContent =
                        (chatMessage.content || "") + eventData.delta;
                      const isIncognito =
                        chatMessage.threadId &&
                        useChatStore.getState().threads[chatMessage.threadId]
                          ?.rootFolderId === "incognito";

                      useChatStore
                        .getState()
                        .updateMessage(eventData.messageId, {
                          content: newContent,
                          // Preserve compacting metadata during streaming
                          metadata: {
                            ...chatMessage.metadata,
                            isStreaming: true,
                          },
                        });

                      // Save to localStorage for incognito mode
                      if (isIncognito) {
                        const { saveMessage } =
                          await import("../../chat/incognito/storage");
                        saveMessage({
                          ...chatMessage,
                          content: newContent,
                          metadata: {
                            ...chatMessage.metadata,
                            isStreaming: true,
                          },
                        });
                      }
                    }
                  } catch (error) {
                    logger.error(
                      "[COMPACTING_DELTA] Failed to update chat store",
                      error instanceof Error ? error : new Error(String(error)),
                    );
                  }
                })();

                break;
              }

              case StreamEventType.COMPACTING_DONE: {
                const eventData = event.data as CompactingDoneEventData;
                logger.debug(
                  "[COMPACTING_DONE] Finalizing compacting message",
                  {
                    messageId: eventData.messageId,
                    contentLength: eventData.content.length,
                  },
                );

                const currentMessage =
                  useAIStreamStore.getState().streamingMessages[
                    eventData.messageId
                  ];

                if (currentMessage) {
                  currentMessage.content = eventData.content;
                  currentMessage.isStreaming = false;
                  currentMessage.isCompacting = true;
                  currentMessage.compactedMessageCount =
                    eventData.metadata.compactedMessageCount;
                  store.updateMessageContent(
                    eventData.messageId,
                    eventData.content,
                  );
                }

                // Update chat store with compacting metadata
                void (async (): Promise<void> => {
                  try {
                    const { useChatStore } =
                      await import("../../chat/hooks/store");

                    const chatMessage =
                      useChatStore.getState().messages[eventData.messageId];
                    const isIncognito =
                      chatMessage?.threadId &&
                      useChatStore.getState().threads[chatMessage.threadId]
                        ?.rootFolderId === "incognito";

                    useChatStore.getState().updateMessage(eventData.messageId, {
                      content: eventData.content,
                      metadata: {
                        isCompacting: true,
                        compactedMessageCount:
                          eventData.metadata.compactedMessageCount,
                        isStreaming: false,
                      },
                    });

                    // Save to localStorage for incognito mode
                    if (isIncognito && chatMessage) {
                      const { saveMessage } =
                        await import("../../chat/incognito/storage");
                      saveMessage({
                        ...chatMessage,
                        content: eventData.content,
                        metadata: {
                          ...chatMessage.metadata,
                          isCompacting: true,
                          compactedMessageCount:
                            eventData.metadata.compactedMessageCount,
                          isStreaming: false,
                        },
                      });
                    }

                    logger.debug("[COMPACTING_DONE] Updated chat store", {
                      messageId: eventData.messageId,
                      isIncognito,
                    });
                  } catch (error) {
                    logger.error(
                      "[COMPACTING_DONE] Failed to update chat store",
                      error instanceof Error ? error : new Error(String(error)),
                    );
                  }
                })();

                break;
              }

              case StreamEventType.ERROR: {
                // ERROR events use ErrorResponseType from the server
                // We need to convert it to match the chat message error format
                const errorResponse = event.data;

                // Create ERROR message in chat so users can see what went wrong
                const activeThreadId = threadId;

                if (activeThreadId) {
                  // Import chat store dynamically to avoid circular dependencies
                  void import("../../chat/hooks/store")
                    .then(({ useChatStore }) => {
                      const errorMessageId = crypto.randomUUID();
                      const { parentId, depth } =
                        getLastMessageForErrorParent(activeThreadId);

                      // ErrorResponseType has a different structure than our chat error messages
                      // Extract the relevant fields
                      const errorMessage =
                        "message" in errorResponse
                          ? errorResponse.message
                          : "Unknown error";
                      const errorType =
                        "errorType" in errorResponse
                          ? errorResponse.errorType.errorKey
                          : "STREAM_ERROR";
                      const errorCode =
                        "errorType" in errorResponse
                          ? errorResponse.errorType.errorCode.toString()
                          : null;

                      // Add error message to chat store
                      useChatStore.getState().addMessage({
                        id: errorMessageId,
                        threadId: activeThreadId,
                        role: ChatMessageRole.ERROR,
                        content: errorMessage,
                        parentId,
                        depth,
                        sequenceId: null,
                        authorId: "system",
                        isAI: false,
                        model: null,
                        character: null,
                        errorType,
                        errorMessage,
                        errorCode,
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
                        error: errorMessage,
                      });
                      return undefined;
                    })
                    .catch((error: Error) => {
                      logger.error("Failed to create error message in chat", {
                        error: parseError(error).message,
                      });
                    });
                }

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
        store.stopStream(threadId);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            const isDraining = isDrainingRefs.current.get(threadId) ?? false;
            if (isDraining) {
              // AbortError during drain mode means the external signal (options.signal)
              // was used to abort. Finalize messages that are still streaming.
              logger.info(
                "Stream aborted (external signal) during drain - finalizing",
              );
            } else {
              logger.info("Stream aborted - finalizing messages");
            }
            // Only finalize messages belonging to this thread
            const streamingMessages = store.streamingMessages;
            Object.values(streamingMessages).forEach((msg) => {
              if (msg.isStreaming && msg.threadId === threadId) {
                store.finalizeMessage(
                  msg.messageId,
                  msg.content,
                  msg.totalTokens,
                  "stop",
                );
              }
            });
          } else {
            logger.error("Stream error", { error: error.message });

            // Create ERROR message in chat for unexpected errors
            const activeThreadId = threadId;

            if (activeThreadId) {
              const errorResponse = fail({
                message:
                  "app.api.agent.chat.aiStream.errors.unexpectedError" as const,
                errorType: ErrorResponseTypes.UNKNOWN_ERROR,
                messageParams: { error: error.message },
              });

              void import("../../chat/hooks/store")
                .then(({ useChatStore }) => {
                  const errorMessageId = crypto.randomUUID();
                  const { parentId, depth } =
                    getLastMessageForErrorParent(activeThreadId);

                  useChatStore.getState().addMessage({
                    id: errorMessageId,
                    threadId: activeThreadId,
                    role: ChatMessageRole.ERROR,
                    content: serializeError(errorResponse),
                    parentId,
                    depth,
                    sequenceId: null,
                    authorId: "system",
                    isAI: false,
                    model: null,
                    character: null,
                    errorType: "STREAM_ERROR",
                    errorMessage: error.message,
                    errorCode: null,
                    metadata: {},
                    upvotes: 0,
                    downvotes: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    searchVector: null,
                  });

                  logger.info("Created ERROR message in chat (exception)", {
                    messageId: errorMessageId,
                    threadId: activeThreadId,
                    error: error.message,
                  });
                  return undefined;
                })
                .catch((err: Error) => {
                  logger.error("Failed to create error message in chat", {
                    error: parseError(err).message,
                  });
                });
            }
          }
        }
        store.stopStream(threadId);
      } finally {
        readerRefs.current.delete(threadId);
        abortControllerRefs.current.delete(threadId);
        isDrainingRefs.current.delete(threadId);
      }
    },
    [locale, logger, store, t],
  );

  /**
   * Stop the stream for a specific thread (or all threads if no threadId given).
   *
   * 1. Freezes the UI immediately (finalizes streaming messages for that thread).
   * 2. Adds a "stream interrupted" error message to the chat UI.
   * 3. Cancels the SSE reader for that thread — drops the connection.
   *    The server continues running and writing to DB regardless.
   */
  const stopStream = useCallback(
    (threadId?: string) => {
      logger.info("Stop stream requested by user", { threadId });

      // Stop audio immediately
      getAudioQueue().stop();

      const threadIds = threadId
        ? [threadId]
        : [...abortControllerRefs.current.keys()];

      for (const tid of threadIds) {
        // Freeze the UI immediately for this thread
        const streamingMessages = store.streamingMessages;
        Object.values(streamingMessages).forEach((msg) => {
          if (msg.isStreaming && msg.threadId === tid) {
            store.finalizeMessage(
              msg.messageId,
              msg.content,
              msg.totalTokens,
              "stop",
            );
          }
        });

        // Add the interruption error message to the chat UI.
        const streamingMsgs = Object.values(
          useAIStreamStore.getState().streamingMessages,
        );
        const activeAssistant = streamingMsgs.find(
          (m) => m.threadId === tid && m.role === ChatMessageRole.ASSISTANT,
        );
        const activeSequenceId = activeAssistant?.sequenceId ?? null;

        const { parentId, depth } = getLastMessageForErrorParent(tid);
        useChatStore.getState().addMessage({
          id: crypto.randomUUID(),
          threadId: tid,
          role: ChatMessageRole.ERROR,
          content: "app.api.agent.chat.aiStream.info.streamInterrupted",
          parentId,
          depth,
          sequenceId: activeSequenceId,
          authorId: "system",
          isAI: false,
          model: null,
          character: null,
          errorType: "STREAM_ERROR",
          errorMessage: t("app.api.agent.chat.aiStream.info.streamInterrupted"),
          errorCode: null,
          metadata: {},
          upvotes: 0,
          downvotes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          searchVector: null,
        });

        // Cancel the reader for this thread — drops the SSE connection.
        // The server keeps going and writes to DB.
        const reader = readerRefs.current.get(tid);
        if (reader) {
          void reader.cancel();
          readerRefs.current.delete(tid);
        }

        store.stopStream(tid);
      }
    },
    [store, logger, t],
  );

  return {
    startStream,
    stopStream,
    isStreaming: store.isStreaming,
    isStreamingThread: store.isStreamingThread,
    streamingMessages: store.streamingMessages,
    threads: store.threads,
  };
}
