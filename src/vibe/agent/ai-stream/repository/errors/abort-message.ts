/**
 * The text of the error row an aborted turn leaves in the thread.
 *
 * The overall turn time limit used to fall through to "Generation was
 * stopped", which reads as if the user pressed stop (prod 2026-11-20: a
 * 51k-token answer cut at exactly 900 s, the user had no idea why). It now
 * names the limit and points to Continue.
 */

import type { AiStreamT } from "../../stream/i18n";
import { AbortReason, type StreamAbortError } from "../core/constants";

export function abortInterruptionMessage(
  streamAbort: StreamAbortError | null,
  t: AiStreamT,
): ReturnType<AiStreamT> {
  switch (streamAbort?.reason) {
    case AbortReason.BILLING_FAILED:
      return t("info.billingFailed");
    case AbortReason.BUDGET_EXCEEDED:
      return t("info.budgetExceeded");
    case AbortReason.TASK_WATCHDOG:
      return t("info.taskWatchdog");
    case AbortReason.STREAM_TIMEOUT:
      // Only the overall duration limit carries maxDurationSeconds; the
      // first-part watchdog and remote-result timers keep the old text.
      return streamAbort.maxDurationSeconds !== undefined
        ? t("info.streamTimeLimit", {
            minutes: Math.max(
              1,
              Math.round(streamAbort.maxDurationSeconds / 60),
            ).toString(),
          })
        : t("info.streamInterrupted");
    default:
      return t("info.streamInterrupted");
  }
}
