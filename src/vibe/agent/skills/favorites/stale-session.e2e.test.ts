import { createE2ECreditUser } from "next-vibe/agent/ai-stream/testing/e2e-credit-user";
import { E2E_AUTH_COOKIE_NAME } from "next-vibe/tooling/testing/e2e/auth";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import type { Route } from "playwright";
import { describe, expect } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import { FAVORITES_LIST_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

describe("E2E: favorites after account deletion", () => {
  const e2e = useE2E("favorites/stale-session");

  e2e.it("reloads as a guest when the signed-in favorites request is denied", async ({
    baseUrl,
    page,
    context,
    gotoReady,
    loginAs,
    cleanup,
  }) => {
    const { user, remove } = await createE2ECreditUser("auth-403-refresh", 0);
    cleanup(remove);
    await context.addCookies([
      { name: LEAD_ID_COOKIE_NAME, value: user.leadId, url: baseUrl },
    ]);
    await loginAs(user);

    // The page has rendered the signed-in identity by the time its client
    // requests favorites. Delete the account before that request reaches auth.
    const pending = Promise.withResolvers<Route>();
    // The shell also reads private chat settings. Keep that request from
    // losing the session first so the favorites 403 drives the reload.
    await page.route(
      /\/api\/[^/]+\/vibe\/agent\/chat\/settings(?:\?|$)/,
      (route) => route.abort(),
    );
    await page.route(
      /\/api\/[^/]+\/vibe\/agent\/skills\/favorites(?:\?|$)/,
      pending.resolve,
      { times: 1 },
    );
    await gotoReady(`/tools/${FAVORITES_LIST_ALIAS}`, async () => {
      await pending.promise;
    });
    const request = await pending.promise;
    const deletion = await sendTestRequest({
      endpoint: userDeleteDefinitions.DELETE,
      urlPathParams: { id: user.id },
      user: await resolveTestAdminUser(),
      toolExecutionContext: undefined,
    });
    expect(deletion.success).toBe(true);

    const denied = page.waitForResponse(
      (response) => response.url() === request.request().url(),
    );
    const reloaded = page.waitForEvent("framenavigated", {
      predicate: (frame) => frame === page.mainFrame(),
    });
    await request.continue();
    const [response] = await Promise.all([denied, reloaded]);
    expect(response.status()).toBe(403);

    const { t } = scopedTranslation.scopedT(E2E_LOCALE);
    await page.getByText(t("get.emptyState"), { exact: true }).waitFor();
    const cookies = await context.cookies();
    expect(
      cookies.find((cookie) => cookie.name === E2E_AUTH_COOKIE_NAME),
    ).toBeUndefined();
    expect(
      cookies.find((cookie) => cookie.name === LEAD_ID_COOKIE_NAME)?.value,
    ).toBe(user.leadId);
  });
});
