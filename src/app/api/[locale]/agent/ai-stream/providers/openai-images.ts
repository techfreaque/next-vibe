import "server-only";

import type { LanguageModelV2 } from "@ai-sdk/provider";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TranslationKey } from "@/i18n/core/static-types";

import {
  createMediaProvider,
  readStringOption,
} from "./shared/media-provider-factory";

interface OpenAIImageResponse {
  data?: Array<{ url?: string; b64_json?: string }>;
  error?: { message: string; code?: string };
}

function mapSizeToOpenAI(size: string): string {
  if (size === "post.size.landscape1792") {
    return "1792x1024";
  }
  if (size === "post.size.portrait1792") {
    return "1024x1792";
  }
  return "1024x1024";
}

function mapQualityToOpenAI(quality: string): "standard" | "hd" {
  return quality === "post.quality.hd" ? "hd" : "standard";
}

export async function generateWithOpenAI(params: {
  providerModel: string;
  prompt: string;
  size: string;
  quality: string;
  logger: EndpointLogger;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, size, quality, logger } = params;

  if (!agentEnv.OPENAI_API_KEY) {
    return fail({
      // eslint-disable-next-line i18next/no-literal-string
      message: "OpenAI API key not configured" as TranslationKey,
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const apiSize = mapSizeToOpenAI(size);
  const apiQuality = mapQualityToOpenAI(quality);
  logger.info("[OpenAI Images] Generating image", {
    model: providerModel,
    size: apiSize,
    quality: apiQuality,
    promptLength: prompt.length,
  });

  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: providerModel,
          prompt,
          n: 1,
          size: apiSize,
          quality: apiQuality,
          response_format: "url",
        }),
      },
    );

    const data = (await response.json()) as OpenAIImageResponse;
    if (!response.ok || data.error) {
      const errorMsg = data.error?.message ?? `HTTP ${response.status}`;
      logger.error("[OpenAI Images] API error", { error: errorMsg });
      return fail({
        message: errorMsg as TranslationKey,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      logger.error("[OpenAI Images] No image URL in response");
      return fail({
        // eslint-disable-next-line i18next/no-literal-string
        message: "No image URL returned" as TranslationKey,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    logger.info("[OpenAI Images] Image generated successfully");
    return success({ imageUrl });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[OpenAI Images] Request failed", { error: errorMessage });
    return fail({
      message: errorMessage as TranslationKey,
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}

export function createOpenAIImages(logger: EndpointLogger): {
  chat: (modelId: string) => LanguageModelV2;
} {
  return createMediaProvider(logger, {
    provider: ApiProvider.OPENAI_IMAGES,
    logPrefix: "OpenAI Images Provider",
    defaultMediaType: "image/png",
    urlKey: "imageUrl",
    generate: (options, prompt, modelId) => {
      const size =
        readStringOption(options.providerOptions, "imageSize") ??
        "post.size.square1024";
      const quality =
        readStringOption(options.providerOptions, "imageQuality") ??
        "post.quality.standard";
      return generateWithOpenAI({
        providerModel: modelId,
        prompt,
        size,
        quality,
        logger,
      });
    },
  });
}
