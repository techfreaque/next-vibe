"use client";

/**
 * Message cache helpers - minimal imperative writes for cases the framework
 * event system cannot handle: optimistic inserts, delete, vote, history pagination,
 * and HTTP-error messages.
 *
 * All streaming state (content-delta, message-created, stream-finished, …) is
 * handled declaratively by the event declarations in definition.ts - no manual
 * writes needed for those.
 */

import { success } from "next-vibe/shared/types/response.schema";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ChatMessageRole } from "../../../../enum";
import messagesDefinition from "../definition";

// ─── Core write ───────────────────────────────────────────────────────────────

function writeMessages(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  updater: (messages: ChatMessage[]) => ChatMessage[],
): void {
  apiClient.updateEndpointData(
    messagesDefinition.GET,
    logger,
    (old) => {
      const existing = old?.success ? old.data.messages : [];
      const updated = updater(existing);
      return success({
        streamingState: old?.success ? old.data.streamingState : "idle",
        backgroundTasks: old?.success ? old.data.backgroundTasks : [],
        messages: updated,
      });
    },
    { urlPathParams: { threadId }, requestData: { rootFolderId } },
  );
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export function upsertMessage(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  message: ChatMessage,
): void {
  writeMessages(threadId, rootFolderId, logger, (msgs) => {
    const idx = msgs.findIndex((m) => m.id === message.id);
    if (idx === -1) {
      return [...msgs, message];
    }
    const next = [...msgs];
    next[idx] = message;
    return next;
  });
}

/**
 * Patch specific keys inside a message's metadata object without replacing
 * the entire metadata. Used by the files-uploaded event to replace attachments
 * without triggering the id-based array merger that would duplicate images.
 */
export function writeMessagesMetadataPatch(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  messageId: string,
  metadataPatch: Partial<NonNullable<ChatMessage["metadata"]>>,
): void {
  writeMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === messageId
        ? {
            ...m,
            metadata: { ...(m.metadata ?? {}), ...metadataPatch },
            updatedAt: new Date(),
          }
        : m,
    ),
  );
}

export function patchMessage(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  messageId: string,
  patch: Partial<ChatMessage>,
): void {
  writeMessages(threadId, rootFolderId, logger, (msgs) =>
    msgs.map((m) =>
      m.id === messageId ? { ...m, ...patch, updatedAt: new Date() } : m,
    ),
  );
}

export function removeMessage(
  threadId: string,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  messageId: string,
): void {
  writeMessages(threadId, rootFolderId, logger, (msgs) => {
    const target = msgs.find((m) => m.id === messageId);
    const targetParentId = target?.parentId ?? null;
    return msgs
      .filter((m) => m.id !== messageId)
      .map((m) =>
        m.parentId === messageId ? { ...m, parentId: targetParentId } : m,
      );
  });
}

/** Remove optimistic placeholders with matching parentId across all folder caches. */
export function removeOptimisticByParentId(
  threadId: string,
  parentId: string,
  logger: EndpointLogger,
): void {
  for (const folderId of Object.values(DefaultFolderId)) {
    writeMessages(threadId, folderId, logger, (msgs) =>
      msgs.filter(
        (m) => !(m.metadata?.isOptimistic && m.parentId === parentId),
      ),
    );
  }
}

/** Read-only cache access - for incognito persistence and error handling. */
export function getCachedMessages(
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
 * Insert an error message at the current branch leaf.
 * De-dupes: if the leaf is already an ERROR message, patches it in place.
 * Reverts optimistic user message and removes optimistic assistant placeholders.
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
  const msgs = getCachedMessages(threadId, rootFolderId, logger);
  const sorted = [...msgs].toSorted(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const leafMsg = sorted[0];

  if (leafMsg?.role === ChatMessageRole.ERROR) {
    patchMessage(threadId, rootFolderId, logger, leafMsg.id, {
      content,
      errorType,
      errorMessage: content,
      errorCode,
    });
    return;
  }

  for (const m of msgs) {
    if (m.metadata?.isOptimistic) {
      removeMessage(threadId, rootFolderId, logger, m.id);
    }
  }

  let errorParentId: string | null = leafMsg?.id ?? null;
  if (leafMsg?.role === ChatMessageRole.USER) {
    errorParentId = leafMsg.parentId;
    removeMessage(threadId, rootFolderId, logger, leafMsg.id);
  }

  upsertMessage(threadId, rootFolderId, logger, {
    id: crypto.randomUUID(),
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
}
