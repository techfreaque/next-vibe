/**
 * Describe Image Repository
 * Fetches an image by URL and describes it using the configured vision model.
 */

import "server-only";

import type { LanguageModel } from "ai";
import { generateText as aiGenerateText } from "ai";
import { eq } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
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

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

import { ProviderFactory } from "../ai-stream/repository/core/infra";
import {
  type BridgeContext,
  ModalityResolver,
} from "../ai-stream/repository/core/modality-resolver";
import { describeWithVisionFallback } from "../ai-stream/repository/handlers/vision-describe";
import { TokenAccumulator } from "../ai-stream/repository/loop/token-accumulator";
import { chatSettings } from "../chat/settings/db";
import { mimeFromUrl } from "../chat/storage/url-utils";
import { getEnvAvailability } from "../env-availability";
import { VISION_MINIMUM_BALANCE } from "../shared/constants";
import { createFixtureDownload } from "../shared/fixture-download";
import {
  parseBase64DataUri,
  resolveMediaReference,
} from "../shared/media-generation";
import { chatFavorites, FAVORITE_CONFIG_COLUMNS } from "../skills/favorites/db";
import { resolveFavoriteConfig } from "../skills/favorites/repository";
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
    /** Fixture chain of the calling stream — the vision model call binds it. */
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<DescribeImagePostResponseOutput>> {
    const tCredits = creditsScopedTranslation.scopedT(locale).t;
    const userId = !user.isPublic && "id" in user ? user.id : undefined;

    // Resolve favorite on demand from favoriteId - picks up latest DB state
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
    const availability = await getEnvAvailability();
    const visionModel = ModalityResolver.resolveImageVisionModel(
      bridgeContext,
      user,
      availability,
    );
    if (!visionModel) {
      return fail({
        message: t("post.errors.noVisionModel"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Own storage files sit behind the auth-gated files route: read them with
    // the caller's permissions and send the bytes. The provider fetching our
    // URL has no session, so a private-thread file 404s for it.
    const fileReference = await resolveMediaReference(
      data.fileUrl,
      user,
      logger,
      locale,
    );
    if (!fileReference) {
      return fail({
        message: t("post.errors.not_found.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const inlineFile = parseBase64DataUri(fileReference);

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
    // Cost is only known after the call — refuse up front when the account
    // can't cover even the smallest description instead of going negative.
    if (balanceResult.data.total < VISION_MINIMUM_BALANCE) {
      return fail({
        message: t("post.errors.insufficientCredits", {
          balance: balanceResult.data.total.toString(),
          minimum: VISION_MINIMUM_BALANCE.toString(),
        }),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }

    try {
      const outcome = await describeWithVisionFallback({
        model: visionModel,
        resolveFallback: (failedId) =>
          ModalityResolver.resolveImageVisionFallback(
            failedId,
            user,
            availability,
          ),
        logger,
        logTag: "[DescribeImage]",
        run: (model) =>
          aiGenerateText({
            model: ProviderFactory.getProviderForModel(
              model,
              logger,
              toolExecutionContext,
            ).chat(model.providerModel) as LanguageModel,
            // Media the model can't take by URL is downloaded through the
            // fixture chain, never the AI SDK's global fetch.
            experimental_download: createFixtureDownload(
              toolExecutionContext,
              logger,
            ),
            messages: [
              {
                role: "user" as const,
                content: [
                  // An explicit image media type: a bare image part reaches
                  // OpenRouter as a generic "file" the model can't see.
                  {
                    type: "file" as const,
                    data: inlineFile
                      ? inlineFile.base64
                      : new URL(fileReference),
                    mediaType:
                      inlineFile?.mimeType ?? mimeFromUrl(data.fileUrl),
                  },
                  {
                    type: "text" as const,
                    text: data.context
                      ? `${data.context}\n\nDescribe this image in detail.`
                      : "Describe this image in detail. Be comprehensive - include colors, objects, text, layout, and any notable features.",
                  },
                ],
              },
            ],
          }),
      });
      if (!outcome.ok) {
        return fail({
          message: t("post.errors.descriptionFailed", {
            error: outcome.reason,
          }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      const { result, model: usedModel, text: description } = outcome;
      // Same rule as chat turns: providers that report the call's real cost
      // (OpenRouter, NanoGPT, Venice) bill it x markup; others (or a missing
      // cost, logged) bill the listed token price.
      const { credits: creditCost, upstreamCost } =
        TokenAccumulator.chargeSingleCall(
          usedModel,
          {
            inputTokens: result.usage.inputTokens ?? 0,
            outputTokens: result.usage.outputTokens ?? 0,
            cachedInputTokens: 0,
            cacheWriteTokens: 0,
          },
          result.providerMetadata,
          logger,
        );

      logger.debug("[DescribeImage] Description generated", {
        modelId: usedModel.id,
        textLength: description.length,
        creditCost,
      });

      // Deduct credits
      if (creditCost > 0) {
        const deductResult = await CreditRepository.deductCreditsForModelUsage(
          user,
          creditCost,
          usedModel.id,
          logger,
          tCredits,
          locale,
          upstreamCost,
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
        model: usedModel.id,
        creditCost,
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[DescribeImage] Failed", {
        error: msg,
        modelId: visionModel.id,
      });
      return fail({
        message: t("post.errors.descriptionFailed", { error: msg }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
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
