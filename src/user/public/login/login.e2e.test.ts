/**
 * E2E: login page — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { identityEnv } from "next-vibe/identity/env";
import { E2E_AUTH_COOKIE_NAME } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { clearLoginAttempts } from "next-vibe/tooling/testing/testing-suite/login-attempts";

import loginEndpoints from "./definition";

const endpoint = loginEndpoints.POST;
const LOGIN_PAGE = "/user/login";

describe("E2E: login page", () => {
  const e2e = useE2E("user/public/login");

  e2e.it("logs in with valid credentials, sets the session cookie and leaves the page", async ({ open, page, context }) => {
    const form = await open(endpoint, { path: LOGIN_PAGE });
    await form.fill({
      email: identityEnv.VIBE_ADMIN_USER_EMAIL,
      password: identityEnv.VIBE_ADMIN_USER_PASSWORD,
      rememberMe: true,
    });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);

    await page.waitForURL((url) => !url.pathname.endsWith(LOGIN_PAGE));
    const cookies = await context.cookies();
    expect(cookies.some((c) => c.name === E2E_AUTH_COOKIE_NAME && c.value.length > 20)).toBe(true);
  });

  e2e.it("rejects a wrong password with a visible alert and stays on the page", async ({ open, page, cleanup }) => {
    // Failed logins feed the lockout ledger (email + IP) — leave it clean
    cleanup(() => clearLoginAttempts(identityEnv.VIBE_ADMIN_USER_EMAIL));
    const form = await open(endpoint, { path: LOGIN_PAGE });

    await form.fill({
      email: identityEnv.VIBE_ADMIN_USER_EMAIL,
      password: "definitely-wrong-password-xyz",
    });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(false);

    await form.alert.waitFor({ state: "visible" });
    expect((await form.alert.textContent())?.trim().length).toBeGreaterThan(0);
    expect(new URL(page.url()).pathname.endsWith(LOGIN_PAGE)).toBe(true);
  });

  e2e.it("blocks a malformed email client-side without sending a request", async ({ open }) => {
    const form = await open(endpoint, { path: LOGIN_PAGE });
    await form.fill({ email: "not-an-email", password: "SomePassword123" });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    // type="email" — the browser's own bubble stops it before the form schema runs
    expect(result.blockedBy).toBe("native");
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });

  e2e.it("blocks an empty submit and flags every required field", async ({ open }) => {
    const form = await open(endpoint, { path: LOGIN_PAGE });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(
      expect.arrayContaining(["email", "password"]),
    );
  });
});
