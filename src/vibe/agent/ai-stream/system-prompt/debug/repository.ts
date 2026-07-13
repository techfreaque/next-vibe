import "server-only";

import { and, eq, sql } from "drizzle-orm";
import {
  type BridgeContext,
  ModalityResolver,
} from "next-vibe/agent/ai-stream/repository/core/modality-resolver";
import {
  buildSystemPrompt,
  createMetadataSystemMessage,
} from "next-vibe/agent/ai-stream/system-prompt/builder";
import {
  type DefaultFolderId,
  rootlessStreamContext,
} from "next-vibe/agent/chat/config";
import { CHAT_MESSAGE_COLUMNS, chatMessages } from "next-vibe/agent/chat/db";
import { chatSettings } from "next-vibe/agent/chat/settings/db";
import {
  isSkillVariantId,
  isUuid,
  parseSkillId,
} from "next-vibe/agent/chat/slugify";
import { loadRawEmbeddingScores } from "next-vibe/agent/cortex/system-prompt";
import { getInstanceAvailability } from "next-vibe/agent/env-availability";
import {
  getBestImageGenModel,
  type ImageGenModelSelection,
} from "next-vibe/agent/image-generation/models";
import {
  getBestMusicGenModel,
  type MusicGenModelSelection,
} from "next-vibe/agent/music-generation/models";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
  type FavoriteConfig,
} from "next-vibe/agent/skills/favorites/db";
import {
  getBestVideoGenModel,
  type VideoGenModelSelection,
} from "next-vibe/agent/video-generation/models";
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

import type { SystemPromptDebugResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

async function loadActiveFavorite(
  userId: string,
): Promise<FavoriteConfig | null> {
  const [settingsRow] = await db
    .select({ activeFavoriteId: chatSettings.activeFavoriteId })
    .from(chatSettings)
    .where(eq(chatSettings.userId, userId))
    .limit(1);
  const effectiveFavoriteId = settingsRow?.activeFavoriteId;
  if (!effectiveFavoriteId) {
    return null;
  }
  const { skillId: sid, variantId } = isSkillVariantId(effectiveFavoriteId)
    ? parseSkillId(effectiveFavoriteId)
    : { skillId: null, variantId: null };
  const favIdCondition = isUuid(effectiveFavoriteId)
    ? eq(chatFavorites.id, effectiveFavoriteId)
    : sid !== null
      ? and(
          eq(chatFavorites.skillId, sid),
          variantId !== null
            ? eq(chatFavorites.variantId, variantId)
            : sql`${chatFavorites.variantId} IS NULL`,
        )
      : eq(chatFavorites.slug, effectiveFavoriteId);
  const [favRow] = await db
    .select(FAVORITE_CONFIG_COLUMNS)
    .from(chatFavorites)
    .where(and(favIdCondition, eq(chatFavorites.userId, userId)))
    .limit(1);
  return favRow ?? null;
}

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
  imageGenModelSelection: ImageGenModelSelection | null;
  musicGenModelSelection: MusicGenModelSelection | null;
  videoGenModelSelection: VideoGenModelSelection | null;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<ResponseType<SystemPromptDebugResponseOutput>> {
  const { t } = scopedTranslation.scopedT(locale);
  try {
    // Load user's active favorite for cascade resolution (same as stream setup)
    const userId = user.isPublic ? undefined : user.id;
    const [favorite, availability] = await Promise.all([
      userId ? loadActiveFavorite(userId) : Promise.resolve(null),
      getInstanceAvailability(),
    ]);

    const bridgeContext: BridgeContext = {
      skill: null,
      favorite: favorite ?? null,
    };
    const effectiveImageGenModel = getBestImageGenModel(
      imageGenModelSelection ??
        ModalityResolver.resolveImageGenSelection(bridgeContext),
      user,
      availability,
    );
    const effectiveMusicGenModel = getBestMusicGenModel(
      musicGenModelSelection ??
        ModalityResolver.resolveMusicGenSelection(bridgeContext),
      user,
      availability,
    );
    const effectiveVideoGenModel = getBestVideoGenModel(
      videoGenModelSelection ??
        ModalityResolver.resolveVideoGenSelection(bridgeContext),
      user,
      availability,
    );

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
          mediaCapabilities: {
            nativeOutputs: [],
            imageGenModelName: effectiveImageGenModel?.name ?? null,
            musicGenModelName: effectiveMusicGenModel?.name ?? null,
            videoGenModelName: effectiveVideoGenModel?.name ?? null,
            imageGenIsSameAsChatModel: false,
            musicGenIsSameAsChatModel: false,
            videoGenIsSameAsChatModel: false,
            videoGenCapabilities: effectiveVideoGenModel
              ? {
                  supportedDurations: effectiveVideoGenModel.supportedDurations,
                  supportedAspectRatios:
                    effectiveVideoGenModel.supportedAspectRatios,
                  supportedResolutions:
                    effectiveVideoGenModel.supportedResolutions,
                  supportedFrameImages:
                    effectiveVideoGenModel.supportedFrameImages,
                  allowedPassthroughParameters:
                    effectiveVideoGenModel.allowedPassthroughParameters,
                }
              : null,
          },
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
