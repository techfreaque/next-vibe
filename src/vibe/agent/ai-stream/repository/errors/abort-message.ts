/** The text an aborted turn leaves in the thread. */

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
    default:
      return t("info.streamInterrupted");
  }
}
