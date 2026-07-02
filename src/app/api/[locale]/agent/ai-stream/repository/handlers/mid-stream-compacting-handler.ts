/**
 * MidStreamCompactingHandler - Compacts accumulated stepMessages between tool-loop steps.
 *
 * Unlike CompactingHandler (which runs before the main stream and works with DB records),
 * this handler works with ModelMessage[] already in AI SDK format — no DB fetch needed.
 * It is invoked from prepareStep when real API-reported input tokens exceed
 * Math.min(effectiveCompactTrigger, floor(contextWindow * COMPACT_TRIGGER_PERCENTAGE)) —
 * the same effective threshold as pre-stream compacting, applied to real counts instead of estimates.
 */

import "server-only";

import type { ModelMessage, streamText } from "ai";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { v4 as uuidv4 } from "uuid";

import type { AiStreamT } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";

import type { ChatModelId } from "../../models";
import { AbortReason, StreamAbortError } from "../core/constants";
import type { StreamContext } from "../core/stream-context";
import {
  buildCompactingInstructions,
  runCompactingLLM,
} from "./compacting-shared";

/** How many recent non-system messages to preserve verbatim (not summarized). */
const RECENT_TURNS_TO_KEEP = 8;

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

    const compactingMessages: Parameters<typeof streamText>[0]["messages"] = [
      ...systemMessages,
      ...middleTurns,
      {
        role: "user" as const,
        content: buildCompactingInstructions(),
      },
    ];

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
        messages: compactingMessages,
        ...temperatureParam,
        // Hard cap: a stalled provider must fail the compacting call quickly
        // (handleFailure aborts the stream cleanly) instead of holding the
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
          if (compactedSummary.trim() === "") {
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

          const creditCost = calculateCreditCost(
            modelConfig,
            uncachedInputTokens,
            outputTokens,
          );

          await ctx.dbWriter.emitCompactingDone({
            messageId: compactingMessageId,
            threadId,
            content: compactedSummary,
            inputTokens,
            outputTokens,
            totalTokens,
            uncachedInputTokens,
            model,
            messagesToCompact: [],
            user,
            creditCost,
          });
        }

        if (part.type === "error") {
          const errorObj =
            part.error instanceof Error
              ? part.error
              : new Error(String(part.error));
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
      }

      // Safety: if the loop exited without a finish part (provider quirk or early abort),
      // and we have a summary, finalize it. If no summary, mark as failed.
      if (!finishHandled) {
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
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

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
