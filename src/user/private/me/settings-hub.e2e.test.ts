/**
 * E2E: the account hub on /user/settings — grouped sections, a separated
 * danger zone that confirms before deleting, and a phone layout without
 * sideways scrolling. Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { TestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { scopedTranslation } from "./i18n";

const SETTINGS_PAGE = "/user/settings";
/** Pixels the page sticks out sideways (evaluated in the browser). */
const OVERFLOW_PROBE =
  "document.documentElement.scrollWidth - window.innerWidth";
const PHONE = { width: 390, height: 844 };
const { t } = scopedTranslation.scopedT(defaultLocale);

async function signedInAccount(
  fixtures: E2EFixtures,
  tag: string,
): Promise<TestUser | null> {
  const created = await createTestUser(fixtures.uniqueEmail(tag), "E2E Hub");
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    return null;
  }
  const account = created.data;
  fixtures.cleanup(() => deleteTestUser(account.user.id));
  await fixtures.loginAs(account.user);
  return account;
}

async function openHub(
  fixtures: E2EFixtures,
  account: TestUser,
): Promise<void> {
  await fixtures.gotoReady(SETTINGS_PAGE, async () => {
    await fixtures.page
      .locator("[data-hydrated]")
      .getByText(account.email)
      .first()
      .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 });
  });
}

describe("E2E: settings hub", () => {
  const e2e = useE2E("user/private/me/hub");

  e2e.it(
    "groups account, creator and danger zone and fits a phone",
    async (fixtures) => {
      const account = await signedInAccount(fixtures, "hub-layout");
      if (!account) {
        return;
      }
      const { page } = fixtures;
      await page.setViewportSize(PHONE);
      await openHub(fixtures, account);

      for (const heading of [
        t("widget.sections.account"),
        t("widget.sections.creator"),
        t("widget.deleteAccount.dangerZone"),
      ]) {
        await page.getByRole("heading", { name: heading }).first().waitFor();
      }

      const overflow = await page.evaluate<number>(OVERFLOW_PROBE);
      expect(overflow).toBeLessThanOrEqual(0);

      // Every hub row is a comfortable touch target
      const row = page.getByRole("button", {
        name: t("widget.sections.password"),
      });
      const box = await row.first().boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    },
  );

  e2e.it(
    "asks for typed confirmation before deleting the account",
    async (fixtures) => {
      const account = await signedInAccount(fixtures, "hub-delete");
      if (!account) {
        return;
      }
      const { page } = fixtures;
      await openHub(fixtures, account);

      await page
        .getByRole("button", { name: t("widget.deleteAccount.button") })
        .last()
        .click();
      await page.getByText(t("widget.deleteAccount.confirmTitle")).waitFor();

      const confirm = page.getByRole("button", {
        name: t("widget.deleteAccount.confirmButton"),
      });
      expect(await confirm.isDisabled()).toBe(true);

      await page
        .getByPlaceholder(t("widget.deleteAccount.confirmPlaceholder"))
        .fill("DELETE");
      expect(await confirm.isDisabled()).toBe(false);

      // Back out — the account stays
      await page
        .getByRole("button", { name: t("widget.deleteAccount.cancelButton") })
        .click();
      await page.getByText(account.email).first().waitFor();
    },
  );
});
