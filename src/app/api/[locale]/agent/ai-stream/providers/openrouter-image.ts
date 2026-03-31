import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface OpenRouterImageMessage {
  role: string;
  content: string | null;
  images?: Array<{ type: string; image_url?: { url: string } }>;
}

interface OpenRouterChatResponse {
  choices?: Array<{ message?: OpenRouterImageMessage }>;
  error?: { message: string; code?: number };
}

export async function generateWithOpenRouter(params: {
  providerModel: string;
  prompt: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, logger, locale } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.OPENROUTER_API_KEY) {
    return fail({
      message: t("errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.info("[OpenRouter Image] Generating image", {
    model: providerModel,
    promptLength: prompt.length,
  });

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          "HTTP-Referer": "https://unbottled.ai",
        },
        body: JSON.stringify({
          model: providerModel,
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    const rawText = await response.text();

    let data: OpenRouterChatResponse;
    try {
      data = JSON.parse(rawText) as OpenRouterChatResponse;
    } catch {
      logger.error("[OpenRouter Image] Failed to parse response as JSON", {
        status: response.status,
        body: rawText.slice(0, 500),
      });
      return fail({
        message: t("errors.requestFailed", {
          message: `Non-JSON response (HTTP ${response.status}): ${rawText.slice(0, 200)}`,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message ?? `HTTP ${response.status}`;
      logger.error("[OpenRouter Image] API error", { error: errorMsg });
      return fail({
        message: t("errors.externalServiceError", { message: errorMsg }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const message = data.choices?.[0]?.message;

    // Images are returned in message.images array as { type: "image_url", image_url: { url } }
    const imageEntry = message?.images?.[0];
    const imageUrl = imageEntry?.image_url?.url;

    if (!imageUrl) {
      logger.error("[OpenRouter Image] No image in response", {
        hasImages: Boolean(message?.images),
        imagesCount: message?.images?.length ?? 0,
      });
      return fail({
        message: t("errors.noImageUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    logger.info("[OpenRouter Image] Image generated successfully");
    return success({ imageUrl });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[OpenRouter Image] Request failed", { error: errorMessage });
    return fail({
      message: t("errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
