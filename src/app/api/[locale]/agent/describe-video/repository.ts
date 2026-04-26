/**
 * Describe Video Repository
 * Fetches a video by URL and describes it using the configured video vision model.
 */

import "server-only";

import { generateText as aiGenerateText } from "ai";
import type { LanguageModel } from "ai";
import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";
import {
  ModalityResolver,
  type BridgeContext,
} from "@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver";
import { ProviderFactory } from "@/app/api/[locale]/agent/ai-stream/repository/core/provider-factory";
import { chatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  DescribeVideoPostRequestOutput,
  DescribeVideoPostResponseOutput,
} from "./definition";
import type { DescribeVideoT } from "./i18n";

export class DescribeVideoRepository {
  static async describeVideo(
    data: DescribeVideoPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: DescribeVideoT,
  ): Promise<ResponseType<DescribeVideoPostResponseOutput>> {
    const tCredits = creditsScopedTranslation.scopedT(locale).t;
    const userId = !user.isPublic && "id" in user ? user.id : undefined;

    const bridgeContext =
      await DescribeVideoRepository.buildBridgeContext(userId);

    const visionModel = ModalityResolver.resolveVideoVisionModel(
      bridgeContext,
      user,
    );
    if (!visionModel) {
      return fail({
        message: t("post.errors.noVisionModel"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const balanceResult = await CreditRepository.getBalance(
      user,
      logger,
      tCredits,
      locale,
    );
    if (!balanceResult.success) {
      return fail({
        message: t("post.errors.balanceCheckFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    try {
      const visionProvider = ProviderFactory.getProviderForModel(
        visionModel,
        logger,
      );

      const result = await aiGenerateText({
        model: visionProvider.chat(visionModel.providerModel) as LanguageModel,
        messages: [
          {
            role: "user" as const,
            content: [
              {
                type: "file" as const,
                data: new URL(data.fileUrl),
                mediaType: "video/mp4",
              },
              {
                type: "text" as const,
                text: data.context
                  ? `${data.context}\n\nDescribe this video in detail.`
                  : "Describe this video in detail. Include scene descriptions, actions, objects, and any text or audio content visible.",
              },
            ],
          },
        ],
      });

      const description = result.text.trim();
      const creditCost = calculateCreditCost(
        visionModel,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
      );

      logger.debug("[DescribeVideo] Description generated", {
        modelId: visionModel.id,
        textLength: description.length,
        creditCost,
      });

      if (creditCost > 0) {
        const deductResult = await CreditRepository.deductCreditsForModelUsage(
          user,
          creditCost,
          visionModel.id,
          logger,
          tCredits,
          locale,
        );
        if (!deductResult.success) {
          logger.error("[DescribeVideo] Failed to deduct credits", {
            creditCost,
          });
          return fail({
            message: t("post.errors.creditsFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
      }

      return success({
        text: description,
        model: visionModel.id,
        creditCost,
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[DescribeVideo] Failed", {
        error: msg,
        modelId: visionModel.id,
      });
      return fail({
        message: t("post.errors.descriptionFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: msg },
      });
    }
  }

  private static async buildBridgeContext(
    userId: string | undefined,
  ): Promise<BridgeContext> {
    if (!userId) {
      return { skill: null, favorite: null, userSettings: null };
    }

    const [userSettingsRow] = await db
      .select({
        activeFavoriteId: chatSettings.activeFavoriteId,
        voiceModelSelection: chatSettings.voiceModelSelection,
        sttModelSelection: chatSettings.sttModelSelection,
        imageVisionModelSelection: chatSettings.imageVisionModelSelection,
        videoVisionModelSelection: chatSettings.videoVisionModelSelection,
        audioVisionModelSelection: chatSettings.audioVisionModelSelection,
        defaultChatMode: chatSettings.defaultChatMode,
        imageGenModelSelection: chatSettings.imageGenModelSelection,
        musicGenModelSelection: chatSettings.musicGenModelSelection,
        videoGenModelSelection: chatSettings.videoGenModelSelection,
      })
      .from(chatSettings)
      .where(eq(chatSettings.userId, userId))
      .limit(1);

    if (!userSettingsRow) {
      return { skill: null, favorite: null, userSettings: null };
    }

    let favoriteConfig: BridgeContext["favorite"] = null;
    if (userSettingsRow.activeFavoriteId) {
      const [favRow] = await db
        .select()
        .from(chatFavorites)
        .where(eq(chatFavorites.id, userSettingsRow.activeFavoriteId))
        .limit(1);
      if (favRow) {
        favoriteConfig = favRow;
      }
    }

    return {
      skill: null,
      favorite: favoriteConfig,
      userSettings: userSettingsRow,
    };
  }
}
