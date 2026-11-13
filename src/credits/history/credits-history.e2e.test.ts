/**
 * E2E: credit history tab (/subscription/history) for a signed-in customer.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  E2E_HYDRATION_TIMEOUT_MS,
  E2E_LOCALE,
} from "next-vibe/tooling/testing/e2e/config";
import { recordPage } from "next-vibe/tooling/testing/e2e/coverage";
import type { E2ESubmitSent } from "next-vibe/tooling/testing/e2e/endpoint-form";
import {
  e2eEndpointId,
  EndpointForm,
} from "next-vibe/tooling/testing/e2e/endpoint-form";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation } from "../i18n";
import { CreditRepository } from "../repository";
import creditsHistoryEndpoints from "./definition";

const endpoint = creditsHistoryEndpoints.GET;
const HISTORY_PAGE = "/subscription/history";
const GRANT = 37;
const { t } = scopedTranslation.scopedT(defaultLocale);

/**
 * Every request field is hidden (admin overrides), so the harness has no
 * visible field to anchor `open()` on. Record the endpoint, load the page, wait
 * for React to own it, then take the call it fires on mount.
 */
async function loadCall(
  page: Page,
  goto: (path: string) => Promise<void>,
  path: string,
): Promise<E2ESubmitSent<typeof endpoint>> {
  const form = new EndpointForm(page, endpoint);
  await form.attach();
  // Retried: a dev-server reload mid-navigation leaves the page unhydrated
  // (the harness only retries this inside open()).
  for (let attempt = 1; ; attempt++) {
    await goto(path);
    const hydrated = await page
      .locator("[data-hydrated]")
      .first()
      .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 })
      .then(() => true)
      .catch(() => false);
    if (hydrated) {
      break;
    }
    expect(attempt, `${path} never hydrated`).toBeLessThan(3);
  }
  recordPage(e2eEndpointId(endpoint), path.split("?")[0] ?? path);
  return await form.firstCall();
}

describe("E2E: credit history", () => {
  const e2e = useE2E("credits/history");

  e2e.it(
    "lists the customer's own transactions",
    async ({ goto, page, loginAs, uniqueEmail, cleanup }) => {
      const created = await createTestUser(uniqueEmail("credits-history"));
      expect(created.success, JSON.stringify(created)).toBe(true);
      if (!created.success) {return;}
      const { user } = created.data;
      cleanup(() => deleteTestUser(user.id));
      const granted = await CreditRepository.addUserCredits(
        user.id,
        GRANT,
        "permanent",
        createEndpointLogger(false, defaultLocale),
        t,
      );
      expect(granted.success, JSON.stringify(granted)).toBe(true);
      await loginAs(user);

      const call = await loadCall(page, goto, HISTORY_PAGE);
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) {return;}
      const { transactions } = call.response.data;
      expect(transactions.some((tx) => tx.amount === GRANT)).toBe(true);
      // Never someone else's history: no admin override travels from this page
      expect(call.requestBody).not.toHaveProperty("targetUserId");

      await page
        .getByText(`+${String(GRANT)}`)
        .first()
        .waitFor();
    },
  );

  e2e.it(
    "ignores a forged admin override from a customer",
    async ({ page, goto, loginAs, uniqueEmail, cleanup }) => {
      const created = await createTestUser(uniqueEmail("credits-snoop"));
      expect(created.success, JSON.stringify(created)).toBe(true);
      if (!created.success) {return;}
      const { user } = created.data;
      cleanup(() => deleteTestUser(user.id));
      await loginAs(user);

      const victim = await createTestUser(uniqueEmail("credits-victim"));
      expect(victim.success).toBe(true);
      if (!victim.success) {return;}
      cleanup(() => deleteTestUser(victim.data.user.id));
      await CreditRepository.addUserCredits(
        victim.data.user.id,
        GRANT,
        "permanent",
        createEndpointLogger(false, defaultLocale),
        t,
      );

      // No UI sends the admin override — forge it with the customer's own
      // browser session, straight at the API.
      await goto(HISTORY_PAGE); // a real visit: session + lead cookies in place
      const query = new URLSearchParams({
        targetUserId: victim.data.user.id,
        "paginationInfo.page": "1",
        "paginationInfo.limit": "20",
      });
      // Through the browser itself: Playwright's Node request client crashes
      // under Bun on any Set-Cookie response (relative IncomingMessage.url).
      const res = await page.goto(
        `/api/${E2E_LOCALE}/${endpoint.path.join("/")}?${query.toString()}`,
      );
      expect(res, "API call produced no response").not.toBeNull();
      if (!res) {return;}
      const body = (await res.json()) as ResponseType<
        typeof endpoint.types.ResponseOutput
      >;
      expect(body.success, JSON.stringify(body)).toBe(true);
      if (!body.success) {return;}
      expect(body.data.transactions.some((tx) => tx.amount === GRANT)).toBe(
        false,
      );
    },
  );
});
