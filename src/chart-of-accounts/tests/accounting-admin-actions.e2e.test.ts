import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { companies } from "@/companies/db";

import deactivateAccount from "../account/[accountId]/deactivate/definition";
import updateAccount from "../account/[accountId]/update/definition";
import createAccount from "../account/create/definition";
import { accountingPeriods, accountNodes } from "../db";
import { AccountSubtype, AccountType, JournalSourceType, LineType, PeriodStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import createPeriod from "../period/create/definition";
import statements from "../reports/statutory-statements/definition";
import setup from "../setup/definition";
import { postJournalEntry } from "../shared/auto-post";
import { prepareAtlasCompany } from "./atlas-workflow-fixture";

const locale = "en-US";

describe("Accounting administration on Atlas", () => {
  const e2e = useE2E("accounting/admin-actions");
  const { t } = scopedTranslation.scopedT(locale);

  e2e.it(
    "loads a template, creates an account, edits it and deactivates it",
    async (fixtures) => {
      const { page, capture, goto } = fixtures;
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        "Northbridge Accounting",
      );
      const company = `arg.companyId=${companyId}`;
      const { t: setupT } = setup.POST.scopedTranslation.scopedT(locale);
      const { t: createT } =
        createAccount.POST.scopedTranslation.scopedT(locale);
      const { t: updateT } =
        updateAccount.PATCH.scopedTranslation.scopedT(locale);
      const { t: deactivateT } =
        deactivateAccount.POST.scopedTranslation.scopedT(locale);
      const setupView = page.locator("#admin-tool-coa-setup");
      const template = setupView.getByRole("combobox", {
        name: setupT("post.country.label"),
      });
      await goto(`/tools/coa-setup?${company}`, locale);
      await template.waitFor();
      await setupView
        .getByText(setupT("post.widget.empty"), { exact: true })
        .waitFor();
      await template.click();
      await page
        .getByRole("option", { name: setupT("enums.country.SK"), exact: true })
        .click();
      await saveAdminReviewScreenshots(page, "coa-setup", locale);
      const setupResult = await capture(setup.POST, () =>
        setupView
          .getByRole("button", {
            name: setupT("post.widget.submit"),
            exact: true,
          })
          .click(),
      );
      expect(setupResult.response.success).toBe(true);
      await setupView
        .getByText(setupT("post.success.title"), { exact: true })
        .first()
        .waitFor();
      const templateAccounts = await db
        .select({ id: accountNodes.id })
        .from(accountNodes)
        .where(eq(accountNodes.companyId, companyId));
      expect(templateAccounts.length).toBeGreaterThan(0);

      const accountCode = "9988";
      const accountName = "Digital equipment reserve";
      const revisedName = "Digital asset reserve";
      const createView = page.locator("#admin-tool-coa-account-create");
      const code = createView.getByRole("textbox", {
        name: createT("post.code.label"),
      });
      await goto(`/tools/coa-account-create?${company}`, locale);
      await code.waitFor();
      await code.fill(accountCode);
      await createView
        .getByRole("textbox", { name: createT("post.name.label") })
        .fill(accountName);
      await createView
        .getByRole("combobox", { name: createT("post.type.label") })
        .click();
      await page
        .getByRole("option", { name: t(AccountType.ASSET), exact: true })
        .click();
      await createView
        .getByRole("combobox", { name: createT("post.subtype.label") })
        .click();
      await page
        .getByRole("option", {
          name: t(AccountSubtype.CURRENT_ASSET),
          exact: true,
        })
        .click();
      await saveAdminReviewScreenshots(page, "coa-account-create", locale);
      const created = await capture(createAccount.POST, () =>
        createView
          .getByRole("button", {
            name: createT("post.widget.save"),
            exact: true,
          })
          .click(),
      );
      expect(created.response).toMatchObject({
        success: true,
        data: { code_out: accountCode, name_out: accountName },
      });
      const [account] = await db
        .select()
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, companyId),
            eq(accountNodes.code, accountCode),
          ),
        );
      expect(account).toMatchObject({
        name: accountName,
        isActive: true,
        subtype: AccountSubtype.CURRENT_ASSET,
      });
      if (!account) return;
      await createView
        .getByRole("button", {
          name: createT("post.widget.viewButton"),
          exact: true,
        })
        .waitFor();

      const updateView = page.locator("#admin-tool-coa-account-update");
      const name = updateView.getByRole("textbox", {
        name: updateT("patch.name.label"),
      });
      await goto(
        `/tools/coa-account-update?arg.accountId=${account.id}`,
        locale,
      );
      await name.waitFor();
      await updateView
        .getByRole("heading", { name: `${accountCode} · ${accountName}` })
        .waitFor();
      expect(await name.inputValue()).toBe(accountName);
      await name.fill(revisedName);
      await saveAdminReviewScreenshots(page, "coa-account-update", locale);
      const updated = await capture(updateAccount.PATCH, () =>
        updateView
          .getByRole("button", { name: updateT("patch.widget.submit") })
          .click(),
      );
      expect(updated.response).toMatchObject({
        success: true,
        data: { updated: true },
      });
      await updateView
        .getByText(updateT("patch.widget.successTitle"), { exact: true })
        .first()
        .waitFor();

      const deactivationView = page.locator(
        "#admin-tool-coa-account-deactivate",
      );
      const confirm = deactivationView.getByRole("button", {
        name: deactivateT("post.widget.confirmButton"),
        exact: true,
      });
      await goto(
        `/tools/coa-account-deactivate?arg.accountId=${account.id}`,
        locale,
      );
      await confirm.waitFor();
      await deactivationView
        .getByText(`${accountCode} · ${revisedName}`, { exact: true })
        .waitFor();
      await saveAdminReviewScreenshots(page, "coa-account-deactivate", locale);
      const deactivated = await capture(deactivateAccount.POST, () =>
        confirm.click(),
      );
      expect(deactivated.response).toMatchObject({
        success: true,
        data: { deactivated: true },
      });
      await deactivationView
        .getByText(deactivateT("post.widget.doneLabel"), { exact: true })
        .first()
        .waitFor();
      const [closed] = await db
        .select()
        .from(accountNodes)
        .where(eq(accountNodes.id, account.id));
      expect(closed).toMatchObject({ name: revisedName, isActive: false });
    },
    120_000,
  );

  e2e.it(
    "opens an accounting period, drills into it and exports statutory statements",
    async (fixtures) => {
      const { page, capture, goto } = fixtures;
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "Carpathian Bookkeeping",
      );
      await db
        .update(companies)
        .set({ country: "SK" })
        .where(eq(companies.id, companyId));
      const company = `arg.companyId=${companyId}`;
      const { t: periodT } =
        createPeriod.POST.scopedTranslation.scopedT(locale);
      const { t: statementsT } =
        statements.GET.scopedTranslation.scopedT(locale);
      const createView = page.locator("#admin-tool-coa-period-create");
      const name = createView.getByRole("textbox", {
        name: periodT("post.name.label"),
      });
      const periodName = "Quarterly close 2031";
      await goto(`/tools/coa-period-create?${company}`, locale);
      await name.waitFor();
      await name.fill(periodName);
      await createView
        .getByRole("textbox", {
          name: periodT("post.startDate.label"),
          exact: true,
        })
        .fill("2031-01-01");
      await createView
        .getByRole("textbox", {
          name: periodT("post.endDate.label"),
          exact: true,
        })
        .fill("2031-03-31");
      await name.focus();
      await saveAdminReviewScreenshots(page, "coa-period-create", locale);
      const created = await capture(createPeriod.POST, () =>
        createView
          .getByRole("button", {
            name: periodT("post.titleShort"),
            exact: true,
          })
          .click(),
      );
      expect(created.response).toMatchObject({
        success: true,
        data: { name_out: periodName },
      });
      const [period] = await db
        .select()
        .from(accountingPeriods)
        .where(eq(accountingPeriods.companyId, companyId));
      expect(period).toMatchObject({
        name: periodName,
        status: PeriodStatus.OPEN,
        startDate: new Date("2031-01-01"),
        endDate: new Date("2031-03-31"),
      });

      const periodView = page.locator("#admin-tool-coa-period-list");
      const periodRow = periodView.getByRole("button", { name: periodName });
      await goto(`/tools/coa-period-list?${company}`, locale);
      await periodRow.waitFor();
      await saveAdminReviewScreenshots(page, "coa-period-list", locale);
      await periodRow.focus();
      await periodRow.press("Enter");
      await page
        .locator("#admin-tool-coa-period-get")
        .getByText(periodName, { exact: true })
        .first()
        .waitFor();

      const priorYear = new Date().getUTCFullYear() - 1;
      await db.insert(accountingPeriods).values({
        companyId,
        name: `Fiscal year ${priorYear}`,
        startDate: new Date(Date.UTC(priorYear, 0, 1)),
        endDate: new Date(Date.UTC(priorYear, 11, 31)),
      });
      await db.insert(accountNodes).values([
        { companyId, code: "221", name: "Operating bank", type: AccountType.ASSET, subtype: AccountSubtype.BANK },
        { companyId, code: "602", name: "Service revenue", type: AccountType.REVENUE, subtype: AccountSubtype.REVENUE_SERVICE },
      ]);
      const posted = await db.transaction((tx) => postJournalEntry({
        companyId,
        date: new Date(Date.UTC(priorYear, 9, 4)),
        description: "Monthly bookkeeping services",
        sourceType: JournalSourceType.MANUAL,
        sourceId: randomUUID(),
        postedByUserId: userId,
        lines: [
          { subtype: AccountSubtype.BANK, type: LineType.DEBIT, amount: 1875, currency: "EUR" },
          { subtype: AccountSubtype.REVENUE_SERVICE, type: LineType.CREDIT, amount: 1875, currency: "EUR" },
        ],
        logger: createEndpointLogger(false, locale),
      }, tx));
      expect(posted).toBeTruthy();

      const report = page.locator("#admin-tool-coa-statutory-statements");
      const download = report.getByRole("button", {
        name: statementsT("widget.download"),
        exact: true,
      });
      await goto(`/tools/coa-statutory-statements?${company}`, locale);
      await download.waitFor();
      await report.getByText(formatMoney(1875, "EUR", locale), { exact: true }).first().waitFor();
      await page.setViewportSize({ width: 390, height: 844 });
      const totalAssets = report.getByText("Total assets", { exact: true }).filter({ visible: true });
      await totalAssets.waitFor();
      expect((await totalAssets.boundingBox())?.height).toBeLessThan(40);
      await page.setViewportSize({ width: 1440, height: 900 });
      await saveAdminReviewScreenshots(
        page,
        "coa-statutory-statements",
        locale,
      );
      const [result] = await Promise.all([
        page.waitForResponse((reply) => {
          const url = new URL(reply.url());
          return (
            reply.ok() &&
            url.pathname.endsWith("/reports/statutory-statements") &&
            url.searchParams.has("from")
          );
        }),
        report
          .getByRole("radio", {
            name: t("reports.widget.previousMonth"),
            exact: true,
          })
          .click(),
      ]);
      expect(await result.json()).toMatchObject({
        success: true,
        data: { reportCompanyId: companyId, available: true },
      });
      const [file] = await Promise.all([
        page.waitForEvent("download"),
        download.click(),
      ]);
      expect(file.suggestedFilename()).toMatch(
        /^statutory-statements-.+\.csv$/u,
      );
      expect(await readFile(await file.path(), "utf8")).toContain(
        statementsT("csv.statement"),
      );
    },
    120_000,
  );
});
