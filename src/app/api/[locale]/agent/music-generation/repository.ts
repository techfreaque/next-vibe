/**
 * Music Generation Repository
 * Handles music generation via multiple AI providers
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import {
  ApiProvider,
  calculateCreditCost,
  getAllModelOptions,
  type ModelOptionAudioBased,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import type {
  MusicGenerationPostRequestOutput,
  MusicGenerationPostResponseOutput,
} from "./definition";
import { MUSIC_DURATION_SECONDS } from "./enum";
import type { MusicGenerationT } from "./i18n";
import { generateMusicWithFalAi } from "../ai-stream/providers/fal-ai-audio";
import { generateMusicWithReplicate } from "../ai-stream/providers/replicate-audio";

export class MusicGenerationRepository {
  /**
   * Generate music from a text prompt
   */
  static async generateMusic(
    data: MusicGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: MusicGenerationT,
  ): Promise<ResponseType<MusicGenerationPostResponseOutput>> {
    const selectedModel: string = data.model;
    const modelConfig = getAllModelOptions().find(
      (m) => m.id === selectedModel,
    );

    if (!modelConfig || modelConfig.modelType !== "audio") {
      return fail({
        message: t("post.errors.notAnAudioModel"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const audioModel = modelConfig as ModelOptionAudioBased;
    const creditCost = calculateCreditCost(audioModel, 0, 0);
    const durationSeconds =
      MUSIC_DURATION_SECONDS[data.duration] ??
      audioModel.defaultDurationSeconds;

    logger.info("[MusicGen] Starting music generation", {
      model: data.model,
      provider: audioModel.apiProvider,
      creditCost,
      durationSeconds,
      promptLength: data.prompt.length,
    });

    const balanceCheck = await checkMediaBalance(
      user,
      creditCost,
      locale,
      logger,
    );
    if (!balanceCheck.success) {
      return balanceCheck;
    }
    const { tCredits } = balanceCheck.data;

    let generationResult: ResponseType<{ audioUrl: string }>;

    switch (audioModel.apiProvider) {
      case ApiProvider.REPLICATE:
        generationResult = await generateMusicWithReplicate({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          logger,
        });
        break;

      case ApiProvider.FAL_AI:
        generationResult = await generateMusicWithFalAi({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          logger,
        });
        break;

      default:
        return fail({
          message: t("post.errors.notConfigured", {
            label: audioModel.apiProvider,
            envKey: "N/A",
            url: "https://unbottled.ai",
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
    }

    if (!generationResult.success) {
      return fail({
        message: t("post.errors.generationFailed", {
          error: generationResult.message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const { audioUrl } = generationResult.data;

    const deductResult = await deductMediaCredits(
      user,
      creditCost,
      "music-generation",
      locale,
      logger,
      tCredits,
    );
    if (!deductResult.success) {
      return deductResult;
    }

    logger.info("[MusicGen] Music generated successfully", {
      model: data.model,
      creditCost,
      durationSeconds,
    });

    return success({ audioUrl, creditCost, durationSeconds });
  }
}
