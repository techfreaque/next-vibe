/**
 * Image Generation Repository
 * Handles image generation via multiple AI providers
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
  getModelById,
  type ModelOptionImageBased,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { generateWithFalAi } from "../ai-stream/providers/fal-ai-image";
import { generateWithOpenAI } from "../ai-stream/providers/openai-images";
import { generateWithOpenRouter } from "../ai-stream/providers/openrouter-image";
import { generateWithReplicate } from "../ai-stream/providers/replicate-image";
import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import type {
  ImageGenerationPostRequestOutput,
  ImageGenerationPostResponseOutput,
} from "./definition";
import type { ImageGenerationT } from "./i18n";

export class ImageGenerationRepository {
  /**
   * Generate an image from a text prompt
   */
  static async generateImage(
    data: ImageGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ImageGenerationT,
  ): Promise<ResponseType<ImageGenerationPostResponseOutput>> {
    const modelConfig = getModelById(data.model);

    if (modelConfig.modelType !== "image") {
      return fail({
        message: t("post.errors.notAnImageModel"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const imageModel = modelConfig as ModelOptionImageBased;
    const creditCost = calculateCreditCost(imageModel, 0, 0);

    logger.info("[ImageGen] Starting image generation", {
      model: data.model,
      provider: imageModel.apiProvider,
      creditCost,
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

    let generationResult: ResponseType<{ imageUrl: string }>;

    switch (imageModel.apiProvider) {
      case ApiProvider.OPENAI_IMAGES:
        generationResult = await generateWithOpenAI({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size: data.size,
          quality: data.quality,
          logger,
        });
        break;

      case ApiProvider.REPLICATE:
        generationResult = await generateWithReplicate({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size: data.size,
          logger,
        });
        break;

      case ApiProvider.FAL_AI:
        generationResult = await generateWithFalAi({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size: data.size,
          logger,
        });
        break;

      case ApiProvider.OPENROUTER:
        generationResult = await generateWithOpenRouter({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          logger,
        });
        break;

      default:
        return fail({
          message: t("post.errors.notConfigured", {
            label: imageModel.apiProvider,
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

    const { imageUrl } = generationResult.data;

    const deductResult = await deductMediaCredits(
      user,
      creditCost,
      "image-generation",
      locale,
      logger,
      tCredits,
    );
    if (!deductResult.success) {
      return deductResult;
    }

    logger.info("[ImageGen] Image generated successfully", {
      model: data.model,
      creditCost,
    });

    return success({ imageUrl, creditCost });
  }
}
