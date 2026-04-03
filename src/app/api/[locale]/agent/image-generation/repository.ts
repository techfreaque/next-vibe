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

import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { getImageGenModelById } from "@/app/api/[locale]/agent/image-generation/models";
import {
  ApiProvider,
  calculateCreditCost,
  isModelProviderAvailable,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";
import { parseStorageUrl } from "@/app/api/[locale]/agent/chat/storage/url-utils";

import { DefaultFolderId } from "../chat/config";
import { NO_SKILL_ID } from "../chat/skills/constants";
import { generateWithFalAi } from "../ai-stream/providers/fal-ai-image";
import { generateWithOpenAI } from "../ai-stream/providers/openai-images";
import { generateWithOpenRouter } from "../ai-stream/providers/openrouter-image";
import { generateWithReplicate } from "../ai-stream/providers/replicate-image";
import { runHeadlessAiStream } from "../ai-stream/repository/headless";
import { scopedTranslation as aiStreamScopedTranslation } from "../ai-stream/stream/i18n";
import type { ChatModelId } from "../ai-stream/models";
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
    // model is resolved via serverDefault on the field definition (from ToolExecutionContext.imageGenModelId)
    const modelConfig = getImageGenModelById(data.model);

    // Token-based multimodal model → use headless AI runner as polyfill
    // Credits are deducted by the AI stream itself (per-token pricing).
    if (!modelConfig.creditCostPerImage) {
      return ImageGenerationRepository.generateViaHeadless(
        data,
        user,
        locale,
        logger,
        t,
        streamContext,
      );
    }

    const imageModel = modelConfig;
    const creditCost = calculateCreditCost(imageModel, 0, 0);

    // Check provider availability before attempting generation
    if (!isModelProviderAvailable(imageModel, agentEnvAvailability)) {
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

  /**
   * Headless AI runner polyfill for token-based multimodal models (e.g. GPT-5 Image, Gemini).
   * Runs the AI with no tools, no persistence, and a lean image-generation prompt.
   * The model natively outputs an image as a file part; credits are deducted per-token by the stream.
   */
  private static async generateViaHeadless(
    data: ImageGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ImageGenerationT,
    streamContext?: MediaGenStreamContext,
  ): Promise<ResponseType<ImageGenerationPostResponseOutput>> {
    logger.info("[ImageGen] Using headless AI runner for token-based model", {
      model: data.model,
      promptLength: data.prompt.length,
    });

    const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(locale);

    const sizeHint = data.size ? ` Output size: ${data.size}.` : "";
    const qualityHint = data.quality ? ` Quality: ${data.quality}.` : "";

    // ImageGenModelId and ChatModelId share string values for multimodal models
    const chatModelId = data.model as string as ChatModelId;

    const result = await runHeadlessAiStream({
      model: chatModelId,
      skill: NO_SKILL_ID,
      prompt: `Generate an image: ${data.prompt}${sizeHint}${qualityHint}`,
      pinnedTools: [],
      availableTools: [],
      // Always "none" — the outer AI stream persists the tool result.
      // Using "append" with the same threadId would re-register in StreamRegistry,
      // aborting the outer stream (superseded).
      threadMode: "none",
      // Do NOT pass outer threadId — using the same threadId would re-register
      // in StreamRegistry, aborting the outer stream. FilePartHandler uploads to
      // an ephemeral thread; we re-upload to the real thread below.
      rootFolderId: DefaultFolderId.INCOGNITO,
      headlessInstructions:
        "You are an image generator. Output exactly one image based on the user's prompt. Do not output any text — only the image.",
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

    // Credit cost is 0 here — already deducted per-token by the AI stream
    return success({ imageUrl, creditCost: 0 });
  }
}
