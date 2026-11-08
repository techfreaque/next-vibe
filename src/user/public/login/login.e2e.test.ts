/**
 * E2E: login page — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { identityEnv } from "next-vibe/identity/env";
import { E2E_AUTH_COOKIE_NAME } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { clearLoginAttempts } from "next-vibe/tooling/testing/testing-suite/login-attempts";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import twoFactorEndpoints from "../../private/me/two-factor/definition";
import { TwoFactorAction } from "../../private/me/two-factor/enum";
import { TwoFactorRepository } from "../../private/me/two-factor/repository";
import { totpAt } from "../../private/me/two-factor/totp";
import signupEndpoints from "../signup/definition";
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

  e2e.it("never shows the code step to a user without 2FA (one step)", async ({ open, page, cleanup }) => {
    const u = await makeUser("plain");
    cleanup(() => u.remove());
    const form = await open(endpoint, { path: LOGIN_PAGE });
    expect(await page.locator('[data-testid="login-2fa-code"]').count()).toBe(0);
    await form.fill({ email: u.email, password: PASSWORD, rememberMe: true });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    expect(await page.locator('[data-testid="login-2fa-code"]').count()).toBe(0);
  });

  e2e.it("2FA user: code step appears after credentials; wrong code stays; valid TOTP logs in", async ({ open, page, cleanup }) => {
    const u = await makeUser("totp");
    cleanup(() => u.remove());
    TwoFactorRepository.resetThrottleForTests();
    const setup = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: twoFactorEndpoints.POST,
      data: { action: TwoFactorAction.SETUP },
      user: u.asUser,
    });
    expect(setup.success, JSON.stringify(setup)).toBe(true);
    if (!setup.success) return;
    const secret = setup.data.secret;
    const enabled = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: twoFactorEndpoints.POST,
      data: { action: TwoFactorAction.ENABLE, code: totpAt(secret, Date.now()) },
      user: u.asUser,
    });
    expect(enabled.success, JSON.stringify(enabled)).toBe(true);

    const form = await open(endpoint, { path: LOGIN_PAGE });
    // Step 1 never renders the code field
    expect(await page.locator('[data-testid="login-2fa-code"]').count()).toBe(0);
    await form.fill({ email: u.email, password: PASSWORD, rememberMe: true });
    const first = await form.submit();
    expect(first.sent).toBe(true);
    if (!first.sent) return;
    expect(first.response.success).toBe(false);

    // Segmented OTP: six boxes over one real input
    const code = page.locator('[data-testid="login-2fa-otp"] input');
    await code.waitFor({ state: "visible" });
    // Typing starts immediately: focus lands in the OTP input on entry
    await page.waitForFunction(() => document.activeElement?.tagName === "INPUT" && document.activeElement.closest('[data-testid="login-2fa-otp"]') !== null);
    await page.screenshot({ path: ".tmp/login-2fa-step2.png" });
    expect(await page.locator('[data-testid="login-2fa-email"]').textContent()).toBe(u.email);

    // Wrong code: inline error, still on step 2
    // 6 digits AUTO-submit (no Verify click); a wrong code must not loop-submit
    let loginPosts = 0;
    page.on("request", (r) => {
      if (r.method() === "POST" && r.url().includes("/user/public/login")) loginPosts++;
    });
    await page.keyboard.type("000000");
    await page.locator('[data-testid="login-2fa-error"]').waitFor({ state: "visible" });
    await page.waitForTimeout(1500);
    expect(loginPosts).toBe(1);
    expect(await code.isVisible()).toBe(true);
    await page.screenshot({ path: ".tmp/login-2fa-wrong.png" });

    // Back returns to credentials, then forward again keeps the typed values
    await page.locator('[data-testid="login-2fa-back"]').click();
    await page.locator('input[type="email"]').waitFor({ state: "visible" });
    expect(await page.locator('[data-testid="login-2fa-code"]').count()).toBe(0);
    await page.locator('[data-testid="endpoint-submit"]').click();
    await code.waitFor({ state: "visible" });
    expect(await page.locator('[data-testid="login-2fa-error"]').count()).toBe(0);

    // Valid TOTP logs in
    TwoFactorRepository.resetThrottleForTests();
    await code.focus();
    await page.keyboard.type(totpAt(secret, Date.now()));
    await page.waitForURL((url) => !url.pathname.endsWith(LOGIN_PAGE));
  });
});

const PASSWORD = "SecurePass123";
const logger = createEndpointLogger(false, defaultLocale);

async function makeUser(tag: string): Promise<{
  email: string;
  asUser: {
    id: string;
    leadId: string;
    isPublic: false;
    roles: [typeof UserPermissionRole.CUSTOMER];
  };
  remove: () => Promise<void>;
}> {
  const admin = await resolveTestAdminUser();
  const email = `e2e-login-${tag}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example-test.invalid`;
  const res = await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint: signupEndpoints.POST,
    data: {
      privateName: "Login E2E",
      publicName: "LoginE2E",
      email,
      password: PASSWORD,
      confirmPassword: PASSWORD,
      acceptTerms: true,
      subscribeToNewsletter: false,
    },
    user: { isPublic: true as const, leadId: admin.leadId, roles: [UserPermissionRole.PUBLIC] },
  });
  expect(res.success, JSON.stringify(res)).toBe(true);
  const found = await UserRepository.getUserByEmail(email, UserDetailLevel.STANDARD, defaultLocale, logger);
  if (!found.success) {
    throw new Error("user not created");
  }
  const id = found.data.id;
  return {
    email,
    asUser: { id, leadId: admin.leadId, isPublic: false, roles: [UserPermissionRole.CUSTOMER] },
    remove: async () => {
      await clearLoginAttempts(email);
      await sendTestRequest({
        endpoint: userDeleteDefinitions.DELETE,
        urlPathParams: { id },
        user: admin,
        toolExecutionContext: undefined,
      });
    },
  };
}
