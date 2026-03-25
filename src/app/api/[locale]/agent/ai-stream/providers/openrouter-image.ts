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
import type { TranslationKey } from "@/i18n/core/static-types";

interface OpenRouterImageResponse {
  data?: Array<{ url?: string; b64_json?: string }>;
  error?: { message: string; code?: number };
}

export async function generateWithOpenRouter(params: {
  providerModel: string;
  prompt: string;
  logger: EndpointLogger;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, logger } = params;

  if (!agentEnv.OPENROUTER_API_KEY) {
    return fail({
      // eslint-disable-next-line i18next/no-literal-string
      message: "OpenRouter API key not configured" as TranslationKey,
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.info("[OpenRouter Image] Generating image", {
    model: providerModel,
    promptLength: prompt.length,
  });

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/images/generations",
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
          prompt,
          n: 1,
          response_format: "url",
        }),
      },
    );

    const data = (await response.json()) as OpenRouterImageResponse;
    if (!response.ok || data.error) {
      const errorMsg = data.error?.message ?? `HTTP ${response.status}`;
      logger.error("[OpenRouter Image] API error", { error: errorMsg });
      return fail({
        message: errorMsg as TranslationKey,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      logger.error("[OpenRouter Image] No image URL in response");
      return fail({
        // eslint-disable-next-line i18next/no-literal-string
        message: "No image URL returned" as TranslationKey,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    logger.info("[OpenRouter Image] Image generated successfully");
    return success({ imageUrl });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[OpenRouter Image] Request failed", { error: errorMessage });
    return fail({
      message: errorMessage as TranslationKey,
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
