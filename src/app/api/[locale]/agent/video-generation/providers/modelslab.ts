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

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { pollDelay } from "@/app/api/[locale]/agent/shared/poll-delay";
import { scopedTranslation } from "@/app/api/[locale]/agent/video-generation/i18n";

interface ModelsLabVideoResponse {
  status: "success" | "processing" | "error";
  id?: number;
  output?: string[];
  proxy_links?: string[];
  fetch_result?: string;
  future_links?: string[];
  eta?: number;
  generationTime?: number;
  message?: string;
}

// Allow tests to override poll interval to avoid 5s × N waits on fixture replay
const POLL_INTERVAL_MS = process.env.NODE_ENV === "test" ? 50 : 2000;
// Video generation routinely takes several minutes (VEO ~1-5 min, heavier
// models longer). Poll for up to 240s (same budget as the music provider);
// slower jobs are NOT failures — exhaustion falls back to the future_links
// URL from the submit response, which becomes valid when the job completes.
const MAX_POLL_ATTEMPTS = 120;

export async function generateVideoWithModelsLab(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
  isUltra?: boolean;
  aspectRatio?: string;
  resolution?: string;
  inputImageUrl?: string;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ videoUrl: string }>> {
  const {
    providerModel,
    prompt,
    durationSeconds,
    logger,
    locale,
    signal,
    isUltra,
    aspectRatio,
    resolution,
    inputImageUrl,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.MODELSLAB_API_KEY) {
    return fail({
      message: t("post.errors.notConfigured", {
        label: "ModelsLab",
        envKey: "MODELSLAB_API_KEY",
        url: "https://modelslab.com",
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // Determine which endpoint to use
  const isUltraModel =
    isUltra ?? (providerModel === "wan2.1" || providerModel === "wan2.2");
  const endpoint = inputImageUrl
    ? "https://modelslab.com/api/v6/video/img2video"
    : isUltraModel
      ? "https://modelslab.com/api/v6/video/text2video_ultra"
      : "https://modelslab.com/api/v6/video/text2video";

  logger.debug("[ModelsLab Video] Submitting generation request", {
    providerModel,
    endpoint,
    durationSeconds,
    promptLength: prompt.length,
  });

  try {
    // ModelsLab fetches init_image itself and rejects URLs that redirect
    // ("The init_image is invalid. Make sure init_image is accessible without
    // redirecting"). CDN-backed sources (Unsplash etc.) routinely 30x to their
    // final asset — resolve redirects here and hand the provider the final
    // direct URL. Resolution failure is non-fatal: submit the original URL
    // and let the provider report its own error.
    let resolvedInitImage = inputImageUrl;
    if (inputImageUrl) {
      try {
        const probe = await fetchImpl(inputImageUrl, {
          method: "HEAD",
          redirect: "follow",
          signal,
        });
        if (probe.url && probe.url !== inputImageUrl) {
          logger.debug("[ModelsLab Video] Resolved init_image redirect", {
            from: inputImageUrl,
            to: probe.url,
          });
          resolvedInitImage = probe.url;
        }
      } catch {
        // Keep the original URL.
      }
    }
    const submitResponse = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: agentEnv.MODELSLAB_API_KEY,
        model_id: providerModel,
        prompt,
        // eslint-disable-next-line i18next/no-literal-string
        output_type: "mp4",
        num_frames: Math.min(Math.round(durationSeconds * 8), 25),
        ...(resolvedInitImage ? { init_image: resolvedInitImage } : {}),
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
        ...(resolution ? { resolution } : {}),
      }),
      signal,
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      logger.error("[ModelsLab Video] Failed to submit request", {
        status: submitResponse.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.providerError", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const result = (await submitResponse.json()) as ModelsLabVideoResponse;

    // Immediate success
    if (result.status === "success") {
      const videoUrl = result.output?.[0] ?? result.proxy_links?.[0];
      if (videoUrl) {
        logger.debug("[ModelsLab Video] Video generated immediately");
        return success({ videoUrl });
      }
    }

    // Async processing - poll fetch_result URL
    if (result.status === "processing" && result.fetch_result) {
      const fetchUrl = result.fetch_result;
      const futureUrl = result.future_links?.[0];
      logger.debug("[ModelsLab Video] Request queued, polling", {
        fetchUrl,
        futureUrl,
        eta: result.eta,
      });

      let lastResponse: Response = submitResponse;
      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        if (signal?.aborted) {
          return fail({
            message: t("post.errors.generationFailed", {
              error: "Request aborted",
            }),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        await pollDelay(POLL_INTERVAL_MS, lastResponse);

        const pollResponse = await fetchImpl(fetchUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: agentEnv.MODELSLAB_API_KEY }),
        });
        lastResponse = pollResponse;

        if (!pollResponse.ok) {
          logger.debug("[ModelsLab Video] Poll request failed, retrying", {
            status: pollResponse.status,
            attempt: attempt + 1,
          });
          continue;
        }

        const pollResult =
          (await pollResponse.json()) as ModelsLabVideoResponse;

        if (pollResult.status === "success") {
          const videoUrl =
            pollResult.output?.[0] ?? pollResult.proxy_links?.[0];
          if (videoUrl) {
            logger.debug("[ModelsLab Video] Video generated successfully");
            return success({ videoUrl });
          }
        }

        if (pollResult.status === "error") {
          return fail({
            message: t("post.errors.generationFailed", {
              error: pollResult.message ?? "Unknown error",
            }),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        logger.debug("[ModelsLab Video] Still processing", {
          attempt: attempt + 1,
          eta: pollResult.eta,
        });
      }

      // Poll budget exhausted but the job is still running upstream. Same
      // contract as the music provider: the processing response carries
      // future_links — the URL the finished asset WILL live at. Return it
      // instead of failing a generation that completes moments later.
      if (futureUrl) {
        logger.warn(
          "[ModelsLab Video] Poll timed out, using future_links URL",
          {
            futureUrl,
          },
        );
        return success({ videoUrl: futureUrl });
      }

      return fail({
        message: t("post.errors.generationFailed", {
          error: "Request timed out",
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Error response. init_image rejections are misleading as-is (the URL is
    // fine — the model/endpoint combination doesn't support image-to-video),
    // so translate them into an actionable hint the AI can act on.
    const rawError = result.message ?? "Unknown error";
    if (inputImageUrl && /init_image/i.test(String(rawError))) {
      return fail({
        message: t("post.errors.imageInputUnsupported", {
          model: providerModel,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    return fail({
      message: t("post.errors.providerError", {
        error: rawError,
      }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[ModelsLab Video] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.generationFailed", { error: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
