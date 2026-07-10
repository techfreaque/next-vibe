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

interface OpenRouterVideoSubmitResponse {
  id: string;
  polling_url: string;
  status: string;
  generation_id?: string;
  error?: string | null;
  unsigned_urls?: string[];
  usage?: { cost?: number; is_byok?: boolean };
}

interface OpenRouterVideoRequestBody {
  model: string;
  prompt: string;
  duration?: number;
  aspect_ratio?: string;
  resolution?: string;
  frame_images?: Array<{ type: string; image_url: string }>;
  generate_audio?: boolean;
  negative_prompt?: string;
  negativePrompt?: string;
  cfg_scale?: number;
}

interface OpenRouterVideoStatusResponse {
  id: string;
  polling_url: string;
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "failed"
    | "cancelled"
    | "expired";
  generation_id?: string;
  error?: string | null;
  unsigned_urls?: string[];
  usage?: { cost?: number; is_byok?: boolean };
}

// Real interval always — pollDelay() collapses to 10ms on REPLAY.
// Video gen can take 1-5 minutes; 5s × 120 = 10 min ceiling.
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 120;

export async function generateVideoWithOpenRouter(params: {
  providerModel: string;
  prompt: string;
  durationSeconds?: number;
  aspectRatio?: string;
  resolution?: string;
  firstFrameUrl?: string;
  lastFrameUrl?: string;
  negativePrompt?: string;
  generateAudio?: boolean;
  supportedFrameImages?: readonly string[];
  allowedPassthroughParameters?: readonly string[];
  logger: EndpointLogger;
  locale: CountryLanguage;
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ videoUrl: string; creditCost?: number }>> {
  const {
    providerModel,
    prompt,
    durationSeconds,
    aspectRatio,
    resolution,
    firstFrameUrl,
    lastFrameUrl,
    negativePrompt,
    generateAudio,
    supportedFrameImages,
    allowedPassthroughParameters,
    logger,
    locale,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.OPENROUTER_API_KEY) {
    return fail({
      message: t("post.errors.notConfigured", {
        label: "OpenRouter",
        envKey: "OPENROUTER_API_KEY",
        url: "https://openrouter.ai/keys",
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const headers = {
    // eslint-disable-next-line i18next/no-literal-string
    Authorization: `Bearer ${agentEnv.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    // eslint-disable-next-line i18next/no-literal-string
    "HTTP-Referer": "https://unbottled.ai",
    // eslint-disable-next-line i18next/no-literal-string
    "X-Title": "Unbottled AI",
  };

  const body: OpenRouterVideoRequestBody = { model: providerModel, prompt };
  if (durationSeconds !== undefined) {
    body.duration = durationSeconds;
  }
  if (aspectRatio) {
    body.aspect_ratio = aspectRatio;
  }
  if (resolution) {
    body.resolution = resolution;
  }
  const frameImages: Array<{ type: string; image_url: string }> = [];
  if (firstFrameUrl) {
    frameImages.push({ type: "first_frame", image_url: firstFrameUrl });
  }
  if (lastFrameUrl && supportedFrameImages?.includes("last_frame")) {
    frameImages.push({ type: "last_frame", image_url: lastFrameUrl });
  }
  if (frameImages.length > 0) {
    body.frame_images = frameImages;
  }
  if (generateAudio) {
    body.generate_audio = true;
  }

  // Per-model passthrough parameters
  const allowed = allowedPassthroughParameters ?? [];
  if (negativePrompt) {
    if (allowed.includes("negative_prompt")) {
      body.negative_prompt = negativePrompt;
    } else if (allowed.includes("negativePrompt")) {
      body.negativePrompt = negativePrompt;
    }
  }

  logger.debug("[OpenRouter Video] Submitting generation job", {
    model: providerModel,
    duration: durationSeconds,
    aspectRatio,
    resolution,
  });

  try {
    const submitRes = await fetchImpl("https://openrouter.ai/api/v1/videos", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const submitText = await submitRes.text();
    let submitData: OpenRouterVideoSubmitResponse;
    try {
      submitData = JSON.parse(submitText) as OpenRouterVideoSubmitResponse;
    } catch {
      return fail({
        message: t("post.errors.providerError", {
          error: `Non-JSON response (HTTP ${submitRes.status}): ${submitText.slice(0, 200)}`,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (!submitRes.ok || submitData.error) {
      const errMsg =
        submitData.error ??
        `HTTP ${submitRes.status}: ${submitText.slice(0, 200)}`;
      logger.error("[OpenRouter Video] Submit failed", { error: errMsg });
      return fail({
        message: t("post.errors.providerError", { error: errMsg }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const jobId = submitData.id;
    const pollUrl = `https://openrouter.ai/api/v1/videos/${jobId}`;

    logger.debug("[OpenRouter Video] Job submitted, polling", { jobId });

    // Fixture replay: pollDelay collapses to 10ms only when the PREVIOUS provider
    // response was a fixture replay (marked via x-vibe-fixture-replay). Seed it
    // with the submit response and advance it each poll, so a recorded run replays
    // instantly instead of sleeping the full real interval every attempt.
    let lastResponse: Response = submitRes;
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await pollDelay(POLL_INTERVAL_MS, lastResponse);

      const statusRes = await fetchImpl(pollUrl, { method: "GET", headers });
      lastResponse = statusRes;
      const statusText = await statusRes.text();
      let statusData: OpenRouterVideoStatusResponse;
      try {
        statusData = JSON.parse(statusText) as OpenRouterVideoStatusResponse;
      } catch {
        logger.warn("[OpenRouter Video] Non-JSON poll response, retrying", {
          attempt,
        });
        continue;
      }

      logger.debug("[OpenRouter Video] Poll status", {
        attempt,
        status: statusData.status,
      });

      if (statusData.status === "completed") {
        const videoUrl = statusData.unsigned_urls?.[0];
        if (!videoUrl) {
          return fail({
            message: t("post.errors.noVideoUrl"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        const creditCost =
          statusData.usage?.cost !== undefined
            ? statusData.usage.cost * 100
            : undefined;
        logger.debug("[OpenRouter Video] Generation complete", { videoUrl });
        return success({ videoUrl, creditCost });
      }

      if (
        statusData.status === "failed" ||
        statusData.status === "cancelled" ||
        statusData.status === "expired"
      ) {
        const errMsg = statusData.error ?? `Job ${statusData.status}`;
        logger.error("[OpenRouter Video] Job terminal failure", {
          status: statusData.status,
          error: errMsg,
        });
        return fail({
          message: t("post.errors.providerError", { error: errMsg }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
    }

    return fail({
      message: t("post.errors.providerError", {
        error: "Timed out waiting for video generation",
      }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[OpenRouter Video] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.providerError", { error: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
