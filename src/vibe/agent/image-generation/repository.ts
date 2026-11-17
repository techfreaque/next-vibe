/**
 * Image Generation Repository
 * Handles image generation via multiple AI providers
 */

import "server-only";

import {
  DefaultFolderId,
  makeHeadlessContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";

import { STANDARD_MARKUP_PERCENTAGE } from "@/products/constants";

import { DEFAULT_CHAT_MODEL_ID } from "../ai-stream/constants";
import { chatModelOptionsIndex } from "../ai-stream/models";
import { AiStreamRepository } from "../ai-stream/repository";
import type { AiStreamPostRequestOutput } from "../ai-stream/stream/definition";
import { scopedTranslation as aiStreamScopedTranslation } from "../ai-stream/stream/i18n";
import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";
import { ChatMessageRole } from "../chat/enum";
import { getStorageAdapter } from "../chat/storage/index";
import { parseStorageUrl } from "../chat/storage/url-utils";
import { getEnvAvailability } from "../env-availability";
import {
  ApiProvider,
  isModelOptionImageBased,
  isModelProviderAvailable,
  type ModelOptionImageBased,
  type ModelOptionTokenBased,
  roundMediaCost,
} from "../models/models";
import { UncensoredConsentRepository } from "../models/uncensored-consent/repository";
import {
  checkMediaBalance,
  deductMediaCredits,
  keepsExplicitMediaModel,
  parseBase64DataUri,
  resolveMediaReference,
} from "../shared/media-generation";
import { NO_SKILL_ID } from "../skills/constants";
import { buildFavoriteConfig } from "../skills/favorites/repository";
import {
  aspectRatioToImageSize,
  describeAspectRatio,
  parseAspectRatio,
  snapAspectRatio,
} from "./aspect-ratio";
import {
  type ImageGenerationPostRequestInput,
  type ImageGenerationPostRequestOutput,
  type ImageGenerationPostResponseOutput,
} from "./definition";
import {
  ImageQuality,
  type ImageQualityValue,
  ImageSize,
  type ImageSizeValue,
} from "./enum";
import type { ImageGenerationT } from "./i18n";
import { type ImageDimensions, readImageDimensions } from "./image-dimensions";
import {
  filterImageGenModels,
  getImageGenModelById,
  type ImageGenModelId,
  imageGenModelOptions,
  type ImageGenModelSelection,
} from "./models";
import {
  classifyImageProviderError,
  ImageProviderFailureKind,
} from "./provider-error";
import { generateWithFalAi } from "./providers/fal-ai";
import { generateImageWithModelsLab } from "./providers/modelslab";
import { generateWithOpenAI } from "./providers/openai";
import { generateWithOpenRouter } from "./providers/openrouter";
import { generateWithReplicate } from "./providers/replicate";
import { generateImageWithUnbottled } from "./providers/unbottled";
import { generateWithVenice } from "./providers/venice";

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

  // Rounded UP to 0.1 credit (never under-bills).
  return roundMediaCost(finalCost * (1 + STANDARD_MARKUP_PERCENTAGE));
}

/** Plain-language size hint for token-based (headless) image models. */
const HEADLESS_SIZE_HINT: Record<typeof ImageSizeValue, string> = {
  [ImageSize.SQUARE_1024]: "square 1024x1024",
  [ImageSize.LANDSCAPE_1792]: "landscape 1792x1024",
  [ImageSize.PORTRAIT_1792]: "portrait 1024x1792",
};

/** Plain-language quality hint for token-based (headless) image models. */
const HEADLESS_QUALITY_HINT: Record<typeof ImageQualityValue, string> = {
  [ImageQuality.STANDARD]: "standard",
  [ImageQuality.HD]: "high detail",
};

/**
 * The size facts of a delivered file for the tool result. The AI must
 * describe the image by these, never by the ratio it asked for.
 */
function deliveredSize(dimensions: ImageDimensions | null): {
  width?: number;
  height?: number;
  outputAspectRatio?: string;
} {
  if (!dimensions) {
    return {};
  }
  return {
    width: dimensions.width,
    height: dimensions.height,
    outputAspectRatio: describeAspectRatio(dimensions.width, dimensions.height),
  };
}

/**
 * Log when a provider delivered a clearly different ratio than requested
 * (more than ~15 % off): that provider ignores or caps the ratio parameter.
 */
function logRatioMismatch(
  logger: EndpointLogger,
  model: string,
  requested: string | undefined,
  dimensions: ImageDimensions | null,
): void {
  if (!requested || !dimensions) {
    return;
  }
  const wanted = parseAspectRatio(requested);
  if (wanted === null) {
    return;
  }
  const got = dimensions.width / dimensions.height;
  if (Math.abs(Math.log(got) - Math.log(wanted)) > 0.15) {
    logger.warn("[ImageGen] Provider delivered a different aspect ratio", {
      model,
      requested,
      width: dimensions.width,
      height: dimensions.height,
    });
  }
}

/**
 * A provider failure the user can act on: a content-filter refusal reads
 * differently from an outage (both used to say "Image generation failed").
 */
function providerFailure(
  message: string,
  t: ImageGenerationT,
): ResponseType<never> {
  const kind = classifyImageProviderError(message);
  if (kind === ImageProviderFailureKind.CONTENT_POLICY) {
    return fail({
      message: t("post.errors.contentRejected", { error: message }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }
  if (kind === ImageProviderFailureKind.OUTAGE) {
    return fail({
      message: t("post.errors.providerOutage", { error: message }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  return fail({
    // Carry the provider's reason: a bare "failed" left users and the AI
    // guessing.
    message: t("post.errors.generationFailedWithReason", { error: message }),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export class ImageGenerationRepository {
  /**
   * Generate an image from a text prompt. Identical paid calls in one thread
   * run once (execute-tool/repository/paid-call-dedupe.ts).
   */
  static async generateImage(
    data: ImageGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ImageGenerationT,
    toolExecutionContext: ToolExecutionContext,
    platform: Platform,
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

    // Uncensored image models need the caller's one-time 18+ consent, same
    // as uncensored chat models.
    const consentGate = await UncensoredConsentRepository.gate({
      content: modelConfig.content,
      modelName: modelConfig.name,
      user,
      locale,
      logger,
    });
    if (!consentGate.success) {
      return consentGate;
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
        toolExecutionContext,
      );
    }

    const imageModel = modelConfig;

    // A requested ratio picks the size for size-based providers (the AI
    // cannot set size; the default square would silently win) and is
    // snapped to the closest ratio the model supports for ratio-based ones.
    // size is hidden from AI/MCP callers and arrives UNSET there (the schema
    // default is not applied to hidden fields), so widen before checking.
    const requestedSize: typeof ImageSizeValue | undefined = data.size;
    const size =
      data.aspectRatio &&
      (requestedSize === undefined || requestedSize === ImageSize.SQUARE_1024)
        ? aspectRatioToImageSize(data.aspectRatio, imageModel.supportedSizes)
        : (requestedSize ?? ImageSize.SQUARE_1024);
    const aspectRatio = data.aspectRatio
      ? snapAspectRatio(data.aspectRatio, imageModel.supportedAspectRatios)
      : undefined;

    // Validate size against model capabilities
    if (
      imageModel.supportedSizes &&
      imageModel.supportedSizes.length > 0 &&
      !imageModel.supportedSizes.includes(size)
    ) {
      return fail({
        message: t("post.errors.unsupportedSize", {
          model: data.model,
          size,
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

    // Reject a reference image on a model that cannot consume one. Passing it
    // to a text-to-image-only model would have the provider silently drop it
    // and return nothing, surfacing as a blank "generation failed". Fail loud
    // and tell the caller to pick an image-to-image model instead.
    if (data.inputMediaUrl && !imageModel.inputs.includes("image")) {
      return fail({
        message: t("post.errors.modelNoReferenceImage", {
          model: data.model,
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const creditCost = calculateImageCreditCost(imageModel, size, data.quality);

    // Check provider availability before attempting generation
    if (!isModelProviderAvailable(imageModel, await getEnvAvailability())) {
      return fail({
        message: t("post.errors.providerUnavailable", {
          label: imageModel.apiProvider,
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
      requestedSize: data.size,
      size,
      requestedAspectRatio: data.aspectRatio ?? null,
      aspectRatio: aspectRatio ?? null,
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
    const fetchImpl = createFixtureFetch(toolExecutionContext, logger);

    // Reference image: own storage files are read here with the caller's
    // permissions and handed over as a data URI (providers have no session,
    // so a private-thread URL 404s for them); browser uploads already are one.
    let inputMediaUrl: string | undefined;
    if (data.inputMediaUrl) {
      const resolvedReference = await resolveMediaReference(
        data.inputMediaUrl,
        user,
        logger,
        locale,
      );
      if (!resolvedReference) {
        return fail({
          message: t("post.errors.referenceUnavailable"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      inputMediaUrl = resolvedReference;
    }

    let generationResult: ResponseType<{
      imageUrl: string;
      creditCost?: number;
    }>;
    switch (imageModel.apiProvider) {
      case ApiProvider.MODELSLAB:
        generationResult = await generateImageWithModelsLab({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          aspectRatio,
          inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.OPENROUTER:
        // /api/v1/images takes aspect_ratio (every listed model supports at
        // least 1:1/3:2/2:3; most take 16:9 and 9:16). Quality has no knob.
        generationResult = await generateWithOpenRouter({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          aspectRatio,
          inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.FAL_AI:
        generationResult = await generateWithFalAi({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size,
          inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.OPENAI_IMAGES:
        generationResult = await generateWithOpenAI({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size,
          quality: data.quality,
          inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.REPLICATE:
        generationResult = await generateWithReplicate({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size,
          inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.VENICE_AI:
        generationResult = await generateWithVenice({
          providerModel: imageModel.providerModel,
          prompt: data.prompt,
          size,
          inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.UNBOTTLED:
        generationResult = await generateImageWithUnbottled({
          // The remote instance cannot read our storage: send the resolved
          // reference (data URI for own files), never our portable path.
          input: inputMediaUrl ? { ...data, inputMediaUrl } : data,
          user,
          locale,
          logger,
          featureLabel: t("post.title"),
          platform,
          // The media-gen context is a narrowed shape — rebuild a headless
          // context carrying its abort wiring + fixture chain for dispatch.
          toolExecutionContext: {
            ...makeHeadlessContext(
              toolExecutionContext.abortSignal,
              toolExecutionContext.threadId,
              toolExecutionContext.timezone,
            ),
            // E2E fixture scope (dev/test only) must survive the rebuild, or
            // a browser-driven run escapes record/replay on this path.
            fixtureScopeId: toolExecutionContext.fixtureScopeId,
          },
        });
        break;

      default:
        return fail({
          message: t("post.errors.providerUnavailable", {
            label: imageModel.apiProvider,
            url: "https://unbottled.ai",
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
    }

    if (!generationResult.success) {
      // The remote instance runs this same repository: its message is
      // already classified (refusal vs outage), never wrap it twice.
      if (imageModel.apiProvider === ApiProvider.UNBOTTLED) {
        return generationResult;
      }
      return providerFailure(generationResult.message, t);
    }

    let { imageUrl } = generationResult.data;

    // Fetch image bytes and upload to storage. Incognito threads have no
    // server-side thread row — the file is owned by the caller's leadId and
    // served only to that lead (browser); inlining as a base64 data URI is
    // forbidden (it blows up the model context on subsequent turns).
    // Standalone calls (CLI, MCP, tool page: no thread) are re-hosted too:
    // providers like OpenRouter return the image as a base64 data URI, and a
    // data: URI must never reach a tool result. They get a fresh thread-less
    // namespace, owned by the account when logged in, by the lead for guests
    // (same rule as video generation).
    const scThreadId = toolExecutionContext.threadId ?? crypto.randomUUID();
    const isLeadOwned = toolExecutionContext.threadId
      ? toolExecutionContext.rootFolderId === DefaultFolderId.INCOGNITO
      : user.isPublic;
    let dimensions: ImageDimensions | null = null;
    try {
      const imgRes = await fetchImpl(imageUrl);
      if (!imgRes.ok) {
        // eslint-disable-next-line restricted/restricted-syntax -- intentional throw to fall through to catch
        throw new Error(`Image fetch failed: ${String(imgRes.status)}`);
      }
      const arrayBuf = await imgRes.arrayBuffer();
      const imageBuffer = Buffer.from(new Uint8Array(arrayBuf));
      dimensions = readImageDimensions(imageBuffer);
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
      const storage = getStorageAdapter();
      const uploadResult = await storage.uploadFile(imageBuffer, {
        filename: `generated-image-${Date.now()}.${ext}`,
        mimeType: `image/${ext}`,
        threadId: scThreadId,
        userId: isLeadOwned ? undefined : user.id,
        leadId: isLeadOwned ? user.leadId : undefined,
      });
      imageUrl = uploadResult.url;
    } catch (uploadErr) {
      logger.error("[ImageGen] Failed to process image, using provider URL", {
        error:
          uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
      });
    }
    // An inline data URI must never reach a tool result (it floods the model
    // context on every later turn): no stored file, no result.
    if (imageUrl.startsWith("data:")) {
      return fail({
        message: t("post.errors.generationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
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
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
    });
    logRatioMismatch(logger, data.model, aspectRatio, dimensions);

    const toolMessageId = toolExecutionContext.currentToolMessageId;
    if (toolMessageId && !user.isPublic) {
      const month = new Date().toISOString().slice(0, 7);
      const slug = `${data.prompt
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "-")
        .replaceAll(/^-|-$/g, "")
        .slice(0, 60)}-${toolMessageId}`;
      void Promise.all([
        import("../cortex/mounts/gens"),
        import("../cortex/embeddings/sync-virtual"),
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
                  toolExecutionContext,
                  logger,
                ),
            )
            .catch(() => undefined);
        })
        .catch(() => undefined);
    }

    return success({
      imageUrl,
      creditCost: finalCreditCost,
      ...deliveredSize(dimensions),
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
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<ImageGenerationPostResponseOutput>> {
    logger.debug("[ImageGen] Using headless AI runner for token-based model", {
      model: data.model,
      promptLength: data.prompt.length,
    });

    const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(locale);

    // data.size / data.quality are i18n enum keys ("post.size.square1024") -
    // never put those in the model prompt; map them to plain-language hints.
    // A requested ratio replaces the size hint (the AI cannot set size).
    const sizeHint = data.aspectRatio
      ? ` Aspect ratio: ${data.aspectRatio}.`
      : data.size
        ? ` Output size: ${HEADLESS_SIZE_HINT[data.size]}.`
        : "";
    const qualityHint = data.quality
      ? ` Quality: ${HEADLESS_QUALITY_HINT[data.quality]}.`
      : "";
    // Reference image: attach the bytes so the model actually sees them. A
    // URL in the prompt text is invisible to the model, and a data URI there
    // would be megabytes of base64 prompt text.
    let refHint = "";
    let referenceAttachments: File[] | null = null;
    if (data.inputMediaUrl) {
      const resolvedReference = await resolveMediaReference(
        data.inputMediaUrl,
        user,
        logger,
        locale,
      );
      const inline = resolvedReference
        ? parseBase64DataUri(resolvedReference)
        : null;
      if (!resolvedReference) {
        return fail({
          message: t("post.errors.referenceUnavailable"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (inline) {
        const extension = inline.mimeType.split("/")[1] ?? "png";
        referenceAttachments = [
          new File(
            [Buffer.from(inline.base64, "base64")],
            `reference.${extension}`,
            { type: inline.mimeType },
          ),
        ];
        refHint = " Use the attached image as reference.";
      } else {
        refHint = ` Use this image as reference: ${resolvedReference}`;
      }
    }

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
      attachments: referenceAttachments,
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
      subAgentDepth: toolExecutionContext.subAgentDepth,
      extraInstructions:
        "You are an image generator. Output exactly one image based on the user's prompt. Do not output any text - only the image.",
      maxToolCalls: 1,
      parentAbortSignal: toolExecutionContext.abortSignal,
      // Link the sub-stream to the caller thread: provenance + the fixture
      // engine walks child → parent → root to record/replay in the run's folder
      // instead of going live under this fresh incognito id.
      parentThreadId: toolExecutionContext.threadId,
      // Browser E2E scope (no caller thread to walk to) — keeps the
      // sub-stream's model call under record/replay.
      fixtureScopeId: toolExecutionContext.fixtureScopeId,
    });

    if (!result.success) {
      return fail({
        message: result.message,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    let imageUrl = result.data.lastGeneratedMediaUrl;
    if (!imageUrl) {
      // The headless sub-stream ran but produced no image. When it carries a
      // provider error part, surface the real upstream cause (e.g. a transient
      // `provider_unavailable` outage) instead of the generic "no image" — the
      // AI caller can then tell the user it is a temporary service issue and
      // retry/fall back, rather than treat it as a permanent dead-end.
      const providerError = result.data.providerErrorText;
      if (providerError) {
        return providerFailure(providerError, t);
      }
      // No image and no provider error: the model answered with text (a
      // refusal, a description of the image) or nothing. Log what it did say
      // so the next "did not generate an image" names the model and reply.
      logger.error("[ImageGen] Headless model produced no image", {
        imageModel: data.model,
        chatModel: syntheticData.model,
        size: data.size,
        quality: data.quality,
        hasReference: Boolean(data.inputMediaUrl),
        promptLength: data.prompt.length,
        replyTextLength: result.data.lastAiMessageContent?.length ?? 0,
        replyTextSample: result.data.lastAiMessageContent?.slice(0, 300),
        creditsDeducted: result.data.totalCreditsDeducted,
      });
      return fail({
        message: t("post.errors.noImageGenerated"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Re-upload from ephemeral storage to the real thread's storage so the
    // file-serving route can find it. Incognito threads have no server-side
    // thread row — the file is owned by the caller's leadId instead.
    // Standalone calls (CLI, MCP, tool page: no thread) are re-hosted too:
    // providers like OpenRouter return the image as a base64 data URI, and a
    // data: URI must never reach a tool result. They get a fresh thread-less
    // namespace, owned by the account when logged in, by the lead for guests
    // (same rule as video generation).
    const scThreadId = toolExecutionContext.threadId ?? crypto.randomUUID();
    const isLeadOwned = toolExecutionContext.threadId
      ? toolExecutionContext.rootFolderId === DefaultFolderId.INCOGNITO
      : user.isPublic;
    let dimensions: ImageDimensions | null = null;
    {
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
          const fetchImpl = createFixtureFetch(toolExecutionContext, logger);
          const arrayBuf = await fetchImpl(imageUrl).then((r) =>
            r.arrayBuffer(),
          );
          imageBuffer = Buffer.from(new Uint8Array(arrayBuf));
        }
        dimensions = readImageDimensions(imageBuffer);
        const ext = imageUrl.includes("webp")
          ? "webp"
          : imageUrl.includes("jpeg") || imageUrl.includes("jpg")
            ? "jpeg"
            : "png";
        const uploadResult = await storage.uploadFile(imageBuffer, {
          filename: `generated-image-${Date.now()}.${ext}`,
          mimeType: `image/${ext}`,
          threadId: scThreadId,
          userId: isLeadOwned ? undefined : user.id,
          leadId: isLeadOwned ? user.leadId : undefined,
        });
        imageUrl = uploadResult.url;
      } catch (uploadErr) {
        logger.error("[ImageGen] Failed to process headless image", {
          error:
            uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
        });
        // Fall through with the ephemeral URL
      }
    }

    // Credits already deducted per-token by the headless AI stream - report the
    // actual cost so the UI displays it the same way as fixed-price image gen models.
    const creditCost = result.data.totalCreditsDeducted ?? 0;
    logRatioMismatch(logger, modelConfig.id, data.aspectRatio, dimensions);
    return success({ imageUrl, creditCost, ...deliveredSize(dimensions) });
  }

  /**
   * A human's explicit model pick wins; AI/MCP callers (or an empty pick) get
   * the favorite/skill model.
   */
  static async getRequestDefaults(
    ctx: {
      user: JwtPayloadType;
      toolExecutionContext: ToolExecutionContext;
      platform: Platform;
    },
    requestedModel: string | undefined,
  ): Promise<Partial<ImageGenerationPostRequestInput>> {
    if (
      keepsExplicitMediaModel(ctx.platform, requestedModel, (model) =>
        imageGenModelOptions.some((option) => option.id === model),
      )
    ) {
      return {};
    }
    const availability = await getEnvAvailability();
    const userId =
      ctx.user && !ctx.user.isPublic && "id" in ctx.user
        ? ctx.user.id
        : undefined;
    // The stream already resolved this (client favorite config -> favorite
    // -> skill -> default) in setup and advertised it in the system prompt.
    // Re-querying the favorite from the DB diverged whenever the client's
    // favorite was not a saved row: a different model generated than the
    // one the user picked. Only stream-less callers re-run the cascade.
    let sel: ImageGenModelSelection | undefined =
      ctx.toolExecutionContext.resolvedMediaSelections?.imageGenModelSelection;
    if (!sel && userId) {
      const { resolveSkillFavoriteContext } =
        await import("../skills/resolver");
      const { ModalityResolver } =
        await import("../ai-stream/repository/core/modality-resolver");
      const { favorite, skill } = await resolveSkillFavoriteContext({
        favoriteId: ctx.toolExecutionContext.favoriteId ?? null,
        skillId: ctx.toolExecutionContext.skillId ?? null,
        userId,
      });
      sel = ModalityResolver.resolveImageGenSelection({ favorite, skill });
    }
    const model = filterImageGenModels(sel, ctx.user, availability)[0]?.id;
    if (!model) {
      return {};
    }
    return { model };
  }
}
