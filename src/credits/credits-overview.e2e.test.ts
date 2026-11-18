/**
 * E2E: /subscription/overview tells one story — balance, the plan you're on,
 * the one step up — and fits a phone. Requires a server: `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { FREE_CREDIT_SIGNED_IN_TOTAL } from "@/products/constants";

import { scopedTranslation } from "./i18n";
import { CreditRepository } from "./repository";

const OVERVIEW_PAGE = "/subscription/overview";
/** Pixels the page sticks out sideways (evaluated in the browser). */
const OVERFLOW_PROBE =
  "document.documentElement.scrollWidth - window.innerWidth";
const PHONE = { width: 390, height: 844 };
const { t } = scopedTranslation.scopedT(defaultLocale);

describe("E2E: credits overview", () => {
  const e2e = useE2E("credits/overview");

  e2e.it("shows the free plan and leads to the plans", async (fixtures) => {
    const { page } = fixtures;
    const created = await createTestUser(fixtures.uniqueEmail("overview"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const account = created.data;
    fixtures.cleanup(() => deleteTestUser(account.user.id));
    // Exercise the funded free-plan view. A fresh unverified account can have zero credits.
    const grant = await CreditRepository.addUserCredits(
      account.user.id,
      FREE_CREDIT_SIGNED_IN_TOTAL,
      "permanent",
      createEndpointLogger(false, defaultLocale),
      t,
    );
    expect(grant.success).toBe(true);
    await fixtures.loginAs(account.user);
    await page.setViewportSize(PHONE);

    await fixtures.gotoReady(OVERVIEW_PAGE, async () => {
      await page
        .getByText(t("get.balance.freePlan"))
        .first()
        .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 });
    });
    expect(await page.evaluate<number>(OVERFLOW_PROBE)).toBeLessThanOrEqual(0);

    await page
      .getByRole("button", { name: t("get.balance.subscribe"), exact: true })
      .click();
    await page.waitForURL((url) => url.pathname.endsWith("/subscription/buy"));
  });
});
