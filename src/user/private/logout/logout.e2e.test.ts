/**
 * E2E: the account round trip a new customer makes on day one -
 * sign up -> log out from the account menu -> log back in.
 * Logout must kill the server session (not just the cookie), and a wrong
 * password on the fresh account must show the real "wrong credentials" copy.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { sessions } from "next-vibe/identity/session/db";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_AUTH_COOKIE_NAME } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { clearLoginAttempts } from "next-vibe/tooling/testing/testing-suite/login-attempts";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import type { BrowserContext } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation as navScopedTranslation } from "@/_pages/story/_components/i18n";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import loginEndpoints from "../../public/login/definition";
import { scopedTranslation as loginScopedTranslation } from "../../public/login/i18n";
import signupEndpoints from "../../public/signup/definition";
import logoutEndpoints from "./definition";

const SIGNUP_PAGE = "/user/signup";
const LOGIN_PAGE = "/user/login";
/** Any story page: it carries the navbar with the account menu. */
const NAV_PAGE = "/story/framework";
const PASSWORD = "E2eRoundTrip123";

const logger = createEndpointLogger(false, defaultLocale);
const { t: tNav } = navScopedTranslation.scopedT(defaultLocale);
const { t: tLogin } = loginScopedTranslation.scopedT(defaultLocale);

async function findUserId(email: string): Promise<string | undefined> {
  const found = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  return found.success && found.data ? found.data.id : undefined;
}

async function deleteUserByEmail(email: string): Promise<void> {
  const id = await findUserId(email);
  if (!id) {
    return;
  }
  await sendTestRequest({
    endpoint: userDeleteDefinitions.DELETE,
    urlPathParams: { id },
    user: await resolveTestAdminUser(),
    toolExecutionContext: undefined,
  });
}

async function sessionCount(userId: string): Promise<number> {
  const rows = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.userId, userId));
  return rows.length;
}

async function authCookie(context: BrowserContext): Promise<string | undefined> {
  const cookies = await context.cookies();
  const cookie = cookies.find((c) => c.name === E2E_AUTH_COOKIE_NAME);
  return cookie && cookie.value.length > 20 ? cookie.value : undefined;
}

describe("E2E: account round trip", () => {
  const e2e = useE2E("user/private/logout");

  e2e.it("signs up, logs out from the account menu (session revoked), logs back in", async ({ open, page, context, gotoReady, capture, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("roundtrip");
    cleanup(() => deleteUserByEmail(email));

    // 1. Sign up -> signed in
    const signup = await open(signupEndpoints.POST, { path: SIGNUP_PAGE });
    await signup.fill({
      privateName: "E2E Roundtrip",
      publicName: "E2ERoundtrip",
      email,
      password: PASSWORD,
      confirmPassword: PASSWORD,
      subscribeToNewsletter: false,
      acceptTerms: true,
    });
    const signedUp = await signup.submit();
    expect(signedUp.sent).toBe(true);
    if (!signedUp.sent) return;
    expect(signedUp.response.success, JSON.stringify(signedUp.response)).toBe(true);
    await page.waitForURL((url) => !url.pathname.endsWith(SIGNUP_PAGE), {
      waitUntil: "commit",
    });
    expect(await authCookie(context)).toBeDefined();
    const userId = await findUserId(email);
    expect(userId).toBeDefined();
    if (!userId) return;
    expect(await sessionCount(userId)).toBeGreaterThan(0);

    // 2. Log out the way a customer does: account menu in the navbar
    const accountMenu = page
      .locator('button[aria-haspopup="menu"]')
      .filter({ has: page.locator("span.bg-primary") });
    await gotoReady(NAV_PAGE, () => accountMenu.first().waitFor());
    const logoutItem = page.getByRole("menuitem", { name: tNav("nav.logout") });
    const loggedOut = await capture(logoutEndpoints.POST, async () => {
      // The navbar is SSR'd: a click before hydration opens nothing, so
      // re-click until the menu actually opens.
      for (let attempt = 0; ; attempt++) {
        await accountMenu.first().click();
        const opened = await logoutItem
          .waitFor({ state: "visible", timeout: 5_000 })
          .then(() => true)
          .catch(() => false);
        if (opened) {
          break;
        }
        expect(attempt, "[e2e] account menu never opened").toBeLessThan(5);
      }
      await logoutItem.click();
    });
    expect(loggedOut.response.success, JSON.stringify(loggedOut.response)).toBe(true);
    await page.waitForURL((url) => url.pathname.endsWith(LOGIN_PAGE), {
      waitUntil: "commit",
    });

    // Cookie gone AND the server session deleted: a stolen copy of the old
    // token is dead, not just forgotten by this browser.
    expect(await authCookie(context)).toBeUndefined();
    expect(await sessionCount(userId)).toBe(0);

    // The navbar is back to the guest view
    await gotoReady(NAV_PAGE, () =>
      page.getByRole("link", { name: tNav("nav.user.login") }).first().waitFor(),
    );
    expect(await accountMenu.count()).toBe(0);

    // 3. Log back in with the new account
    const login = await open(loginEndpoints.POST, { path: LOGIN_PAGE });
    await login.fill({ email, password: PASSWORD });
    const loggedIn = await login.submit();
    expect(loggedIn.sent).toBe(true);
    if (!loggedIn.sent) return;
    expect(loggedIn.response.success, JSON.stringify(loggedIn.response)).toBe(true);
    // "commit": leaving the login page is the signal, not the next page's
    // full load (the landing page is heavy on a busy dev server)
    await page.waitForURL((url) => !url.pathname.endsWith(LOGIN_PAGE), {
      waitUntil: "commit",
    });
    expect(await authCookie(context)).toBeDefined();
    expect(await sessionCount(userId)).toBe(1);
  });

  e2e.it("a wrong password on a fresh account says exactly why and signs nobody in", async ({ open, page, context, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("wrongpass");
    cleanup(() => deleteUserByEmail(email));
    // Failed logins feed the lockout ledger (email + IP) - leave it clean
    cleanup(() => clearLoginAttempts(email));

    // Real signup through the page (the in-process path blocks on SMTP),
    // then drop the browser session so the visitor is a guest again.
    const signup = await open(signupEndpoints.POST, { path: SIGNUP_PAGE });
    await signup.fill({
      privateName: "E2E Wrongpass",
      publicName: "E2EWrongpass",
      email,
      password: PASSWORD,
      confirmPassword: PASSWORD,
      subscribeToNewsletter: false,
      acceptTerms: true,
    });
    const signedUp = await signup.submit();
    expect(signedUp.sent).toBe(true);
    if (!signedUp.sent) return;
    expect(signedUp.response.success, JSON.stringify(signedUp.response)).toBe(true);
    await context.clearCookies();
    const userId = await findUserId(email);
    expect(userId).toBeDefined();
    if (!userId) return;
    const sessionsBefore = await sessionCount(userId);

    const form = await open(loginEndpoints.POST, { path: LOGIN_PAGE });
    await form.fill({ email, password: `${PASSWORD}-wrong` });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(false);
    if (result.response.success) return;

    await form.alert.waitFor({ state: "visible" });
    expect(await form.alert.textContent()).toContain(
      tLogin("errors.invalid_credentials"),
    );
    expect(new URL(page.url()).pathname.endsWith(LOGIN_PAGE)).toBe(true);
    expect(await authCookie(context)).toBeUndefined();
    expect(await sessionCount(userId)).toBe(sessionsBefore);
  });
});
