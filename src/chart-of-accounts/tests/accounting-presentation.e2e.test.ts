import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Page } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import { scopedTranslation as accountT } from "../account/list/i18n";
import { accountingPeriods, accountNodes, journalEntries, journalEntryLines } from "../db";
import { AccountSubtype, AccountType, JournalEntryStatus, LineType } from "../enum";
import { scopedTranslation as journalT } from "../i18n";
import { prepareAtlasCompany } from "./atlas-workflow-fixture";

const output = "scratchpad/erp/shots/v2/accounting";
const locales = [
  { locale: "en-US", language: "en", decimal: "." },
  { locale: "de-DE", language: "de", decimal: "," },
  { locale: "sk-SK", language: "sk", decimal: "," },
] as const;
const draftResponse = z.object({
  success: z.literal(true),
  data: z.object({ id: z.uuid() }),
});

async function saveViews(
  page: Page,
  alias: string,
  language: string,
  ready: () => Promise<void>,
  prepare?: () => Promise<void>,
): Promise<void> {
  if (process.env["ACCOUNTING_PRESENTATION_SHOTS"] !== "1") {
    return;
  }
  await mkdir(output, { recursive: true });
  for (const { label, width, height } of [
    { label: "desktop", width: 1440, height: 900 },
    { label: "phone", width: 390, height: 844 },
  ]) {
    await page.setViewportSize({ width, height });
    await prepare?.();
    for (const theme of ["light", "dark"] as const) {
      await page.evaluate((value) => {
        const key = "theme_v2";
        const oldValue = localStorage.getItem(key);
        localStorage.setItem(key, value);
        window.dispatchEvent(new StorageEvent("storage", { key, oldValue, newValue: value }));
      }, theme);
      await page.locator(`html.${theme}`).waitFor({ state: "attached" });
      await ready();
      if (prepare && label === "phone") {
        await page.locator('input[inputmode="decimal"]').last().scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${output}/${alias}-verified-lines-${language}-${label}-${theme}.png`,
        });
        await page.locator('input[inputmode="decimal"]').last().evaluate((field) => {
          for (let node: Element | null = field; node; node = node.parentElement) {
            node.scrollTop = 0;
          }
          window.scrollTo(0, 0);
        });
      }
      await page.screenshot({
        path: `${output}/${alias}-verified-${language}-${label}-${theme}.png`,
      });
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}

describe("Accounting presentation on Atlas", () => {
  const e2e = useE2E("accounting/presentation");
  for (const { locale, language, decimal } of locales) {
    e2e.it(`opens the chart and prepares a precise journal draft in ${locale}`, async (fixture) => {
      const { baseUrl, page } = fixture;
      const { companyId, userId } = await prepareAtlasCompany(fixture, "Accounting presentation fixture");
      const periodId = randomUUID();
      const parentId = randomUUID();
      const bankId = randomUUID();
      const incomeId = randomUUID();
      await db.insert(accountingPeriods).values({
        id: periodId,
        companyId,
        name: "November 2026",
        startDate: new Date("2026-11-01"),
        endDate: new Date("2026-11-30"),
      });
      await db.insert(accountNodes).values([
        { id: parentId, companyId, code: "10", name: "Liquid assets", type: AccountType.ASSET, subtype: AccountSubtype.CURRENT_ASSET, isPostable: false, sortOrder: 3 },
        { id: bankId, parentId, companyId, code: "1010", name: "Settlement bank", type: AccountType.ASSET, subtype: AccountSubtype.BANK, sortOrder: 1 },
        { id: incomeId, companyId, code: "4000", name: "Service income", type: AccountType.REVENUE, subtype: AccountSubtype.REVENUE_SERVICE, sortOrder: 2 },
      ]);
      const bookedId = randomUUID();
      await db.insert(journalEntries).values({
        id: bookedId,
        companyId,
        periodId,
        entryNumber: "FIXTURE-001",
        date: new Date("2026-11-12"),
        description: "Fixture opening amount",
        status: JournalEntryStatus.POSTED,
        postedAt: new Date("2026-11-12"),
        postedByUserId: userId,
      });
      await db.insert(journalEntryLines).values([
        { journalEntryId: bookedId, accountId: bankId, type: LineType.DEBIT, amount: 150, currency: "EUR" },
        { journalEntryId: bookedId, accountId: incomeId, type: LineType.CREDIT, amount: 150, currency: "EUR" },
      ]);
      const { t: account } = accountT.scopedT(locale);
      const { t: journal } = journalT.scopedT(locale);
      const chartPath = `${baseUrl}/${locale}/tools/coa-account-list?arg.companyId=${companyId}`;
      await page.goto(chartPath, { waitUntil: "domcontentloaded" });
      const parent = page.getByRole("button", { name: "Liquid assets", exact: true });
      const child = page.getByRole("button", { name: "Settlement bank", exact: true });
      await child.waitFor();
      const positions = await page.getByRole("row").allTextContents();
      expect(positions.findIndex((row) => row.includes("Liquid assets"))).toBeLessThan(
        positions.findIndex((row) => row.includes("Settlement bank")),
      );
      const amount = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(150);
      await page.getByText(amount, { exact: false }).first().waitFor();
      const search = page.getByRole("textbox", { name: String(account("get.widget.searchPage")), exact: true });
      await search.fill("1010");
      await parent.waitFor();
      await child.waitFor();
      expect(await page.getByRole("button", { name: "Service income", exact: true }).count()).toBe(0);
      await search.fill("No account matches this search");
      await page.getByText(String(account("get.widget.noMatches")), { exact: true }).waitFor();
      await search.clear();
      await page.getByRole("button", { name: "Service income", exact: true }).waitFor();
      await saveViews(page, "coa-account-list", language, () => child.waitFor());

      const balanced = page.getByText(String(journal("journalCreate.widget.balanced")), { exact: true });
      const prepareDraft = async (): Promise<void> => {
        await page.goto(`${baseUrl}/${locale}/tools/coa-journal-create?arg.companyId=${companyId}`, { waitUntil: "domcontentloaded" });
        const add = page.getByRole("button", { name: String(journal("journalCreate.widget.addLine")), exact: true });
        const description = page.locator("input[name=description]:visible");
        await description.fill("Fixture transfer");
        const date = page.getByRole("textbox", { name: String(journal("journalCreate.date.label")), exact: true });
        const localizedDate = locale === "en-US" ? "11/20/2026" : "20.11.2026";
        await date.fill(localizedDate);
        await date.press("Tab");
        expect(await page.locator('input[type="hidden"][name="date"]').last().inputValue()).toBe("2026-11-20");
        await add.click();
        await add.click();
        const picks = page.getByRole("combobox", { name: String(journal("journalCreate.widget.account")), exact: true });
        await picks.nth(0).click();
        await page.getByRole("option", { name: "1010 Settlement bank", exact: true }).click();
        await picks.nth(1).click();
        await page.getByRole("option", { name: "4000 Service income", exact: true }).click();
        const debit = page.getByRole("textbox", { name: String(journal(LineType.DEBIT)), exact: true }).first();
        const credit = page.getByRole("textbox", { name: String(journal(LineType.CREDIT)), exact: true }).last();
        await debit.fill(`25${decimal}125`);
        await debit.press("Tab");
        await credit.fill(`25${decimal}120`);
        await credit.press("Tab");
        expect(await debit.getAttribute("inputmode")).toBe("decimal");
        await page.getByText(String(journal("journalCreate.widget.offByLessThan", {
          amount: new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(0.01),
        })), { exact: false }).waitFor();
        await credit.fill(`25${decimal}125`);
        await credit.press("Tab");
        await balanced.waitFor();
      };
      if (process.env["ACCOUNTING_PRESENTATION_SHOTS"] === "1") {
        await saveViews(page, "coa-journal-create", language, () => balanced.waitFor(), prepareDraft);
      } else {
        await prepareDraft();
      }

      if (language === "en") {
        if (!(await balanced.isVisible())) {
          await prepareDraft();
        }
        const response = page.waitForResponse((reply) =>
          reply.request().method() === "POST" &&
          new URL(reply.url()).pathname.endsWith("/chart-of-accounts/journal/create"),
        );
        await page.getByRole("button", { name: String(journal("journalCreate.widget.saveDraft")), exact: true }).click();
        const result = await response;
        expect(result.ok()).toBe(true);
        const parsed = draftResponse.safeParse(await result.json());
        expect(parsed.success).toBe(true);
        if (!parsed.success) {
          return;
        }
        const [debitRow] = await db.select({ amount: journalEntryLines.amount }).from(journalEntryLines)
          .where(eq(journalEntryLines.journalEntryId, parsed.data.data.id));
        expect(debitRow?.amount).toBe(25.125);
        const [entry] = await db.select({ date: journalEntries.date }).from(journalEntries)
          .where(eq(journalEntries.id, parsed.data.data.id));
        expect(entry?.date.toISOString().slice(0, 10)).toBe("2026-11-20");
        await page.getByRole("button", { name: String(journal("journalCreate.widget.viewEntryButton")), exact: true }).click();
        await page.getByText("Fixture transfer", { exact: true }).last().waitFor();
      }
      const journalDetailPath = `${baseUrl}/${locale}/tools/coa-journal-entry-get?arg.entryId=${bookedId}`;
      await page.goto(journalDetailPath, { waitUntil: "domcontentloaded" });
      const posted = page.getByText("Fixture opening amount", { exact: true }).last();
      await posted.waitFor();
      await saveViews(page, "coa-journal-entry-get", language, () => posted.waitFor());
    });
  }
});
