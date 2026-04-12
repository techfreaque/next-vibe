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
  getImageGenModelById,
  type ImageGenModelId,
} from "@/app/api/[locale]/agent/image-generation/models";
import {
  ApiProvider,
  isModelOptionImageBased,
  isModelProviderAvailable,
  type ModelOptionImageBased,
  type ModelOptionTokenBased,
} from "@/app/api/[locale]/agent/models/models";
import { STANDARD_MARKUP_PERCENTAGE } from "@/app/api/[locale]/products/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";
import { parseStorageUrl } from "@/app/api/[locale]/agent/chat/storage/url-utils";

import { chatModelOptionsIndex } from "../ai-stream/models";
import { runHeadlessAiStream } from "../ai-stream/repository/headless";
import { scopedTranslation as aiStreamScopedTranslation } from "../ai-stream/stream/i18n";
import { DefaultFolderId } from "../chat/config";
import { NO_SKILL_ID } from "../chat/skills/constants";
import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import type {
  ImageGenerationPostRequestOutput,
  ImageGenerationPostResponseOutput,
} from "./definition";
import type { ImageGenerationT } from "./i18n";
import { generateWithFalAi } from "./providers/fal-ai";
import { generateImageWithModelsLab } from "./providers/modelslab";
import { generateWithOpenAI } from "./providers/openai";
import { generateWithOpenRouter } from "./providers/openrouter";
import { generateWithReplicate } from "./providers/replicate";

interface MediaGenStreamContext {
  threadId?: string | undefined;
  aiMessageId?: string | undefined;
}

/**
 * Calculate image generation credit cost with option-aware pricing.
 * Uses pricingBySize/pricingByQuality overrides when available,
 * falls back to base creditCostPerImage.
 */
function calculateImageCreditCost(
  model: ModelOptionImageBased,
  size: string,
  quality: string,
): number {
  // Check for size-specific pricing override
  const baseCost =
    model.pricingBySize?.[size] ??
    model.pricingByQuality?.[quality] ??
    model.creditCostPerImage;

  // If both size and quality have overrides, use the size price as base
  // and apply quality as a multiplier or override
  let finalCost = baseCost;
  if (
    model.pricingBySize?.[size] !== undefined &&
    model.pricingByQuality?.[quality] !== undefined
  ) {
    finalCost = model.pricingByQuality[quality] ?? baseCost;
  }

  const withMarkup = finalCost * (1 + STANDARD_MARKUP_PERCENTAGE);
  const rounded = Math.round(withMarkup * 10) / 10;
  return rounded % 1 === 0 ? Math.round(rounded) : rounded;
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
    // model is resolved via serverDefault on the field definition (from ToolExecutionContext.imageGenModelId)
    const modelConfig = getImageGenModelById(data.model);

    if (!modelConfig) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Token-based multimodal model → use headless AI runner as polyfill
    // Credits are deducted by the AI stream itself (per-token pricing).
    if (!isModelOptionImageBased(modelConfig)) {
      return ImageGenerationRepository.generateViaHeadless(
        data,
        modelConfig,
        user,
        locale,
        logger,
        t,
        streamContext,
      );
    }

    const imageModel = modelConfig;

    // Validate size against model capabilities
    if (
      imageModel.supportedSizes &&
      imageModel.supportedSizes.length > 0 &&
      !imageModel.supportedSizes.includes(data.size)
    ) {
      return fail({
        message: t("post.errors.unsupportedSize", {
          model: data.model,
          size: data.size,
          supported: imageModel.supportedSizes.join(", "),
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // Validate quality against model capabilities
    if (
      imageModel.supportedQualities &&
      imageModel.supportedQualities.length > 0 &&
      !imageModel.supportedQualities.includes(data.quality)
    ) {
      return fail({
        message: t("post.errors.unsupportedQuality", {
          model: data.model,
          quality: data.quality,
          supported: imageModel.supportedQualities.join(", "),
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // Validate aspect ratio against model capabilities
    if (
      data.aspectRatio &&
      imageModel.supportedAspectRatios &&
      imageModel.supportedAspectRatios.length > 0 &&
      !imageModel.supportedAspectRatios.includes(data.aspectRatio)
    ) {
      return fail({
        message: t("post.errors.unsupportedAspectRatio", {
          model: data.model,
          aspectRatio: data.aspectRatio,
          supported: imageModel.supportedAspectRatios.join(", "),
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const creditCost = calculateImageCreditCost(
      imageModel,
      data.size,
      data.quality,
    );

    // Check provider availability before attempting generation
    if (!isModelProviderAvailable(imageModel)) {
      return fail({
        message: t("post.errors.notConfigured", {
          label: imageModel.apiProvider,
          envKey: "N/A",
          url: "https://unbottled.ai",
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    logger.debug("[ImageGen] Starting image generation", {
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
      case ApiProvider.MODELSLAB:
        generationResult = await generateImageWithModelsLab({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          aspectRatio: data.aspectRatio,
          logger,
          locale,
        });
        break;

      case ApiProvider.OPENROUTER:
        // OpenRouter image models don't support aspect ratio or quality - silently drop them
        generationResult = await generateWithOpenRouter({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
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
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) {
          // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- intentional throw to fall through to catch
          throw new Error(`Image fetch failed: ${String(imgRes.status)}`);
        }
        const arrayBuf = await imgRes.arrayBuffer();
        const imageBuffer = Buffer.from(new Uint8Array(arrayBuf));
        // Detect format from magic bytes (providers often return PNG despite .jpg URL)
        const magic = imageBuffer.subarray(0, 4);
        const ext =
          magic[0] === 0x89 && magic[1] === 0x50
            ? "png"
            : magic[0] === 0xff && magic[1] === 0xd8
              ? "jpeg"
              : magic[0] === 0x52 && magic[1] === 0x49
                ? "webp"
                : "png";
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

    logger.debug("[ImageGen] Image generated successfully", {
      model: data.model,
      creditCost,
    });

    return success({ imageUrl, creditCost });
  }

  /**
   * Headless AI runner polyfill for token-based multimodal models (e.g. GPT-5 Image, Gemini).
   * Runs the AI with no tools, no persistence, and a lean image-generation prompt.
   * The model natively outputs an image as a file part; credits are deducted per-token by the stream.
   */
  private static async generateViaHeadless(
    data: ImageGenerationPostRequestOutput,
    modelConfig: ModelOptionTokenBased & { id: ImageGenModelId },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ImageGenerationT,
    streamContext?: MediaGenStreamContext,
  ): Promise<ResponseType<ImageGenerationPostResponseOutput>> {
    logger.debug("[ImageGen] Using headless AI runner for token-based model", {
      model: data.model,
      promptLength: data.prompt.length,
    });

    const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(locale);

    const sizeHint = data.size ? ` Output size: ${data.size}.` : "";
    const qualityHint = data.quality ? ` Quality: ${data.quality}.` : "";

    const chatModel = chatModelOptionsIndex[modelConfig.id];
    const result = await runHeadlessAiStream({
      model: chatModel?.id,
      skill: NO_SKILL_ID,
      prompt: `Generate an image: ${data.prompt}${sizeHint}${qualityHint}`,
      pinnedTools: [],
      availableTools: [],
      // Always "none" - the outer AI stream persists the tool result.
      // Using "append" with the same threadId would re-register in StreamRegistry,
      // aborting the outer stream (superseded).
      // Do NOT pass outer threadId - using the same threadId would re-register
      // in StreamRegistry, aborting the outer stream. FilePartHandler uploads to
      // an ephemeral thread; we re-upload to the real thread below.
      rootFolderId: DefaultFolderId.INCOGNITO,
      headlessInstructions:
        "You are an image generator. Output exactly one image based on the user's prompt. Do not output any text - only the image.",
      maxTurns: 1,
      user,
      locale,
      logger,
      t: aiStreamT,
    });

    if (!result.success) {
      return fail({
        message: result.message,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    let imageUrl = result.data.lastGeneratedMediaUrl;
    if (!imageUrl) {
      return fail({
        message: t("post.errors.generationFailed", {
          error: "Model did not generate an image",
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Re-upload from ephemeral storage to the real thread's storage so the
    // file-serving route can find it (it checks thread ownership in DB).
    if (streamContext?.threadId) {
      try {
        const storage = getStorageAdapter();
        // The ephemeral URL points to our file-serving API which requires DB thread lookup.
        // Read the file directly from storage instead of HTTP fetch.
        const parsed = parseStorageUrl(imageUrl);
        let imageBuffer: Buffer | null = null;
        if (parsed) {
          const base64 = await storage.readFileAsBase64(
            parsed.fileId,
            parsed.threadId,
          );
          if (base64) {
            imageBuffer = Buffer.from(base64, "base64");
          }
        }
        if (!imageBuffer) {
          // Fallback to HTTP fetch for external URLs
          const arrayBuf = await fetch(imageUrl).then((r) => r.arrayBuffer());
          imageBuffer = Buffer.from(new Uint8Array(arrayBuf));
        }
        const ext = imageUrl.includes("webp")
          ? "webp"
          : imageUrl.includes("jpeg") || imageUrl.includes("jpg")
            ? "jpeg"
            : "png";
        const uploadResult = await storage.uploadFile(imageBuffer, {
          filename: `generated-image-${Date.now()}.${ext}`,
          mimeType: `image/${ext}`,
          threadId: streamContext.threadId,
          userId: user.id,
        });
        imageUrl = uploadResult.url;
      } catch (uploadErr) {
        logger.error(
          "[ImageGen] Failed to re-upload headless image to thread storage",
          {
            error:
              uploadErr instanceof Error
                ? uploadErr.message
                : String(uploadErr),
          },
        );
        // Fall through with the ephemeral URL
      }
    }

    // Credits already deducted per-token by the headless AI stream - report the
    // actual cost so the UI displays it the same way as fixed-price image gen models.
    const creditCost = result.data.totalCreditsDeducted ?? 0;
    return success({ imageUrl, creditCost });
  }
}
