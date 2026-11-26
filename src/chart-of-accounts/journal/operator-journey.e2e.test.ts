import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { asc, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Locator } from "playwright";
import { describe, expect } from "vitest";

import { accountingPeriods, accountNodes, journalEntries, journalEntryLines } from "../db";
import { AccountSubtype, AccountType, JournalEntryStatus, LineType } from "../enum";
import { scopedTranslation } from "../i18n";
import exportDefinition from "../reports/journal-export/definition";
import { scopedTranslation as exportTranslation } from "../reports/journal-export/i18n";
import { prepareAtlasCompany } from "../tests/atlas-workflow-fixture";
import postDefinition from "./[entryId]/post/definition";
import reverseDefinition from "./[entryId]/reverse/definition";
import createDefinition from "./create/definition";

describe("Manual journal operator journey", () => {
  const e2e = useE2E("accounting/manual-journal-operator");

  for (const [locale, reversalPrefix] of [
    ["en-US", "Reversal of"],
    ["de-DE", "Storno zu"],
    ["sk-SK", "Storno zápisu"],
  ] as const) {
    e2e.it(`${locale}: saves, posts, exports and reverses exact EUR movements`, async (fixtures) => {
      const { page, capture } = fixtures;
      const { companyId } = await prepareAtlasCompany(fixtures, "Fixture manual journal books");
      const periodId = randomUUID();
      const debitAccount = randomUUID();
      const creditAccount = randomUUID();
      const periodName = "Fixture open accounting period";
      const today = new Date().toISOString().slice(0, 10);
      await db.insert(accountingPeriods).values({
        id: periodId,
        companyId,
        name: periodName,
        startDate: new Date(`${today}T00:00:00Z`),
        endDate: new Date(`${today}T23:59:59Z`),
      });
      await db.insert(accountNodes).values([
        { id: debitAccount, companyId, code: "1010", name: "Fixture bank", type: AccountType.ASSET, subtype: AccountSubtype.BANK },
        { id: creditAccount, companyId, code: "4100", name: "Fixture revenue", type: AccountType.REVENUE, subtype: AccountSubtype.REVENUE_SERVICE },
      ]);
      const { t } = scopedTranslation.scopedT(locale);
      const { t: exportT } = exportTranslation.scopedT(locale);
      const amount = 25.1251;
      const decimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(amount);
      const title = "Fixture opening journal";
      const memo = "Checked exact posting";
      const shot = async (state: string, marker: Locator): Promise<void> => {
        if (process.env["JOURNAL_OPERATOR_SHOTS"] !== "1") {
          return;
        }
        const folder = "scratchpad/erp/shots/v2/journal-operator";
        await mkdir(folder, { recursive: true });
        for (const [device, width, height] of [
          ["desktop", 1440, 900],
          ["phone", 390, 844],
        ] as const) {
          await page.setViewportSize({ width, height });
          for (const theme of ["light", "dark"] as const) {
            await page.emulateMedia({ colorScheme: theme });
            await page.locator("html").evaluate((root, mode) => {
              root.classList.remove("light", "dark");
              root.classList.add(mode);
              root.style.colorScheme = mode;
            }, theme);
            await marker.waitFor({ state: "visible" });
            await marker.scrollIntoViewIfNeeded();
            expect(await page.locator("vite-error-overlay").count()).toBe(0);
            await page.screenshot({
              animations: "disabled",
              path: `${folder}/${locale}-${state}-${device}-${theme}.png`,
            });
          }
        }
      };
      const currentPanel = (alias: string) => page.locator(`#admin-tool-${alias} [data-hydrated]`).last();
      const readLines = (id: string) =>
        db.select().from(journalEntryLines).where(eq(journalEntryLines.journalEntryId, id))
          .orderBy(asc(journalEntryLines.sortOrder));

      await page.setViewportSize({ width: 1440, height: 900 });
      await fixtures.goto(`/tools/coa-journal-create?arg.companyId=${companyId}`, locale);
      const editor = currentPanel("coa-journal-create");
      await editor.getByText(periodName, { exact: true }).filter({ visible: true }).waitFor();
      await editor.getByLabel(t("journalCreate.entryDescription.label"), { exact: true }).fill(title);
      await editor.getByLabel(t("journalCreate.memo.label"), { exact: true }).fill(memo);
      const addLine = editor.getByRole("button", { name: t("journalCreate.widget.addLine"), exact: true });
      await addLine.click();
      await addLine.click();
      const accounts = editor.getByRole("combobox", {
        name: t("journalCreate.widget.account"), exact: true,
      });
      for (const [index, name] of ["1010 Fixture bank", "4100 Fixture revenue"].entries()) {
        await accounts.nth(index).click();
        await page.getByRole("option", { name, exact: true }).click();
      }
      const rowDescriptions = editor.getByRole("textbox", {
        name: t("journalCreate.widget.lineDescription"), exact: true,
      });
      await rowDescriptions.nth(0).fill("Exact debit");
      await rowDescriptions.nth(1).fill("Exact credit");
      const debit = editor.getByRole("textbox", { name: t(LineType.DEBIT), exact: true }).nth(0);
      const credit = editor.getByRole("textbox", { name: t(LineType.CREDIT), exact: true }).nth(1);
      await debit.fill(decimal);
      await credit.fill(decimal);
      await credit.press("Tab");
      const balanced = editor.getByText(t("journalCreate.widget.balanced"), { exact: true });
      await balanced.waitFor();
      await debit.focus();
      expect(await debit.inputValue()).toBe(decimal);
      await debit.press("Tab");
      const localZero = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
      }).format(0);
      const inactiveCredit = editor.getByRole("textbox", { name: t(LineType.CREDIT), exact: true }).nth(0);
      const inactiveDebit = editor.getByRole("textbox", { name: t(LineType.DEBIT), exact: true }).nth(1);
      for (const counterpart of [inactiveCredit, inactiveDebit]) {
        expect(await counterpart.inputValue()).toBe("");
        expect(await counterpart.getAttribute("placeholder")).toBe(localZero);
      }
      const preview = editor.getByTestId("journal-balance-preview");
      expect(await preview.isVisible()).toBe(false);
      await page.setViewportSize({ width: 390, height: 844 });
      await preview.waitFor();
      const rows = preview.getByTestId("journal-balance-preview-line");
      expect(await rows.count()).toBe(2);
      for (const [index, account, debitValue, creditValue] of [
        [0, "1010 Fixture bank", decimal, localZero],
        [1, "4100 Fixture revenue", localZero, decimal],
      ] as const) {
        expect(await rows.nth(index).locator("span").allTextContents()).toEqual([
          account, debitValue, creditValue,
        ]);
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await shot("balanced-draft", balanced);

      const created = await capture(createDefinition.POST, () =>
        editor.getByRole("button", { name: t("journalCreate.widget.saveDraft"), exact: true }).click(),
      );
      expect(created.response.success).toBe(true);
      if (!created.response.success) return;
      const { id, entryNumber } = created.response.data;
      const [draft] = await db.select().from(journalEntries).where(eq(journalEntries.id, id));
      expect(draft).toMatchObject({ companyId, periodId, description: title, memo, status: JournalEntryStatus.DRAFT });
      const lines = await readLines(id);
      expect(lines).toMatchObject([
        { accountId: debitAccount, type: LineType.DEBIT, amount, currency: "EUR", description: "Exact debit" },
        { accountId: creditAccount, type: LineType.CREDIT, amount, currency: "EUR", description: "Exact credit" },
      ]);

      await page.getByRole("button", { name: t("journalCreate.widget.postNowButton"), exact: true }).last().click();
      const posted = await capture(postDefinition.POST, () =>
        currentPanel("coa-journal-post").getByTestId("endpoint-submit").click(),
      );
      expect(posted.response).toMatchObject({ success: true, data: { posted: true } });
      const entryPath = `/tools/coa-journal-entry-get?arg.entryId=${id}`;
      const assertPostedView = async (): Promise<void> => {
        const view = currentPanel("coa-journal-entry-get");
        await view.getByRole("heading", { name: entryNumber, exact: true }).waitFor();
        await view.getByText(memo, { exact: true }).waitFor();
        await view.getByRole("button", { name: "1010 Fixture bank", exact: true }).waitFor();
        await view.getByRole("button", { name: "4100 Fixture revenue", exact: true }).waitFor();
        const displayed = new Intl.NumberFormat(locale, {
          style: "currency", currency: "EUR",
        }).format(amount);
        await view.getByText(displayed, { exact: true }).first().waitFor();
        await view.getByText(t(JournalEntryStatus.POSTED), { exact: true }).waitFor();
      };
      const postedHeading = currentPanel("coa-journal-entry-get")
        .getByRole("heading", { name: entryNumber, exact: true });
      const openPostedEntry = currentPanel("coa-journal-post")
        .getByRole("button", { name: t("journalCreate.widget.viewEntryButton"), exact: true });
      await postedHeading.or(openPostedEntry).filter({ visible: true }).first().waitFor();
      if (await openPostedEntry.isVisible()) {
        await openPostedEntry.click();
      }
      await assertPostedView();
      const [postedRow] = await db.select().from(journalEntries).where(eq(journalEntries.id, id));
      expect(postedRow?.status).toBe(JournalEntryStatus.POSTED);
      expect(postedRow?.postedAt).toBeInstanceOf(Date);
      expect(await readLines(id)).toEqual(lines);
      await shot("posted-entry", currentPanel("coa-journal-entry-get").getByRole("heading", { name: entryNumber, exact: true }));

      const exportPath = `/tools/coa-journal-export?arg.companyId=${companyId}&arg.currency=EUR&arg.dateFrom=${today}&arg.dateTo=${today}`;
      const exported = await capture(exportDefinition.GET, () =>
        fixtures.goto(exportPath, locale),
      );
      const report = currentPanel("coa-journal-export");
      expect(exported.response).toMatchObject({
        success: true,
        data: { companyIdOut: companyId, currencyOut: "EUR", fromOut: today, toOut: today, rowCount: 2, debitCount: 1, creditCount: 1 },
      });
      if (!exported.response.success) return;
      const button = report.getByRole("button", { name: exportT("download"), exact: true });
      await button.waitFor();
      await shot("csv-ready", button);
      const download = page.waitForEvent("download");
      await button.click();
      const file = await download;
      expect(file.suggestedFilename()).toBe(`journal-${today}_${today}-EUR.csv`);
      const filename = await file.path();
      const csv = await Bun.file(filename).text();
      expect(csv.replace(/^\uFEFF/u, "")).toBe(exported.response.data.csv.replace(/^\uFEFF/u, ""));
      const [header, ...records] = csv.trim().split("\r\n");
      expect(header).toContain(`"${exportT("headerDebit")}","${exportT("headerCredit")}"`);
      expect(records).toHaveLength(2);
      expect(records.every((record) => record.startsWith(`"${entryNumber}","${today}",`))).toBe(true);
      expect(records).toContainEqual(expect.stringMatching(/"1010","Fixture bank".*"EUR",25\.1251,$/u));
      expect(records).toContainEqual(expect.stringMatching(/"4100","Fixture revenue".*"EUR",,25\.1251$/u));

      await fixtures.goto(entryPath, locale);
      await assertPostedView();
      const original = currentPanel("coa-journal-entry-get");
      await original.getByRole("button", {
        name: t("journalEntryGet.widget.reverseButton"), exact: true,
      }).click();
      const reversal = currentPanel("coa-journal-reverse");
      const reversed = await capture(reverseDefinition.POST, () =>
        reversal.getByTestId("endpoint-submit").click(),
      );
      expect(reversed.response.success).toBe(true);
      if (!reversed.response.success) return;
      const { reversalEntryId, reversalEntryNumber } = reversed.response.data;
      await reversal.getByRole("button", {
        name: t("journalReverse.widget.viewReversalButton"), exact: true,
      }).click();
      await original.getByRole("heading", { name: reversalEntryNumber, exact: true }).waitFor();
      await original.getByText(t(JournalEntryStatus.POSTED), { exact: true }).waitFor();
      expect(await readLines(id)).toEqual(lines);
      expect(await readLines(reversalEntryId)).toMatchObject([
        { accountId: debitAccount, type: LineType.CREDIT, amount, currency: "EUR" },
        { accountId: creditAccount, type: LineType.DEBIT, amount, currency: "EUR" },
      ]);
      const [reversedOriginal] = await db.select().from(journalEntries).where(eq(journalEntries.id, id));
      const [postedReversal] = await db.select().from(journalEntries).where(eq(journalEntries.id, reversalEntryId));
      expect(reversedOriginal).toMatchObject({ status: JournalEntryStatus.REVERSED, reversedById: reversalEntryId });
      const reversalDescription = `${reversalPrefix} ${entryNumber}: ${title}`;
      expect(postedReversal).toMatchObject({
        status: JournalEntryStatus.POSTED,
        reversalOfId: id,
        companyId,
        periodId,
        description: reversalDescription,
      });
      await original.getByText(reversalDescription, { exact: true }).waitFor();
      await original
        .getByText(t("journalEntryGet.widget.reversalBadge"), { exact: true })
        .waitFor();
      const originalEntry = original.getByRole("button", {
        name: `${t("journalEntryGet.widget.originalEntry")} ${entryNumber}`,
        exact: true,
      });
      await originalEntry.waitFor();
      await shot("reversal-entry", original.getByRole("heading", { name: reversalEntryNumber, exact: true }));
      await original.getByText(t("journalEntryGet.widget.originalLineNotes"), {exact:true}).waitFor();
      await original.getByRole("button",{name:t("journalEntryGet.widget.reverseReversal"),exact:true}).waitFor();
      await originalEntry.click();
      await original.getByRole("heading", {name:entryNumber,exact:true}).waitFor();
      await original.getByText(t(JournalEntryStatus.REVERSED),{exact:true}).waitFor();
      await original.getByRole("button", {
        name: `${t("journalEntryGet.widget.reversingEntry")} ${reversalEntryNumber}`,
        exact: true,
      }).click();
      await original.getByRole("heading",{name:reversalEntryNumber,exact:true}).waitFor();
      expect(await readLines(id)).toEqual(lines);

    });
  }
});
