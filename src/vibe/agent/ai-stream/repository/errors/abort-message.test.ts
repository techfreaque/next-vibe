/**
 * Prod 2026-11-20: a GLM 5.3 Uncensored answer (51k tokens) hit the 900 s turn
 * limit and the thread said "Generation was stopped", as if the user had
 * pressed stop. The time limit now names itself and points to Continue; the
 * other STREAM_TIMEOUT sources and user stops keep their text.
 */

import { describe, expect, it } from "vitest";

import { scopedTranslation } from "../../stream/i18n";
import { AbortReason, StreamAbortError } from "../core/constants";
import { abortInterruptionMessage } from "./abort-message";

const { t } = scopedTranslation.scopedT("en-US");

describe("abortInterruptionMessage", () => {
  it("the overall turn time limit says so and offers Continue", () => {
    const text = abortInterruptionMessage(
      new StreamAbortError(AbortReason.STREAM_TIMEOUT, {
        maxDurationSeconds: 900,
      }),
      t,
    );
    expect(text).toContain("15 minute limit");
    expect(text).toContain("Continue");
    expect(text).not.toBe(t("info.streamInterrupted"));
  });

  it("other timeouts and a user stop keep the stopped text", () => {
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

  it("every locale has the time-limit text with the minutes filled in", () => {
    for (const locale of [
      "de-DE",
      "pl-PL",
      "es-ES",
      "fr-FR",
      "it-IT",
    ] as const) {
      const { t: lt } = scopedTranslation.scopedT(locale);
      const text = abortInterruptionMessage(
        new StreamAbortError(AbortReason.STREAM_TIMEOUT, {
          maxDurationSeconds: 900,
        }),
        lt,
      );
      expect(text).toContain("15");
      expect(text).not.toContain("{{");
      expect(text).not.toBe(t("info.streamTimeLimit", { minutes: "15" }));
    }
  });
});
