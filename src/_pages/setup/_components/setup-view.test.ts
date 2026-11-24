import { describe, expect, test } from "bun:test";

import { resolveSetupView } from "./setup-view";

const fresh = { pending: true, firstRun: true, complete: false };
const inProgress = { pending: true, firstRun: false, complete: false };
const configured = { pending: false, firstRun: false, complete: false };

describe("resolveSetupView", () => {
  test("a configured instance never shows setup", () => {
    expect(
      resolveSetupView({
        status: configured,
        isAdmin: false,
        stepCookie: null,
      }),
    ).toBeNull();
    expect(
      resolveSetupView({ status: configured, isAdmin: true, stepCookie: null }),
    ).toBeNull();
    expect(
      resolveSetupView({ status: configured, isAdmin: true, stepCookie: "ai" }),
    ).toBeNull();
    expect(
      resolveSetupView({
        status: configured,
        isAdmin: false,
        stepCookie: "done",
      }),
    ).toBeNull();
    expect(
      resolveSetupView({
        status: configured,
        isAdmin: true,
        stepCookie: "done",
      }),
    ).toBeNull();
  });

  test("the admin who just finished sees the done screen after the restart", () => {
    expect(
      resolveSetupView({
        status: { ...configured, complete: true },
        isAdmin: true,
        stepCookie: "done",
      }),
    ).toEqual({ kind: "wizard", step: "done" });
  });

  test("visitors who are not admin get the welcome screen", () => {
    expect(
      resolveSetupView({ status: fresh, isAdmin: false, stepCookie: "ai" }),
    ).toEqual({ kind: "welcome" });
    expect(
      resolveSetupView({
        status: inProgress,
        isAdmin: false,
        stepCookie: null,
      }),
    ).toEqual({ kind: "welcome" });
  });

  test("the admin resumes at the step from the cookie", () => {
    expect(
      resolveSetupView({ status: fresh, isAdmin: true, stepCookie: null }),
    ).toEqual({ kind: "wizard", step: "admin" });
    expect(
      resolveSetupView({
        status: inProgress,
        isAdmin: true,
        stepCookie: "extras",
      }),
    ).toEqual({ kind: "wizard", step: "extras" });
    expect(
      resolveSetupView({ status: inProgress, isAdmin: true, stepCookie: null }),
    ).toEqual({ kind: "wizard", step: "ai" });
    expect(
      resolveSetupView({ status: fresh, isAdmin: true, stepCookie: "bogus" }),
    ).toEqual({ kind: "wizard", step: "admin" });
    expect(
      resolveSetupView({ status: fresh, isAdmin: true, stepCookie: "done" }),
    ).toEqual({ kind: "wizard", step: "admin" });
  });
});
