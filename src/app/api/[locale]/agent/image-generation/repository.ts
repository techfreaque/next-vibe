/**
 * Image Generation Repository
 * Handles image generation via multiple AI providers
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { createFixtureFetch } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage/index";
import { parseStorageUrl } from "@/app/api/[locale]/agent/chat/storage/url-utils";
import {
  ApiProvider,
  isModelOptionImageBased,
  isModelProviderAvailable,
  type ModelOptionImageBased,
  type ModelOptionTokenBased,
} from "@/app/api/[locale]/agent/models/models";
import { STANDARD_MARKUP_PERCENTAGE } from "@/app/api/[locale]/products/constants";

import { DEFAULT_CHAT_MODEL_ID } from "../ai-stream/constants";
import { chatModelOptionsIndex } from "../ai-stream/models";
import { AiStreamRepository } from "../ai-stream/repository";
import type { AiStreamPostRequestOutput } from "../ai-stream/stream/definition";
import { scopedTranslation as aiStreamScopedTranslation } from "../ai-stream/stream/i18n";
import {
  DefaultFolderId,
  makeHeadlessContext,
  type ToolExecutionContext,
} from "../chat/config";
import { ChatMessageRole } from "../chat/enum";
import { getEnvAvailability } from "../env-availability";
import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import { NO_SKILL_ID } from "../skills/constants";
import { buildFavoriteConfig } from "../skills/favorites/repository";
import {
  type ImageGenerationPostRequestInput,
  type ImageGenerationPostRequestOutput,
  type ImageGenerationPostResponseOutput,
} from "./definition";
import type { ImageGenerationT } from "./i18n";
import {
  filterImageGenModels,
  getImageGenModelById,
  type ImageGenModelId,
  type ImageGenModelSelection,
} from "./models";
import { generateWithFalAi } from "./providers/fal-ai";
import { generateImageWithModelsLab } from "./providers/modelslab";
import { generateWithOpenAI } from "./providers/openai";
import { generateWithOpenRouter } from "./providers/openrouter";
import { generateWithReplicate } from "./providers/replicate";
import { generateImageWithUnbottled } from "./providers/unbottled";

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
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<ImageGenerationPostResponseOutput>> {
    // model is resolved via fieldDefaults in route.ts (from favorites/skill config)
    if (!data.model) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
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
    if (!isModelProviderAvailable(imageModel, getEnvAvailability())) {
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

    // One fixture-aware fetch per generation - carries the repeat counter for
    // poll loops, so it must not be recreated per call.
    const fetchImpl = createFixtureFetch(streamContext, logger);

    let generationResult: ResponseType<{
      imageUrl: string;
      creditCost?: number;
    }>;
    switch (imageModel.apiProvider) {
      case ApiProvider.MODELSLAB:
        generationResult = await generateImageWithModelsLab({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          aspectRatio: data.aspectRatio,
          inputMediaUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.OPENROUTER:
        // OpenRouter image models don't support aspect ratio or quality - silently drop them
        generationResult = await generateWithOpenRouter({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          inputMediaUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.FAL_AI:
        generationResult = await generateWithFalAi({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size: data.size,
          inputMediaUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.OPENAI_IMAGES:
        generationResult = await generateWithOpenAI({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size: data.size,
          quality: data.quality,
          inputMediaUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.REPLICATE:
        generationResult = await generateWithReplicate({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size: data.size,
          inputMediaUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.UNBOTTLED:
        generationResult = await generateImageWithUnbottled({
          input: data,
          user,
          locale,
          logger,
          featureLabel: t("post.title"),
          // The media-gen context is a narrowed shape — rebuild a headless
          // context carrying its abort wiring + fixture chain for dispatch.
          streamContext: makeHeadlessContext(
            streamContext.abortSignal,
            streamContext.threadId,
            streamContext.timezone,
          ),
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
    const scThreadId = streamContext.threadId;
    if (scThreadId) {
      try {
        const storage = getStorageAdapter();
        const imgRes = await fetchImpl(imageUrl);
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
          threadId: scThreadId,
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

    const finalCreditCost = generationResult.data.creditCost ?? creditCost;

    if (imageModel.apiProvider !== ApiProvider.UNBOTTLED) {
      const deductResult = await deductMediaCredits(
        user,
        finalCreditCost,
        t("post.title"),
        locale,
        logger,
        tCredits,
      );
      if (!deductResult.success) {
        return deductResult;
      }
    }

    logger.debug("[ImageGen] Image generated successfully", {
      model: data.model,
      creditCost: finalCreditCost,
    });

    const toolMessageId = streamContext.currentToolMessageId;
    if (toolMessageId && !user.isPublic) {
      const month = new Date().toISOString().slice(0, 7);
      const slug = `${data.prompt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60)}-${toolMessageId}`;
      void Promise.all([
        import("@/app/api/[locale]/agent/cortex/mounts/gens"),
        import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual"),
      ])
        .then(([{ readGenPath }, { syncVirtualNodeToEmbedding }]) => {
          const path = `/gens/images/${month}/${slug}.md`;
          return readGenPath(user.id, path)
            .then(
              (result) =>
                result &&
                syncVirtualNodeToEmbedding(
                  user.id,
                  path,
                  result.content,
                  streamContext,
                ),
            )
            .catch(() => undefined);
        })
        .catch(() => undefined);
    }

    return success({
      imageUrl,
      creditCost: finalCreditCost,
    });
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
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<ImageGenerationPostResponseOutput>> {
    logger.debug("[ImageGen] Using headless AI runner for token-based model", {
      model: data.model,
      promptLength: data.prompt.length,
    });

    const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(locale);

    const sizeHint = data.size ? ` Output size: ${data.size}.` : "";
    const qualityHint = data.quality ? ` Quality: ${data.quality}.` : "";
    const refHint = data.inputMediaUrl
      ? ` Use this image as reference: ${data.inputMediaUrl}`
      : "";

    const chatModel = chatModelOptionsIndex[modelConfig.id];
    // Synthetic request data — the headless intake phase inside createAiStream
    // derives operation/parent/userMessageId; this only supplies ingredients.
    // Always INCOGNITO (threadMode "none") — the outer AI stream persists the
    // tool result. Fresh threadId (reusing the outer one would supersede/abort
    // the outer stream); the sub-stream is linked to the caller via
    // parentThreadId below so it walks to the caller's fixture root.
    const syntheticData: AiStreamPostRequestOutput = {
      operation: "send", // placeholder — headlessIntake derives the real one
      rootFolderId: DefaultFolderId.INCOGNITO,
      subFolderId: null,
      threadId: crypto.randomUUID(),
      userMessageId: null,
      parentMessageId: null,
      content: `Generate an image: ${data.prompt}${sizeHint}${qualityHint}${refHint}`,
      role: ChatMessageRole.USER,
      // chatModel may be undefined when the image model isn't in the chat index —
      // fall back to the default chat model so the request is well-formed.
      model: chatModel?.id ?? DEFAULT_CHAT_MODEL_ID,
      skill: NO_SKILL_ID,
      favoriteConfig: buildFavoriteConfig({
        id: "image-gen-headless",
        skillId: NO_SKILL_ID,
        availableTools: [],
        pinnedTools: [],
      }),
      toolConfirmations: null,
      messageHistory: [],
      voiceMode: { enabled: false },
      audioInput: { file: null },
      resumeToken: null,
      timezone: "UTC",
      attachments: null,
      executionContext: { mode: "local" as const },
    };
    const result = await AiStreamRepository.createAiStream({
      data: syntheticData,
      locale,
      logger,
      user,
      request: undefined,
      t: aiStreamT,
      awaitResult: true,
      subAgentDepth: streamContext.subAgentDepth,
      extraInstructions:
        "You are an image generator. Output exactly one image based on the user's prompt. Do not output any text - only the image.",
      maxToolCalls: 1,
      parentAbortSignal: streamContext.abortSignal,
      // Link the sub-stream to the caller thread: provenance + the fixture
      // engine walks child → parent → root to record/replay in the run's folder
      // instead of going live under this fresh incognito id.
      parentThreadId: streamContext.threadId,
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
    const scThreadId = streamContext.threadId;
    if (scThreadId) {
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
          const fetchImpl = createFixtureFetch(streamContext, logger);
          const arrayBuf = await fetchImpl(imageUrl).then((r) =>
            r.arrayBuffer(),
          );
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
          threadId: scThreadId,
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

  static async getRequestDefaults(ctx: {
    user: JwtPayloadType;
    streamContext: ToolExecutionContext;
  }): Promise<Partial<ImageGenerationPostRequestInput>> {
    const { getInstanceAvailability } = await import("../env-availability");
    const availability = await getInstanceAvailability();
    const userId =
      ctx.user && !ctx.user.isPublic && "id" in ctx.user
        ? ctx.user.id
        : undefined;
    let sel: ImageGenModelSelection | undefined;
    if (userId) {
      const { resolveSkillFavoriteContext } =
        await import("@/app/api/[locale]/agent/skills/resolver");
      const { ModalityResolver } =
        await import("@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver");
      const { favorite, skill } = await resolveSkillFavoriteContext({
        favoriteId: ctx.streamContext.favoriteId ?? null,
        skillId: ctx.streamContext.skillId ?? null,
        userId,
      });
      sel = ModalityResolver.resolveImageGenSelection({ favorite, skill });
    }
    sel ??= ctx.streamContext.resolvedMediaSelections?.imageGenModelSelection;
    const model = filterImageGenModels(sel, ctx.user, availability)[0]?.id;
    if (!model) {
      return {};
    }
    return { model };
  }
}
