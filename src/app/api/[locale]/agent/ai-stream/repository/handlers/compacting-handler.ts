/**
 * Compacting Handler
 * Executes history compacting as a sub-stream operation
 */

import "server-only";

import { streamText } from "ai";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { v4 as uuidv4 } from "uuid";

import {
  calculateCreditCost,
  getModelById,
  type ModelId,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage } from "../../../chat/db";
import type { StreamContext } from "../core/stream-context";
import { MessageConverter } from "./message-converter";

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

**What to omit:**
- System instructions, character personas, or role-play framing
- Tool definitions, function signatures, or available-tool descriptions
- Greetings, pleasantries, and filler exchanges
- Redundant or superseded information
- Any content that is only relevant to the system and not to the user conversation

**Format:**
- Write in past tense from a neutral observer perspective
- Group related points together
- Use bullet points for clarity
- Output ONLY the summary — no preamble, no meta-commentary, no section headers like "Summary:"`;
}

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
    depth: number;
    sequenceId: string;
    ctx: StreamContext;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    model: ModelId;
    character: string | null;
    providerModel: Parameters<typeof streamText>[0]["model"];
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    timezone: string;
    rootFolderId?: DefaultFolderId;
    compactingMessageCreatedAt: Date;
  }): Promise<
    | {
        success: true;
        compactedSummary: string;
        compactingMessageId: string;
        newParentId: string;
        newDepth: number;
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
      depth,
      sequenceId,
      ctx,
      userId,
      user,
      model,
      character,
      providerModel,
      abortSignal,
      logger,
      timezone,
      rootFolderId,
      compactingMessageCreatedAt,
    } = params;

    const compactingMessageId = uuidv4();

    const historyMessages = await MessageConverter.toAiSdkMessages(
      branchMessages,
      logger,
      timezone,
      rootFolderId,
    );

    const { formatAbsoluteTimestamp } =
      await import("../system-prompt/message-metadata");
    const shortId = compactingMessageId.slice(-8);
    const timestamp = formatAbsoluteTimestamp(
      compactingMessageCreatedAt,
      timezone,
    );

    const compactingModeContext = `[Context: ID:${shortId} | Posted:${timestamp} | Mode:auto-compacting]`;
    const compactingInstructions = buildCompactingInstructions();

    const metadataParts: string[] = [`ID:${shortId}`];
    metadataParts.push(`Model:${model}`);
    if (character) {
      metadataParts.push(`Character:${character}`);
    }
    metadataParts.push(`Mode:compacting`);
    metadataParts.push(`Posted:${timestamp}`);
    const finalContextMessage = `[Context: ${metadataParts.join(" | ")}]`;

    const compactingMessages: Parameters<typeof streamText>[0]["messages"] = [
      ...historyMessages,
      { role: "system" as const, content: compactingModeContext },
      { role: "user" as const, content: compactingInstructions },
      { role: "system" as const, content: finalContextMessage },
    ];

    // Emit MESSAGE_CREATED SSE + insert to DB
    await ctx.dbWriter.emitCompactingMessageCreated({
      messageId: compactingMessageId,
      threadId,
      parentId,
      depth,
      sequenceId,
      model,
      character: character ?? null,
      userId,
      messagesToCompact,
      createdAt: compactingMessageCreatedAt,
    });

    let compactedSummary = "";

    try {
      const streamResult = await streamText({
        model: providerModel,
        // Do NOT pass system prompt or tools — compacting is a pure summarization
        // task that should not be influenced by character personas, tool definitions,
        // or other system-level instructions that would bloat the context.
        messages: compactingMessages,
        temperature: 0.3,
        abortSignal,
      });

      for await (const part of streamResult.fullStream) {
        if (part.type === "text-delta") {
          compactedSummary += part.text;
          ctx.dbWriter.emitCompactingDelta(compactingMessageId, part.text);
        }

        if (part.type === "finish") {
          const usageData = await streamResult.usage;
          const inputTokens = usageData.inputTokens ?? 0;
          const outputTokens = usageData.outputTokens ?? 0;
          const totalTokens = usageData.totalTokens ?? 0;

          const cachedInputTokens =
            usageData.cachedInputTokens ??
            usageData.inputTokenDetails?.cacheReadTokens ??
            0;
          const uncachedInputTokens = inputTokens - cachedInputTokens;

          const modelConfig = getModelById(model);
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
          logger.error("[Compacting] Stream error", errorObj);

          ctx.dbWriter.emitError(
            fail({
              message:
                "app.api.agent.chat.aiStream.errors.compactingStreamError" as const,
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              messageParams: { error: errorObj.message },
            }),
          );

          return { success: false, compactingMessageId };
        }
      }
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      logger.error("[Compacting] Failed to compact history", errorObj);

      ctx.dbWriter.emitError(
        fail({
          message:
            "app.api.agent.chat.aiStream.errors.compactingException" as const,
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: { error: errorObj.message },
        }),
      );

      return { success: false, compactingMessageId };
    }

    return {
      success: true,
      compactedSummary,
      compactingMessageId,
      newParentId: compactingMessageId,
      newDepth: depth + 1,
    };
  }
}
