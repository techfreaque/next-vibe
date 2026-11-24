/**
 * First-run setup state, shared by the env definition (identity/env.ts), the
 * /setup page and the redirects that send a fresh instance there.
 * Client-safe (no env imports).
 *
 * A fresh instance is "first run" while the admin password is still a shipped
 * default. Saving the admin login on /setup writes VIBE_SETUP_STATE=in-progress
 * so the rest of the setup stays reachable after the password changed; the
 * last step writes "complete". Instances that never ran /setup (prod) have
 * no line, which counts as complete too.
 */

import {
  DEFAULT_ADMIN_EMAIL,
  isDefaultAdminPassword,
} from "./default-admin-password";

export const SETUP_STATE = {
  IN_PROGRESS: "in-progress",
  COMPLETE: "complete",
} as const;

export type SetupStateValue = (typeof SETUP_STATE)[keyof typeof SETUP_STATE];

interface SetupConfig {
  VIBE_ADMIN_USER_EMAIL: string;
  VIBE_ADMIN_USER_PASSWORD: string;
  VIBE_SETUP_STATE?: string;
}

export function getSetupPhase(
  config: SetupConfig,
): "first-run" | "in-progress" | "complete" | "configured" {
  if (config.VIBE_SETUP_STATE === SETUP_STATE.COMPLETE) {
    return "complete";
  }
  if (config.VIBE_SETUP_STATE === SETUP_STATE.IN_PROGRESS) {
    return "in-progress";
  }
  return config.VIBE_SETUP_STATE === undefined &&
    config.VIBE_ADMIN_USER_EMAIL === DEFAULT_ADMIN_EMAIL &&
    isDefaultAdminPassword(config.VIBE_ADMIN_USER_PASSWORD)
    ? "first-run"
    : "configured";
}

export function canUseSetupBootstrap(
  config: SetupConfig,
  email: string,
  password: string,
): boolean {
  return (
    email === DEFAULT_ADMIN_EMAIL &&
    password === config.VIBE_ADMIN_USER_PASSWORD &&
    getSetupPhase(config) === "first-run"
  );
}

/**
 * Browser cookie with the step the setup page should open on. Every saved
 * step rewrites .env, the dev server restarts and the page reloads; the
 * loader reads this cookie so the reload lands on the right step.
 */
export const SETUP_STEP_COOKIE = "vibe-setup-step" as const;

/** Setup steps in order. "welcome" is shown only to a visitor who is not signed in as admin yet. */
export const SETUP_STEPS = ["admin", "ai", "extras", "done"] as const;
export type SetupStep = (typeof SETUP_STEPS)[number];

export function parseSetupStep(value: string | null | undefined): SetupStep {
  const match = SETUP_STEPS.find((step) => step === value);
  return match ?? "admin";
}

export const SETUP_PATH_SEGMENT = "setup" as const;
