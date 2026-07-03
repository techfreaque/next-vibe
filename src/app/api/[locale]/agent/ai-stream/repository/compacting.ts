/**
 * AI Stream compacting — pre-stream compacting, mid-stream compacting, and the
 * shared summarization core of the one compacting feature.
 */

import "server-only";

import { type ModelMessage, streamText } from "ai";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { v4 as uuidv4 } from "uuid";

import type { DefaultFolderId } from "../../chat/config";
import type { ChatMessage } from "../../chat/db";
import { MessagesRepository } from "../../chat/threads/[threadId]/messages/repository";
import { calculateCreditCost } from "../../models/models";
import { type ChatModelId, getChatModelById } from "../models";
import type { AiStreamT } from "../stream/i18n";
import { MessageConverter } from "./context";
import { AbortReason, StreamAbortError } from "./core/constants";
import type { StreamContext } from "./core/stream";

/**
 * Compacting shared primitives
 * Used by both the pre-stream CompactingHandler and the MidStreamCompactingHandler:
 * the summarization instructions and the summarization LLM stream skeleton.
 * Each handler keeps its own input preparation and failure policy.
 */

/**
 * Hard cap for the compacting LLM call. Summarization of a large thread
 * streams well within this; only a stalled provider connection exceeds it.
 */
const COMPACTING_LLM_TIMEOUT_MS = 600_000;

/**
 * Build compacting instructions (without conversation text)
 */
function buildCompactingInstructions(): string {
  return `You are a conversation summarizer. Your task is to compress the conversation history above into a compact summary that preserves all essential context for continuing the conversation.

**What to preserve:**
- Key decisions, conclusions, and outcomes reached
- Important facts, data, or values mentioned by the user
- User preferences, constraints, and goals stated
- Significant code, technical details, or instructions (keep verbatim if important)
- The most recent topic/task being worked on
- Results of tool calls and actions taken
- CDN URLs for images, audio, and video - copy these verbatim exactly as they appear (e.g. https://...)

**What to omit:**
- System instructions, skill personas, or role-play framing
- Tool definitions, function signatures, or available-tool descriptions
- Greetings, pleasantries, and filler exchanges
- Redundant or superseded information
- Any content that is only relevant to the system and not to the user conversation

**Format:**
- Write in past tense from a neutral observer perspective
- Group related points together
- Use bullet points for clarity
- Output ONLY the summary - no preamble, no meta-commentary, no section headers like "Summary:"`;
}

/**
 * Outcome of the shared summarization stream. The caller decides the failure
 * policy per status:
 * - "done": finish part received, non-empty summary, emitCompactingDone emitted.
 * - "no-finish": stream ended without a finish part (provider quirk / early
 *   abort); no emitCompactingDone was emitted - caller decides.
 * - "empty": finish part received but the summary was blank; nothing emitted.
 * - "stream-error": the fullStream yielded an error part; nothing emitted.
 * - "exception": streamText / iteration threw; nothing emitted.
 */
type CompactingLLMOutcome =
  | { status: "done"; compactedSummary: string }
  | { status: "no-finish"; compactedSummary: string }
  | { status: "empty"; inputTokens: number; outputTokens: number }
  | { status: "stream-error"; error: Error }
  | { status: "exception"; error: Error };

/**
 * Run the summarization LLM stream shared by pre-stream and mid-stream
 * compacting: no system prompt, no tools, temperature 0.3 when supported,
 * hard timeout, text-delta accumulation with emitCompactingDelta, and on a
 * successful finish: usage-based credit accounting + emitCompactingDone.
 * All error/empty handling (emitCompactingFailed, emitError, aborts) stays
 * with the caller - policies differ between the two handlers.
 */
async function runCompactingLLM(params: {
  compactingMessages: ModelMessage[];
  providerModel: Parameters<typeof streamText>[0]["model"];
  model: ChatModelId;
  compactingMessageId: string;
  threadId: string;
  /** Forwarded verbatim into emitCompactingDone (mid-stream passes []). */
  messagesToCompact: ChatMessage[];
  user: JwtPayloadType;
  abortSignal: AbortSignal;
  ctx: StreamContext;
  logger: EndpointLogger;
}): Promise<CompactingLLMOutcome> {
  const {
    compactingMessages,
    providerModel,
    model,
    compactingMessageId,
    threadId,
    messagesToCompact,
    user,
    abortSignal,
    ctx,
  } = params;

  const modelConfig = getChatModelById(model);
  const temperatureParam =
    modelConfig?.features.supportsTemperature !== false
      ? { temperature: 0.3 }
      : {};

  let compactedSummary = "";
  let finishHandled = false;

  try {
    const streamResult = await streamText({
      model: providerModel,
      // Do NOT pass system prompt or tools - compacting is a pure summarization
      // task that should not be influenced by skill personas, tool definitions,
      // or other system-level instructions that would bloat the context.
      messages: compactingMessages,
      ...temperatureParam,
      // Hard cap: a stalled provider must fail the compacting call quickly
      // (the caller aborts the stream cleanly) instead of holding the
      // thread until a network-level timeout minutes later.
      abortSignal: AbortSignal.any([
        abortSignal,
        AbortSignal.timeout(COMPACTING_LLM_TIMEOUT_MS),
      ]),
    });

    for await (const part of streamResult.fullStream) {
      if (part.type === "text-delta") {
        compactedSummary += part.text;
        ctx.dbWriter.emitCompactingDelta(compactingMessageId, part.text);
      }

      if (part.type === "finish") {
        finishHandled = true;
        const usageData = await streamResult.usage;
        const inputTokens = usageData.inputTokens ?? 0;
        const outputTokens = usageData.outputTokens ?? 0;
        const totalTokens = usageData.totalTokens ?? 0;
        const cachedInputTokens =
          usageData.cachedInputTokens ??
          usageData.inputTokenDetails?.cacheReadTokens ??
          0;
        const uncachedInputTokens = inputTokens - cachedInputTokens;

        // Empty summary is worse than no compacting — it would erase context.
        // The caller decides whether that fails the stream or is skipped.
        if (compactedSummary.trim() === "") {
          return { status: "empty", inputTokens, outputTokens };
        }

        const creditCost = calculateCreditCost(
          modelConfig,
          uncachedInputTokens,
          outputTokens,
        );

        // DB update + TOKENS_UPDATED + CREDITS_DEDUCTED + COMPACTING_DONE
        await ctx.dbWriter.emitCompactingDone({
          messageId: compactingMessageId,
          threadId,
          content: compactedSummary,
          inputTokens,
          outputTokens,
          totalTokens,
          uncachedInputTokens,
          model,
          messagesToCompact,
          user,
          creditCost,
        });
      }

      if (part.type === "error") {
        const errorObj =
          part.error instanceof Error
            ? part.error
            : new Error(String(part.error));
        return { status: "stream-error", error: errorObj };
      }
    }
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    return { status: "exception", error: errorObj };
  }

  if (!finishHandled) {
    return { status: "no-finish", compactedSummary };
  }
  return { status: "done", compactedSummary };
}
/**
 * Compacting Handler
 * Executes history compacting as a sub-stream operation
 */

/**
 * Compacting Handler
 * Manages the compacting sub-stream operation
 */
export class CompactingHandler {
  /**
   * Execute compacting operation as a sub-stream
   */
  static async executeCompacting(params: {
    messagesToCompact: ChatMessage[];
    branchMessages: ChatMessage[];
    currentUserMessage: ChatMessage | null;
    threadId: string;
    parentId: string | null;
    sequenceId: string;
    ctx: StreamContext;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    model: ChatModelId;
    skill: string | null;
    providerModel: Parameters<typeof streamText>[0]["model"];
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    timezone: string;
    rootFolderId: DefaultFolderId;
    compactingMessageCreatedAt: Date;
    t: AiStreamT;
    /** Pre-gap-filled history messages. When provided, skip internal MessageConverter call. */
    preFilledHistoryMessages?: Parameters<typeof streamText>[0]["messages"];
  }): Promise<
    | {
        success: true;
        compactedSummary: string;
        compactingMessageId: string;
      }
    | {
        success: false;
        compactingMessageId: string;
      }
  > {
    const {
      messagesToCompact,
      branchMessages,
      threadId,
      parentId,
      sequenceId,
      ctx,
      userId,
      user,
      model,
      skill,
      providerModel,
      abortSignal,
      logger,
      timezone,
      rootFolderId,
      compactingMessageCreatedAt,
      t,
    } = params;

    const compactingMessageId = uuidv4();

    // Use pre-gap-filled messages if provided (avoids re-conversion + gap fill is already done)
    const historyMessages = params.preFilledHistoryMessages
      ? params.preFilledHistoryMessages
      : await MessageConverter.toAiSdkMessages(
          branchMessages,
          logger,
          timezone,
          rootFolderId,
        );

    const { CONTEXT_LINE_PREFIX, formatAbsoluteTimestamp } =
      await import("../system-prompt/builder");
    const shortId = compactingMessageId.slice(-8);
    const timestamp = formatAbsoluteTimestamp(
      compactingMessageCreatedAt,
      timezone,
      logger,
    );

    const compactingModeContext = `${CONTEXT_LINE_PREFIX}ID:${shortId} | Posted:${timestamp} | Mode:auto-compacting]`;
    const compactingInstructions = buildCompactingInstructions();

    const metadataParts: string[] = [`ID:${shortId}`];
    metadataParts.push(`Model:${model}`);
    if (skill) {
      metadataParts.push(`Skill:${skill}`);
    }
    metadataParts.push(`Mode:compacting`);
    metadataParts.push(`Posted:${timestamp}`);
    const finalContextMessage = `${CONTEXT_LINE_PREFIX}${metadataParts.join(" | ")}]`;

    const compactingMessages: ModelMessage[] = [
      ...historyMessages,
      { role: "system" as const, content: compactingModeContext },
      { role: "user" as const, content: compactingInstructions },
      { role: "system" as const, content: finalContextMessage },
    ];

    // Check if any message being compacted has generated media or variants
    const containsMediaReferences = messagesToCompact.some(
      (m) =>
        (m.metadata?.generatedMedia !== null &&
          m.metadata?.generatedMedia !== undefined) ||
        (m.metadata?.variants !== null &&
          m.metadata?.variants !== undefined &&
          m.metadata.variants.length > 0),
    );

    // Emit MESSAGE_CREATED SSE + insert to DB
    await ctx.dbWriter.emitCompactingMessageCreated({
      messageId: compactingMessageId,
      threadId,
      parentId,
      sequenceId,
      model,
      skill: skill ?? null,
      userId,
      messagesToCompact,
      createdAt: compactingMessageCreatedAt,
      containsMediaReferences,
    });

    // Re-parent user message: compacting inserted itself before the user message,
    // so update the user message's parentId → compactingMessageId.
    // This fixes both the DB record and the client SSE event so the chain is:
    //   effectiveParentMessage → compacting → user → AI
    const { currentUserMessage } = params;
    if (currentUserMessage && !params.isIncognito) {
      await MessagesRepository.reparentUserMessage({
        messageId: currentUserMessage.id,
        newParentId: compactingMessageId,
        logger,
      });
      // Mirror the compacting insert + user re-parent to peers when this is a
      // REMOTE-folder owned thread. The live relay already delivered the
      // PRE-reparent user message to the caller; without this push the caller's
      // mirror keeps the stale parent and the compacting node orphans into a
      // branch. pushThreadSync no-ops for non-mirrored threads.
      if (userId) {
        const { pushThreadSync } =
          await import("@/app/api/[locale]/agent/chat/threads/sync-provider");
        await pushThreadSync(threadId, userId, logger);
      }
    }
    if (currentUserMessage) {
      ctx.dbWriter.emitUserMessageCreated({
        messageId: currentUserMessage.id,
        threadId,
        content: currentUserMessage.content ?? "",
        parentId: compactingMessageId,
        model,
        skill: skill,
        metadata: currentUserMessage.metadata ?? undefined,
      });
    }

    const outcome = await runCompactingLLM({
      compactingMessages,
      providerModel,
      model,
      compactingMessageId,
      threadId,
      messagesToCompact,
      user,
      abortSignal,
      ctx,
      logger,
    });

    switch (outcome.status) {
      case "empty": {
        // Empty summary is worse than no compacting — it would erase context.
        // Treat it as a failure so the stream stops rather than continuing with
        // a blank "summary" that discards the entire conversation history.
        logger.error(
          "[Compacting] LLM produced no text output - treating as compacting failure",
          {
            inputTokens: outcome.inputTokens,
            outputTokens: outcome.outputTokens,
          },
        );
        await ctx.dbWriter.emitCompactingFailed({
          messageId: compactingMessageId,
          errorMessage: "Compacting LLM produced no text output",
        });
        ctx.dbWriter.emitError(
          fail({
            message: t("errors.compactingStreamError"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          }),
          ctx.lastParentId,
        );
        return { success: false, compactingMessageId };
      }
      case "stream-error": {
        const errorObj = outcome.error;
        logger.error("[Compacting] Stream error", errorObj);

        await ctx.dbWriter.emitCompactingFailed({
          messageId: compactingMessageId,
          errorMessage: errorObj.message,
        });

        const isContextLimit =
          errorObj.message.toLowerCase().includes("context length") ||
          errorObj.message.toLowerCase().includes("context window") ||
          errorObj.message.toLowerCase().includes("maximum context") ||
          errorObj.message.toLowerCase().includes("input tokens") ||
          errorObj.message.toLowerCase().includes("token limit");

        const tokenMatch = /(\d[\d,]+)\s*(?:input\s*)?tokens/i.exec(
          errorObj.message,
        );
        const tokenCount = tokenMatch ? tokenMatch[1].replace(/,/g, "") : null;
        const isExpensive =
          isContextLimit &&
          tokenCount !== null &&
          parseInt(tokenCount, 10) > 100_000;

        const userMessage = isExpensive
          ? t("errors.compactingStreamErrorExpensive", {
              tokens: tokenCount ?? "unknown",
            })
          : t("errors.compactingStreamError");

        ctx.dbWriter.emitError(
          fail({
            message: userMessage,
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          }),
          ctx.lastParentId,
        );

        return { success: false, compactingMessageId };
      }
      case "exception": {
        const errorObj = outcome.error;
        logger.error("[Compacting] Failed to compact history", errorObj);

        await ctx.dbWriter.emitCompactingFailed({
          messageId: compactingMessageId,
          errorMessage: errorObj.message,
        });

        ctx.dbWriter.emitError(
          fail({
            message: t("errors.compactingException"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          }),
          ctx.lastParentId,
        );

        return { success: false, compactingMessageId };
      }
      case "done":
      case "no-finish":
        // Pre-stream compacting treats a missing finish part the same as done:
        // whatever summary accumulated is used (matches the pre-extraction code,
        // which returned success after the loop unconditionally).
        return {
          success: true,
          compactedSummary: outcome.compactedSummary,
          compactingMessageId,
        };
    }
  }
}
/**
 * MidStreamCompactingHandler - Compacts accumulated stepMessages between tool-loop steps.
 *
 * Unlike CompactingHandler (which runs before the main stream and works with DB records),
 * this handler works with ModelMessage[] already in AI SDK format — no DB fetch needed.
 * It is invoked from prepareStep when real API-reported input tokens exceed
 * Math.min(effectiveCompactTrigger, floor(contextWindow * COMPACT_TRIGGER_PERCENTAGE)) —
 * the same effective threshold as pre-stream compacting, applied to real counts instead of estimates.
 */

/** How many recent non-system messages to preserve verbatim (not summarized). */
const RECENT_TURNS_TO_KEEP = 8;

export class MidStreamCompactingHandler {
  /**
   * Compact accumulated stepMessages mid-stream between tool-loop steps.
   *
   * Partitions messages into system / middle / recent, summarizes the middle portion,
   * writes a compacting record to DB, and returns the compacted ModelMessage[] for
   * prepareStep to return to the AI SDK.
   *
   * Returns null in two cases:
   * - Nothing to compact (middleTurns empty) — stream continues unchanged, no abort.
   * - Compacting failed — stream is aborted via streamAbortController before returning null.
   *
   * On success returns { messages, compactingMessageId } so the caller can update
   * ctx.currentParentId to the compacting message — maintaining the linked list.
   */
  static async compact(params: {
    stepMessages: ModelMessage[];
    ctx: StreamContext;
    model: ChatModelId;
    skill: string;
    threadId: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    providerModel: Parameters<typeof streamText>[0]["model"];
    abortSignal: AbortSignal;
    streamAbortController: AbortController;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<{
    messages: ModelMessage[];
    compactingMessageId: string;
  } | null> {
    const {
      stepMessages,
      ctx,
      model,
      skill,
      threadId,
      userId,
      user,
      providerModel,
      abortSignal,
      streamAbortController,
      logger,
      t,
    } = params;

    // Partition messages
    const systemMessages = stepMessages.filter((m) => m.role === "system");
    const nonSystemMessages = stepMessages.filter((m) => m.role !== "system");

    // Always preserve the first non-system message (the original user task prompt) verbatim.
    // It must never be summarized away — the AI needs the task instruction even after compacting.
    const firstUserMessage = nonSystemMessages[0];
    const afterFirst = nonSystemMessages.slice(1);

    // Take the last RECENT_TURNS_TO_KEEP messages from afterFirst as the "recent" tail.
    // IMPORTANT: The split point must land on an `assistant` or `user` message boundary —
    // never on a `tool` result message. A `tool` result without its preceding `assistant`
    // tool-call message would cause AI SDK's AI_MissingToolResultsError on the next step.
    //
    // Walk backward from the desired cut index to find the nearest boundary.
    let cutIndex = Math.max(0, afterFirst.length - RECENT_TURNS_TO_KEEP);
    while (cutIndex > 0 && afterFirst[cutIndex]?.role === "tool") {
      cutIndex--;
    }

    const recentTurns = afterFirst.slice(cutIndex);
    const middleTurns = afterFirst.slice(0, cutIndex);

    // Nothing to compact — token pressure comes from system messages or a single huge
    // recent turn, neither of which we can safely summarize. Continue without compacting.
    if (middleTurns.length === 0) {
      logger.debug(
        "[MidStreamCompacting] No middle turns to compact - skipping",
        {
          nonSystemMessageCount: nonSystemMessages.length,
          recentTurnsToKeep: RECENT_TURNS_TO_KEEP,
        },
      );
      return null;
    }

    const compactingMessageId = uuidv4();
    const compactingSequenceId = uuidv4();
    const createdAt = new Date();

    logger.debug("[MidStreamCompacting] Starting mid-stream compacting", {
      threadId,
      totalMessages: stepMessages.length,
      systemMessageCount: systemMessages.length,
      middleTurnsCount: middleTurns.length,
      recentTurnsCount: recentTurns.length,
      compactingMessageId,
    });

    // Write compacting record to DB + emit SSE so the UI shows the compacting
    // bubble. The compacting node must sit on the CURRENT turn's tip so the
    // next assistant chains through it (pendingQueueParentId, set by the
    // caller). ctx parent fields are unreliable at the step boundary: at step
    // 0→1 currentParentId still holds the user message's PARENT (not the user
    // message), which would make the compacting node a sibling of the user
    // message and orphan it. Resolve the thread's newest committed message
    // from the DB — the unambiguous current leaf in every step.
    const pendingTail = [...ctx.pendingToolMessages.values()].at(-1);
    let compactingParentId = pendingTail?.messageId ?? ctx.currentParentId;
    if (!pendingTail) {
      const { db } = await import("next-vibe/database");
      const { chatMessages } = await import("@/app/api/[locale]/agent/chat/db");
      const { eq, desc } = await import("drizzle-orm");
      const [dbLeaf] = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(eq(chatMessages.threadId, threadId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(1);
      if (dbLeaf) {
        compactingParentId = dbLeaf.id;
      }
    }
    await ctx.dbWriter.emitCompactingMessageCreated({
      messageId: compactingMessageId,
      threadId,
      parentId: compactingParentId,
      sequenceId: compactingSequenceId,
      model,
      skill: skill || null,
      userId,
      messagesToCompact: [],
      createdAt,
      containsMediaReferences: false,
    });

    const compactingMessages: ModelMessage[] = [
      ...systemMessages,
      ...middleTurns,
      {
        role: "user" as const,
        content: buildCompactingInstructions(),
      },
    ];

    const outcome = await runCompactingLLM({
      compactingMessages,
      providerModel,
      model,
      compactingMessageId,
      threadId,
      messagesToCompact: [],
      user,
      abortSignal,
      ctx,
      logger,
    });

    // Empty summary is worse than no compacting — it would erase context.
    if (outcome.status === "empty") {
      const { inputTokens, outputTokens } = outcome;
      if (outputTokens > 0) {
        // Model produced tokens but no text (reasoning-only response, e.g. kimi-k2.6).
        // Skip compacting and continue stream with original messages — safer than aborting.
        logger.warn(
          "[MidStreamCompacting] LLM produced reasoning tokens but no text — skipping compacting, stream continues",
          { inputTokens, outputTokens },
        );
        await ctx.dbWriter.emitCompactingFailed({
          messageId: compactingMessageId,
          errorMessage: "Reasoning-only response, no text produced",
        });
        return null;
      }
      logger.error(
        "[MidStreamCompacting] LLM produced no text output - treating as compacting failure",
        { inputTokens, outputTokens },
      );
      await MidStreamCompactingHandler.handleFailure({
        compactingMessageId,
        errorMessage: "Compacting LLM produced no text output",
        ctx,
        streamAbortController,
        t,
      });
      return null;
    }

    if (outcome.status === "stream-error") {
      const errorObj = outcome.error;
      logger.error("[MidStreamCompacting] Stream error part", errorObj);
      // Don't call handleFailure if the outer abort signal is already set —
      // that means the main stream was cancelled by the user, not by us.
      if (!abortSignal.aborted) {
        await MidStreamCompactingHandler.handleFailure({
          compactingMessageId,
          errorMessage: errorObj.message,
          ctx,
          streamAbortController,
          t,
        });
      } else {
        await ctx.dbWriter.emitCompactingFailed({
          messageId: compactingMessageId,
          errorMessage: errorObj.message,
        });
      }
      return null;
    }

    if (outcome.status === "exception") {
      const errorObj = outcome.error;

      // If the outer abort signal fired, this is a user cancellation — don't emit a
      // compacting error on top of it, just mark the compacting message as failed quietly.
      if (abortSignal.aborted) {
        logger.debug(
          "[MidStreamCompacting] Compacting interrupted by stream abort",
          { compactingMessageId },
        );
        await ctx.dbWriter.emitCompactingFailed({
          messageId: compactingMessageId,
          errorMessage: "Interrupted",
        });
        return null;
      }

      logger.error("[MidStreamCompacting] Compacting failed", errorObj);
      await MidStreamCompactingHandler.handleFailure({
        compactingMessageId,
        errorMessage: errorObj.message,
        ctx,
        streamAbortController,
        t,
      });
      return null;
    }

    const { compactedSummary } = outcome;

    // Safety: if the loop exited without a finish part (provider quirk or early abort),
    // and we have a summary, finalize it. If no summary, mark as failed.
    if (outcome.status === "no-finish") {
      if (compactedSummary.length > 0) {
        await ctx.dbWriter.emitCompactingDone({
          messageId: compactingMessageId,
          threadId,
          content: compactedSummary,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          uncachedInputTokens: 0,
          model,
          messagesToCompact: [],
          user,
          creditCost: 0,
        });
      } else if (!abortSignal.aborted) {
        // Loop exited cleanly but no content and no finish — treat as failure
        logger.warn(
          "[MidStreamCompacting] Stream ended without finish part and no summary",
          { compactingMessageId },
        );
        await MidStreamCompactingHandler.handleFailure({
          compactingMessageId,
          errorMessage: "Stream ended without producing a summary",
          ctx,
          streamAbortController,
          t,
        });
        return null;
      }
    }

    // Build the compacted message array for the SDK.
    // Structure: system messages → original user task (always preserved) →
    //            summary of middle turns → recent turns verbatim.
    const compacted: ModelMessage[] = [
      ...systemMessages,
      ...(firstUserMessage ? [firstUserMessage] : []),
      {
        role: "system" as const,
        content: `Previous conversation summary:\n\n${compactedSummary}`,
      },
      ...recentTurns,
    ];

    logger.debug("[MidStreamCompacting] Compacting complete", {
      compactingMessageId,
      originalMessageCount: stepMessages.length,
      compactedMessageCount: compacted.length,
      summaryLength: compactedSummary.length,
    });

    return { messages: compacted, compactingMessageId };
  }

  private static async handleFailure(params: {
    compactingMessageId: string;
    errorMessage: string;
    ctx: StreamContext;
    streamAbortController: AbortController;
    t: AiStreamT;
  }): Promise<void> {
    const { compactingMessageId, errorMessage, ctx, streamAbortController, t } =
      params;

    await ctx.dbWriter.emitCompactingFailed({
      messageId: compactingMessageId,
      errorMessage,
    });

    // Error message is a child of the compacting bubble so it appears inline
    // in the thread beneath the failed compacting, not as an orphaned root message.
    ctx.dbWriter.emitError(
      fail({
        message: t("errors.compactingStreamError"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      }),
      compactingMessageId,
    );

    streamAbortController.abort(
      new StreamAbortError(AbortReason.CONTEXT_WINDOW_GUARD),
    );
  }
}
