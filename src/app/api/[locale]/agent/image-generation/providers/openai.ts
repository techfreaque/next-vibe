import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { scopedTranslation } from "@/app/api/[locale]/agent/image-generation/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

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
  locale: CountryLanguage;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, size, quality, logger, locale } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.OPENAI_API_KEY) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const apiSize = mapSizeToOpenAI(size);
  const apiQuality = mapQualityToOpenAI(quality);
  logger.debug("[OpenAI Images] Generating image", {
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
        message: t("post.errors.externalServiceError", { message: errorMsg }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      logger.error("[OpenAI Images] No image URL in response");
      return fail({
        message: t("post.errors.noImageUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    logger.debug("[OpenAI Images] Image generated successfully");
    return success({ imageUrl });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[OpenAI Images] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
