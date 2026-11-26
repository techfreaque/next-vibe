import { mkdir } from "node:fs/promises";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { LEAD_ID_COOKIE_NAME } from "@/env/constants";

import { scopedTranslation } from "./i18n";

async function capture(
  page: Page,
  locale: string,
  device: "desktop" | "phone",
  state: "default" | "actions",
): Promise<void> {
  if (process.env["USERS_DETAIL_PHONE_SHOTS"] !== "1") {
    return;
  }
  const directory = "scratchpad/erp/shots/v2/usersDirectory";
  await mkdir(directory, { recursive: true });
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await page.evaluate((theme) => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
    }, theme);
    await page.screenshot({
      path: `${directory}/users-detail-phone-${state}-${locale}-${device}-${theme}.png`,
      animations: "disabled",
    });
  }
}

describe("User detail on a phone", () => {
  const e2e = useE2E("users-detail-phone");

  e2e.it(
    "keeps all actions within the page and switches sections with the keyboard",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const name = "Taylor Morgan";
      let userId: string | undefined;
      fixtures.cleanup(async () => {
        if (userId) {
          await deleteTestUser(userId);
        }
      });
      const created = await createTestUser(
        fixtures.uniqueEmail("detail-phone"),
        name,
      );
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      userId = created.data.user.id;
      const admin = await resolveTestAdminUser();
      await authAtlas(fixtures, admin);
      await fixtures.context.addCookies([
        {
          name: LEAD_ID_COOKIE_NAME,
          value: admin.leadId,
          url: baseUrl,
          httpOnly: true,
        },
      ]);

      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const url = new URL(`/${locale}/tools/users-view`, baseUrl);
        url.searchParams.set("userId", userId);
        await page.setViewportSize({ width: 390, height: 844 });
        let response = await page.goto(url.toString(), {
          waitUntil: "domcontentloaded",
        });
        for (let retry = 0; response?.status() === 503 && retry < 3; retry++) {
          await Bun.sleep(5000);
          response = await page.reload({ waitUntil: "domcontentloaded" });
        }
        expect(response?.status()).toBe(200);
        await page.getByRole("heading", { name, exact: true }).last().waitFor();
        await expectPhoneTabs(page, t);
        const more = page.getByRole("button", {
          name: t("widget.actions.more"),
          exact: true,
        });
        await page
          .getByRole("button", {
            name: t("widget.actions.addCredits"),
            exact: true,
          })
          .waitFor();
        await page
          .getByRole("button", { name: t("roles.add"), exact: true })
          .waitFor();
        await capture(page, locale, "phone", "default");
        await more.click();
        expect(await more.getAttribute("aria-expanded")).toBe("true");
        const mobileActions = page.getByRole("region", {
          name: t("widget.actions.more"),
          exact: true,
        });
        expect(await more.getAttribute("aria-controls")).toBe(
          await mobileActions.getAttribute("id"),
        );
        const box = await mobileActions.boundingBox();
        expect(box && box.x >= 12 && box.x + box.width <= 378).toBe(true);
        const labels = [
          t("widget.actions.edit"),
          t("widget.actions.copyUserId"),
          t("ban.banUser"),
          t("widget.actions.delete"),
        ];
        for (const label of labels) {
          const button = mobileActions.getByRole("button", {
            name: label,
            exact: true,
          });
          const size = await button.boundingBox();
          expect(size && size.height >= 44).toBe(true);
        }
        const sections = page.getByRole("combobox", { name: t("tabs.section") });
        const tabBox = await sections.boundingBox();
        expect(box && tabBox && box.y + box.height < tabBox.y).toBe(true);
        await capture(page, locale, "phone", "actions");
        await more.click();
        await mobileActions.waitFor({ state: "hidden" });

        await sections.focus();
        await sections.press("Space");
        await page.getByRole("option", {name: t("tabs.billing"), exact:true}).press("Enter");
        expect(await sections.textContent()).toContain(t("tabs.billing"));
        await sections.click();
        await page.getByRole("option", {name:t("tabs.skills"),exact:true}).click();
        expect(await sections.textContent()).toContain(t("tabs.skills"));
        await sections.click();
        await page.getByRole("option", {name:t("tabs.overview"),exact:true}).click();

        await page.setViewportSize({ width: 1440, height: 900 });
        await capture(page, locale, "desktop", "default");
        await more.click();
        const desktopActions = page.getByRole("menu");
        for (const label of labels) {
          await desktopActions
            .getByRole("menuitem", { name: label, exact: true })
            .waitFor();
        }
        await capture(page, locale, "desktop", "actions");
        await page.keyboard.press("Escape");
        await desktopActions.waitFor({ state: "hidden" });
      }
    },
  );
});

async function expectPhoneTabs(
  page: Page,
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): Promise<void> {
  const sections = page.getByRole("combobox", { name: t("tabs.section") });
  await sections.click();
  expect(await page.getByRole("option").count()).toBe(8);
  await page.keyboard.press("Escape");
  expect(await sections.textContent()).toContain(t("tabs.overview"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}
