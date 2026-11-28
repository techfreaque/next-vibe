/**
 * Run a vision description with ONE fallback model.
 *
 * Used by the describe-image / describe-video tools. The resolved model runs
 * first; when it throws (moderation block or any other failure) or returns a
 * refusal / empty / content-filtered answer, the fallback model gets one try.
 * Every refusal and failure is logged with the model id and reason. The caller
 * gets either a real description (and the model that produced it, for
 * billing) or an explicit failure reason, never placeholder text.
 */

import "server-only";

import type { generateText } from "ai";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ModelOptionTokenBased } from "../../../models/models";
import { detectVisionRefusal, isModerationError } from "./vision-refusal";

type VisionGenerateResult = Awaited<ReturnType<typeof generateText>>;

export type VisionDescribeOutcome<TOption extends ModelOptionTokenBased> =
  | {
      ok: true;
      model: TOption;
      result: VisionGenerateResult;
      text: string;
    }
  | { ok: false; reason: string; creditRefusal?: ErrorResponseType };

export async function describeWithVisionFallback<
  TOption extends ModelOptionTokenBased,
>(params: {
  model: TOption;
  mediaSource: "inline-upload" | "storage-file" | "remote-url";
  /** Non-PII diagnostics for remote media URLs (host + file extension). */
  mediaContext?: { remoteHost?: string; urlExt?: string | null };
  /** Second-chance model after `failedId` refused/failed; null = none. */
  resolveFallback: (failedId: string) => TOption | null;
  checkCredits?: (model: TOption) => Promise<ResponseType<number>>;
  run: (model: TOption) => Promise<VisionGenerateResult>;
  logger: EndpointLogger;
  /** Log prefix, e.g. "[DescribeImage]". */
  logTag: string;
}): Promise<VisionDescribeOutcome<TOption>> {
  const {
    model,
    mediaSource,
    mediaContext,
    resolveFallback,
    run,
    logger,
    logTag,
  } = params;
  const reasons: string[] = [];
  let current: TOption | null = model;
  let isFallback = false;

  while (current) {
    const gate = await params.checkCredits?.(current);
    if (gate && !gate.success) {
      return { ok: false, reason: gate.message, creditRefusal: gate };
    }
    let reason: string;
    try {
      const result = await run(current);
      const text = result.text.trim();
      const refusal = detectVisionRefusal(text, result.finishReason);
      if (!refusal) {
        if (isFallback) {
          logger.info(`${logTag} Fallback vision model succeeded`, {
            modelId: current.id,
            failedModelId: model.id,
          });
        }
        return { ok: true, model: current, result, text };
      }
      reason = refusal;
      logger.warn(`${logTag} Vision model refused`, {
        modelId: current.id,
        mediaSource,
        finishReason: result.finishReason,
        reason,
      });
    } catch (error) {
      reason = parseError(error).message;
      logger.warn(
        isModerationError(reason)
          ? `${logTag} Vision model refused by provider moderation`
          : `${logTag} Vision model failed`,
        {
          modelId: current.id,
          visionAttempt: { apiProvider: current.apiProvider, isFallback },
          mediaSource,
          ...mediaContext,
          error: reason,
        },
      );
    }
    reasons.push(`${current.id}: ${reason}`);
    if (isFallback) {
      break;
    }
    isFallback = true;
    current = resolveFallback(model.id);
    if (current) {
      logger.warn(`${logTag} Retrying with fallback vision model`, {
        failedModelId: model.id,
        mediaSource,
        ...mediaContext,
        fallbackModelId: current.id,
      });
    }
  }

  const reason = reasons.join("; ");
  logger.error(`${logTag} No vision model produced a description`, {
    reason,
    mediaSource,
    ...mediaContext,
  });
  return { ok: false, reason };
}
