/** Restrict the setup marker to valid transitions of a first-run wizard. */
import { z } from "zod";

import { isDefaultAdminPassword } from "../../identity/default-admin-password";
import { type getSetupPhase, SETUP_STATE } from "../../identity/setup-state";

type SetupSave =
  | { kind: "settings" | "continue" | "invalid" }
  | { kind: "credentials"; email: string; password: string };

const adminEmailSchema = z.email();

export function resolveSetupSave(
  phase: ReturnType<typeof getSetupPhase>,
  settings: Record<string, string>,
): SetupSave {
  const requested = settings["VIBE_SETUP_STATE"];
  if (requested === undefined) {
    return { kind: "settings" };
  }

  const email = settings["VIBE_ADMIN_USER_EMAIL"];
  const password = settings["VIBE_ADMIN_USER_PASSWORD"];
  if (phase === "first-run" && requested === SETUP_STATE.IN_PROGRESS) {
    if (
      !email ||
      !adminEmailSchema.safeParse(email).success ||
      !password ||
      password.length < 8 ||
      isDefaultAdminPassword(password)
    ) {
      return { kind: "invalid" };
    }
    return { kind: "credentials", email, password };
  }
  if (
    phase === "in-progress" &&
    (requested === SETUP_STATE.IN_PROGRESS ||
      requested === SETUP_STATE.COMPLETE) &&
    email === undefined &&
    password === undefined
  ) {
    return { kind: "continue" };
  }
  return { kind: "invalid" };
}
