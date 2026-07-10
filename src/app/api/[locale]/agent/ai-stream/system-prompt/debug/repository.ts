import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  type BridgeContext,
  ModalityResolver,
} from "@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver";
import {
  buildSystemPrompt,
  createMetadataSystemMessage,
} from "@/app/api/[locale]/agent/ai-stream/system-prompt/builder";
import {
  type DefaultFolderId,
  rootlessStreamContext,
} from "@/app/api/[locale]/agent/chat/config";
import {
  CHAT_MESSAGE_COLUMNS,
  chatMessages,
} from "@/app/api/[locale]/agent/chat/db";
import { chatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import {
  isSkillVariantId,
  isUuid,
  parseSkillId,
} from "@/app/api/[locale]/agent/chat/slugify";
import { loadRawEmbeddingScores } from "@/app/api/[locale]/agent/cortex/system-prompt";
import { getInstanceAvailability } from "@/app/api/[locale]/agent/env-availability";
import {
  getBestImageGenModel,
  type ImageGenModelSelection,
} from "@/app/api/[locale]/agent/image-generation/models";
import {
  getBestMusicGenModel,
  type MusicGenModelSelection,
} from "@/app/api/[locale]/agent/music-generation/models";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
  type FavoriteConfig,
} from "@/app/api/[locale]/agent/skills/favorites/db";
import {
  getBestVideoGenModel,
  type VideoGenModelSelection,
} from "@/app/api/[locale]/agent/video-generation/models";

import type { SystemPromptDebugResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export async function buildDebugSystemPrompt({
  rootFolderId,
  userMessage,
  threadId,
  skillId,
  subFolderId,
  imageGenModelSelection,
  musicGenModelSelection,
  videoGenModelSelection,
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
    const [{ systemPrompt, trailingSystemMessage }, rawScores, threadMsgs] =
      await Promise.all([
        buildSystemPrompt({
          streamContext: rootlessStreamContext(),
          skillId: skillId ?? null,
          user,
          logger,
          locale,
          rootFolderId,
          subFolderId: subFolderId ?? null,
          callMode: false,
          headless: false,
          subAgentDepth: 0,
          threadId: threadId ?? null,
        }),
        userMessage && user.id
          ? loadRawEmbeddingScores(user.id, userMessage, logger)
          : Promise.resolve(undefined),
        threadId
          ? db
              .select(CHAT_MESSAGE_COLUMNS)
              .from(chatMessages)
              .where(eq(chatMessages.threadId, threadId))
          : Promise.resolve([] as (typeof chatMessages.$inferSelect)[]),
      ]);

    const timezone = "UTC";
    const messageContextLines: Record<string, string> = {};
    for (const msg of threadMsgs) {
      messageContextLines[msg.id] = createMetadataSystemMessage(
        msg,
        rootFolderId,
        timezone,
        logger,
      );
    }

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
      messageContextLines:
        Object.keys(messageContextLines).length > 0
          ? messageContextLines
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
