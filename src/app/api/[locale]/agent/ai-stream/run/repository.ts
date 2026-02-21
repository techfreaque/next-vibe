/**
 * AI Stream Run Repository
 *
 * 1. Execute pre-calls sequentially (split flat args → urlPathParams + data)
 * 2. Build a context block from results, prepend to user prompt
 * 3. Run headless AI stream (no SSE, DB persistence only)
 * 4. Read last assistant message from DB, strip think-tags
 * 5. Return text + token counts + per-call results
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ToolCallResult } from "@/app/api/[locale]/agent/chat/db";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";
import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/parsing";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { HeadlessPreCall } from "../repository/headless";
import { runHeadlessAiStream } from "../repository/headless";
import type {
  AiStreamRunPostRequestOutput,
  AiStreamRunPostResponseOutput,
} from "./definition";

/* eslint-disable i18next/no-literal-string */

/**
 * Strip <think>...</think> reasoning tags from AI message content.
 * Handles both complete tags and incomplete (streaming-cut) trailing tags.
 */
function stripThinkTags(content: string): string {
  let result = content.replace(/<think>[\s\S]*?<\/think>/gi, "");
  result = result.replace(/<think>[\s\S]*$/i, "");
  return result.trim();
}

interface PreCallResult {
  routeId: string;
  args: CliRequestData;
  success: boolean;
  data?: CliRequestData;
  error?: string;
  executionTimeMs?: number;
}

/**
 * Execute a single pre-call and return its result.
 * Args are passed as flat merged data — RouteExecutionExecutor auto-splits
 * urlPathParams from data using the endpoint's requestUrlPathParamsSchema.
 */
async function executePreCall(
  routeId: string,
  mergedArgs: CliRequestData,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<PreCallResult> {
  logger.debug("[AiStreamRun] Executing pre-call", { routeId });

  const result = await RouteExecutionExecutor.executeGenericHandler({
    toolName: routeId,
    data: mergedArgs,
    user,
    locale,
    logger,
    platform: Platform.CLI,
  });

  if (!result.success) {
    return {
      routeId,
      args: mergedArgs,
      success: false,
      error: result.message ?? "Pre-call failed",
    };
  }

  return {
    routeId,
    args: mergedArgs,
    success: true,
    data: result.data as CliRequestData,
  };
}

export class AiStreamRunRepository {
  static async run(
    data: AiStreamRunPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AiStreamRunPostResponseOutput>> {
    try {
      const {
        prompt,
        model,
        character,
        preCalls,
        instructions,
        maxTurns,
        activeTools,
        tools,
        appendThreadId,
        rootFolderId,
        subFolderId,
      } = data;

      // Derive thread mode from fields:
      // incognito rootFolder → no persistence; appendThreadId present → append; else → new
      const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;
      const headlessThreadMode: "none" | "new" | "append" = isIncognito
        ? "none"
        : appendThreadId
          ? "append"
          : "new";

      // ── Step 1: Execute pre-calls sequentially ──────────────────────────
      const preCallResults: PreCallResult[] = [];

      if (preCalls && preCalls.length > 0) {
        for (const call of preCalls) {
          const startTime = Date.now();
          const result = await executePreCall(
            call.routeId,
            call.args as CliRequestData,
            user,
            locale,
            logger,
          );
          preCallResults.push({
            ...result,
            executionTimeMs: Date.now() - startTime,
          });
        }
      }

      logger.debug("[AiStreamRun] Running headless stream", {
        model,
        promptLength: prompt.length,
        preCallCount: preCallResults.length,
      });

      // Map to HeadlessPreCall format for proper tool message injection
      const headlessPreCalls: HeadlessPreCall[] = preCallResults.map((r) => ({
        routeId: r.routeId,
        args: r.args as Record<string, ToolCallResult>,
        result: (r.data ?? null) as ToolCallResult,
        success: r.success,
        error: r.error,
        executionTimeMs: r.executionTimeMs,
      }));

      // ── Step 2: Run headless AI stream ──────────────────────────────────
      // Pre-call results are injected as proper tool messages in the thread
      const streamResult = await runHeadlessAiStream({
        model,
        character,
        prompt,
        availableTools: tools ?? [], // default: no tools (explicit opt-in); null = all tools
        activeTools: activeTools ?? null, // null = all tools permitted
        headlessInstructions: instructions,
        maxTurns: maxTurns ?? 1,
        threadMode: headlessThreadMode,
        threadId: appendThreadId,
        subFolderId,
        rootFolderId: rootFolderId as DefaultFolderId,
        preCalls: headlessPreCalls.length > 0 ? headlessPreCalls : undefined,
        user,
        locale,
        logger,
      });

      if (!streamResult.success) {
        return streamResult;
      }

      const { lastAiMessageId, threadId } = streamResult.data;

      // ── Step 4: Read message content + tokens from DB ───────────────────
      const [aiMessage] = await db
        .select({
          content: chatMessages.content,
          metadata: chatMessages.metadata,
        })
        .from(chatMessages)
        .where(eq(chatMessages.id, lastAiMessageId))
        .limit(1);

      const rawText = aiMessage?.content ?? null;
      const text = rawText ? stripThinkTags(rawText) : null;
      const promptTokens = aiMessage?.metadata?.promptTokens ?? null;
      const completionTokens = aiMessage?.metadata?.completionTokens ?? null;
      const resultThreadId =
        (headlessThreadMode !== "none" ? threadId : null) ?? null;

      // ── Step 5: Fetch thread metadata if persisted ───────────────────────
      let threadTitle: string | null = null;
      let threadCreatedAt: string | null = null;

      if (resultThreadId) {
        const [thread] = await db
          .select({
            title: chatThreads.title,
            createdAt: chatThreads.createdAt,
          })
          .from(chatThreads)
          .where(eq(chatThreads.id, resultThreadId))
          .limit(1);

        threadTitle = thread?.title ?? null;
        threadCreatedAt = thread?.createdAt?.toISOString() ?? null;
      }

      logger.debug("[AiStreamRun] Complete", {
        lastAiMessageId,
        threadId: resultThreadId,
        textLength: text?.length ?? 0,
        promptTokens,
        completionTokens,
      });

      return success({
        text,
        threadId: resultThreadId,
        lastAiMessageId: headlessThreadMode !== "none" ? lastAiMessageId : null,
        threadTitle,
        threadCreatedAt,
        promptTokens,
        completionTokens,
        preCallResults: preCallResults.map((r) => ({
          routeId: r.routeId,
          success: r.success,
          error: r.error ?? null,
        })),
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[AiStreamRun] Failed", { error: msg });
      return fail({
        message: msg,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: msg },
      });
    }
  }
}
