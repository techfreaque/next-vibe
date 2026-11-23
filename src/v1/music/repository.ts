/**
 * POST /v1/music - validate, price and queue a music job; the generation runs
 * in the background through the music generation tool (provider routing,
 * storage, billing at the provider's real cost x markup where reported,
 * listed per-clip price otherwise; nothing is charged for a failed job).
 */

import "server-only";

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { calculateCreditCost } from "next-vibe/agent/models/models";
import {
  MUSIC_DURATION_SECONDS,
  MusicDuration,
  type MusicDurationValue,
} from "next-vibe/agent/music-generation/enum";
import { scopedTranslation as musicScopedTranslation } from "next-vibe/agent/music-generation/i18n";
import { MusicGenerationRepository } from "next-vibe/agent/music-generation/repository";
import { checkMediaBalance } from "next-vibe/agent/shared/media-generation";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  type StreamingResponse,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";

import type { V1T } from "../i18n";
import { v1Error } from "../shared/errors";
import { gateApiKeyRequest } from "../shared/gate";
import {
  mediaConsentError,
  mediaToolContext,
  v1ErrorFromToolFailure,
} from "../shared/media";
import {
  createMediaJob,
  mediaJobObject,
  newMediaJobId,
  startMediaJob,
  type V1MediaJobOutput,
} from "../shared/media-jobs";
import {
  type V1MediaJobParams,
  V1MediaJobsRepository,
} from "../shared/media-jobs-repository";
import { resolveV1MusicModel } from "../shared/media-models";
import { openAiErrorResponse, openAiJson } from "../shared/openai";
import type { V1MusicPostRequestOutput } from "./definition";

/** Requested seconds as the music tool's length bucket (nearest). */
export function musicDurationFor(
  seconds: number | undefined,
): typeof MusicDurationValue {
  if (seconds === undefined) {
    return MusicDuration.MEDIUM;
  }
  let best: typeof MusicDurationValue = MusicDuration.MEDIUM;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const duration of Object.values(MusicDuration)) {
    const distance = Math.abs((MUSIC_DURATION_SECONDS[duration] ?? 0) - seconds);
    if (distance < bestDistance) {
      best = duration;
      bestDistance = distance;
    }
  }
  return best;
}

export class V1MusicRepository {
  static async create(params: {
    data: V1MusicPostRequestOutput;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    request: Request | undefined;
    t: V1T;
    toolExecutionContext: ToolExecutionContext;
    platform: Platform;
    /**
     * Injection point for tests (no provider call); production runs the
     * generation tool.
     */
    generate?: () => Promise<ResponseType<V1MediaJobOutput>>;
  }): Promise<StreamingResponse> {
    const { data, user, locale, logger, request, t, platform } = params;
    const gate = await gateApiKeyRequest(user, request, locale, t, logger);
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    const model = resolveV1MusicModel(data.model, gate.user, await getEnvAvailability());
    if (!model) {
      return openAiErrorResponse(
        v1Error(404, t("openai.modelNotFound", { model: data.model }), "not_found_error", "model_not_found", "model"),
      );
    }
    const consent = await mediaConsentError({ model, user: gate.user, locale, logger });
    if (consent) {
      return openAiErrorResponse(consent);
    }
    const duration = musicDurationFor(data.seconds);
    const estimate = calculateCreditCost(model, 0, 0);
    const balance = await checkMediaBalance(
      gate.user,
      estimate,
      locale,
      logger,
      model.id,
    );
    if (!balance.success) {
      return openAiErrorResponse(v1ErrorFromToolFailure(balance));
    }

    const job = await createMediaJob({
      id: newMediaJobId("music"),
      userId: gate.user.id,
      apiKeyId: gate.key.id,
      kind: "music",
      model: model.id,
      prompt: data.prompt,
      params: {
        seconds: MUSIC_DURATION_SECONDS[duration] ?? model.defaultDurationSeconds,
        size: null,
        aspectRatio: null,
        resolution: null,
      },
    });
    if (!job) {
      return openAiErrorResponse(
        v1Error(500, t("media.errors.jobNotCreated"), "server_error", null),
      );
    }

    const { t: musicT } = musicScopedTranslation.scopedT(locale);
    // Background: no request signal (the job outlives the request). A
    // thread namespace makes the tool store the file under the account.
    const toolContext = mediaToolContext(params.toolExecutionContext, undefined, crypto.randomUUID());
    startMediaJob(
      job,
      params.generate ??
        (async (): Promise<ResponseType<V1MediaJobOutput>> => {
        const result = await MusicGenerationRepository.generateMusic(
          { prompt: data.prompt, model: model.id, duration },
          gate.user,
          locale,
          logger,
          musicT,
          toolContext,
          platform,
        );
        if (!result.success) {
          return result;
        }
        // Storage failed and the provider handed back inline bytes: never
        // keep a data: URI as the result (the file is not deliverable).
        if (result.data.audioUrl.startsWith("data:")) {
          return fail({
            message: t("media.errors.storageFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        return success({
          url: result.data.audioUrl,
          creditCost: result.data.creditCost,
          durationSeconds: result.data.durationSeconds,
        });
      }),
      logger,
    );
    return openAiJson(mediaJobObject(job, request));
  }

  /** GET /v1/music/{id}: job status (see V1MediaJobsRepository). */
  static get(
    params: Omit<V1MediaJobParams, "kind">,
  ): Promise<StreamingResponse> {
    return V1MediaJobsRepository.get({ ...params, kind: "music" });
  }

  /** GET /v1/music/{id}/content: the finished file. */
  static content(
    params: Omit<V1MediaJobParams, "kind">,
  ): Promise<StreamingResponse> {
    return V1MediaJobsRepository.content({ ...params, kind: "music" });
  }
}
