/**
 * Which part of /setup a request sees. Pure, so the redirect rules are testable.
 */

import { parseSetupStep, type SetupStep } from "next-vibe/identity/setup-state";

export type SetupView =
  | { kind: "welcome" }
  | { kind: "wizard"; step: SetupStep };

export function resolveSetupView({
  status,
  isAdmin,
  stepCookie,
}: {
  status: { pending: boolean; firstRun: boolean; complete: boolean };
  isAdmin: boolean;
  stepCookie: string | null;
}): SetupView | null {
  if (!status.pending) {
    // Setup just finished in this browser: the restart reloaded the page,
    // show the done screen once more. Everyone else goes home.
    return status.complete && isAdmin && stepCookie === "done"
      ? { kind: "wizard", step: "done" }
      : null;
  }
  if (!isAdmin) {
    return { kind: "welcome" };
  }
  if (status.firstRun) {
    return { kind: "wizard", step: "admin" };
  }
  const step = parseSetupStep(stepCookie);
  return {
    kind: "wizard",
    step: step === "admin" || step === "done" ? "ai" : step,
  };
}
