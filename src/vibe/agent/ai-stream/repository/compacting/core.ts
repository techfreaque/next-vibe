/**
 * Compacting shared primitives
 * Used by both the pre-stream CompactingHandler and the MidStreamCompactingHandler:
 * the summarization instructions and the summarization LLM stream skeleton.
 * Each handler keeps its own input preparation and failure policy.
 */

import "server-only";

import { type ModelMessage, streamText } from "ai";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatMessage } from "../../../chat/db";
import { calculateCreditCost } from "../../../models/models";
import { type ChatModelId, getChatModelById } from "../../models";
import type { ToolExecutionContextImpl } from "../core/stream";

/**
 * Hard cap for the compacting LLM call. Summarization of a large thread
 * streams well within this; only a stalled provider connection exceeds it.
 */
const COMPACTING_LLM_TIMEOUT_MS = 600_000;

/**
 * Build compacting instructions (without conversation text)
 */
export function buildCompactingInstructions(): string {
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
export type CompactingLLMOutcome =
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
export async function runCompactingLLM(params: {
  compactingMessages: ModelMessage[];
  providerModel: Parameters<typeof streamText>[0]["model"];
  model: ChatModelId;
  compactingMessageId: string;
  threadId: string;
  /** Forwarded verbatim into emitCompactingDone (mid-stream passes []). */
  messagesToCompact: ChatMessage[];
  user: JwtPayloadType;
  abortSignal: AbortSignal;
  ctx: ToolExecutionContextImpl;
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
      allowSystemInMessages: true,
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
          usageData.inputTokenDetails?.cacheReadTokens ?? 0;
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
