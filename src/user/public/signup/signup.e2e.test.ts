/**
 * E2E: signup page — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { identityEnv } from "next-vibe/identity/env";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { describe, expect } from "vitest";

import userDeleteDefinitions from "@/users/user/[id]/definition";

import signupEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = signupEndpoints.POST;
const SIGNUP_PAGE = "/user/signup";
const PASSWORD = "E2eSecurePass123";

/** Delete the account a test created, if it exists. */
async function deleteUserByEmail(email: string): Promise<void> {
  const logger = createEndpointLogger(false, defaultLocale);
  const found = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!found.success || !found.data) {
    return;
  }
  await sendTestRequest({
    endpoint: userDeleteDefinitions.DELETE,
    urlPathParams: { id: found.data.id },
    user: await resolveTestAdminUser(),
    toolExecutionContext: undefined,
  });
}

describe("E2E: signup page", () => {
  const e2e = useE2E("user/public/signup");
  const { t } = scopedTranslation.scopedT(defaultLocale);

  e2e.it("creates an account and signs the user in", async ({ open, page, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("signup");
    cleanup(() => deleteUserByEmail(email));

    const form = await open(endpoint, { path: SIGNUP_PAGE });
    await form.fill({
      privateName: "E2E Signup",
      publicName: "E2ESignup",
      email,
      password: PASSWORD,
      confirmPassword: PASSWORD,
      subscribeToNewsletter: false,
      acceptTerms: true,
    });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);

    await page.waitForURL((url) => !url.pathname.endsWith(SIGNUP_PAGE));
    const logger = createEndpointLogger(false, defaultLocale);
    const created = await UserRepository.getUserByEmail(
      email,
      UserDetailLevel.STANDARD,
      defaultLocale,
      logger,
    );
    expect(created.success && created.data?.privateName).toBe("E2E Signup");
    // Browser signup must leave the email UNVERIFIED — a verification mail is
    // sent (wired in signup/route.ts) and the account stays unconfirmed until
    // the mailed link is opened. This is what keeps unverified addresses out of
    // marketing sends (lifecycle + consented blast gate on emailVerified).
    expect(created.success && created.data?.emailVerified).toBe(false);
  });

  e2e.it("refuses to continue until the terms are accepted", async ({ open, uniqueEmail }) => {
    const form = await open(endpoint, { path: SIGNUP_PAGE });
    await form.fill({
      privateName: "E2E Terms",
      publicName: "E2ETerms",
      email: uniqueEmail("terms"),
      password: PASSWORD,
      confirmPassword: PASSWORD,
      acceptTerms: false,
    });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["acceptTerms"]);
  });

  e2e.it("tells the user when the passwords don't match", async ({ open, uniqueEmail }) => {
    const form = await open(endpoint, { path: SIGNUP_PAGE });
    await form.fill({
      privateName: "E2E Mismatch",
      publicName: "E2EMismatch",
      email: uniqueEmail("mismatch"),
      password: PASSWORD,
      confirmPassword: `${PASSWORD}-different`,
      acceptTerms: true,
    });

    // Mismatch is checked server-side only (signup/repository.ts)
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(false);
    await form.alert.waitFor({ state: "visible" });
    expect(await form.alert.textContent()).toContain(
      t("fields.confirmPassword.validation.mismatch"),
    );
  });

  e2e.it("rejects an email that already has an account", async ({ open }) => {
    const form = await open(endpoint, { path: SIGNUP_PAGE });
    await form.fill({
      privateName: "E2E Duplicate",
      publicName: "E2EDuplicate",
      email: identityEnv.VIBE_ADMIN_USER_EMAIL,
      password: PASSWORD,
      confirmPassword: PASSWORD,
      acceptTerms: true,
    });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(false);
    await form.alert.waitFor({ state: "visible" });
  });
});
