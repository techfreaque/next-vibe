import "server-only";

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { chatMessages, chatThreads } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import { stripThinkTags } from "../../text-to-speech/content-processing";
import type { AiStreamRunPostResponseOutput } from "../run/definition";
import type { AiStreamT } from "../stream/i18n";
import { providerErrorTranslationKey } from "./errors/provider-error-key";
import type { HeadlessAiStreamResult } from "./setup/setup";

/**
 * Shape the headless turn result into the ai-run response: read the last
 * assistant message + tokens from the DB (in-memory content for incognito),
 * strip think-tags, fetch thread metadata, and attach the pre-call summary.
 */
export async function shapeRunResult(params: {
  headlessResult: HeadlessAiStreamResult;
  isIncognito: boolean;
  headlessThreadMode: "none" | "new" | "append";
  preCallResults: Array<{
    routeId: string;
    success: boolean;
    error?: string;
  }>;
  logger: EndpointLogger;
  t: AiStreamT;
}): Promise<ResponseType<AiStreamRunPostResponseOutput>> {
  const {
    headlessResult,
    isIncognito,
    headlessThreadMode,
    preCallResults,
    logger,
    t,
  } = params;
  const { lastAiMessageId, threadId, lastAiMessageContent } = headlessResult;

  // Incognito → messages aren't persisted; use in-memory content directly.
  // Persistent modes → DB read also provides token metadata.
  let rawText: string | null = lastAiMessageContent ?? null;
  let promptTokens: number | null = null;
  let completionTokens: number | null = null;
  const creditCost = headlessResult.totalCreditsDeducted ?? null;
  const providerError = headlessResult.providerErrorText;
  // With no assistant write, lastAiMessageId may be a committed user,
  // error or previous-turn message for callers that need a continuation ID.
  // Only this run's own visible text can turn a provider failure into a partial answer.
  if (providerError && !stripThinkTags(rawText ?? "")) {
    return fail({
      message: t(
        providerErrorTranslationKey(providerError) ?? "errors.streamError",
      ),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  if (!isIncognito) {
    const [aiMessage] = await db
      .select({
        content: chatMessages.content,
        metadata: chatMessages.metadata,
      })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.id, lastAiMessageId),
          eq(chatMessages.role, ChatMessageRole.ASSISTANT),
        ),
      )
      .limit(1);

    rawText = providerError ? rawText : (aiMessage?.content ?? rawText);
    promptTokens = aiMessage?.metadata?.promptTokens ?? null;
    completionTokens = aiMessage?.metadata?.completionTokens ?? null;
  }

  const text = rawText ? stripThinkTags(rawText) : null;
  const resultThreadId =
    (headlessThreadMode !== "none" ? threadId : null) ?? null;

  let threadTitle: string | null = null;
  let threadCreatedAt: string | null = null;
  if (resultThreadId) {
    const [thread] = await db
      .select({ title: chatThreads.title, createdAt: chatThreads.createdAt })
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
    creditCost,
    preCallResults: preCallResults.map((r) => ({
      routeId: r.routeId,
      success: r.success,
      error: r.error ?? null,
    })),
  });
}
