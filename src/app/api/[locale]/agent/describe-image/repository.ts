/**
 * Describe Image Repository
 * Fetches an image by URL and describes it using the configured vision model.
 */

import "server-only";

import type { LanguageModel } from "ai";
import { generateText as aiGenerateText } from "ai";
import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  ModalityResolver,
  type BridgeContext,
} from "@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver";
import { ProviderFactory } from "@/app/api/[locale]/agent/ai-stream/repository/core/provider-factory";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
} from "@/app/api/[locale]/agent/chat/favorites/db";
import { resolveFavoriteConfig } from "@/app/api/[locale]/agent/chat/favorites/repository";
import { chatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  DescribeImagePostRequestOutput,
  DescribeImagePostResponseOutput,
} from "./definition";
import type { DescribeImageT } from "./i18n";

export class DescribeImageRepository {
  static async describeImage(
    data: DescribeImagePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: DescribeImageT,
    favoriteId: string | undefined,
  ): Promise<ResponseType<DescribeImagePostResponseOutput>> {
    const tCredits = creditsScopedTranslation.scopedT(locale).t;
    const userId = !user.isPublic && "id" in user ? user.id : undefined;

    // Resolve favorite on demand from favoriteId — picks up latest DB state
    const resolvedFavoriteConfig = await resolveFavoriteConfig(
      favoriteId,
      userId,
    );
    const bridgeContext = resolvedFavoriteConfig
      ? ({
          skill: null,
          favorite: resolvedFavoriteConfig,
        } satisfies BridgeContext)
      : await DescribeImageRepository.buildBridgeContext(userId);

    // Resolve vision model
    const visionModel = ModalityResolver.resolveImageVisionModel(
      bridgeContext,
      user,
    );
    if (!visionModel) {
      return fail({
        message: t("post.errors.noVisionModel"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Check balance
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
              { type: "image" as const, image: new URL(data.fileUrl) },
              {
                type: "text" as const,
                text: data.context
                  ? `${data.context}\n\nDescribe this image in detail.`
                  : "Describe this image in detail. Be comprehensive - include colors, objects, text, layout, and any notable features.",
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

      logger.debug("[DescribeImage] Description generated", {
        modelId: visionModel.id,
        textLength: description.length,
        creditCost,
      });

      // Deduct credits
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
          logger.error("[DescribeImage] Failed to deduct credits", {
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
      logger.error("[DescribeImage] Failed", {
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
      return { skill: null, favorite: null };
    }

    const [userSettingsRow] = await db
      .select({
        activeFavoriteId: chatSettings.activeFavoriteId,
      })
      .from(chatSettings)
      .where(eq(chatSettings.userId, userId))
      .limit(1);

    if (!userSettingsRow?.activeFavoriteId) {
      return { skill: null, favorite: null };
    }

    const [favRow] = await db
      .select(FAVORITE_CONFIG_COLUMNS)
      .from(chatFavorites)
      .where(eq(chatFavorites.id, userSettingsRow.activeFavoriteId))
      .limit(1);

    return {
      skill: null,
      favorite: favRow ?? null,
    };
  }
}
