import { describe, expect, it } from "bun:test";

import { authPageHref, safeCallbackPath } from "./callback-url";

describe("safeCallbackPath", () => {
  it("keeps same-site absolute paths", () => {
    expect(safeCallbackPath("/en-US/user/referral")).toBe(
      "/en-US/user/referral",
    );
    expect(safeCallbackPath("/en-US/threads?x=1")).toBe("/en-US/threads?x=1");
  });

  it("rejects anything that could leave the site", () => {
    expect(safeCallbackPath(undefined)).toBeNull();
    expect(safeCallbackPath(null)).toBeNull();
    expect(safeCallbackPath("")).toBeNull();
    expect(safeCallbackPath("https://evil.example")).toBeNull();
    expect(safeCallbackPath("//evil.example/x")).toBeNull();
    expect(safeCallbackPath("/\\evil.example")).toBeNull();
    expect(safeCallbackPath("javascript:alert(1)")).toBeNull();
    expect(safeCallbackPath("/redirect?to=https://evil.example")).toBeNull();
  });
});

describe("authPageHref", () => {
  it("prefixes the locale and keeps a safe return path", () => {
    expect(authPageHref("en-US", "login", "/en-US/user/referral")).toBe(
      "/en-US/user/login?callbackUrl=%2Fen-US%2Fuser%2Freferral",
    );
    expect(authPageHref("de-DE", "signup", "/de-DE/user/referral")).toBe(
      "/de-DE/user/signup?callbackUrl=%2Fde-DE%2Fuser%2Freferral",
    );
  });

  it("drops a missing or unsafe return path", () => {
    expect(authPageHref("en-US", "login", null)).toBe("/en-US/user/login");
    expect(authPageHref("pl-PL", "signup", "https://evil.example")).toBe(
      "/pl-PL/user/signup",
    );
    expect(authPageHref("en-US", "reset-password", null)).toBe(
      "/en-US/user/reset-password",
    );
  });
});
