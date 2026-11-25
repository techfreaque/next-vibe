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
import { pollDelay } from "../../shared/poll-delay";
import { scopedTranslation } from "../i18n";

interface ModelsLabVideoResponse {
  /** v7 video-fusion reports a failed job as "failed", v6 as "error". */
  status: "success" | "processing" | "error" | "failed";
  id?: number;
  output?: string[];
  proxy_links?: string[];
  fetch_result?: string;
  future_links?: string[];
  eta?: number;
  generationTime?: number;
  message?: string;
}

/**
 * How a ModelsLab-hosted video model is called. ModelsLab serves the hosted
 * (closed) video models (Kling, LTX, Hailuo, Sora, Veo, Wan 2.6+, ...) only on
 * the v7 `video-fusion` routes. The legacy v6 `/video/text2video` and
 * `/video/img2video` routes take `num_frames` (max 25 frames) and SILENTLY
 * ignore an unknown model_id, generating with their default open model instead
 * (prod 2026-11-25: Kling V2.5 Turbo / LTX 2.3 Pro requests at 5-6 s came back
 * as 25-frame ~1.56 s 464x832 clips, billed at the requested length).
 * Params per model come from each model's page
 * (modelslab.com/models/<org>/<model_id>/llms.txt).
 */
export interface ModelsLabVideoModelSpec {
  /** model_id as ModelsLab spells it (case matters). */
  apiModelId: string;
  /** v7 video-fusion route the model lives on. */
  route: "text-to-video" | "image-to-video" | "video-to-video" | "lip-sync";
  /** How the aspect ratio is sent; absent = the model takes none. */
  aspect?: "ratio" | "size";
  /** resolution values by our resolution label; absent = not sent. */
  resolutions?: Readonly<Record<string, string>>;
  /** Sent when the request names no resolution (the billed base tier). */
  defaultResolution?: string;
  /** Extra fixed params the model requires. */
  extra?: Readonly<Record<string, string | boolean>>;
}

const V7_VIDEO_BASE = "https://modelslab.com/api/v7/video-fusion";

const LTX_RESOLUTIONS: Readonly<Record<string, string>> = {
  "1080p": "1920x1080",
  FHD: "1920x1080",
  "2K": "2560x1440",
  "4K": "3840x2160",
};
const WAN_RESOLUTIONS: Readonly<Record<string, string>> = {
  "720p": "720p",
  "1080p": "1080p",
};

/** providerModel (our models.ts value) -> ModelsLab v7 call shape. */
export const MODELSLAB_VIDEO_MODELS: Readonly<
  Record<string, ModelsLabVideoModelSpec>
> = {
  "kling-v2-5-turbo-t2v": {
    apiModelId: "kling-v2-5-turbo-t2v",
    route: "text-to-video",
    aspect: "ratio",
  },
  "kling-v2-5-turbo-i2v": {
    apiModelId: "Kling-V2-5-Turbo-i2v",
    route: "image-to-video",
  },
  "kling-v2-1-master-t2v": {
    apiModelId: "kling-v2-1-master-t2v",
    route: "text-to-video",
  },
  "kling-v2-1-master-i2v": {
    apiModelId: "kling-v2-1-master-i2v",
    route: "image-to-video",
  },
  "kling-v3-t2v": {
    apiModelId: "kling-v3-t2v",
    route: "text-to-video",
    aspect: "ratio",
    extra: { mode: "std", generate_audio: false },
  },
  "ltx-2-pro-t2v": {
    apiModelId: "ltx-2-pro-t2v",
    route: "text-to-video",
    resolutions: LTX_RESOLUTIONS,
    defaultResolution: "1920x1080",
  },
  "ltx-2-3-pro-i2v": {
    apiModelId: "ltx-2-3-pro-i2v",
    route: "image-to-video",
    resolutions: LTX_RESOLUTIONS,
    defaultResolution: "1920x1080",
  },
  "Hailuo-2.3-t2v": { apiModelId: "Hailuo-2.3-t2v", route: "text-to-video" },
  "Hailuo-2.3-i2v": { apiModelId: "Hailuo-2.3-i2v", route: "image-to-video" },
  "Hailuo-2.3-Fast-i2v": {
    apiModelId: "Hailuo-2.3-Fast-i2v",
    route: "image-to-video",
  },
  "sora-2": { apiModelId: "sora-2", route: "text-to-video", aspect: "size" },
  "sora-2-pro-t2v": {
    apiModelId: "sora-2-pro-t2v",
    route: "text-to-video",
    aspect: "size",
  },
  "veo-3.1-fast": {
    apiModelId: "veo-3.1-fast",
    route: "text-to-video",
    aspect: "ratio",
    extra: { generate_audio: true },
  },
  "wan2.7-t2v": {
    apiModelId: "wan2.7-t2v",
    route: "text-to-video",
    resolutions: WAN_RESOLUTIONS,
    defaultResolution: "720p",
  },
  "wan2.6-i2v": {
    apiModelId: "wan2.6-i2v",
    route: "image-to-video",
    resolutions: WAN_RESOLUTIONS,
    defaultResolution: "720p",
  },
  "wan2.6-i2v-flash": {
    apiModelId: "wan2.6-i2v-flash",
    route: "image-to-video",
    resolutions: WAN_RESOLUTIONS,
    defaultResolution: "720p",
  },
  "seedance-1-5-pro": {
    apiModelId: "seedance-1-5-pro",
    route: "image-to-video",
    resolutions: { "480p": "480p", "720p": "720p", "1080p": "1080p" },
  },
  "omni-human-1.5": { apiModelId: "omni-human-1.5", route: "image-to-video" },
  "grok-t2v": {
    apiModelId: "grok-imagine-video-t2v",
    route: "text-to-video",
    resolutions: { "480p": "480P", "720p": "720P" },
  },
  "grok-i2v": {
    apiModelId: "grok-imagine-video-i2v",
    route: "image-to-video",
    resolutions: { "480p": "480p", "720p": "HD" },
  },
  gen4_aleph: { apiModelId: "gen4_aleph", route: "video-to-video" },
  "lipsync-2": { apiModelId: "lipsync-2", route: "lip-sync" },
};

/** Sora takes WxH strings instead of ratios. */
const SORA_SIZE_BY_RATIO: Readonly<Record<string, string>> = {
  "16:9": "1280x720",
  "9:16": "720x1280",
};

export type ModelsLabVideoRequest =
  | {
      ok: true;
      endpoint: string;
      body: Record<string, string | number | boolean>;
    }
  | { ok: false; reason: "imageRequired" | "unsupportedInput" };

/**
 * Pure request builder (no key, no I/O): endpoint + JSON body for one clip.
 * `durationSeconds` is already snapped to the route's listed durations by the
 * repository; ModelsLab takes it as a seconds STRING.
 */
export function buildModelsLabVideoRequest(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  aspectRatio?: string;
  resolution?: string;
  initImage?: string;
  isUltra?: boolean;
}): ModelsLabVideoRequest {
  const {
    providerModel,
    prompt,
    durationSeconds,
    aspectRatio,
    resolution,
    initImage,
  } = params;
  // Own files reach us as data URIs (the provider cannot fetch our storage);
  // without the flag ModelsLab rejects them: "init image must be a valid url
  // when base64 is a representation of false" (prod 2026-11-18).
  const imageFields = initImage
    ? {
        init_image: initImage,
        ...(initImage.startsWith("data:") ? { base64: true } : {}),
      }
    : {};

  const spec = MODELSLAB_VIDEO_MODELS[providerModel];
  if (!spec) {
    // Legacy v6 open models (wan2.1 / wan2.2 / ltx-2.3 community ids):
    // frame-based, max 25 frames.
    const isUltraModel =
      params.isUltra ??
      (providerModel === "wan2.1" || providerModel === "wan2.2");
    return {
      ok: true,
      endpoint: initImage
        ? "https://modelslab.com/api/v6/video/img2video"
        : isUltraModel
          ? "https://modelslab.com/api/v6/video/text2video_ultra"
          : "https://modelslab.com/api/v6/video/text2video",
      body: {
        model_id: providerModel,
        prompt,
        // eslint-disable-next-line i18next/no-literal-string
        output_type: "mp4",
        num_frames: Math.min(Math.round(durationSeconds * 8), 25),
        ...imageFields,
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
        ...(resolution ? { resolution } : {}),
      },
    };
  }

  if (spec.route === "video-to-video" || spec.route === "lip-sync") {
    // These edit an existing video (init_video / init_audio), which this
    // endpoint does not take. Fail before submitting: nothing is billed.
    return { ok: false, reason: "unsupportedInput" };
  }
  if (spec.route === "image-to-video" && !initImage) {
    return { ok: false, reason: "imageRequired" };
  }

  const body: Record<string, string | number | boolean> = {
    model_id: spec.apiModelId,
    prompt,
    duration: String(durationSeconds),
    ...(spec.route === "image-to-video" ? imageFields : {}),
    ...spec.extra,
  };
  if (aspectRatio && spec.aspect === "ratio") {
    body.aspect_ratio = aspectRatio;
  }
  if (aspectRatio && spec.aspect === "size") {
    const size = SORA_SIZE_BY_RATIO[aspectRatio];
    if (size) {
      body.aspect_ratio = size;
    }
  }
  if (spec.resolutions) {
    const mapped = resolution ? spec.resolutions[resolution] : undefined;
    const value = mapped ?? spec.defaultResolution;
    if (value) {
      body.resolution = value;
    }
  }
  return { ok: true, endpoint: `${V7_VIDEO_BASE}/${spec.route}`, body };
}

// Real interval ALWAYS — never a test-only shortcut. pollDelay() collapses to
// 10ms on REPLAY (via the fixture-replay header), so replays stay fast; a
// RECORDING run must actually wait the real cadence or it times out before the
// job finishes and records a bogus future_links fallback.
// Hosted v7 video takes minutes: Kling V2.5 Turbo T2V 5 s took 343 s on
// 2026-11-25 (a 4.5 min budget timed out on it). 3s × 300 = 15 min.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 300;

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

  logger.debug("[ModelsLab Video] Submitting generation request", {
    providerModel,
    durationSeconds,
    resolution,
    aspectRatio,
    hasImage: inputImageUrl !== undefined,
    promptLength: prompt.length,
  });

  try {
    // ModelsLab fetches init_image itself and rejects URLs that redirect
    // ("The init_image is invalid. Make sure init_image is accessible without
    // redirecting"). CDN-backed sources (Unsplash etc.) routinely 30x to their
    // final asset — resolve redirects here and hand the provider the final
    // direct URL. Resolution failure is non-fatal: submit the original URL
    // and let the provider report its own error. (Our own storage URLs are
    // already inlined to data URIs by the repository before this call.)
    let resolvedInitImage = inputImageUrl;
    if (inputImageUrl && inputImageUrl.startsWith("http")) {
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
    const request = buildModelsLabVideoRequest({
      providerModel,
      prompt,
      durationSeconds,
      aspectRatio,
      resolution,
      initImage: resolvedInitImage,
      isUltra,
    });
    if (!request.ok) {
      return fail({
        message:
          request.reason === "imageRequired"
            ? t("post.errors.inputMediaRequired")
            : t("post.errors.providerUnsupported", {
                label: `ModelsLab ${providerModel}`,
              }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }
    const submitResponse = await fetchImpl(request.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: agentEnv.MODELSLAB_API_KEY,
        ...request.body,
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

      // After ~ETA seconds the asset is usually ready even if the poll `status`
      // stays "processing" (a ModelsLab video quirk); from that point we HEAD the
      // future_links URL each poll. Guarded so a tiny/absent ETA still waits at
      // least a couple polls before hammering HEAD.
      const etaAttempts = Math.max(
        2,
        Math.ceil((result.eta ?? 60) / (POLL_INTERVAL_MS / 1000)),
      );

      let lastResponse: Response = submitResponse;
      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        if (signal?.aborted) {
          return fail({
            message: t("post.errors.requestAborted"),
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

        if (pollResult.status === "error" || pollResult.status === "failed") {
          return fail({
            message: pollResult.message
              ? t("post.errors.generationFailed", { error: pollResult.message })
              : t("post.errors.generationFailedUnknown"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        // ModelsLab's /fetch endpoint sometimes NEVER flips `status` to "success"
        // for video jobs — it stays "processing" indefinitely even after the asset
        // is fully generated and live at future_links. Relying on `status` alone
        // then burns the whole poll budget and fails a video that actually exists.
        // So once we're past the provider's ETA, HEAD the future_links URL each
        // poll: the moment the file is really there (200), return it as success.
        if (futureUrl && attempt + 1 >= etaAttempts) {
          try {
            const head = await fetchImpl(futureUrl, { method: "HEAD", signal });
            lastResponse = head;
            if (head.ok) {
              logger.debug(
                "[ModelsLab Video] future_links ready mid-poll (status stuck on processing)",
                { futureUrl, attempt: attempt + 1 },
              );
              return success({ videoUrl: futureUrl });
            }
          } catch {
            // File not ready yet — keep polling.
          }
        }

        logger.debug("[ModelsLab Video] Still processing", {
          attempt: attempt + 1,
          eta: pollResult.eta,
        });
      }

      // Poll budget exhausted. future_links is the URL the finished asset WILL
      // live at — but returning it blind is a silent failure: if the job never
      // finished, that URL 404s and we ship a dead video link. Only accept it
      // if the file is ACTUALLY there now (HEAD via the fixture-aware fetch);
      // otherwise fail loudly.
      if (futureUrl) {
        let ready = false;
        try {
          const head = await fetchImpl(futureUrl, { method: "HEAD", signal });
          ready = head.ok;
          if (!ready) {
            logger.error(
              "[ModelsLab Video] Poll timed out; future_links URL not ready",
              { futureUrl, status: head.status },
            );
          }
        } catch (headErr) {
          logger.error(
            "[ModelsLab Video] Poll timed out; future_links HEAD check failed",
            { futureUrl, error: parseError(headErr).message },
          );
        }
        if (ready) {
          logger.debug(
            "[ModelsLab Video] Poll timed out but future_links file is ready",
            { futureUrl },
          );
          return success({ videoUrl: futureUrl });
        }
      }

      return fail({
        message: t("post.errors.requestTimedOut"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Error response. init_image rejections are misleading as-is (the URL is
    // fine — the model/endpoint combination doesn't support image-to-video),
    // so translate them into an actionable hint the AI can act on.
    const rawError = result.message;
    if (inputImageUrl && rawError && /init_image/i.test(rawError)) {
      return fail({
        message: t("post.errors.imageInputUnsupported", {
          model: providerModel,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    return fail({
      message: rawError
        ? t("post.errors.providerError", { error: rawError })
        : t("post.errors.providerErrorUnknown"),
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
