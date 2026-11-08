/**
 * Credits - DB deduction + running total tracking for the db-writer.
 * MessageDbWriter.deductAndEmitCredits delegates here; tool and compacting
 * modules call it directly.
 */

import "server-only";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";

import type { ChatModelId } from "../../../models";
import type {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "../../../vision-models";
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
 * Background-task streams (cronTaskId) log every billed step to the task spend
 * ledger and check run limits + budget caps right away. A breach aborts the
 * stream before the next billed step. Interactive chat has no cronTaskId and
 * skips this entirely.
 */
async function guardTaskStep(
  w: DbWriterState,
  params: DeductAndEmitCreditsParams,
): Promise<void> {
  const taskId = w.toolExecutionContext.cronTaskId;
  if (!taskId) {
    return;
  }
  const { TaskGuard } = await import("next-vibe/tasks/watchdog/guard");
  const { SpendKind } = await import("next-vibe/tasks/watchdog/enum");
  const verdict = await TaskGuard.afterBilledStep(
    {
      taskId,
      threadId: w.lastThreadId,
      kind: params.type === "model" ? SpendKind.MODEL : SpendKind.TOOL,
      amount: params.amount,
    },
    w.deps.logger,
  );
  if (!verdict.ok) {
    w.deps.logger.warn(
      "[MessageDbWriter] Task guard tripped - stopping stream",
      {
        taskId,
        threadId: w.lastThreadId,
        abortReason: verdict.abortReason,
        reason: verdict.reason,
      },
    );
    w.onTaskGuardTripped?.(verdict.abortReason, verdict.reason);
  }
}

/** Pause before the single deduction retry */
const BILLING_RETRY_DELAY_MS = 250;

/**
 * Deduct credits in DB (one retry). On final failure the writer is marked
 * billingFailed and the owning stream is aborted — fail closed.
 */
export async function deductAndEmitCredits(
  w: DbWriterState,
  params: DeductAndEmitCreditsParams,
): Promise<void> {
  if (params.amount <= 0) {
    // Free steps still count toward a task's turn / tool-call ceilings.
    await guardTaskStep(w, params);
    return;
  }

  const { CreditRepository } = await import("@/credits/repository");
  const deduct = (): ReturnType<
    typeof CreditRepository.deductCreditsForFeature
  > =>
    params.type === "model"
      ? CreditRepository.deductCreditsForModelUsage(
          params.user,
          params.amount,
          params.model,
          w.deps.logger,
          w.deps.creditsT,
          w.deps.locale,
        )
      : CreditRepository.deductCreditsForFeature(
          params.user,
          params.amount,
          params.feature,
          w.deps.logger,
          w.deps.creditsT,
          w.deps.locale,
        );

  // One retry absorbs transient DB failures (pool hiccup, lock timeout).
  let deductResult = await deduct();
  if (!deductResult.success) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, BILLING_RETRY_DELAY_MS);
    });
    deductResult = await deduct();
  }

  if (deductResult.success) {
    w.totalCreditsDeducted += params.amount;
    await guardTaskStep(w, params);
    return;
  }

  // Fail closed: an unbilled turn must not become a free loop. The output
  // already streamed cannot be recalled, so stop the stream before any
  // further billed step/tool and leave a full record for reconciliation.
  w.billingFailed = true;
  w.deps.logger.error(
    "[MessageDbWriter] Credit deduction failed after retry — stopping stream (fail closed)",
    {
      amount: params.amount,
      feature: params.feature,
      type: params.type,
      model: params.type === "model" ? params.model : (params.model ?? null),
      userId: params.user.isPublic ? null : params.user.id,
      leadId: params.user.leadId,
      threadId: w.lastThreadId,
      messageId: w.lastAssistantMessageId,
      totalCreditsDeductedSoFar: w.totalCreditsDeducted,
      error: deductResult.message,
      errorType: deductResult.errorType?.errorKey ?? null,
    },
  );
  w.onBillingFailed?.();
}
