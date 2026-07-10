/**
 * Headless intake phase — preCall injection + operation/parent derivation for
 * runHeadlessAiStream. Extracted verbatim from setup.ts (behavior-preserving).
 */
import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DefaultFolderId } from "../../../chat/config";
import { chatMessages, type MessageMetadata } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { ThreadsRepository } from "../../../chat/threads/repository";
import { type AiStreamPostRequestOutput } from "../../stream/definition";
import { findLatestThreadMessage } from "../core/tree-walk";
import {
  insertDeferredWakeUpMessage,
  type WakeUpPayload,
} from "../revival/revival";

/** Normalize DB tool config items - ensures requiresConfirmation is always boolean */
export interface HeadlessPreCall {
  routeId: string;
  args: Record<string, WidgetData>;
  result: WidgetData;
  success: boolean;
  error?: string;
  executionTimeMs?: number;
}

/**
 * Intake knobs the headless adapter forwards into createAiStream.
 * Presence of this object (even empty) triggers the intake phase.
 */
export interface HeadlessIntake {
  /**
   * Pre-fetched tool call results to inject as tool messages before the AI
   * runs. Written to the thread DB so they render exactly like regular tool
   * calls. Skipped for incognito (no persistence).
   */
  preCalls?: HeadlessPreCall[];
  /**
   * Override the derived operation for test / special-case callers.
   * "send" treats the prompt as a new user message appended to the thread
   * history instead of an answer-as-ai continuation.
   */
  operationOverride?: "send" | "retry" | "edit";
}

/**
 * Derive the effective operation/parent/userMessageId for a headless stream
 * and inject preCalls. Returns the adjusted request data (never mutates the
 * input object).
 */
export async function runHeadlessIntakePhase(params: {
  data: AiStreamPostRequestOutput;
  intake: HeadlessIntake;
  /** Revival stream (wakeUp/WAIT resume) — derives "wakeup-resume". */
  isRevival: boolean | undefined;
  /** Revival: explicit parent for history loading (overrides last-by-createdAt). */
  explicitParentMessageId?: string;
  /** Revival: when set, insert the deferred TOOL message at the leaf first. */
  deferredWakeUpPayload?: WakeUpPayload;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<ResponseType<AiStreamPostRequestOutput>> {
  const {
    data,
    intake,
    isRevival,
    explicitParentMessageId,
    deferredWakeUpPayload,
    user,
    locale,
    logger,
  } = params;
  const { preCalls, operationOverride } = intake;

  const isIncognito = data.rootFolderId === DefaultFolderId.INCOGNITO;
  const userMessageId = data.userMessageId ?? crypto.randomUUID();
  let parentMessageIdForAi: string | null = null;

  // ── Revival: insert the deferred TOOL message at the chain leaf ─────────
  // Folds resume's pre-revival step in: the deferred result becomes the last
  // context item so the AI continues the thread naturally. The inserted
  // deferred id is the revival parent.
  if (deferredWakeUpPayload) {
    const { deferredId } = await insertDeferredWakeUpMessage(
      data.threadId,
      deferredWakeUpPayload,
      logger,
      user,
    );
    parentMessageIdForAi = deferredId;
  } else if (explicitParentMessageId) {
    parentMessageIdForAi = explicitParentMessageId;
  }

  // ── Pre-call injection ─────────────────────────────────────────────────
  // Write pre-call results as proper tool messages in the thread so the AI
  // sees them in context and they render correctly in the UI.
  // Only write to DB for persistent threads (not incognito).
  if (preCalls && preCalls.length > 0 && !isIncognito) {
    // Ensure the thread exists first
    const userId = user.isPublic ? undefined : user.id;
    const ensureResult = await ThreadsRepository.ensureThread({
      threadId: data.threadId,
      rootFolderId: data.rootFolderId,
      subFolderId: data.subFolderId ?? null,
      userId,
      leadId: undefined,
      isIncognito: false,
      logger,
      user,
      locale,
    });
    if (!ensureResult.success) {
      return ensureResult;
    }

    // For append mode, chain the user message off the thread's current last
    // message (explicit parent wins when the adapter provided one).
    const preCallUserParentId =
      data.parentMessageId ??
      (await findLatestThreadMessage(data.threadId))?.id ??
      null;

    // Write the user message first
    await db.insert(chatMessages).values({
      id: userMessageId,
      threadId: data.threadId,
      role: ChatMessageRole.USER,
      content: data.content,
      parentId: preCallUserParentId,
      authorId: userId ?? null,
      sequenceId: null,
      isAI: false,
      model: null,
      skill: null,
      metadata: {},
    });

    // All pre-call messages share a sequenceId so they render as one grouped bubble
    const preCallSequenceId = crypto.randomUUID();

    // Write a synthetic assistant message that "called" the tools
    const syntheticAssistantId = crypto.randomUUID();
    await db.insert(chatMessages).values({
      id: syntheticAssistantId,
      threadId: data.threadId,
      role: ChatMessageRole.ASSISTANT,
      content: null,
      parentId: userMessageId,
      authorId: userId ?? null,
      sequenceId: preCallSequenceId,
      isAI: true,
      model: data.model,
      skill: data.skill,
      metadata: {},
    });

    // Write each pre-call as a TOOL message
    let lastToolMessageId = syntheticAssistantId;
    for (const preCall of preCalls) {
      const toolMessageId = crypto.randomUUID();
      const metadata: MessageMetadata = {
        toolCall: {
          toolCallId: `precall_${toolMessageId}`,
          toolName: preCall.routeId,
          args: preCall.args,
          result: preCall.result,
          executionTime: preCall.executionTimeMs,
        },
      };
      await db.insert(chatMessages).values({
        id: toolMessageId,
        threadId: data.threadId,
        role: ChatMessageRole.TOOL,
        content: null,
        parentId: lastToolMessageId,
        authorId: userId ?? null,
        sequenceId: preCallSequenceId,
        isAI: true,
        model: data.model,
        skill: data.skill,
        metadata,
      });
      lastToolMessageId = toolMessageId;
    }

    parentMessageIdForAi = lastToolMessageId;
  }

  // For "append" mode with no preCalls, determine the parent message for
  // history loading. data.parentMessageId (the adapter's explicit parent)
  // takes priority; otherwise fall back to the thread's newest message.
  // A fresh thread has no rows, so the fallback resolves to null → "send".
  if (!parentMessageIdForAi) {
    parentMessageIdForAi =
      data.parentMessageId ??
      (await findLatestThreadMessage(data.threadId))?.id ??
      null;
  }

  // Revival ALWAYS resumes an existing thread — never a fresh "send" (which
  // would require a userMessageId the revival never carries → setup rejects it
  // with "User message ID must be provided"). It uses "wakeup-resume" (same as
  // answer-as-ai but without CONTINUE_CONVERSATION_PROMPT): the AI sees the
  // deferred tool result as the last message and responds naturally. A null
  // parent here is a real bug (the deferred message wasn't inserted / wrong
  // threadId) — surface it as a failed history load, don't degrade to "send".
  const operation =
    operationOverride ??
    (isRevival
      ? "wakeup-resume"
      : parentMessageIdForAi
        ? "answer-as-ai"
        : "send");

  logger.debug("[Headless] operation resolved", {
    operation,
    isRevival,
    parentMessageIdForAi,
    threadId: data.threadId,
  });

  // When preCalls are used, the user message was already written manually
  // above. Override to "answer-as-ai" so setup doesn't re-insert it.
  const effectiveOperation =
    preCalls && preCalls.length > 0 && parentMessageIdForAi
      ? "answer-as-ai"
      : operation;

  return success({
    ...data,
    operation: effectiveOperation,
    parentMessageId: parentMessageIdForAi,
    userMessageId: effectiveOperation !== "answer-as-ai" ? userMessageId : null,
  });
}
