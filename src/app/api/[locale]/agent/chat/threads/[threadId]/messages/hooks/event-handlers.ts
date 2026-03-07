"use client";

/**
 * Message Event Handlers
 *
 * Self-contained handlers for all message WS events.
 * Owns the full event lifecycle on the client:
 *   - useAIStreamStore updates (streaming state)
 *   - useChatStore updates (chat rendering state)
 *   - incognito localStorage persistence
 *   - error message creation
 *
 * No callbacks. No external dependencies beyond the two stores.
 * Colocated in the messages folder because this IS message logic.
 */

import { parseError } from "next-vibe/shared/utils";

import { useAIStreamStore } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/store";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { MessageMetadata } from "../../../../db";
import { ChatMessageRole } from "../../../../enum";
import { useChatStore } from "../../../../hooks/store";
import { saveMessage } from "../../../../incognito/storage";
import type { StreamEventDataMap } from "../events";
import { StreamEventType } from "../events";
import { useStreamingMessagesStore } from "./streaming-messages-store";
import type { MessagesEventHandlers } from "./use-messages-ws";

// ============================================================================
// HELPERS
// ============================================================================

/** Check if a thread is incognito from either store */
function isIncognito(threadId: string): boolean {
  const streamThread = useAIStreamStore.getState().threads[threadId];
  if (streamThread?.rootFolderId === "incognito") {
    return true;
  }
  const chatThread = useChatStore.getState().threads[threadId];
  return chatThread?.rootFolderId === "incognito";
}

/** Build a ChatMessage-shaped object for incognito saves from streaming state */
function buildIncognitoMessage(
  messageId: string,
  threadId: string,
  role: ChatMessageRole,
  content: string,
  parentId: string | null,
  sequenceId: string | null | undefined,
  model: ModelId | null,
  character: string | null,
  metadata: MessageMetadata = {},
): Parameters<typeof saveMessage>[0] {
  return {
    id: messageId,
    threadId,
    role,
    content,
    parentId,
    sequenceId: sequenceId ?? null,
    authorId: "incognito",
    authorName: null,
    isAI: role === ChatMessageRole.ASSISTANT || role === ChatMessageRole.TOOL,
    model: model ?? null,
    character: character ?? null,
    errorType: role === ChatMessageRole.ERROR ? "STREAM_ERROR" : null,
    errorMessage: role === ChatMessageRole.ERROR ? content : null,
    errorCode: null,
    metadata,
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    searchVector: null,
  };
}

/**
 * Get last message in current branch to use as parent for error messages.
 * This ensures errors are attached to the correct branch.
 */
export function getLastMessageForErrorParent(threadId: string): {
  parentId: string | null;
} {
  const chatStore = useChatStore.getState();
  const threadMessages = Object.values(chatStore.messages).filter(
    (msg) => msg.threadId === threadId,
  );

  if (threadMessages.length === 0) {
    return { parentId: null };
  }

  // leafMessageId is mirrored from the navigation store into the chat store.
  const leafMessageId = chatStore.leafMessageIds[threadId] ?? null;

  if (leafMessageId && chatStore.messages[leafMessageId]) {
    return { parentId: leafMessageId };
  }

  // Fallback: latest message in this thread
  const sorted = threadMessages.toSorted(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  return { parentId: sorted[0]?.id ?? null };
}

/**
 * Add an error message to the chat store at the correct branch position.
 * Used by ai-stream for HTTP errors and user-initiated stops.
 */
export function addErrorMessageToChat(
  threadId: string,
  content: string,
  errorType: string,
  errorCode: string | null = null,
  sequenceId: string | null = null,
): void {
  const { parentId } = getLastMessageForErrorParent(threadId);
  useChatStore.getState().addMessage({
    id: crypto.randomUUID(),
    threadId,
    role: ChatMessageRole.ERROR,
    content,
    parentId,
    sequenceId,
    authorId: "system",
    authorName: null,
    isAI: false,
    model: null,
    character: null,
    errorType,
    errorMessage: content,
    errorCode,
    metadata: {},
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    searchVector: null,
  });
}

// ============================================================================
// INDIVIDUAL EVENT HANDLERS
// ============================================================================

function handleMessageCreated(
  e: StreamEventDataMap[StreamEventType.MESSAGE_CREATED],
  logger: EndpointLogger,
): void {
  const store = useStreamingMessagesStore.getState();
  const toolCall = e.toolCall;

  store.addMessage({
    messageId: e.messageId,
    threadId: e.threadId,
    role: e.role,
    content: e.content || "",
    parentId: e.parentId,
    model: e.model,
    character: e.character,
    isStreaming: e.role === ChatMessageRole.ASSISTANT,
    sequenceId: e.sequenceId,
    toolCall,
    isCompacting: e.metadata?.isCompacting,
    compactedMessageCount: e.metadata?.compactedMessageCount,
  });

  const incognito = isIncognito(e.threadId);
  const isUserRole = e.role === ChatMessageRole.USER;
  const isAssistantOrTool =
    e.role === ChatMessageRole.ASSISTANT || e.role === ChatMessageRole.TOOL;
  const shouldAddToStore = isUserRole || isAssistantOrTool || incognito;

  if (!shouldAddToStore) {
    return;
  }

  const serverMetadata = {
    ...(e.metadata || {}),
    ...(toolCall ? { toolCall } : {}),
    ...(isUserRole && e.content ? { isTranscribing: false } : {}),
  };

  const existingOptimistic =
    isUserRole && useChatStore.getState().messages[e.messageId];

  if (existingOptimistic) {
    useChatStore.getState().updateMessage(e.messageId, {
      parentId: e.parentId,
      content: e.content || "",
      metadata: serverMetadata,
    });
  } else {
    useChatStore.getState().addMessage({
      id: e.messageId,
      threadId: e.threadId,
      role: e.role,
      content: e.content || "",
      parentId: e.parentId,
      sequenceId: e.sequenceId ?? null,
      authorId: incognito ? "incognito" : "system",
      authorName: null,
      isAI: isAssistantOrTool,
      model: e.model ?? null,
      character: e.character ?? null,
      errorType: e.role === ChatMessageRole.ERROR ? "STREAM_ERROR" : null,
      errorMessage: e.role === ChatMessageRole.ERROR ? e.content : null,
      errorCode: null,
      metadata: serverMetadata,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      searchVector: null,
    });
  }

  // Save to localStorage for incognito mode (but not USER messages yet)
  if (incognito && !isUserRole) {
    void saveMessage(
      buildIncognitoMessage(
        e.messageId,
        e.threadId,
        e.role,
        e.content || "",
        e.parentId,
        e.sequenceId,
        e.model,
        e.character,
        e.metadata
          ? { ...e.metadata, ...(toolCall ? { toolCall } : {}) }
          : toolCall
            ? { toolCall }
            : {},
      ),
    ).catch((error: Error) => {
      logger.error("Failed to save incognito message", { error });
    });
  }

  // When the first ASSISTANT message arrives in incognito mode,
  // also save the pending user message to localStorage.
  if (incognito && e.role === ChatMessageRole.ASSISTANT) {
    const userMsg = useChatStore.getState().messages[e.parentId ?? ""];
    if (userMsg && userMsg.role === ChatMessageRole.USER) {
      void saveMessage(userMsg).catch((error) => {
        logger.error(
          "Failed to save pending user message to localStorage",
          parseError(error),
        );
      });
    }
  }
}

function handleContentDelta(
  e: StreamEventDataMap[StreamEventType.CONTENT_DELTA],
  threadId: string,
  logger: EndpointLogger,
): void {
  const store = useStreamingMessagesStore.getState();
  let currentMessage = store.streamingMessages[e.messageId];

  if (!currentMessage) {
    store.addMessage({
      messageId: e.messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "",
      parentId: null,
      model: null,
      character: null,
      isStreaming: true,
      sequenceId: null,
    });
    currentMessage =
      useStreamingMessagesStore.getState().streamingMessages[e.messageId];
  }

  if (currentMessage && e.delta) {
    const newContent = (currentMessage.content || "") + e.delta;
    useStreamingMessagesStore
      .getState()
      .updateMessageContent(e.messageId, newContent);

    useChatStore.getState().updateMessage(e.messageId, {
      content: newContent,
    });

    if (isIncognito(currentMessage.threadId)) {
      void saveMessage(
        buildIncognitoMessage(
          e.messageId,
          currentMessage.threadId,
          currentMessage.role,
          newContent,
          currentMessage.parentId,
          currentMessage.sequenceId,
          currentMessage.model,
          currentMessage.character,
        ),
      ).catch((error) => {
        logger.error("Failed to save content delta to localStorage", {
          error: parseError(error).message,
        });
      });
    }
  }
}

function handleReasoningDelta(
  e: StreamEventDataMap[StreamEventType.REASONING_DELTA],
  logger: EndpointLogger,
): void {
  const currentMessage =
    useStreamingMessagesStore.getState().streamingMessages[e.messageId];

  if (currentMessage && e.delta) {
    const newContent = (currentMessage.content || "") + e.delta;
    useStreamingMessagesStore
      .getState()
      .updateMessageContent(e.messageId, newContent);

    const chatMessage = useChatStore.getState().messages[e.messageId];
    if (chatMessage) {
      useChatStore.getState().updateMessage(e.messageId, {
        content: newContent,
      });

      if (isIncognito(currentMessage.threadId)) {
        void saveMessage(
          buildIncognitoMessage(
            e.messageId,
            currentMessage.threadId,
            currentMessage.role,
            newContent,
            currentMessage.parentId,
            currentMessage.sequenceId,
            currentMessage.model,
            currentMessage.character,
          ),
        ).catch((error) => {
          logger.error("Failed to update reasoning in localStorage", {
            error: parseError(error).message,
          });
        });
      }
    }
  }
}

function handleReasoningDone(
  e: StreamEventDataMap[StreamEventType.REASONING_DONE],
): void {
  const currentMessage =
    useStreamingMessagesStore.getState().streamingMessages[e.messageId];
  if (currentMessage) {
    useStreamingMessagesStore
      .getState()
      .updateMessageContent(e.messageId, e.content);

    const chatMessage = useChatStore.getState().messages[e.messageId];
    if (chatMessage) {
      useChatStore.getState().updateMessage(e.messageId, {
        content: e.content,
      });
    }
  }
}

function handleContentDone(
  e: StreamEventDataMap[StreamEventType.CONTENT_DONE],
  logger: EndpointLogger,
): void {
  useStreamingMessagesStore
    .getState()
    .finalizeMessage(e.messageId, e.content, e.totalTokens, e.finishReason);

  const message =
    useStreamingMessagesStore.getState().streamingMessages[e.messageId];
  if (!message) {
    return;
  }

  if (isIncognito(message.threadId)) {
    void saveMessage(
      buildIncognitoMessage(
        message.messageId,
        message.threadId,
        message.role,
        e.content,
        message.parentId,
        message.sequenceId,
        message.model,
        message.character,
      ),
    ).catch((storageError) => {
      logger.error("Failed to update incognito message", {
        error: parseError(storageError).message,
      });
    });
  }

  useChatStore.getState().updateMessage(message.messageId, {
    content: e.content,
  });
}

function handleTokensUpdated(
  e: StreamEventDataMap[StreamEventType.TOKENS_UPDATED],
): void {
  useStreamingMessagesStore
    .getState()
    .updateTokens(
      e.messageId,
      e.promptTokens,
      e.completionTokens,
      e.totalTokens,
      e.creditCost,
      e.finishReason,
    );
}

function handleVoiceTranscribed(
  e: StreamEventDataMap[StreamEventType.VOICE_TRANSCRIBED],
): void {
  useChatStore.getState().updateMessage(e.messageId, {
    content: e.text,
    metadata: { isTranscribing: false },
  });
}

function handleFilesUploaded(
  e: StreamEventDataMap[StreamEventType.FILES_UPLOADED],
): void {
  useChatStore.getState().updateMessage(e.messageId, {
    metadata: {
      isUploadingAttachments: false,
      attachments: e.attachments,
    },
  });
}

function handleToolResult(
  e: StreamEventDataMap[StreamEventType.TOOL_RESULT],
  logger: EndpointLogger,
): void {
  if (!e.toolCall) {
    return;
  }
  const toolCall = e.toolCall;
  useStreamingMessagesStore.getState().setToolCall(e.messageId, toolCall);

  const currentMessage =
    useStreamingMessagesStore.getState().streamingMessages[e.messageId];
  const incognitoStream = currentMessage
    ? isIncognito(currentMessage.threadId)
    : false;

  const chatMessage = useChatStore.getState().messages[e.messageId];
  if (chatMessage) {
    useChatStore.getState().updateMessage(e.messageId, {
      metadata: { toolCall },
    });
  }

  if (incognitoStream) {
    const chatMsg = useChatStore.getState().messages[e.messageId];
    if (chatMsg) {
      void saveMessage(chatMsg).catch((error) => {
        logger.error("Failed to save incognito tool result", {
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }
  }
}

function handleCompactingDelta(
  e: StreamEventDataMap[StreamEventType.COMPACTING_DELTA],
  logger: EndpointLogger,
): void {
  const store = useStreamingMessagesStore.getState();
  const currentMessage = store.streamingMessages[e.messageId];

  if (currentMessage) {
    const newContent = currentMessage.content + e.delta;
    store.updateMessageContent(e.messageId, newContent);
  }

  const chatMessage = useChatStore.getState().messages[e.messageId];
  if (chatMessage) {
    const newContent = (chatMessage.content || "") + e.delta;
    useChatStore.getState().updateMessage(e.messageId, {
      content: newContent,
      metadata: { ...chatMessage.metadata, isStreaming: true },
    });

    if (isIncognito(chatMessage.threadId)) {
      void saveMessage({
        ...chatMessage,
        content: newContent,
        metadata: { ...chatMessage.metadata, isStreaming: true },
      }).catch((error) => {
        logger.error("[COMPACTING_DELTA] Failed to save incognito", {
          error: parseError(error).message,
        });
      });
    }
  }
}

function handleCompactingDone(
  e: StreamEventDataMap[StreamEventType.COMPACTING_DONE],
  logger: EndpointLogger,
): void {
  const store = useStreamingMessagesStore.getState();
  const currentMessage = store.streamingMessages[e.messageId];

  if (currentMessage) {
    store.updateMessageContent(e.messageId, e.content);
  }

  useChatStore.getState().updateMessage(e.messageId, {
    content: e.content,
    metadata: {
      isCompacting: true,
      compactedMessageCount: e.metadata.compactedMessageCount,
      isStreaming: false,
    },
  });

  const chatMessage = useChatStore.getState().messages[e.messageId];
  if (chatMessage && isIncognito(chatMessage.threadId)) {
    void saveMessage({
      ...chatMessage,
      content: e.content,
      metadata: {
        ...chatMessage.metadata,
        isCompacting: true,
        compactedMessageCount: e.metadata.compactedMessageCount,
        isStreaming: false,
      },
    }).catch((error) => {
      logger.error("[COMPACTING_DONE] Failed to save incognito", {
        error: parseError(error).message,
      });
    });
  }
}

function handleError(
  e: StreamEventDataMap[StreamEventType.ERROR],
  threadId: string,
  logger: EndpointLogger,
): void {
  const errorMessageId = crypto.randomUUID();
  const { parentId } = getLastMessageForErrorParent(threadId);

  const errorMessage = e.message ?? "Unknown error";
  const errorType = e.errorType?.errorKey ?? "STREAM_ERROR";
  const errorCode = e.errorType?.errorCode
    ? String(e.errorType.errorCode)
    : null;

  useChatStore.getState().addMessage({
    id: errorMessageId,
    threadId,
    role: ChatMessageRole.ERROR,
    content: errorMessage,
    parentId,
    sequenceId: null,
    authorId: "system",
    authorName: null,
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
    threadId,
    error: errorMessage,
  });
}

// ============================================================================
// FACTORY
// ============================================================================

/**
 * Create self-contained message event handlers for a thread.
 * All store updates, chat syncing, and incognito persistence
 * are handled internally — no callbacks needed.
 */
export function createMessageEventHandlers(
  threadId: string,
  logger: EndpointLogger,
): MessagesEventHandlers {
  return {
    [StreamEventType.MESSAGE_CREATED]: (e) => {
      handleMessageCreated(e, logger);
    },
    [StreamEventType.CONTENT_DELTA]: (e) => {
      handleContentDelta(e, threadId, logger);
    },
    [StreamEventType.CONTENT_DONE]: (e) => {
      handleContentDone(e, logger);
    },
    [StreamEventType.REASONING_DELTA]: (e) => {
      handleReasoningDelta(e, logger);
    },
    [StreamEventType.REASONING_DONE]: (e) => {
      handleReasoningDone(e);
    },
    [StreamEventType.TOOL_CALL]: () => {
      // Informational — TOOL_RESULT carries the actual data
    },
    [StreamEventType.TOOL_WAITING]: () => {
      // Handled at the ai-stream level if needed
    },
    [StreamEventType.TOOL_RESULT]: (e) => {
      handleToolResult(e, logger);
    },
    [StreamEventType.ERROR]: (e) => {
      handleError(e, threadId, logger);
    },
    [StreamEventType.VOICE_TRANSCRIBED]: (e) => {
      handleVoiceTranscribed(e);
    },
    [StreamEventType.AUDIO_CHUNK]: () => {
      // Audio playback is ai-stream-specific (voice mode)
    },
    [StreamEventType.FILES_UPLOADED]: (e) => {
      handleFilesUploaded(e);
    },
    [StreamEventType.CREDITS_DEDUCTED]: () => {
      // Credits are user-scoped, refreshed independently
    },
    [StreamEventType.TOKENS_UPDATED]: (e) => {
      handleTokensUpdated(e);
    },
    [StreamEventType.COMPACTING_DELTA]: (e) => {
      handleCompactingDelta(e, logger);
    },
    [StreamEventType.COMPACTING_DONE]: (e) => {
      handleCompactingDone(e, logger);
    },
  };
}
