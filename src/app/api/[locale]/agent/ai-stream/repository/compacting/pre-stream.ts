/**
 * Compacting Handler
 * Executes history compacting as a sub-stream operation
 */

import "server-only";

import type { ModelMessage, streamText } from "ai";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { v4 as uuidv4 } from "uuid";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";

import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage } from "../../../chat/db";
import { MessagesRepository } from "../../../chat/threads/[threadId]/messages/repository";
import type { ChatModelId } from "../../models";
import type { AiStreamT } from "../../stream/i18n";
import { toAiSdkMessages } from "../context/convert";
import type { StreamContext } from "../core/stream";
import { buildCompactingInstructions, runCompactingLLM } from "./core";

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
    /** Fixture chain of the calling stream — attachment/media downloads bind it. */
    streamContext: ToolExecutionContext;
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
      : await toAiSdkMessages(
          branchMessages,
          logger,
          timezone,
          rootFolderId,
          undefined,
          undefined,
          params.streamContext,
        );

    const { CONTEXT_LINE_PREFIX, formatAbsoluteTimestamp } =
      await import("../../system-prompt/builder");
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

    // The summarization ASK must be the LAST message. A trailing system/context
    // message after it makes the model treat the request as "continue the
    // conversation" — and because the history is full of structured tool turns,
    // it imitates them and emits a (dead) tool call instead of prose, finishing
    // with reasoning + a tool-call part and ZERO text (empty summary). Keeping
    // the user instruction last is the same principle the toolless native-gen
    // path relies on (see convert.ts appendTrailingSystemMessages): the ask
    // stays LAST so the model answers it. Provenance context therefore precedes
    // the instruction.
    const compactingMessages: ModelMessage[] = [
      ...historyMessages,
      { role: "system" as const, content: compactingModeContext },
      { role: "system" as const, content: finalContextMessage },
      { role: "user" as const, content: compactingInstructions },
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
