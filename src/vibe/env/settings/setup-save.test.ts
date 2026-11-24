import { describe, expect, test } from "bun:test";

import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from "../../identity/default-admin-password";
import {
  canUseSetupBootstrap,
  getSetupPhase,
  SETUP_STATE,
} from "../../identity/setup-state";
import { resolveSetupSave } from "./setup-save";

const fresh = {
  VIBE_ADMIN_USER_EMAIL: DEFAULT_ADMIN_EMAIL,
  VIBE_ADMIN_USER_PASSWORD: DEFAULT_ADMIN_PASSWORD,
};
const configured = {
  VIBE_ADMIN_USER_EMAIL: "admin@example.com",
  VIBE_ADMIN_USER_PASSWORD: "a-different-test-password",
};
const initialSave = {
  ...configured,
  VIBE_SETUP_STATE: SETUP_STATE.IN_PROGRESS,
};

describe("first-run setup access", () => {
  test("only the unconfigured placeholder can sign in with the shipped password", () => {
    expect(
      canUseSetupBootstrap(fresh, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD),
    ).toBe(true);
    expect(
      canUseSetupBootstrap(
        configured,
        DEFAULT_ADMIN_EMAIL,
        DEFAULT_ADMIN_PASSWORD,
      ),
    ).toBe(false);
    expect(
      canUseSetupBootstrap(
        {
          ...fresh,
          VIBE_SETUP_STATE: SETUP_STATE.IN_PROGRESS,
        },
        DEFAULT_ADMIN_EMAIL,
        DEFAULT_ADMIN_PASSWORD,
      ),
    ).toBe(false);
    expect(
      canUseSetupBootstrap(
        {
          ...fresh,
          VIBE_ADMIN_USER_EMAIL: configured.VIBE_ADMIN_USER_EMAIL,
        },
        configured.VIBE_ADMIN_USER_EMAIL,
        DEFAULT_ADMIN_PASSWORD,
      ),
    ).toBe(false);
  });

  test("setup cannot change or reopen a configured instance", () => {
    expect(getSetupPhase(configured)).toBe("configured");
    expect(resolveSetupSave(getSetupPhase(configured), initialSave)).toEqual({
      kind: "invalid",
    });
    expect(resolveSetupSave("complete", initialSave)).toEqual({
      kind: "invalid",
    });
    expect(resolveSetupSave("configured", configured)).toEqual({
      kind: "settings",
    });
  });

  test("only the first step can save new login credentials", () => {
    expect(resolveSetupSave("first-run", initialSave)).toEqual({
      kind: "credentials",
      email: configured.VIBE_ADMIN_USER_EMAIL,
      password: configured.VIBE_ADMIN_USER_PASSWORD,
    });
    expect(
      resolveSetupSave("first-run", {
        ...initialSave,
        VIBE_ADMIN_USER_PASSWORD: DEFAULT_ADMIN_PASSWORD,
      }),
    ).toEqual({ kind: "invalid" });
    expect(resolveSetupSave("in-progress", initialSave)).toEqual({
      kind: "invalid",
    });
    expect(
      resolveSetupSave("in-progress", {
        VIBE_SETUP_STATE: SETUP_STATE.COMPLETE,
      }),
    ).toEqual({ kind: "continue" });
    expect(
      resolveSetupSave("first-run", {
        VIBE_SETUP_STATE: SETUP_STATE.COMPLETE,
      }),
    ).toEqual({ kind: "invalid" });
  });
});
