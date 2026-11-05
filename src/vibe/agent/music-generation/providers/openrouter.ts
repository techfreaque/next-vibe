import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../../env";
import { scopedTranslation } from "../i18n";

/** One SSE chunk of an OpenRouter chat completion with audio output. */
interface OpenRouterAudioChunk {
  choices?: Array<{
    delta?: { content?: string | null; audio?: { data?: string } };
  }>;
  error?: { message: string; code?: number };
}

/**
 * Music via OpenRouter (Lyria): a chat completion with audio output.
 * OpenRouter only emits audio on a STREAMED completion — the clip arrives as
 * base64 MP3 in `delta.audio.data` chunks, concatenated in order.
 */
export async function generateMusicWithOpenRouter(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ audioUrl: string }>> {
  const { providerModel, prompt, durationSeconds, logger, locale, fetchImpl } =
    params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.OPENROUTER_API_KEY) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.debug("[OpenRouter Music] Generating clip", {
    model: providerModel,
    durationSeconds,
    promptLength: prompt.length,
  });

  try {
    const response = await fetchImpl(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          "HTTP-Referer": "https://unbottled.ai",
          // eslint-disable-next-line i18next/no-literal-string
          "X-Title": "Unbottled AI",
        },
        body: JSON.stringify({
          model: providerModel,
          modalities: ["text", "audio"],
          stream: true,
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    const rawText = await response.text();
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(rawText) as OpenRouterAudioChunk;
        message = parsed.error?.message ?? message;
      } catch {
        // non-JSON error body — keep the status
      }
      logger.error("[OpenRouter Music] API error", { error: message });
      return fail({
        message: t("post.errors.externalServiceError", { message }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    let audioBase64 = "";
    for (const line of rawText.split("\n")) {
      if (!line.startsWith("data: {")) {
        continue;
      }
      const chunk = JSON.parse(line.slice(6)) as OpenRouterAudioChunk;
      if (chunk.error) {
        logger.error("[OpenRouter Music] Stream error", {
          error: chunk.error.message,
        });
        return fail({
          message: t("post.errors.externalServiceError", {
            message: chunk.error.message,
          }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      audioBase64 += chunk.choices?.[0]?.delta?.audio?.data ?? "";
    }

    if (!audioBase64) {
      logger.error("[OpenRouter Music] No audio in response");
      return fail({
        message: t("post.errors.noAudioUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    logger.debug("[OpenRouter Music] Clip generated", {
      bytes: Math.floor((audioBase64.length * 3) / 4),
    });
    // Lyria returns MP3 (ID3). The repository re-uploads to storage when the
    // call belongs to a thread; standalone calls play the inline clip.
    return success({ audioUrl: `data:audio/mpeg;base64,${audioBase64}` });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[OpenRouter Music] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
