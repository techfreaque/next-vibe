import { mkdir } from "node:fs/promises";

import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Page } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import { scopedTranslation as detailTranslation } from "../view/i18n";
import { scopedTranslation } from "./i18n";

const { t } = scopedTranslation.scopedT(E2E_LOCALE);
const { t: detailT } = detailTranslation.scopedT(E2E_LOCALE);

async function captureView(page: Page, tool: "users-list" | "users-view", state: "default" | "empty" | "menu"): Promise<void> {
  if (process.env["USERS_REVIEW_SHOTS"] !== "1") {
    return;
  }
  const root = "scratchpad/erp/shots/v2/usersDirectory";
  await mkdir(root, { recursive: true });
  const theme = (await page.locator("html.dark").count()) ? "dark" : "light";
  const menu = page.getByRole("menu");
  const more = page.getByRole("button", { name: String(detailT("widget.actions.more")), exact: true });
  const viewports = [
    { label: "desktop", width: 1440, height: 900 },
    { label: "phone", width: 390, height: 844 },
  ];
  for (const { label, width, height } of viewports) {
    await page.setViewportSize({ width, height });
    if (state === "menu") {
      if (!(await menu.isVisible())) {
        await more.click();
        await menu.waitFor();
      }
      await page.waitForFunction(() => Array.from(document.querySelectorAll('[role="menu"]')).some((item) =>
        getComputedStyle(item).opacity === "1" && item.getBoundingClientRect().height > 0,
      ));
    }
    await page.screenshot({ path: `${root}/${tool}-${state}-en-${label}-${theme}.png` });
    if (state === "menu") {
      await page.keyboard.press("Escape");
      await menu.waitFor({ state: "hidden" });
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}

const directoryResult = z.object({
  success: z.literal(true),
  data: z.object({ users: z.array(z.object({ email: z.string() })) }),
});

async function searchDirectory(page: Page, value: string): Promise<{ count: number; containsFixture: boolean } | undefined> {
  const pending = page.waitForResponse((reply) => {
    const url = new URL(reply.url());
    return reply.ok() && url.pathname.endsWith("/users/list") && url.searchParams.get("search") === value;
  });
  await page.getByRole("textbox", { name: String(t("get.fields.search.label")), exact: true }).last().fill(value);
  const result = directoryResult.safeParse(await (await pending).json());
  return result.success
    ? { count: result.data.data.users.length, containsFixture: result.data.data.users.some(({ email }) => email === value) }
    : undefined;
}

describe("E2E: admin user directory review", () => {
  const e2e = useE2E("users-review");

  e2e.it("filters an authorized account, opens its full record and keeps advanced actions visible", async ({
    cleanup, gotoReady, loginAs, page, uniqueEmail,
  }) => {
    const name = "Taylor Morgan";
    const account = await createTestUser(uniqueEmail("directory-review"), name);
    expect(account.success).toBe(true);
    if (!account.success) {
      return;
    }
    const { user, email } = account.data;
    cleanup(async () => { await deleteTestUser(user.id); });
    await loginAs(await resolveTestAdminUser());
    const search = page.getByRole("textbox", { name: String(t("get.fields.search.label")), exact: true }).last();
    await gotoReady("/tools/users-list", () =>
      page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor(),
    );
    await search.waitFor();
    await page.locator("#admin-tool-users-list tbody tr").first().waitFor();
    const filtered = await searchDirectory(page, email);
    expect(filtered).toEqual({ count: 1, containsFixture: true });
    const record = page.getByRole("button", {
      name: String(t("widget.actions.openUser", { email })),
      exact: true,
    }).filter({ visible: true }).last();
    await record.waitFor();
    await page.locator("#admin-tool-users-list h1").waitFor();
    await captureView(page, "users-list", "default");
    await record.click();

    const header = page.getByRole("heading", { name, exact: true }).last();
    await header.waitFor();
    const primary = page.getByRole("button", { name: String(detailT("widget.actions.addCredits")), exact: true });
    await primary.waitFor();
    const more = page.getByRole("button", { name: String(detailT("widget.actions.more")), exact: true });
    await more.click();
    await page.getByRole("menuitem", { name: String(detailT("widget.actions.edit")), exact: true }).waitFor();
    if (process.env["USERS_REVIEW_SHOTS"] === "1") {
      await captureView(page, "users-view", "menu");
    } else {
      await page.keyboard.press("Escape");
    }
    const headerArea = page.locator("header").filter({ has: header }).last();
    expect(await headerArea.getByText(user.id, { exact: true }).count()).toBe(0);
    await captureView(page, "users-view", "default");
  });

  e2e.it("shows no matches for a real filtered query and keeps the filter available", async ({
    gotoReady, loginAs, page, uniqueEmail,
  }) => {
    await loginAs(await resolveTestAdminUser());
    const search = page.getByRole("textbox", { name: String(t("get.fields.search.label")), exact: true }).last();
    await gotoReady("/tools/users-list", () =>
      page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor(),
    );
    await page.locator("#admin-tool-users-list tbody tr").first().waitFor();
    const filtered = await searchDirectory(page, uniqueEmail("unmatched-directory"));
    expect(filtered?.count).toBe(0);
    await page.getByText(String(t("widget.empty.filtered")), { exact: true }).last().waitFor();
    expect(await search.isVisible()).toBe(true);
    await captureView(page, "users-list", "empty");
  });
});
