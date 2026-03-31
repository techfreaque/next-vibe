"use client";

/**
 * Message Event Handlers
 *
 * Self-contained handlers for all message WS events.
 * Single source of truth: all writes go through updateMessages → apiClient cache.
 * Incognito localStorage persistence is handled automatically inside updateMessages.
 *
 * No Zustand message stores. No dual writes.
 */

import { useChatInputStore } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/input-store";
import { clearDraft } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/use-input-autosave";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { stripSpecialTags } from "@/app/api/[locale]/agent/text-to-speech/content-processing";

import { DefaultFolderId } from "../../../../config";
import type { ChatMessage, MessageMetadata } from "../../../../db";
import { ChatMessageRole } from "../../../../enum";
import messagesDefinition from "../definition";
import type { StreamEventDataMap } from "../events";
import { StreamEventType } from "../events";
import {
  patchMessage,
  removeMessage,
  updateMessages,
  upsertMessage,
} from "./update-messages";
import { useMessageEditorStore } from "./use-message-editor-store";
import type { MessagesEventHandlers } from "./use-messages-ws";

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Read messages from the apiClient cache for a thread.
 */
function getCachedMessages(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): ChatMessage[] {
  const data = apiClient.getEndpointData(messagesDefinition.GET, logger, {
    urlPathParams: { threadId },
    requestData: { rootFolderId },
  });
  return data?.success ? data.data.messages : [];
}

/**
 * Get the last message in the current branch to use as parent for error messages.
 */
function getLastMessageForErrorParent(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): {
  parentId: string | null;
  leafMsg: ReturnType<typeof getCachedMessages>[number] | undefined;
} {
  const msgs = getCachedMessages(threadId, rootFolderId, logger);
  if (msgs.length === 0) {
    return { parentId: null, leafMsg: undefined };
  }
  // Use the last message by creation time as a proxy for leaf
  const sorted = [...msgs].toSorted(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const leafMsg = sorted[0];
  return { parentId: leafMsg?.id ?? null, leafMsg };
}

/**
 * Add an error message to the cache at the correct branch position.
 * Used by ai-stream for HTTP errors and user-initiated stops.
 */
export function addErrorMessageToChat(
  threadId: string,
  rootFolderId: DefaultFolderId,
  content: string,
  errorType: string,
  errorCode: string | null = null,
  sequenceId: string | null = null,
  logger: EndpointLogger,
): void {
  const { parentId, leafMsg } = getLastMessageForErrorParent(
    threadId,
    rootFolderId,
    logger,
  );

  // If WS already placed an error - update it in place instead of adding a duplicate.
  if (leafMsg?.role === ChatMessageRole.ERROR) {
    patchMessage(threadId, rootFolderId, logger, leafMsg.id, {
      content,
      errorType,
      errorMessage: content,
      errorCode,
    });
    return;
  }

  // Remove any optimistic assistant placeholders.
  const allMsgsForError = getCachedMessages(threadId, rootFolderId, logger);
  for (const m of allMsgsForError) {
    if (m.metadata?.isOptimistic) {
      removeMessage(threadId, rootFolderId, logger, m.id);
    }
  }

  // Revert the optimistic user message.
  let errorParentId = parentId;
  if (leafMsg?.role === ChatMessageRole.USER) {
    errorParentId = leafMsg.parentId;
    removeMessage(threadId, rootFolderId, logger, leafMsg.id);
  }

  const errorMessageId = crypto.randomUUID();
  upsertMessage(threadId, rootFolderId, logger, {
    id: errorMessageId,
    threadId,
    role: ChatMessageRole.ERROR,
    content,
    parentId: errorParentId,
    sequenceId,
    authorId: "system",
    authorName: null,
    isAI: false,
    model: null,
    skill: null,
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

  // Remove ?message= from URL - error messages are client-only
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.delete("message");
    window.history.replaceState(null, "", url.toString());
  }
}

// ============================================================================
// INDIVIDUAL EVENT HANDLERS
// ============================================================================

function handleMessageCreated(
  e: StreamEventDataMap[StreamEventType.MESSAGE_CREATED],
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  const toolCall = e.toolCall;
  const isUserRole = e.role === ChatMessageRole.USER;
  const isAssistantOrTool =
    e.role === ChatMessageRole.ASSISTANT || e.role === ChatMessageRole.TOOL;
  const isErrorRole = e.role === ChatMessageRole.ERROR;

  const serverMetadata: MessageMetadata = {
    ...(e.metadata ?? {}),
    ...(toolCall ? { toolCall } : {}),
    ...(isUserRole && e.content ? { isTranscribing: false } : {}),
  };

  // For server-emitted error messages: de-duplicate + revert optimistic messages.
  if (isErrorRole) {
    const msgs = getCachedMessages(e.threadId, rootFolderId, logger);
    const sorted = [...msgs].toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const leaf = sorted[0];
    if (leaf?.role === ChatMessageRole.ERROR) {
      // HTTP error already added one - update in place, preserving the server parentId
      // so the error sits at the correct branch position in the tree.
      patchMessage(e.threadId, rootFolderId, logger, leaf.id, {
        content: e.content || leaf.content,
        errorType: "STREAM_ERROR",
        errorMessage: (e.content || leaf.content) ?? null,
        ...(e.parentId ? { parentId: e.parentId } : {}),
      });
      return;
    }
    // Remove any optimistic messages (user + assistant placeholders) before
    // inserting the real error. This handles cancellation where the optimistic
    // assistant placeholder is still present when the error arrives.
    for (const m of msgs) {
      if (m.metadata?.isOptimistic) {
        removeMessage(e.threadId, rootFolderId, logger, m.id);
      }
    }
    if (leaf?.role === ChatMessageRole.USER) {
      removeMessage(e.threadId, rootFolderId, logger, leaf.id);
    }
  }

  // Mark as actively streaming so LoadingIndicator shows immediately
  if (isAssistantOrTool && !serverMetadata.isStreaming) {
    serverMetadata.isStreaming = true;
  }

  const newMsg: ChatMessage = {
    id: e.messageId,
    threadId: e.threadId,
    role: e.role,
    content: e.content || "",
    parentId: e.parentId,
    sequenceId: e.sequenceId ?? null,
    authorId:
      rootFolderId === DefaultFolderId.INCOGNITO ? "incognito" : "system",
    authorName: null,
    isAI: isAssistantOrTool,
    model: e.model ?? null,
    skill: e.skill ?? null,
    errorType: isErrorRole ? "STREAM_ERROR" : null,
    errorMessage: isErrorRole ? (e.content ?? null) : null,
    errorCode: null,
    metadata: serverMetadata,
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    searchVector: null,
  };

  if (isAssistantOrTool) {
    // Remove optimistic placeholder(s) and insert real message atomically in a
    // single updateMessages call to avoid any transient state where both exist
    // simultaneously (which would show a "1/2" branch indicator).
    updateMessages(e.threadId, rootFolderId, logger, (msgs) => {
      const withoutOptimistic = msgs.filter((m) => !m.metadata?.isOptimistic);
      const idx = withoutOptimistic.findIndex((m) => m.id === newMsg.id);
      if (idx === -1) {
        return [...withoutOptimistic, newMsg];
      }
      const next = [...withoutOptimistic];
      next[idx] = newMsg;
      return next;
    });
  } else {
    // For user/error messages: simple upsert (no optimistic placeholder to remove)
    upsertMessage(e.threadId, rootFolderId, logger, newMsg);
  }

  // When the first ASSISTANT message arrives in incognito mode,
  // also save the pending user message (upsertMessage already handles the assistant).
  if (
    rootFolderId === DefaultFolderId.INCOGNITO &&
    e.role === ChatMessageRole.ASSISTANT
  ) {
    const msgs = getCachedMessages(e.threadId, rootFolderId, logger);
    const userMsg = msgs.find((m) => m.id === e.parentId);
    if (userMsg?.role === ChatMessageRole.USER) {
      // Force-save the user message (it was already in cache, just need localStorage)
      upsertMessage(e.threadId, rootFolderId, logger, userMsg);
    }
  }

  // Clear input + editor state when the user message is confirmed by the server.
  if (isUserRole) {
    useChatInputStore.getState().reset();
    void clearDraft(`chat-draft:${e.threadId}`, logger);
    const editorStore = useMessageEditorStore.getState();
    if (editorStore.editingMessageId) {
      editorStore.clearEditing();
    } else if (editorStore.retryingMessageId) {
      editorStore.clearRetrying();
    }
  }
}

function handleContentDelta(
  e: StreamEventDataMap[StreamEventType.CONTENT_DELTA],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  if (!e.delta) {
    return;
  }
  updateMessages(threadId, rootFolderId, logger, (msgs) => {
    const idx = msgs.findIndex((m) => m.id === e.messageId);
    if (idx === -1) {
      // Message not yet in cache (rare race) - add a stub
      return [
        ...msgs,
        {
          id: e.messageId,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          content: e.delta,
          parentId: null,
          sequenceId: null,
          authorId: "system",
          authorName: null,
          isAI: true,
          model: null,
          skill: null,
          errorType: null,
          errorMessage: null,
          errorCode: null,
          metadata: {},
          upvotes: 0,
          downvotes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          searchVector: null,
        },
      ];
    }
    const next = [...msgs];
    const m = next[idx];
    next[idx] = {
      ...m,
      content: (m.content ?? "") + e.delta,
      updatedAt: new Date(),
    };
    return next;
  });
}

function handleReasoningDelta(
  e: StreamEventDataMap[StreamEventType.REASONING_DELTA],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  if (!e.delta) {
    return;
  }
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === e.messageId
        ? {
            ...m,
            content: (m.content ?? "") + e.delta,
            updatedAt: new Date(),
          }
        : m,
    ),
  );
}

function handleReasoningDone(
  e: StreamEventDataMap[StreamEventType.REASONING_DONE],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  patchMessage(threadId, rootFolderId, logger, e.messageId, {
    content: e.content,
  });
}

function handleContentDone(
  e: StreamEventDataMap[StreamEventType.CONTENT_DONE],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  const tokenMetadata: MessageMetadata = {
    totalTokens: e.totalTokens ?? undefined,
    finishReason: e.finishReason ?? undefined,
    isStreaming: false,
  };
  // Strip think/chat tags from final content - the server sends raw content
  // including reasoning blocks; the UI and localStorage should store clean text.
  const cleanContent = e.content ? stripSpecialTags(e.content) : e.content;
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === e.messageId
        ? {
            ...m,
            content: cleanContent,
            metadata: { ...m.metadata, ...tokenMetadata },
            updatedAt: new Date(),
          }
        : m,
    ),
  );
}

function handleTokensUpdated(
  e: StreamEventDataMap[StreamEventType.TOKENS_UPDATED],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  const tokenMetadata: MessageMetadata = {
    promptTokens: e.promptTokens,
    completionTokens: e.completionTokens,
    totalTokens: e.totalTokens,
    cachedInputTokens: e.cachedInputTokens,
    cacheWriteTokens: e.cacheWriteTokens > 0 ? e.cacheWriteTokens : undefined,
    timeToFirstToken: e.timeToFirstToken ?? undefined,
    creditCost: e.creditCost,
    finishReason: e.finishReason ?? undefined,
  };
  // Merge token metadata into existing metadata (don't overwrite other fields)
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === e.messageId
        ? {
            ...m,
            metadata: { ...m.metadata, ...tokenMetadata },
            updatedAt: new Date(),
          }
        : m,
    ),
  );
}

function handleVoiceTranscribed(
  e: StreamEventDataMap[StreamEventType.VOICE_TRANSCRIBED],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  patchMessage(threadId, rootFolderId, logger, e.messageId, {
    content: e.text,
    metadata: { isTranscribing: false },
  });
}

function handleFilesUploaded(
  e: StreamEventDataMap[StreamEventType.FILES_UPLOADED],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === e.messageId
        ? {
            ...m,
            metadata: {
              ...m.metadata,
              isUploadingAttachments: false,
              attachments: e.attachments,
            },
            updatedAt: new Date(),
          }
        : m,
    ),
  );
}

function handleToolResult(
  e: StreamEventDataMap[StreamEventType.TOOL_RESULT],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  if (!e.toolCall) {
    return;
  }
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === e.messageId
        ? {
            ...m,
            metadata: { ...m.metadata, toolCall: e.toolCall },
            updatedAt: new Date(),
          }
        : m,
    ),
  );
}

function handleCompactingDelta(
  e: StreamEventDataMap[StreamEventType.COMPACTING_DELTA],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === e.messageId
        ? {
            ...m,
            content: (m.content ?? "") + e.delta,
            metadata: { ...m.metadata, isStreaming: true },
            updatedAt: new Date(),
          }
        : m,
    ),
  );
}

function handleCompactingDone(
  e: StreamEventDataMap[StreamEventType.COMPACTING_DONE],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === e.messageId
        ? {
            ...m,
            content: e.content,
            metadata: {
              ...m.metadata,
              isCompacting: true,
              compactedMessageCount: e.metadata.compactedMessageCount,
              isStreaming: false,
            },
            updatedAt: new Date(),
          }
        : m,
    ),
  );
}

function handleError(
  e: StreamEventDataMap[StreamEventType.ERROR],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  const errorMessage = e.message ?? "Unknown error";
  const errorType = e.errorType?.errorKey ?? "STREAM_ERROR";
  const errorCode = e.errorType?.errorCode
    ? String(e.errorType.errorCode)
    : null;

  const { parentId, leafMsg } = getLastMessageForErrorParent(
    threadId,
    rootFolderId,
    logger,
  );

  // If HTTP error path already added an error - update in place.
  if (leafMsg?.role === ChatMessageRole.ERROR) {
    patchMessage(threadId, rootFolderId, logger, leafMsg.id, {
      content: errorMessage,
      errorType,
      errorMessage,
      errorCode,
    });
    logger.info("Updated existing error message from WS ERROR event", {
      messageId: leafMsg.id,
      threadId,
    });
    return;
  }

  // Revert any optimistic placeholders (user + assistant) before showing error.
  const allMsgs = getCachedMessages(threadId, rootFolderId, logger);
  for (const m of allMsgs) {
    if (m.metadata?.isOptimistic) {
      removeMessage(threadId, rootFolderId, logger, m.id);
    }
  }

  // Revert the optimistic user message.
  let errorParentId = parentId;
  if (leafMsg?.role === ChatMessageRole.USER) {
    errorParentId = leafMsg.parentId;
    removeMessage(threadId, rootFolderId, logger, leafMsg.id);
    logger.info("Reverted optimistic user message on stream error", {
      messageId: leafMsg.id,
      threadId,
    });
  }

  const errorMessageId = crypto.randomUUID();
  upsertMessage(threadId, rootFolderId, logger, {
    id: errorMessageId,
    threadId,
    role: ChatMessageRole.ERROR,
    content: errorMessage,
    parentId: errorParentId,
    sequenceId: null,
    authorId: "system",
    authorName: null,
    isAI: false,
    model: null,
    skill: null,
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

function handleGeneratedMediaAdded(
  e: StreamEventDataMap[StreamEventType.GENERATED_MEDIA_ADDED],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) => {
      if (m.id !== e.messageId) {
        return m;
      }
      return {
        ...m,
        metadata: {
          ...m.metadata,
          generatedMedia: e.generatedMedia as MessageMetadata["generatedMedia"],
          creditCost:
            (m.metadata?.creditCost ?? 0) + e.generatedMedia.creditCost,
        },
        updatedAt: new Date(),
      };
    }),
  );
}

function handleGapFillStarted(
  e: StreamEventDataMap[StreamEventType.GAP_FILL_STARTED],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  // Mark the message as having a gap-fill in progress
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) => {
      if (m.id !== e.messageId) {
        return m;
      }
      return {
        ...m,
        metadata: {
          ...m.metadata,
          isStreaming: true,
        },
        updatedAt: new Date(),
      };
    }),
  );
}

function handleGapFillCompleted(
  e: StreamEventDataMap[StreamEventType.GAP_FILL_COMPLETED],
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): void {
  updateMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) => {
      if (m.id !== e.messageId) {
        return m;
      }
      const existingVariants = m.metadata?.variants ?? [];
      return {
        ...m,
        metadata: {
          ...m.metadata,
          isStreaming: false,
          variants: [
            ...existingVariants.filter(
              (v) => v.modality !== e.variant.modality,
            ),
            e.variant as NonNullable<MessageMetadata["variants"]>[number],
          ],
        },
        updatedAt: new Date(),
      };
    }),
  );
}

// ============================================================================
// FACTORY
// ============================================================================

/**
 * Create self-contained message event handlers for a thread.
 * All writes go through updateMessages → apiClient cache.
 * Incognito persistence is automatic inside updateMessages.
 */
export function createMessageEventHandlers(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): MessagesEventHandlers {
  return {
    [StreamEventType.MESSAGE_CREATED]: (e) => {
      handleMessageCreated(e, rootFolderId, logger);
    },
    [StreamEventType.CONTENT_DELTA]: (e) => {
      handleContentDelta(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.CONTENT_DONE]: (e) => {
      handleContentDone(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.REASONING_DELTA]: (e) => {
      handleReasoningDelta(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.REASONING_DONE]: (e) => {
      handleReasoningDone(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.TOOL_CALL]: () => {
      // Informational - TOOL_RESULT carries the actual data
    },
    [StreamEventType.TOOL_WAITING]: () => {
      // Handled at the ai-stream level if needed
    },
    [StreamEventType.TOOL_RESULT]: (e) => {
      handleToolResult(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.ERROR]: (e) => {
      handleError(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.VOICE_TRANSCRIBED]: (e) => {
      handleVoiceTranscribed(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.AUDIO_CHUNK]: () => {
      // Audio playback is ai-stream-specific (voice mode)
    },
    [StreamEventType.FILES_UPLOADED]: (e) => {
      handleFilesUploaded(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.CREDITS_DEDUCTED]: () => {
      // Handled via onCreditsDeducted callback in use-messages-subscription → deductCredits
    },
    [StreamEventType.TOKENS_UPDATED]: (e) => {
      handleTokensUpdated(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.COMPACTING_DELTA]: (e) => {
      handleCompactingDelta(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.COMPACTING_DONE]: (e) => {
      handleCompactingDone(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.GENERATED_MEDIA_ADDED]: (e) => {
      handleGeneratedMediaAdded(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.GAP_FILL_STARTED]: (e) => {
      handleGapFillStarted(e, threadId, rootFolderId, logger);
    },
    [StreamEventType.GAP_FILL_COMPLETED]: (e) => {
      handleGapFillCompleted(e, threadId, rootFolderId, logger);
    },
  };
}
