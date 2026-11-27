import { randomUUID } from "node:crypto";

import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Response, Route } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import { workspaceCompanyCookieName } from "@/companies/_shared/workspace-company";
import { scopedTranslation as helpTranslation } from "@/vibe/help-tool/i18n";
import { scopedTranslation as documentsTranslation } from "@/finance/i18n";

import { accountNodes, accountingPeriods } from "../db";
import {
  AccountSubtype,
  AccountType,
  JournalSourceType,
  LineType,
} from "../enum";
import { scopedTranslation } from "../i18n";
import { type AutoPostLine, postJournalEntry } from "../shared/auto-post";
import {
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "../tests/atlas-workflow-fixture";
import balance from "./balance-sheet/definition";
import profit from "./profit-loss/definition";
import tax from "./tax-report/definition";
import trial from "./trial-balance/definition";

const reports = [
  {
    definition: balance.GET,
    prompt: "balanceSheet.widget.selectCompany",
    key: "balance-sheet",
  },
  {
    definition: trial.GET,
    prompt: "trialBalance.widget.selectCompany",
    key: "trial-balance",
  },
  {
    definition: profit.GET,
    prompt: "profitLoss.widget.selectCompany",
    key: "profit-loss",
  },
  {
    definition: tax.GET,
    prompt: "taxReport.widget.selectCompany",
    key: "tax-report",
  },
] as const;

async function seedVatMovements(
  companyId: string,
  userId: string,
): Promise<void> {
  const date = new Date();
  const year = date.getUTCFullYear();
  await db.insert(accountingPeriods).values({
    companyId,
    name: "Fixture fiscal year",
    startDate: new Date(Date.UTC(year, 0, 1)),
    endDate: new Date(Date.UTC(year, 11, 31)),
  });
  await db.insert(accountNodes).values([
    {
      companyId,
      code: "1000",
      name: "Fixture bank",
      type: AccountType.ASSET,
      subtype: AccountSubtype.BANK,
    },
    {
      companyId,
      code: "1570",
      name: "Fixture input VAT 7",
      type: AccountType.ASSET,
      subtype: AccountSubtype.VAT_RECEIVABLE,
    },
    {
      companyId,
      code: "1770",
      name: "Fixture output VAT 19",
      type: AccountType.LIABILITY,
      subtype: AccountSubtype.VAT_PAYABLE,
    },
    {
      companyId,
      code: "4000",
      name: "Fixture sales",
      type: AccountType.REVENUE,
      subtype: AccountSubtype.REVENUE_SERVICE,
    },
    {
      companyId,
      code: "6000",
      name: "Fixture expense",
      type: AccountType.EXPENSE,
      subtype: AccountSubtype.OPEX,
    },
  ]);
  const line = (
    subtype: AutoPostLine["subtype"],
    type: AutoPostLine["type"],
    amount: number,
  ): AutoPostLine => ({ subtype, type, amount, currency: "EUR" });
  const logger = createEndpointLogger(false, "en-US");
  for (const [description, lines] of [
    [
      "Fixture taxable sale",
      [
        line(AccountSubtype.BANK, LineType.DEBIT, 120),
        line(AccountSubtype.REVENUE_SERVICE, LineType.CREDIT, 100),
        line(AccountSubtype.VAT_PAYABLE, LineType.CREDIT, 20),
      ],
    ],
    [
      "Fixture taxable purchase",
      [
        line(AccountSubtype.OPEX, LineType.DEBIT, 25),
        line(AccountSubtype.VAT_RECEIVABLE, LineType.DEBIT, 5),
        line(AccountSubtype.BANK, LineType.CREDIT, 30),
      ],
    ],
    [
      "Fixture taxable customer refund",
      [
        line(AccountSubtype.REVENUE_SERVICE, LineType.DEBIT, 5),
        line(AccountSubtype.VAT_PAYABLE, LineType.DEBIT, 1),
        line(AccountSubtype.BANK, LineType.CREDIT, 6),
      ],
    ],
    [
      "Fixture taxable supplier refund",
      [
        line(AccountSubtype.BANK, LineType.DEBIT, 1.5),
        line(AccountSubtype.OPEX, LineType.CREDIT, 1.25),
        line(AccountSubtype.VAT_RECEIVABLE, LineType.CREDIT, 0.25),
      ],
    ],
  ] as const) {
    const entry = await db.transaction((tx) =>
      postJournalEntry(
        {
          companyId,
          date,
          description,
          sourceType: JournalSourceType.MANUAL,
          sourceId: randomUUID(),
          postedByUserId: userId,
          lines: [...lines],
          logger,
        },
        tx,
      ),
    );
    expect(entry).toBeTruthy();
  }
}

describe("Ledger report company selection", () => {
  const e2e = useE2E("ledger-report-company-selection");

  e2e.it(
    "restores the company in the shared header and retries an unavailable tax read",
    async (fixtures) => {
      const { baseUrl, page } = fixtures;
      const companyName = "Disposable Ledger Report Workshop";
      const account = await createTestUser(
        fixtures.uniqueEmail("ledger-report-admin"),
        "Ledger report test admin",
      );
      if (!account.success) {
        expect.fail(account.message);
      }
      const identity = account.data.user;
      fixtures.cleanup(async () => {
        await deleteTestUser(identity.id);
      });
      await db
        .insert(userRoles)
        .values({ userId: identity.id, role: UserRole.ADMIN });
      const owner = { ...identity, roles: [...identity.roles, UserRole.ADMIN] };
      const alternative = await prepareAtlasCompany(
        fixtures,
        "Disposable Alternative Ledger",
        owner,
      );
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        companyName,
        owner,
      );
      await seedVatMovements(companyId, identity.id);
      await seedVatMovements(alternative.companyId, identity.id);
      const taxSchema = z.object({
        success: z.literal(true),
        data: tax.GET.responseSchema,
      });
      const schema = z.object({
        success: z.literal(true),
        data: z.object({
          reportCompanyId: z.string(),
          reportCurrency: z.string(),
        }),
      });
      const capture = process.env["REPORT_COMPANY_SHOTS"] === "1";
      const taxOnly = process.env["REPORT_TAX_ONLY"] === "1";
      const failure = {
        status: 503,
        json: {
          success: false,
          message: "Disposable report outage",
          errorType: { ...ErrorResponseTypes.UNKNOWN_ERROR, errorCode: 503 },
        },
      };

      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const { t: docs } = documentsTranslation.scopedT(locale);
        const { t: help } = helpTranslation.scopedT(locale);
        for (const report of reports.filter(
          ({ key }) => !taxOnly || key === "tax-report",
        )) {
          await fixtures.context.addCookies([
            {
              name: workspaceCompanyCookieName(identity.id),
              value: alternative.companyId,
              url: baseUrl,
            },
          ]);
          const reportSlug = endpointToUrlSegment(report.definition);
          const endpointPath = "/" + report.definition.path.join("/");
          const api = `**/api/${locale}${endpointPath}*`;
          const isTax = report.key === "tax-report";
          const held = Promise.withResolvers<Route>();
          let holdNext = isTax;
          let unavailable = isTax;
          if (isTax) {
            await page.route(api, async (route) => {
              const company = new URL(route.request().url()).searchParams.get(
                "companyId",
              );
              if (company === companyId && holdNext) {
                holdNext = false;
                held.resolve(route);
                return;
              }
              if (company === companyId && unavailable) {
                await route.fulfill(failure);
                return;
              }
              await route.continue();
            });
          }

          await page.setViewportSize({ width: 390, height: 844 });
          const response = await page.goto(
            `${baseUrl}/${locale}/tools/${reportSlug}`,
            { waitUntil: "commit", timeout: 60_000 },
          );
          expect(response?.ok()).toBe(true);
          await page
            .locator('#admin-tools-toolbar[data-admin-ready="true"]')
            .waitFor();
          const view = page.locator(`#admin-tool-${reportSlug}`);
          const prompt = view.getByText(t(report.prompt), { exact: true });
          const picker = page.locator("#erp-company-switch");
          expect(await picker.textContent()).toContain(
            "Disposable Alternative Ledger",
          );
          expect(
            await view
              .getByRole("button", {
                name: docs("documents.chooseCompany"),
                exact: true,
              })
              .count(),
          ).toBe(0);
          await picker.click();
          const reportResponse = (): Promise<Response> =>
            page.waitForResponse(
              (reply) => {
                const url = new URL(reply.url());
                return (
                  reply.ok() &&
                  url.pathname.endsWith(endpointPath) &&
                  url.searchParams.get("companyId") === companyId
                );
              },
              { timeout: 60_000 },
            );
          const companyOption = page
            .getByRole("menuitemradio")
            .filter({ hasText: companyName });
          const firstResult = isTax
            ? undefined
            : Promise.all([reportResponse(), companyOption.click()]);

          if (isTax) {
            await companyOption.click();
            await view
              .getByText(t("reports.widget.running"), { exact: true })
              .waitFor();
            const heldRequest = await held.promise;
            if (capture) {
              await saveAdminViewMatrix(
                page,
                "ledger-report-company-states",
                `tax-loading-${locale}`,
              );
            }
            await heldRequest.fulfill(failure);
            const retry = view.getByRole("button", {
              name: t("reports.widget.retry"),
              exact: true,
            });
            await retry.waitFor();
            await view
              .getByRole("heading", {
                name: t("reports.widget.loadError"),
                exact: true,
              })
              .waitFor();
            if (capture) {
              await saveAdminViewMatrix(
                page,
                "ledger-report-company-states",
                `tax-error-${locale}`,
              );
            }
            unavailable = false;
            const retried = reportResponse();
            await retry.click();
            expect(
              taxSchema.parse(await (await retried).json()).data,
            ).toMatchObject({
              reportCompanyId: companyId,
              reportCompanyName: companyName,
              reportCurrency: "EUR",
              vatCollected: 19,
              vatReclaimable: 4.75,
              netVatPayable: 14.25,
              lines: [
                {
                  taxRateCode: "1570",
                  direction: "input",
                  taxAmount: 4.75,
                  rate: null,
                  netAmount: null,
                },
                {
                  taxRateCode: "1770",
                  direction: "output",
                  taxAmount: 19,
                  rate: null,
                  netAmount: null,
                },
              ],
            });
            await page
              .getByRole("button", {
                name: help("erp.companySwitch.current", { name: companyName }),
                exact: true,
              })
              .waitFor();
            const payable = view.getByRole("heading", {
              name: t("taxReport.response.netVatPayable"),
              exact: true,
            });
            await payable.waitFor();
            const box = await payable.boundingBox();
            expect(box && box.y >= 0 && box.y + box.height < 844).toBe(true);
            await view
              .getByText(formatMoney(14.25, "EUR", locale), { exact: true })
              .waitFor();
            const summary = payable.locator("xpath=../..");
            const outputVat = await summary
              .getByText(formatMoney(19, "EUR", locale), { exact: true })
              .boundingBox();
            const inputVat = await summary
              .getByText(formatMoney(4.75, "EUR", locale), { exact: true })
              .boundingBox();
            expect(
              outputVat && inputVat && Math.abs(outputVat.y - inputVat.y) <= 1,
            ).toBe(true);
            const filters = view.getByRole("button", {
              name: t("taxReport.widget.filters"),
              exact: true,
            });
            expect(await filters.getAttribute("aria-expanded")).toBe("false");
            await filters.click();
            expect(await filters.getAttribute("aria-expanded")).toBe("true");
            await filters.click();
            await page.unroute(api);
          } else if (firstResult) {
            const [selectedReport] = await firstResult;
            expect(schema.parse(await selectedReport.json()).data).toEqual({
              reportCompanyId: companyId,
              reportCurrency: "EUR",
            });
          }

          await view
            .getByText(`${t("reports.currency")} EUR`, { exact: true })
            .waitFor();
          expect(await prompt.count()).toBe(0);
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          ).toBe(true);
          if (capture && isTax) {
            await saveAdminViewMatrix(
              page,
              "ledger-report-company-states",
              `tax-ready-${locale}`,
            );
          }
        }
      }
    },
    240_000,
  );

  e2e.it(
    "localizes balance sheet subtype labels and opens the matching account ledger",
    async (fixtures) => {
      const { page, goto } = fixtures;
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "Northbridge Accounting",
      );
      await seedVatMovements(companyId, userId);
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        await page.setViewportSize({ width: 1440, height: 900 });
        await goto(`/tools/coa-balance-sheet?arg.companyId=${companyId}`, locale);
        const view = page.locator("#admin-tool-coa-balance-sheet");
        await view.getByText(t(AccountSubtype.BANK), { exact: true }).waitFor();
        await view.getByText(t(AccountSubtype.VAT_PAYABLE), { exact: true }).waitFor();
        await view.getByText(t("balanceSheet.widget.balanced"), { exact: true }).waitFor();
        expect(await view.getByText(/enums\.accountSubtype/u).count()).toBe(0);
        await saveAdminReviewScreenshots(page, "coa-balance-sheet", locale);
        if (locale === "en-US") {
          await view.getByRole("button", { name: "1000", exact: true }).click();
          await page.locator("#admin-tool-coa-ledger").getByText(formatMoney(85.5, "EUR", locale), { exact: true }).first().waitFor();
        }
      }
    },
    120_000,
  );
});
