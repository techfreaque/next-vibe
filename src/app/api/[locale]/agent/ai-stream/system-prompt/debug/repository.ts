import "server-only";

import {
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { buildSystemPrompt } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/builder";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { SystemPromptDebugResponseOutput } from "./definition";
import type { SystemPromptDebugT } from "./i18n";

interface DebugSystemPromptParams {
  rootFolderId: DefaultFolderId;
  userMessage?: string;
  threadId?: string;
  skillId?: string;
  subFolderId?: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: SystemPromptDebugT;
}

export async function buildDebugSystemPrompt(
  params: DebugSystemPromptParams,
): Promise<ResponseType<SystemPromptDebugResponseOutput>> {
  const {
    rootFolderId,
    userMessage,
    threadId,
    skillId,
    subFolderId,
    user,
    locale,
    logger,
    t,
  } = params;

  try {
    const userId = user.isPublic ? undefined : user.id;

    const [{ systemPrompt, trailingSystemMessage }, rawScores] =
      await Promise.all([
        buildSystemPrompt({
          skillId: skillId ?? null,
          user,
          logger,
          locale,
          rootFolderId: rootFolderId as DefaultFolderId,
          subFolderId: subFolderId ?? null,
          callMode: false,
          headless: false,
          subAgentDepth: 0,
          lastUserMessage: userMessage,
          threadId: threadId ?? null,
        }),
        userMessage && userId
          ? import("@/app/api/[locale]/agent/cortex/system-prompt/server")
              .then(({ loadRawEmbeddingScores }) =>
                loadRawEmbeddingScores(userId, userMessage),
              )
              .catch((err) => {
                logger.warn("loadRawEmbeddingScores failed", {
                  error: err instanceof Error ? err.message : String(err),
                });
                return null;
              })
          : Promise.resolve(null),
      ]);

    const totalChars = systemPrompt.length + trailingSystemMessage.length;

    return success({
      systemPrompt,
      trailingSystemMessage,
      charCount: totalChars,
      tokenEstimate: Math.ceil(totalChars / 4),
      cortexDiagnostics: rawScores
        ? {
            embeddingGenerated: rawScores.embeddingGenerated,
            topScores: rawScores.scores,
          }
        : undefined,
    });
  } catch (error) {
    logger.error("Failed to build debug system prompt", parseError(error));
    return fail({
      message: t("get.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
