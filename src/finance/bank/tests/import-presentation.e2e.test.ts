import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Page } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { bankStatementLines } from "../db";
import { scopedTranslation } from "../i18n";

const statements = [
  {
    format: "normalized", locale: "en-US", language: "en", name: "standard.csv",
    text: "transactionId,date,amount,currency\nPRIVATE-REFERENCE-9,2026-11-25,-1250.35,EUR",
  },
  {
    format: "mapped", locale: "en-US", language: "en", name: "custom.csv",
    text: "When,Movement,Narrative\n2026-11-25,-1250.35,Private fixture narrative",
  },
  {
    format: "c24", locale: "de-DE", language: "de", name: "c24.csv",
    text: "Buchungstag;Wertstellung;Betrag;Verwendungszweck;Zahlungspartner\n25.11.2026;26.11.2026;-1.250,35;Private fixture narrative;Fixture vendor",
  },
  {
    format: "revolut", locale: "sk-SK", language: "sk", name: "revolut-personal.csv",
    text: "Type,Completed Date,Description,Amount,Fee,Currency,State\nCARD_PAYMENT,2026-11-25 11:04:22,Private fixture narrative,-1250.35,1.00,EUR,COMPLETED\nTRANSFER,,Unfinished,-5,0,EUR,PENDING",
  },
  {
    format: "camt053", locale: "de-DE", language: "de", name: "statement.xml",
    text: '<?xml version="1.0"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.08"><BkToCstmrStmt><Stmt><Ntry><Amt Ccy="EUR">1250.35</Amt><CdtDbtInd>DBIT</CdtDbtInd><Sts><Cd>BOOK</Cd></Sts><BookgDt><Dt>2026-11-25</Dt></BookgDt><AcctSvcrRef>PRIVATE-REFERENCE-9</AcctSvcrRef><NtryDtls><TxDtls><AmtDtls><InstdAmt><Amt Ccy="USD">1400.20</Amt></InstdAmt></AmtDtls><Chrgs><TtlChrgsAndTaxAmt Ccy="EUR">0.50</TtlChrgsAndTaxAmt></Chrgs><RmtInf><Ustrd>Private fixture narrative</Ustrd></RmtInf></TxDtls></NtryDtls></Ntry></Stmt></BkToCstmrStmt></Document>',
  },
  {
    format: "mt940", locale: "sk-SK", language: "sk", name: "statement.sta",
    text: ":20:FIXTURE\n:25:1234\n:60F:C261124EUR3000,00\n:61:261125D1250,35NTRFNONREF//PRIVATE-REFERENCE-9\n:86:Private fixture narrative\n:62F:C261125EUR1749,65",
  },
] as const;

const previewSchema = z.object({
  success: z.literal(true),
  data: z.object({ preview: z.literal(true), imported: z.number() }),
});

async function saveThemes(page: Page, file: string): Promise<void> {
  if (process.env["BANK_PRESENTATION_SHOTS"] !== "1") {
    return;
  }
  const root = "scratchpad/erp/shots/v2/finance";
  await mkdir(root, { recursive: true });
  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((value) => {
      const key = "theme_v2";
      const oldValue = localStorage.getItem(key);
      localStorage.setItem(key, value);
      window.dispatchEvent(new StorageEvent("storage", { key, oldValue, newValue: value }));
    }, theme);
    await page.locator(`html.${theme}`).waitFor({ state: "attached" });
    await page.screenshot({ path: `${root}/bank-import-${file}-${theme}.png`, fullPage: true });
  }
}

describe("Bank import presentation on Atlas", () => {
  const e2e = useE2E("finance/bank-import-presentation");
  for (const { format, locale, language, name, text } of statements) {
    e2e.it(`reviews a synthetic ${format} statement in ${locale}`, async (fixture) => {
      const { baseUrl, page } = fixture;
      const { companyId } = await prepareAtlasCompany(fixture, "Statement review fixture");
      const accountId = randomUUID();
      await db.insert(accountNodes).values({
        id: accountId, companyId, code: "1100", name: "Fixture current account",
        type: AccountType.ASSET, subtype: AccountSubtype.BANK,
      });
      const { t } = scopedTranslation.scopedT(locale);
      const localMoney = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" });
      const open = async (): Promise<void> => {
        const accountArgument = format === "normalized" ? "" : `&arg.accountId=${accountId}`;
        await page.goto(`${baseUrl}/${locale}/tools/bank-statement-import?arg.companyId=${companyId}${accountArgument}&arg.format=${format}`, { waitUntil: "domcontentloaded" });
        if (format === "normalized") {
          await page.getByRole("button", { name: t("fields.account"), exact: true }).click();
          await page.getByRole("button", { name: "Fixture current account", exact: true }).click();
        }
        const chooser = page.waitForEvent("filechooser");
        await page.getByRole("button", { name: t("ui.upload"), exact: true }).click();
        await (await chooser).setFiles({
          name,
          mimeType: format === "camt053" ? "application/xml" : "text/plain",
          buffer: Buffer.from(text),
        });
        if (format === "mapped") {
          for (const [field, header] of [
            ["date", "When"], ["amount", "Movement"], ["description", "Narrative"],
          ] as const) {
            await page.getByRole("combobox", { name: t(`statement.columns.${field}`), exact: true }).click();
            await page.getByRole("option", { name: header, exact: true }).click();
          }
        }
        await page.getByText(t("statement.localPreview"), { exact: true }).waitFor();
        const amount = page.getByText(localMoney.format(-1250.35), { exact: true })
          .filter({ visible: true }).first();
        await amount.waitFor();
        await page.getByText("Fixture current account", { exact: true }).filter({ visible: true }).first().waitFor();
        if (process.env["BANK_PRESENTATION_SHOTS"] === "1") {
          await amount.scrollIntoViewIfNeeded();
        }
        expect(await page.getByText(/Private fixture narrative|PRIVATE-REFERENCE-9/).count()).toBe(0);
        if (format === "revolut" || format === "camt053") {
          await page.getByText(t("statement.columns.feeAmount"), { exact: true }).waitFor();
          await page.getByText(localMoney.format(format === "revolut" ? -1 : -0.5), { exact: true }).waitFor();
        }
      };

      await page.setViewportSize({ width: 1440, height: 900 });
      await open();
      await saveThemes(page, `${format}-local-${language}-desktop`);
      await page.getByRole("checkbox", { name: t("statement.preview"), exact: true }).check();
      const response = page.waitForResponse((reply) =>
        reply.request().method() === "POST" && new URL(reply.url()).pathname.endsWith("/finance/bank/import"),
      );
      await page.getByRole("button", { name: t("ui.importAction"), exact: true }).click();
      const preview = await response;
      expect(preview.ok()).toBe(true);
      expect(previewSchema.safeParse(await preview.json())).toMatchObject({
        success: true, data: { data: { imported: 1 } },
      });
      await page.getByText(t("statement.projected"), { exact: true }).waitFor();
      await saveThemes(page, `${format}-screened-${language}-desktop`);
      expect(await page.getByText(t("fields.imported"), { exact: true }).count()).toBe(0);
      expect(await db.select().from(bankStatementLines).where(eq(bankStatementLines.companyId, companyId))).toEqual([]);

      if (process.env["BANK_PRESENTATION_SHOTS"] === "1") {
        await page.setViewportSize({ width: 390, height: 844 });
        await open();
        await saveThemes(page, `${format}-local-${language}-phone`);
      }
    });
  }
});
