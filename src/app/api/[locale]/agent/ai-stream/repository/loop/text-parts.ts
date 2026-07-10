/**
 * Text / reasoning part handlers + chain-tip management for the StreamLoop.
 */

import "server-only";

import type { AssistantPrepResult, StreamLoopState } from "./state";

/**
 * Advance the chain tip (currentParentId + lastParentId) to a newly written
 * message so the next message becomes its child.
 *
 * clearPendingQueueParent: pass true when the new message was just created
 * as a child of the current tip (first text/reasoning content of a step).
 * If pendingQueueParentId was the parent for this new message, the chain has
 * advanced past the compacting point - it is cleared so finish-step and
 * onToolCall don't re-apply the compacting ID as parent.
 *
 * Callers with rewind guards (tool-result/tool-error: only advance when no
 * pending entry matched) keep those guards at the call site - whether to
 * advance at all is per-site logic; this method only owns the advancement.
 */
export function advanceTip(
  state: StreamLoopState,
  messageId: string | null,
  opts: { clearPendingQueueParent: boolean },
): void {
  const { ctx } = state.p;
  if (
    opts.clearPendingQueueParent &&
    ctx.pendingQueueParentId === ctx.currentParentId
  ) {
    ctx.pendingQueueParentId = null;
  }
  ctx.currentParentId = messageId;
  ctx.lastParentId = messageId;
}

/** Handle a text-delta part: create the assistant message on first delta,
 *  then emit SSE + throttled DB updates for subsequent deltas. */
export async function onTextDelta(
  state: StreamLoopState,
  textDelta: string,
): Promise<{
  currentAssistantMessageId: string;
  currentAssistantContent: string;
  wasCreated: boolean;
}> {
  const { ctx, threadId, model, skill, userId, ttsHandler, logger } = state.p;
  const { currentAssistantContent, currentParentId, sequenceId, dbWriter } =
    ctx;

  let { currentAssistantMessageId } = ctx;

  if (!textDelta) {
    return {
      currentAssistantMessageId: currentAssistantMessageId!,
      currentAssistantContent,
      wasCreated: false,
    };
  }

  // First delta: create the message
  if (!currentAssistantMessageId) {
    const messageId = ctx.getNextAssistantMessageId();

    logger.debug("[AI Stream] Creating ASSISTANT message", {
      messageId,
      parentId: currentParentId,
    });

    // Emits MESSAGE_CREATED + CONTENT_DELTA SSE, then inserts to DB
    await dbWriter.emitMessageCreated({
      messageId,
      threadId,
      content: textDelta,
      parentId: currentParentId,
      userId,
      model,
      skill,
      sequenceId,
    });

    currentAssistantMessageId = messageId;

    if (ttsHandler) {
      ttsHandler.setMessageId(messageId);
      void ttsHandler.addDelta(textDelta);
    }

    return {
      currentAssistantMessageId,
      currentAssistantContent: textDelta,
      wasCreated: true,
    };
  }

  // Subsequent deltas: emit SSE + throttled DB update
  const newContent = currentAssistantContent + textDelta;
  dbWriter.emitDeltaAndSchedule(
    currentAssistantMessageId,
    textDelta,
    newContent,
  );

  if (ttsHandler) {
    void ttsHandler.addDelta(textDelta);
  }

  return {
    currentAssistantMessageId,
    currentAssistantContent: newContent,
    wasCreated: false,
  };
}

/** Handle a reasoning-start part (o1-style models): open a <think> block,
 *  creating the assistant message if this is the first content. */
export async function onReasoningStart(state: StreamLoopState): Promise<{
  currentAssistantMessageId: string;
  currentAssistantContent: string;
  wasCreated: boolean;
}> {
  const { ctx, threadId, model, skill, userId, logger } = state.p;
  const { currentAssistantContent, currentParentId, sequenceId, dbWriter } =
    ctx;

  const { currentAssistantMessageId } = ctx;
  const thinkTag = "<think>";

  if (!currentAssistantMessageId) {
    const messageId = ctx.getNextAssistantMessageId();
    logger.debug("[AI Stream] Creating ASSISTANT message (reasoning)", {
      messageId,
      parentId: currentParentId,
    });

    // Emits MESSAGE_CREATED + CONTENT_DELTA SSE, then inserts to DB
    await dbWriter.emitMessageCreated({
      messageId,
      threadId,
      content: thinkTag,
      parentId: currentParentId,
      userId,
      model,
      skill,
      sequenceId,
    });

    return {
      currentAssistantMessageId: messageId,
      currentAssistantContent: thinkTag,
      wasCreated: true,
    };
  }

  const newContent = currentAssistantContent + thinkTag;
  dbWriter.emitDeltaAndSchedule(
    currentAssistantMessageId,
    thinkTag,
    newContent,
  );

  return {
    currentAssistantMessageId,
    currentAssistantContent: newContent,
    wasCreated: false,
  };
}

/** Handle a reasoning-delta part: append reasoning text inside the open
 *  <think> block. Returns the new accumulated content. */
export function onReasoningDelta(
  state: StreamLoopState,
  reasoningText: string,
): string {
  const { ctx } = state.p;
  const { currentAssistantMessageId, currentAssistantContent, dbWriter } = ctx;

  if (reasoningText && currentAssistantMessageId) {
    const newContent = currentAssistantContent + reasoningText;
    dbWriter.emitDeltaAndSchedule(
      currentAssistantMessageId,
      reasoningText,
      newContent,
    );
    return newContent;
  }

  return currentAssistantContent;
}

/** Handle a reasoning-end part: close the <think> block.
 *  Returns the new accumulated content. */
export function onReasoningEnd(state: StreamLoopState): string {
  const { ctx } = state.p;
  const { currentAssistantMessageId, currentAssistantContent, dbWriter } = ctx;

  if (currentAssistantMessageId) {
    const thinkCloseTag = "</think>";
    const newContent = currentAssistantContent + thinkCloseTag;
    dbWriter.emitDeltaAndSchedule(
      currentAssistantMessageId,
      thinkCloseTag,
      newContent,
    );
    return newContent;
  }

  return currentAssistantContent;
}

/**
 * Ensure an ASSISTANT message exists and finalize any open reasoning block.
 */
export async function ensureAssistantMessage(
  state: StreamLoopState,
  initialParentId: string | null,
): Promise<AssistantPrepResult> {
  const { ctx, threadId, model, skill, userId, logger } = state.p;
  const { currentAssistantContent, isInReasoningBlock, sequenceId, dbWriter } =
    ctx;

  let { currentAssistantMessageId } = ctx;
  let currentParentId = initialParentId;

  // Tool call event without preceding text/reasoning - create placeholder ASSISTANT message
  // CRITICAL: Must CREATE the message in DB so TOOL messages can reference it as parent_id
  if (!currentAssistantMessageId) {
    currentAssistantMessageId = ctx.getNextAssistantMessageId();
    currentParentId = currentAssistantMessageId;

    logger.debug(
      "[AI Stream] Creating placeholder ASSISTANT message for tool-call parent chain",
      {
        messageId: currentAssistantMessageId,
        reason: "Tool call without preceding text/reasoning",
        parentId: initialParentId,
      },
    );

    await dbWriter.emitPlaceholderAssistantMessage({
      messageId: currentAssistantMessageId,
      threadId,
      parentId: initialParentId,
      userId,
      model,
      skill,
      sequenceId,
    });

    logger.debug("[AI Stream] Created placeholder ASSISTANT message", {
      messageId: currentAssistantMessageId,
      threadId,
    });
  }

  let newAssistantContent = currentAssistantContent;
  let newIsInReasoningBlock = isInReasoningBlock;

  // Finalize current ASSISTANT message before creating tool message
  if (currentAssistantMessageId) {
    // If reasoning block is still open, close it before tool call
    if (isInReasoningBlock) {
      const thinkCloseTag = "</think>";
      newAssistantContent += thinkCloseTag;
      dbWriter.emitClosingDelta(currentAssistantMessageId, thinkCloseTag);
      newIsInReasoningBlock = false;

      logger.debug(
        "[AI Stream] ⏱️ Reasoning interrupted by tool call → </think>",
        {
          messageId: currentAssistantMessageId,
        },
      );
    }

    // Flush pending writes and write final ASSISTANT content before tool message
    if (newAssistantContent) {
      await dbWriter.flushContent(
        currentAssistantMessageId,
        newAssistantContent,
      );
    }

    logger.debug("Finalized ASSISTANT message before tool call", {
      messageId: currentAssistantMessageId,
      contentLength: newAssistantContent.length,
    });
  }

  return {
    currentAssistantMessageId,
    currentAssistantContent: newAssistantContent,
    isInReasoningBlock: newIsInReasoningBlock,
    currentParentId,
  };
}
