/**
 * Refusal Index - one headless single-turn model call.
 *
 * Every model contact of the index goes through here: the target model
 * answering a question, the judge classifying it and the generator proposing
 * questions. It is a sub-agent call through the same headless stream ai-run
 * uses (incognito, no memories, no skill, no tools), so models that are weak
 * at tool calling (Uncensored LM) are measured on plain chat only.
 */

import "server-only";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { fail, success } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatModelId } from "../ai-stream/models";
import { AiStreamRepository } from "../ai-stream/repository";
import type { AiStreamPostRequestOutput } from "../ai-stream/stream/definition";
import { scopedTranslation as aiStreamScopedTranslation } from "../ai-stream/stream/i18n";
import { ChatMessageRole } from "../chat/enum";
import { NO_SKILL_ID } from "../skills/constants";
import { buildFavoriteConfig } from "../skills/favorites/repository";
import { stripThinkTags } from "../text-to-speech/content-processing";

export interface AskOk {
  /** Null when the provider returned no content (content-filter / empty stream). */
  text: string | null;
  cost: number;
}

export interface AskParams {
  modelId: ChatModelId;
  content: string;
  instruction: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  abortSignal: AbortSignal;
  fixtureScopeId: string | undefined;
}

export async function askModel(
  params: AskParams,
): Promise<ResponseType<AskOk>> {
  const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(params.locale);
  const syntheticData: AiStreamPostRequestOutput = {
    operation: "send",
    rootFolderId: DefaultFolderId.INCOGNITO,
    subFolderId: null,
    threadId: crypto.randomUUID(),
    userMessageId: null,
    parentMessageId: null,
    content: params.content,
    role: ChatMessageRole.USER,
    model: params.modelId,
    skill: NO_SKILL_ID,
    favoriteConfig: buildFavoriteConfig({
      id: "refusal-index-headless",
      skillId: NO_SKILL_ID,
      availableTools: [],
      pinnedTools: [],
    }),
    toolConfirmations: null,
    messageHistory: [],
    voiceMode: { enabled: false },
    audioInput: { file: null },
    resumeToken: null,
    timezone: "UTC",
    attachments: null,
    executionContext: { mode: "local" as const },
  };
  const result = await AiStreamRepository.createAiStream({
    data: syntheticData,
    locale: params.locale,
    logger: params.logger,
    user: params.user,
    request: undefined,
    t: aiStreamT,
    awaitResult: true,
    subAgentDepth: 1,
    extraInstructions: params.instruction,
    excludeMemories: true,
    maxToolCalls: 1,
    parentAbortSignal: params.abortSignal,
    fixtureScopeId: params.fixtureScopeId,
    // Platform benchmark: measures how often each model refuses, uncensored
    // ones included. Not a person chatting, so no consent gate.
    skipUncensoredConsentGate: true,
  });
  if (!result.success) {
    return fail({
      message: result.message,
      errorType: result.errorType,
    });
  }
  const raw = result.data.lastAiMessageContent;
  const text = raw ? stripThinkTags(raw).trim() : "";
  return success({
    text: text.length > 0 ? text : null,
    cost: result.data.totalCreditsDeducted ?? 0,
  });
}
