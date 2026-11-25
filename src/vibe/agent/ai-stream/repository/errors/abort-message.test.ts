import { describe, expect, it } from "bun:test";

import { scopedTranslation } from "../../stream/i18n";
import { AbortReason, StreamAbortError } from "../core/constants";
import { abortInterruptionMessage } from "./abort-message";

const { t } = scopedTranslation.scopedT("en-US");

describe("abortInterruptionMessage", () => {
  it("timeouts and a user stop keep the stopped text", () => {
    expect(
      abortInterruptionMessage(
        new StreamAbortError(AbortReason.STREAM_TIMEOUT),
        t,
      ),
    ).toBe(t("info.streamInterrupted"));
    expect(
      abortInterruptionMessage(
        new StreamAbortError(AbortReason.USER_CANCELLED),
        t,
      ),
    ).toBe(t("info.streamInterrupted"));
    expect(abortInterruptionMessage(null, t)).toBe(t("info.streamInterrupted"));
  });

  it("billing, budget and watchdog stops keep their own text", () => {
    expect(
      abortInterruptionMessage(
        new StreamAbortError(AbortReason.BILLING_FAILED),
        t,
      ),
    ).toBe(t("info.billingFailed"));
    expect(
      abortInterruptionMessage(
        new StreamAbortError(AbortReason.BUDGET_EXCEEDED),
        t,
      ),
    ).toBe(t("info.budgetExceeded"));
    expect(
      abortInterruptionMessage(
        new StreamAbortError(AbortReason.TASK_WATCHDOG),
        t,
      ),
    ).toBe(t("info.taskWatchdog"));
  });

});
