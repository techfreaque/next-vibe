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
import { ChannelType } from "@/leads/growth/enum";
import { scopedTranslation as growthTranslation } from "@/leads/growth/i18n";

import { scopedTranslation as detailTranslation } from "../view/i18n";
import { scopedTranslation } from "./i18n";

const viewports = [
  { label: "phone", width: 390, height: 844 },
  { label: "desktop", width: 1440, height: 900 },
];

async function visit(page: Page, url: URL): Promise<void> {
  let response = await page.goto(url.toString(), {
    waitUntil: "domcontentloaded",
  });
  for (let retry = 0; response?.status() === 503 && retry < 3; retry++) {
    await Bun.sleep(5000);
    response = await page.reload({ waitUntil: "domcontentloaded" });
  }
  expect(response?.status()).toBe(200);
}

async function capture(
  page: Page,
  screen: string,
  locale: string,
): Promise<void> {
  for (const { label, width, height } of viewports) {
    await page.setViewportSize({ width, height });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    if (process.env["USERS_DIRECTORY_REVIEW_SHOTS"] === "1") {
      const directory = "scratchpad/erp/shots/v2/usersDirectory";
      await mkdir(directory, { recursive: true });
      const prefix = `${directory}/users-directory-review-${screen}-${locale}-${label}`;
      await page.screenshot({ path: `${prefix}.png`, animations: "disabled" });
      if (screen === "list" && label === "phone") {
        const row = page.locator("#admin-tool-users-list tbody tr").first();
        await row.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${prefix}-row.png`,
          animations: "disabled",
        });
        await row.evaluate((node) => {
          for (
            let parent = node.parentElement;
            parent;
            parent = parent.parentElement
          ) {
            parent.scrollTop = 0;
          }
        });
      }
    }
  }
}

describe("User directory and detail readability", () => {
  const e2e = useE2E("users-directory-review");

  e2e.it(
    "shows localized account information and excludes test accounts from Humans only",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const name = "Taylor Morgan";
      const email = `review-${crypto.randomUUID().slice(0, 8)}@example.com`;
      let userId: string | undefined;
      fixtures.cleanup(async () => {
        if (userId) {
          await deleteTestUser(userId);
        }
      });
      const account = await createTestUser(email, name);
      expect(account.success).toBe(true);
      if (!account.success) {
        return;
      }
      userId = account.data.user.id;
      await authAtlas(fixtures, await resolveTestAdminUser());
      await page.emulateMedia({ colorScheme: "dark" });

      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const { t: detailT } = detailTranslation.scopedT(locale);
        const directory = new URL(`/${locale}/tools/users-list`, baseUrl);
        directory.searchParams.set("arg.search", email);
        await page.setViewportSize({ width: 390, height: 844 });
        await visit(page, directory);
        // Phone renders each account as a card button (name, balance, email, plan).
        const cards = page
          .locator("#admin-tool-users-list")
          .getByRole("button", { name: t("widget.actions.openUser", { email }), exact: true })
          .filter({ visible: true });
        const row = cards.filter({ hasText: email });
        await row.getByText(email, { exact: true }).waitFor();
        expect(await cards.count()).toBe(1);
        const balance = row
          .getByText(t("widget.creditAmount", { count: "0" }), { exact: true })
          .filter({ visible: true });
        await balance.waitFor();
        const revenue = page.getByRole("button", {
          name: t("widget.kpi.revenue"),
        });
        const expectedRevenue = new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
        }).format(0);
        await revenue.getByText(expectedRevenue, { exact: true }).waitFor();
        const header = page.locator("#admin-tool-users-list header").filter({
          has: page.getByRole("heading", {
            name: t("widget.titleWithCount", { count: "1" }),
            exact: true,
          }),
        });
        for (const control of [
          header.getByRole("heading"),
          header.getByRole("button", {
            name: t("widget.actions.stats"),
            exact: true,
          }),
          header.getByRole("button", {
            name: t("widget.actions.refresh"),
            exact: true,
          }),
          header.getByRole("button", {
            name: t("widget.actions.newUser"),
            exact: true,
          }),
        ]) {
          expect(
            await control.evaluate((node) => {
              const rect = node.getBoundingClientRect();
              const front = document.elementFromPoint(
                rect.x + rect.width / 2,
                rect.y + rect.height / 2,
              );
              return (
                rect.left >= 0 &&
                rect.right <= innerWidth + 1 &&
                (node.tagName === "H1" || rect.height >= 44) &&
                node.contains(front)
              );
            }),
          ).toBe(true);
        }
        const search = page.getByRole("textbox", {
          name: t("get.fields.search.label"),
          exact: true,
        });
        expect(
          await search.evaluate((node) => {
            if (!(node instanceof HTMLInputElement)) {
              return false;
            }
            const context = document.createElement("canvas").getContext("2d");
            if (!context) {
              return false;
            }
            const style = getComputedStyle(node);
            context.font = `${style.fontSize} ${style.fontFamily}`;
            const available =
              node.clientWidth -
              Number.parseFloat(style.paddingLeft) -
              Number.parseFloat(style.paddingRight);
            return context.measureText(node.value).width <= available;
          }),
        ).toBe(true);
        await capture(page, "list", locale);
        const direct = growthTranslation.scopedT(locale).t(ChannelType.DIRECT);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page
          .locator("#admin-tool-users-list tbody tr")
          .filter({ hasText: email })
          .getByText(direct, { exact: true })
          .waitFor();
        await page.setViewportSize({ width: 390, height: 844 });

        const humans = page.getByRole("button", {
          name: t("widget.quick.humans"),
          exact: true,
        });
        await humans.click();
        await page
          .getByText(t("widget.empty.filtered"), { exact: true })
          .waitFor();
        expect(await row.count()).toBe(0);
        await humans.click();
        await row.waitFor();

        const detail = new URL(`/${locale}/tools/users-view`, baseUrl);
        detail.searchParams.set("userId", userId);
        await page.setViewportSize({ width: 390, height: 844 });
        await visit(page, detail);
        await page.getByRole("heading", { name, exact: true }).waitFor();
        const walletLabel = page.getByText(detailT("kpi.credits"), {
          exact: true,
        });
        await walletLabel.waitFor();
        expect(
          await walletLabel.evaluate(
            (label) => label.scrollWidth <= label.clientWidth + 1,
          ),
        ).toBe(true);
        const activity = page
          .getByText(detailT("kpi.lastSeen"), { exact: true })
          .locator("../following-sibling::div[1]/span");
        await activity.waitFor();
        expect(
          await activity.evaluate((value) => {
            const lineHeight = Number.parseFloat(
              getComputedStyle(value).lineHeight,
            );
            return value.getBoundingClientRect().height <= lineHeight + 1;
          }),
        ).toBe(true);
        const sections = page.getByRole("combobox", {name:detailT("tabs.section")});
        await sections.waitFor();
        const paidHint = page.getByText(detailT("kpi.paidHint", { count: 0 }), {
          exact: true,
        });
        expect(
          await paidHint.evaluate((node) => {
            const style = getComputedStyle(node);
            return (
              node.getBoundingClientRect().height <=
              Number.parseFloat(style.lineHeight) + 1
            );
          }),
        ).toBe(true);
        await capture(page, "detail", locale);

        await page.setViewportSize({ width: 390, height: 844 });
        await sections.click();
        await page.getByRole("option",{name:detailT("tabs.skills"),exact:true}).click();
        expect(await sections.textContent()).toContain(detailT("tabs.skills"));
        await sections.click();
        await page.getByRole("option",{name:detailT("tabs.overview"),exact:true}).click();
        const back = page.getByRole("button", {
          name: detailT("widget.actions.browse"),
          exact: true,
        });
        await back.waitFor({ state: "visible" });
        expect(await back.locator("svg").count()).toBe(1);
        await back.click();
        await page.waitForURL(`**/${locale}/tools/users-list**`);
      }
    },
  );
});
