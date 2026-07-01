import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { buildSystemPrompt } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/builder";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

import type { SystemPromptDebugResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export async function buildDebugSystemPrompt({
  rootFolderId,
  userMessage,
  threadId,
  skillId,
  subFolderId,
  user,
  locale,
  logger,
}: {
  rootFolderId: DefaultFolderId;
  userMessage?: string;
  threadId?: string;
  skillId?: string;
  subFolderId?: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<ResponseType<SystemPromptDebugResponseOutput>> {
  const { t } = scopedTranslation.scopedT(locale);
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
