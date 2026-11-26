import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype } from "@/chart-of-accounts/enum";
import { scopedTranslation as chartTranslation } from "@/chart-of-accounts/i18n";
import { authAtlas, prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { workspaceCompanyCookieName } from "@/companies/_shared/workspace-company";
import { findDemoCompany } from "@/companies/demo-company.repository";
import { scopedTranslation as financeTranslation } from "@/finance/i18n";
import { reportDay, reportPeriodRange } from "@/finance/report-period";

const locale = "en-US";

describe("ERP workspace controls", () => {
  const e2e = useE2E("erp-workspace-period");

  const groups: readonly { name: string; tools: readonly string[] }[] = [
    {
      name: "checks accounting and monthly profit period controls",
      tools: [
        "finance-monthly-profit",
        "coa-profit-loss",
        "coa-balance-sheet",
        "coa-trial-balance",
        "coa-receivables-aging",
        "coa-payables-aging",
      ],
    },
    {
      name: "checks tax, journal export, supplier, and ledger period controls",
      tools: [
        "tax/report/GET",
        "company-tax-regime-view",
        "coa-tax-report",
        "coa-journal-export",
        "supplier-evidence",
        "coa-ledger",
      ],
    },
    {
      name: "checks business, payment, and credit analytics period controls",
      tools: ["business-overview", "revenue-report", "credit-usage-report"],
    },
  ];
  for (const group of groups) {
    e2e.it(
      group.name,
      async (fixtures) => {
        const { page, baseUrl } = fixtures;
        const admin = await resolveTestAdminUser();
        const demoCompany = await findDemoCompany();
        if (!demoCompany) {
          expect.fail("Run the ERP development seeds before this test");
        }
        const { id: companyId, name } = demoCompany;
        const headers = await authAtlas(fixtures, admin);
        await fixtures.context.addCookies([
          {
            name: workspaceCompanyCookieName(admin.id),
            value: companyId,
            url: baseUrl,
          },
        ]);
        await page.route(
          (url) =>
            url.origin === new URL(baseUrl).origin && url.pathname.startsWith(`/api/${locale}/`),
          async (route) => {
            await route.continue({ headers: { ...route.request().headers(), ...headers } });
          },
        );
        const chart = chartTranslation.scopedT(locale).t;
        const finance = financeTranslation.scopedT(locale).t;
        const previousMonth = chart("reports.widget.previousMonth");
        for (const alias of group.tools) {
          let path = `/tools/${alias}`;
          if (alias === "coa-ledger") {
            const [bank] = await db
              .select({ id: accountNodes.id })
              .from(accountNodes)
              .where(
                and(
                  eq(accountNodes.companyId, companyId),
                  eq(accountNodes.subtype, AccountSubtype.BANK),
                ),
              )
              .limit(1);
            expect(bank).toBeDefined();
            path += `?arg.accountId=${bank.id}`;
          }
          await fixtures.goto(path, locale);
          const view = page.locator(`[id="admin-tool-${alias}"]`);
          await view.waitFor({ timeout: 30_000 });
          if (alias === "coa-tax-report") {
            const filter = view.getByRole("button", {
              name: chart("taxReport.widget.filters"),
              exact: true,
            });
            if ((await filter.getAttribute("aria-expanded")) === "false") {
              await filter.click();
            }
          }
          const lastMonth = view.getByRole("radio", { name: previousMonth, exact: true });
          await lastMonth.waitFor({ timeout: 30_000 });
          if (alias === "finance-monthly-profit") {
            await view.getByText(finance("profit.net"), { exact: true }).first().waitFor();
            const expected = reportPeriodRange("lastMonth");
            const reply = page.waitForResponse((response) => {
              const url = new URL(response.url());
              return (
                url.pathname.endsWith("/finance/monthly-profit") &&
                url.searchParams.get("companyId") === companyId &&
                url.searchParams.get("from") === reportDay(expected.from) &&
                url.searchParams.get("to") === reportDay(expected.to)
              );
            });
            await lastMonth.click();
            expect((await reply).ok()).toBe(true);
            await view
              .getByRole("radio", { name: chart("reports.widget.customPeriod"), exact: true })
              .click();
            await view
              .getByRole("combobox", { name: finance("suppliers.month"), exact: true })
              .waitFor();
            await view.getByRole("button", { name: "Open calendar", exact: true }).first().click();
            await page.getByRole("grid").first().waitFor();
            await page.keyboard.press("Escape");
          } else {
            await lastMonth.click();
            await lastMonth.and(view.locator('[aria-checked="true"]')).waitFor();
          }
          if (
            !["business-overview", "revenue-report", "credit-usage-report", "coa-ledger"].includes(
              alias,
            )
          ) {
            await page.locator("#admin-tools-toolbar").getByText(name, { exact: true }).waitFor();
            expect(
              await view
                .getByRole("button", {
                  name: finance("documents.chooseCompany"),
                  exact: true,
                })
                .count(),
            ).toBe(0);
          }
        }
      },
      120_000,
    );
  }

  const examples: readonly [string, RegExp][] = [
    ["coa-account-list", /Processor Clearing/u],
    ["coa-journal-list", /Studio workshop sales/u],
    ["coa-period-list", /20[0-9]{2}-[0-9]{2}/u],
    ["products-catalog-list", /Studio Monthly Membership/u],
    ["products-category-list", /Physical Goods/u],
    ["payment-invoice-list", /DEMO-INV/u],
    ["payment-bill-list", /DEMO-AP/u],
    ["payment-estimate-list", /DEMO-Q/u],
    ["bank-statement-lines", /demo-[a-f0-9-]{36}/u],
    ["inventory-warehouses", /Main Warehouse/u],
    ["inventory-stock", /Laptop Stand/u],
    ["inventory-transfers", /DEMO-TR-001/u],
    ["purchasing-vendors", /Acme Supplies/u],
    ["purchasing-orders", /DEMO-PO-001/u],
    ["pos-terminals", /Main Register/u],
    ["pos-dashboard", /Main Register/u],
    ["tax-rate-list", /MwSt 19%/u],
  ];
  for (const [name, group] of [
    ["ledger and catalog samples", examples.slice(0, 5)],
    ["document, bank, and inventory samples", examples.slice(5, 12)],
    ["purchasing, POS, and tax samples", examples.slice(12)],
  ] as const) {
    e2e.it(
      name,
      async (fixtures) => {
        const { page, baseUrl } = fixtures;
        const admin = await resolveTestAdminUser();
        const company = await findDemoCompany();
        if (!company) {
          expect.fail("Run the ERP development seeds before this test");
        }
        const headers = await authAtlas(fixtures, admin);
        await fixtures.context.addCookies([
          {
            name: workspaceCompanyCookieName(admin.id),
            value: company.id,
            url: baseUrl,
          },
        ]);
        await page.route(
          (url) =>
            url.origin === new URL(baseUrl).origin && url.pathname.startsWith(`/api/${locale}/`),
          async (route) => {
            await route.continue({ headers: { ...route.request().headers(), ...headers } });
          },
        );
        for (const [alias, sample] of group) {
          const path = `/tools/${alias}`;
          const view = page.locator(`[id="admin-tool-${alias}"]`);
          await fixtures.goto(path, locale);
          try {
            await view.waitFor({ timeout: 12_000 });
          } catch {
            // Shared Atlas can reload its catalog during a generator refresh.
            await fixtures.goto(path, locale);
          }
          await view.getByText(sample).filter({ visible: true }).first().waitFor();
          expect(
            await view
              .getByRole("button", {
                name: financeTranslation.scopedT(locale).t("documents.chooseCompany"),
                exact: true,
              })
              .count(),
          ).toBe(0);
        }
      },
      120_000,
    );
  }

  e2e.it(
    "auto-selects a member's only company and remembers a switch when they join another",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const account = await createTestUser(
        fixtures.uniqueEmail("workspace-accountant"),
        "Workspace accountant",
      );
      if (!account.success) {
        expect.fail(account.message);
      }
      const user = account.data.user;
      fixtures.cleanup(async () => {
        await deleteTestUser(user.id);
      });
      await db.insert(userRoles).values({ userId: user.id, role: UserRole.PARTNER_ADMIN });
      const accountant = { ...user, roles: [...user.roles, UserRole.PARTNER_ADMIN] };
      const first = "Workspace Birch";
      const second = "Workspace Fern";
      let { headers } = await prepareAtlasCompany(fixtures, first, accountant);
      await page.route(
        (url) =>
          url.origin === new URL(baseUrl).origin && url.pathname.startsWith(`/api/${locale}/`),
        async (route) => {
          await route.continue({ headers: { ...route.request().headers(), ...headers } });
        },
      );
      const openReport = (): Promise<void> => fixtures.goto("/tools/coa-profit-loss", locale);
      const toolbar = page.locator("#admin-tools-toolbar");
      await openReport();
      await toolbar.getByText(first, { exact: true }).waitFor();
      expect(await toolbar.locator("#erp-company-switch").count()).toBe(0);

      ({ headers } = await prepareAtlasCompany(fixtures, second, accountant));
      await openReport();
      const switcher = toolbar.locator("#erp-company-switch");
      await switcher.click();
      await page.getByRole("menuitemradio").filter({ hasText: second }).click();
      await switcher.getByText(second, { exact: true }).waitFor();
      await openReport();
      await switcher.getByText(second, { exact: true }).waitFor();
    },
  );
});
