/**
 * Credits - DB deduction + running total tracking for the db-writer.
 * MessageDbWriter.deductAndEmitCredits delegates here; tool and compacting
 * modules call it directly.
 */

import "server-only";

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "next-vibe/agent/ai-stream/vision-models";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

import type { DbWriterState } from "./shared";

/** Params for deductAndEmitCredits - model usage or tool usage. */
export type DeductAndEmitCreditsParams =
  | {
      user: JwtPayloadType;
      amount: number;
      feature: string;
      type: "model";
      model:
        | ChatModelId
        | ImageVisionModelId
        | VideoVisionModelId
        | AudioVisionModelId;
    }
  | {
      user: JwtPayloadType;
      amount: number;
      feature: string;
      type: "tool";
      model: ChatModelId | undefined;
    };

/**
 * Deduct credits in DB then emit CREDITS_DEDUCTED SSE.
 * Returns whether deduction succeeded.
 */
export async function deductAndEmitCredits(
  w: DbWriterState,
  params: DeductAndEmitCreditsParams,
): Promise<void> {
  if (params.amount <= 0) {
    return;
  }

  const { CreditRepository } = await import("@/credits/repository");
  const deductResult =
    params.type === "model"
      ? await CreditRepository.deductCreditsForModelUsage(
          params.user,
          params.amount,
          params.model,
          w.deps.logger,
          w.deps.creditsT,
          w.deps.locale,
        )
      : await CreditRepository.deductCreditsForFeature(
          params.user,
          params.amount,
          params.feature,
          w.deps.logger,
          w.deps.creditsT,
          w.deps.locale,
        );

  if (deductResult.success) {
    w.totalCreditsDeducted += params.amount;
  } else {
    w.deps.logger.error("[MessageDbWriter] Failed to deduct credits", {
      amount: params.amount,
      feature: params.feature,
      model: params.type === "model" ? params.model : (params.model ?? null),
      error: deductResult.message,
    });
  }
}
