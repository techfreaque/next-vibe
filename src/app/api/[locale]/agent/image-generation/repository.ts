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
  isModelProviderAvailable,
  type ModelOptionImageBased,
} from "@/app/api/[locale]/agent/models/models";
import { getAgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import type { ImageGenModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";

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

interface MediaGenStreamContext {
  threadId?: string | undefined;
  aiMessageId?: string | undefined;
}

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
    streamContext?: MediaGenStreamContext,
  ): Promise<ResponseType<ImageGenerationPostResponseOutput>> {
    // model is already resolved via streamContextPatch in tools-loader (from ToolExecutionContext.imageGenModelId)
    const modelConfig = getModelById(data.model as ImageGenModelId);

    if (modelConfig.modelRole !== "image-gen") {
      return fail({
        message: t("post.errors.notAnImageModel"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const imageModel = modelConfig as ModelOptionImageBased;
    const creditCost = calculateCreditCost(imageModel, 0, 0);

    // Check provider availability before attempting generation
    const envAvailability = getAgentEnvAvailability();
    if (!isModelProviderAvailable(imageModel, envAvailability)) {
      return fail({
        message: t("post.errors.notConfigured", {
          label: imageModel.apiProvider,
          envKey: "N/A",
          url: "https://unbottled.ai",
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

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
          locale,
        });
        break;

      case ApiProvider.REPLICATE:
        generationResult = await generateWithReplicate({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size: data.size,
          logger,
          locale,
        });
        break;

      case ApiProvider.FAL_AI:
        generationResult = await generateWithFalAi({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size: data.size,
          logger,
          locale,
        });
        break;

      case ApiProvider.OPENROUTER:
        generationResult = await generateWithOpenRouter({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          logger,
          locale,
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

    let { imageUrl } = generationResult.data;

    // Upload to our storage so the URL is persistent and access-controlled
    if (streamContext?.threadId) {
      try {
        const storage = getStorageAdapter();
        const arrayBuf = await fetch(imageUrl).then((r) => r.arrayBuffer());
        const imageBuffer = Buffer.from(new Uint8Array(arrayBuf));
        const ext = imageUrl.includes("webp") ? "webp" : "png";
        const uploadResult = await storage.uploadFile(imageBuffer, {
          filename: `generated-image-${Date.now()}.${ext}`,
          mimeType: `image/${ext}`,
          threadId: streamContext.threadId,
          userId: user.id,
        });
        imageUrl = uploadResult.url;
      } catch (uploadErr) {
        logger.error(
          "[ImageGen] Failed to upload to storage, using provider URL",
          {
            error:
              uploadErr instanceof Error
                ? uploadErr.message
                : String(uploadErr),
          },
        );
      }
    }

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
