/**
 * E2E: set a new password from the emailed reset link (/user/reset-password/[token]).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { clearLoginAttempts } from "next-vibe/tooling/testing/testing-suite/login-attempts";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import type { TestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import loginEndpoints from "@/user/public/login/definition";

import { scopedTranslation } from "../i18n";
import { PasswordRepository } from "../repository";
import resetConfirmEndpoints from "./definition";

const endpoint = resetConfirmEndpoints.POST;
const NEW_PASSWORD = "E2eFreshPass456";
const { t } = scopedTranslation.scopedT(defaultLocale);

const resetPage = (token: string): string =>
  `/user/reset-password/${encodeURIComponent(token)}`;

/** Throwaway account + a live reset token for it (what the reset email links to). */
async function accountWithResetToken(
  email: string,
  cleanup: (fn: () => Promise<void>) => void,
): Promise<{ account: TestUser; token: string }> {
  const created = await createTestUser(email);
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error("test user creation failed");
  }
  const account = created.data;
  cleanup(() => deleteTestUser(account.user.id));

  const token = await PasswordRepository.createResetToken(
    email,
    defaultLocale,
    createEndpointLogger(false, defaultLocale),
    t,
  );
  expect(token.success, JSON.stringify(token)).toBe(true);
  if (!token.success) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error("reset token creation failed");
  }
  return { account, token: token.data };
}

async function canLogin(email: string, password: string): Promise<boolean> {
  const result = await sendTestRequest({
    endpoint: loginEndpoints.POST,
    data: { email, password, rememberMe: false },
    user: undefined,
    toolExecutionContext: undefined,
  });
  return result.success;
}

describe("E2E: reset password confirm", () => {
  const e2e = useE2E("user/public/reset-password/confirm");

  e2e.it("sets the new password from the emailed link and sends the user to login", async ({ open, goto, page, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("reset-confirm");
    const { token } = await accountWithResetToken(email, cleanup);
    cleanup(() => clearLoginAttempts(email));

    const form = await open(endpoint, { path: resetPage(token) });
    // The token travels in the link — no raw JWT field shown to the customer
    expect(await form.field("token").isVisible()).toBe(false);

    await form.fill({
      email,
      password: NEW_PASSWORD,
      confirmPassword: NEW_PASSWORD,
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    // ...but the request still carries it
    expect(result.requestBody).toMatchObject({ token });

    await page.waitForURL((url) => url.pathname.endsWith("/user/login"));
    expect(await canLogin(email, NEW_PASSWORD)).toBe(true);

    // The link is single-use
    await goto(resetPage(token));
    await page.getByText(t("errors.tokenInvalid")).first().waitFor();
  });

  e2e.it("refuses mismatched passwords and keeps the old one", async ({ open, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("reset-mismatch");
    const { account, token } = await accountWithResetToken(email, cleanup);
    cleanup(() => clearLoginAttempts(email));

    const form = await open(endpoint, { path: resetPage(token) });
    await form.fill({
      email,
      password: NEW_PASSWORD,
      confirmPassword: `${NEW_PASSWORD}-typo`,
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(false);
    await form.alert.waitFor({ state: "visible" });
    expect(await form.alert.textContent()).toContain(
      t("confirm.validation.passwords.mismatch"),
    );
    expect(await canLogin(email, account.password)).toBe(true);
  });

  e2e.it("refuses an email that doesn't own the link", async ({ open, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("reset-owner");
    const { token } = await accountWithResetToken(email, cleanup);

    const form = await open(endpoint, { path: resetPage(token) });
    await form.fill({
      email: uniqueEmail("reset-intruder"),
      password: NEW_PASSWORD,
      confirmPassword: NEW_PASSWORD,
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(false);
    await form.alert.waitFor({ state: "visible" });
    expect(await form.alert.textContent()).toContain(t("errors.emailMismatch"));
  });

  e2e.it("blocks a too-short password client-side", async ({ open, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("reset-short");
    const { token } = await accountWithResetToken(email, cleanup);

    const form = await open(endpoint, { path: resetPage(token) });
    await form.fill({ email, password: "short", confirmPassword: "short" });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(
      expect.arrayContaining(["password", "confirmPassword"]),
    );
  });

  e2e.it("shows a dead link as invalid with a way to request a new one", async ({ goto, page }) => {
    await goto(resetPage("not-a-real-token"));
    await page.getByText(t("errors.tokenInvalid")).first().waitFor();
    expect(
      await page.locator('a[href$="/user/reset-password"]').count(),
    ).toBeGreaterThan(0);
  });
});
