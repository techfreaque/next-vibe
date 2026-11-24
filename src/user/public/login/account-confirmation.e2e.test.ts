import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { loginAttempts, users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";

import { requestAccountChallenge } from "../verify-email/account-challenge";
import { scopedTranslation } from "../verify-email/i18n";
import verifyEmail from "../verify-email/definition";
import login from "./definition";

describe("legacy email confirmation in the browser", () => {
  const browser = useE2E("user/public/login/account-confirmation");

  browser.it(
    "dismisses the notice, then signs in with the same mailed code",
    async ({
      open,
      goto,
      page,
      context,
      cleanup,
      loginAs,
      baseUrl,
      capture,
    }) => {
      const email = `confirm-ui-${crypto.randomUUID()}@example-test.invalid`;
      const created = await createTestUser(email);
      if (!created.success) {
        return expect.fail(created.message);
      }
      const { user, password } = created.data;
      cleanup(async () => {
        await db.delete(loginAttempts).where(eq(loginAttempts.email, email));
        await deleteTestUser(user.id);
      });
      await loginAs(user);
      await db
        .update(users)
        .set({ emailVerified: false })
        .where(eq(users.id, user.id));
      // Capture the dispatch in-process. Both real browser endpoints must reuse it.
      const inbox: string[] = [];
      const sent = await requestAccountChallenge(
        { ...user, email, privateName: "Fixture" },
        "login",
        defaultLocale,
        createEndpointLogger(false, defaultLocale),
        async (_recipient, challenge) => {
          inbox.push(challenge.code);
          return { messageId: "captured@fixture.invalid", bounced: false };
        },
      );
      expect(sent.success).toBe(true);
      const { t } = scopedTranslation.scopedT(defaultLocale);
      const notice = page.getByTestId("session-email-banner").filter({ hasText: email });
      const first = await capture(verifyEmail.POST, () => goto("/user/settings"), E2E_HYDRATION_TIMEOUT_MS);
      expect(first.response.success && !first.response.data.verified).toBe(
        true,
      );
      // The fixed site header must leave the first line of the notice readable.
      await notice.getByText(t("accountChallenge.notice", { email })).click({
        trial: true, position: { x: 8, y: 4 },
      });
      await notice
        .getByRole("button", { name: t("accountChallenge.dismiss") })
        .click();
      await notice.waitFor({ state: "hidden" });
      await page.reload();
      await notice.waitFor({ state: "hidden" });
      expect(await notice.isVisible()).toBe(false);
      // Leave the authenticated page before switching to a signed-out visitor.
      await page.goto("about:blank");
      await context.clearCookies();
      await context.addCookies([
        { name: LEAD_ID_COOKIE_NAME, value: user.leadId, url: baseUrl },
      ]);
      const form = await open(login.POST, {
        path: "/user/login",
        query: { callbackUrl: `/${defaultLocale}/user/settings` },
      });
      await form.fill({ email, password });
      const step = await form.submit();
      expect(step.sent && !step.response.success).toBe(true);
      const code = page.getByTestId("login-email-otp").getByRole("textbox");
      await code.waitFor({ state: "visible" });
      const signedIn = await capture(login.POST, () => code.fill(inbox[0]!));
      expect(signedIn.response.success).toBe(true);
      await page.waitForURL((url) => url.pathname.endsWith("/user/settings"));
      const [account] = await db
        .select({ verified: users.emailVerified })
        .from(users)
        .where(eq(users.id, user.id));
      expect(account?.verified).toBe(true);
      expect(await notice.isVisible()).toBe(false);
    },
    180_000,
  );
});
