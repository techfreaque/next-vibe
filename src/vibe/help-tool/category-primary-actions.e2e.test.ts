import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import platformSummary from "@/analytics/business/summary/definition";
import { accountNodes, accountingPeriods } from "@/chart-of-accounts/db";
import accountingDashboard from "@/chart-of-accounts/dashboard/definition";
import { AccountSubtype, AccountType, PeriodStatus } from "@/chart-of-accounts/enum";
import { companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import {
  getAtlasFixture,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { CATEGORY_REGISTRY } from "@/generated/categories/registry";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import createInvoice from "@/payment/invoice/create/definition";
import { purchaseOrderLines, purchaseOrders, purchasingVendors } from "@/purchasing/db";
import { scopedTranslation as purchasingCopy } from "@/purchasing/i18n";
import createOrder from "@/purchasing/order/create/definition";
import createSkill from "@/vibe/agent/skills/create/definition";
import { scopedTranslation as aiCopy } from "@/vibe/agent/summary/i18n";

import definitions from "./definition";
import { scopedTranslation } from "./i18n";
import { localizedLabel } from "./localized-label";

const catalogResponse = z.object({
  success: z.literal(true),
  data: definitions.GET.responseSchema,
});

const cases = [
  { key: "ai", primary: "skill-create", destination: "models" },
  { key: "analytics", primary: null, destination: "acquisition-report" },
] as const;

describe("category landing primary actions", () => {
  const e2e = useE2E("admin-category-primary-actions");

  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`shows a single creation action or none in ${locale}`, async (fixture) => {
      const { page, baseUrl } = fixture;
      const { headers } = await prepareAtlasCompany(fixture, "Fixture category books");
      const response = await getAtlasFixture(
        `${baseUrl}/api/${locale}/vibe/help-tool`, {}, headers,
      );
      expect(response.status).toBe(200);
      const catalog = catalogResponse.parse(await response.json()).data;
      const { t } = scopedTranslation.scopedT(locale);
      await page.route(/\/api\//, async (route) => {
        if (route.request().method() === "GET") {
          await route.continue();
          return;
        }
        await route.abort();
      });
      for (const { key, primary, destination } of cases) {
        const category = CATEGORY_REGISTRY.find((entry) => entry.key === key);
        const landing = catalog.adminCategoryLandings?.[key];
        expect(category).toBeDefined();
        expect(landing).toBeDefined();
        if (!category || !landing) {
          return;
        }
        expect(landing.actions.map(({ alias }) => alias)).toEqual(primary ? [primary] : []);
        const destinationEntry = landing.destinations.find(({ alias }) => alias === destination);
        expect(destinationEntry).toBeDefined();
        if (!destinationEntry) {
          return;
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await fixture.goto(`/tools?cat=${key}`, locale);
        const toolbar = page.locator('#admin-tools-toolbar[data-admin-ready="true"]');
        await toolbar.waitFor();
        const heading = page.getByRole("heading", {
          level: 1,
          name: landing.heading ?? localizedLabel(category.labels, locale) ?? category.label,
          exact: true,
        });
        await heading.waitFor();
        const headerRow = heading.locator("xpath=../../..");
        const destinations = page.getByRole("heading", {
          name: t("admin.destinations"), exact: true,
        }).locator("xpath=..");
        const destinationButton = destinations.getByRole("button").filter({
          has: page.getByText(destinationEntry.title, { exact: true }),
        });
        await destinationButton.waitFor();
        expect(await destinationButton.count()).toBe(1);
        const headerButtons = headerRow.getByRole("button");
        expect(await headerButtons.count()).toBe(primary ? 1 : 0);

        if (process.env["CATEGORY_PRIMARY_SHOTS"] === "1") {
          const busy = page.locator('[aria-busy="true"]');
          const loadingOverview = key === "analytics"
            ? busy
            : busy.filter({
                has: page.getByText(
                  t("aiTools.modal.loading"),
                  { exact: true },
                ),
              });
          await loadingOverview.first().waitFor({ state: "hidden", timeout: 25_000 });
          await page.evaluate(() => window.scrollTo(0, 0));
          await saveAdminViewMatrix(page, "category-primary-actions", `${key}-${locale}`);
        }
        if (primary) {
          expect(await headerButtons.first().innerText()).toBe(landing.actions[0]?.title);
          await headerButtons.first().click();
        } else {
          await destinationButton.click();
        }
        await page.waitForURL((url) => url.pathname.endsWith(`/tools/${primary ?? destination}`));
      }
    });

    e2e.it(`selects the accounting action for the active company in ${locale}`, async (fixture) => {
      const { page, baseUrl } = fixture;
      const states = [
        { name: "Fixture no chart", alias: "coa-setup" },
        { name: "Fixture no period", alias: "coa-period-create" },
        { name: "Fixture ready books", alias: "coa-journal-create" },
      ] as const;
      const empty = await prepareAtlasCompany(fixture, states[0].name);
      const needsPeriod = await prepareAtlasCompany(fixture, states[1].name);
      const ready = await prepareAtlasCompany(fixture, states[2].name);
      const restricted = await prepareAtlasCompany(fixture, "Fixture viewer books");
      await db.update(companyMembers)
        .set({ role: CompanyMemberRole.VIEWER })
        .where(and(
          eq(companyMembers.companyId, restricted.companyId),
          eq(companyMembers.userId, restricted.userId),
        ));
      await db.insert(accountNodes).values([needsPeriod, ready, restricted].map(({ companyId }) => ({
        companyId,
        code: "1000",
        name: "Fixture bank",
        type: AccountType.ASSET,
        subtype: AccountSubtype.BANK,
      })));
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth();
      await db.insert(accountingPeriods).values([ready, restricted].map(({ companyId }) => ({
        companyId,
        name: "Fixture open period",
        status: PeriodStatus.OPEN,
        startDate: new Date(Date.UTC(year, month, 1)),
        endDate: new Date(Date.UTC(year, month + 1, 0)),
      })));
      const path = `/api/${locale}/chart-of-accounts/dashboard`;
      const dashboardResponse = z.object({ success: z.literal(true), data: accountingDashboard.GET.responseSchema });
      for (const [index, company] of [empty, needsPeriod, ready, restricted].entries()) {
        const response = await getAtlasFixture(`${baseUrl}${path}`, { companyId: company.companyId }, restricted.headers);
        expect(response.status).toBe(200);
        const data = dashboardResponse.parse(await response.json()).data;
        expect(data.selectedCompanyId).toBe(company.companyId);
        expect(data.primaryActionAlias).toBe(states[index]?.alias);
      }

      const response = await getAtlasFixture(`${baseUrl}/api/${locale}/vibe/help-tool`, {}, restricted.headers);
      expect(response.status).toBe(200);
      const landing = catalogResponse.parse(await response.json()).data.adminCategoryLandings?.["accounting"];
      expect(landing?.contextualActions).toBe(true);
      expect(landing?.actions.map(({ alias }) => alias)).toEqual(states.map(({ alias }) => alias));
      if (!landing) {
        return;
      }
      const origin = new URL(baseUrl).origin;
      const reportPath = (url: URL): boolean =>
        url.origin === origin && url.pathname === path;
      await page.route(
        reportPath,
        async (route) => {
          await route.continue({
            headers: { ...route.request().headers(), authorization: restricted.headers.authorization },
          });
        },
      );
      const { t } = scopedTranslation.scopedT(locale);
      const category = CATEGORY_REGISTRY.find((entry) => entry.key === "accounting");
      expect(category).toBeDefined();
      if (!category) {
        return;
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await fixture.goto("/tools?cat=accounting", locale);
      const toolbar = page.locator('#admin-tools-toolbar[data-admin-ready="true"]');
      await toolbar.waitFor();
      const headerRow = page.getByRole("heading", {
        level: 1,
        name: localizedLabel(category.labels, locale) ?? category.label,
        exact: true,
      }).locator("xpath=../../..");
      let companyMenu = toolbar.locator("#erp-company-switch");
      const selections = [
        states[0],
        states[1],
        { name: "Fixture viewer books", alias: undefined },
        states[2],
      ];
      for (const { name, alias } of selections) {
        const [overview] = await Promise.all([
          page.waitForResponse((result) => reportPath(new URL(result.url()))),
          (async (): Promise<void> => {
            await companyMenu.click();
            await page.getByRole("menuitemradio").filter({ hasText: name }).click();
          })(),
        ]);
        expect(overview.status()).toBe(200);
        companyMenu = toolbar.getByRole("button", {
          name: t("erp.companySwitch.current", { name }), exact: true,
        });
        await companyMenu.waitFor();
        if (!alias) {
          await page.getByText("Fixture open period", { exact: true }).first().waitFor();
          expect(await headerRow.getByRole("button").count()).toBe(0);
          continue;
        }
        const title = landing.actions.find((action) => action.alias === alias)?.title;
        expect(title).toBeDefined();
        if (!title) {
          return;
        }
        const action = headerRow.getByRole("button", { name: title, exact: true });
        const readyForShot = async (): Promise<void> => {
          await action.waitFor();
          expect(await headerRow.getByRole("button").count()).toBe(1);
        };
        await readyForShot();
        if (process.env["CATEGORY_PRIMARY_SHOTS"] === "1") {
          await saveAdminViewMatrix(page, "category-primary-actions", `accounting-${alias}-${locale}`, readyForShot);
        }
        if (alias === "coa-journal-create") {
          await action.click();
          await page.waitForURL((url) => url.pathname.endsWith(`/tools/${alias}`));
        }
      }
    }, 150_000);

    e2e.it(`keeps compact landing metrics and their actions readable in ${locale}`, async (fixture) => {
      const { page, cleanup } = fixture;
      const company = await prepareAtlasCompany(fixture, "Fixture KPI workshop");
      const vendorId = crypto.randomUUID();
      const orderId = crypto.randomUUID();
      cleanup(async () => {
        await db.delete(purchaseOrders).where(eq(purchaseOrders.companyId, company.companyId));
        await db.delete(purchasingVendors).where(eq(purchasingVendors.id, vendorId));
      });
      await db.insert(purchasingVendors).values({
        id: vendorId, companyId: company.companyId, name: "Fixture KPI supplier",
      });
      await db.insert(purchaseOrders).values({
        id: orderId,
        companyId: company.companyId,
        createdByUserId: company.userId,
        vendorId,
        poNumber: "PO-KPI-101",
        status: "CONFIRMED",
        currency: "EUR",
        subtotal: 123_456.78,
        total: 123_456.78,
      });
      await db.insert(purchaseOrderLines).values({
        poId: orderId,
        description: "Fixture bulk order",
        quantity: 1,
        unitPrice: 123_456.78,
        lineTotal: 123_456.78,
      });
      const buyer = await createTestUser(`${crypto.randomUUID()}@reporting-fixture.test`);
      expect(buyer.success).toBe(true);
      if (!buyer.success) {
        return;
      }
      const buyerId = buyer.data.user.id;
      cleanup(async () => { await deleteTestUser(buyerId); });
      await db.insert(paymentTransactions).values({
        userId: buyerId,
        amount: "123456.78",
        currency: "USD",
        status: PaymentStatus.SUCCEEDED,
      });

      const { t } = scopedTranslation.scopedT(locale);
      const { t: purchasingT } = purchasingCopy.scopedT(locale);
      const { t: aiT } = aiCopy.scopedT(locale);
      const summaryPath = `/api/${locale}/analytics/business/summary`;
      const summarySchema = z.object({
        success: z.literal(true),
        data: platformSummary.GET.responseSchema,
      });
      const casesToVerify = [
        { key: "ai", route: "skill-create", label: aiT("models"),
          actionLabel: createSkill.POST.scopedTranslation.scopedT(locale).t(createSkill.POST.titleShort ?? createSkill.POST.title) },
        { key: "purchasing", route: "purchasing/order/create/POST", label: purchasingT("dashboard.get.widget.kpiDraft"),
          actionLabel: purchasingT(createOrder.POST.titleShort ?? createOrder.POST.title) },
        { key: "payments", route: "payment/invoice/create/POST", label: undefined,
          actionLabel: createInvoice.POST.scopedTranslation.scopedT(locale).t(createInvoice.POST.titleShort ?? createInvoice.POST.title) },
      ] as const;
      for (const { key, route, label, actionLabel } of casesToVerify) {
        await page.setViewportSize({ width: 390, height: 844 });
        let paymentFigure: string | undefined;
        if (key === "payments") {
          const [summary] = await Promise.all([
            page.waitForResponse((reply) => {
              const url = new URL(reply.url());
              return reply.ok() && url.pathname === summaryPath &&
                url.searchParams.get("section") === "payments";
            }, { timeout: 55_000 }),
            fixture.goto(`/tools?cat=${key}`, locale),
          ]);
          const gross = summarySchema.parse(await summary.json()).data.summary.kpis
            .find(({ label: metric }) => metric === "platformSummary.grossReceipts");
          expect(gross?.value).toBeGreaterThanOrEqual(123_456.78);
          if (typeof gross?.value === "number") {
            paymentFigure = formatMoney(gross.value, gross.currency, locale);
          }
        } else {
          await fixture.goto(`/tools?cat=${key}`, locale);
        }
        const toolbar = page.locator('#admin-tools-toolbar[data-admin-ready="true"]');
        await toolbar.waitFor();
        if (key === "purchasing") {
          await toolbar.locator("#erp-company-switch").click();
          await page.getByRole("menuitemradio").filter({ hasText: "Fixture KPI workshop" }).click();
        }
        const action = page.getByRole("button", { name: actionLabel, exact: true }).first();
        const ready = async (): Promise<void> => {
          await action.waitFor();
          if (label) {
            await page.getByText(label, { exact: true }).filter({ visible: true }).first().waitFor();
          }
          const mobile = (page.viewportSize()?.width ?? 0) === 390;
          const amount = key === "purchasing"
            ? formatMoney(123_456.78, "EUR", locale)
            : key === "payments" ? paymentFigure : undefined;
          if (amount) {
            const amountScope = key === "purchasing"
              ? page.getByText(`${purchasingT("dashboard.get.widget.openValue")} · EUR`, { exact: true })
                  .locator("xpath=../..")
              : page;
            const value = amountScope.getByText(amount, { exact: true }).filter({ visible: true }).first();
            await value.waitFor();
            expect(await value.evaluate((node) => {
              const card = node.closest("button") ?? node.parentElement?.parentElement;
              const bounds = card?.getBoundingClientRect();
              const range = node.ownerDocument.createRange();
              range.selectNodeContents(node);
              const lines = [...range.getClientRects()];
              return Boolean(bounds && lines.length && lines.every((line) =>
                line.left >= bounds.left - 1 && line.right <= bounds.right + 1,
              ));
            })).toBe(true);
          }
          if (mobile && key === "ai") {
            const counts = await Promise.all([
              page.getByText(aiT("models"), { exact: true }).boundingBox(),
              page.getByText(aiT("providers"), { exact: true }).boundingBox(),
            ]);
            expect(counts[0]?.y).toBe(counts[1]?.y);
          }
          if (mobile && key === "purchasing") {
            const draft = await page.getByText(purchasingT("dashboard.get.widget.kpiDraft"), { exact: true }).boundingBox();
            const confirmed = await page.getByText(purchasingT("dashboard.get.widget.kpiConfirmed"), { exact: true }).boundingBox();
            expect(draft?.y).toBe(confirmed?.y);
            const links = await page.getByRole("heading", { name: t("admin.destinations"), exact: true }).boundingBox();
            expect(links?.y).toBeLessThan(844);
          }
        };
        await ready();
        if (process.env["CATEGORY_DENSITY_SHOTS"] === "1") {
          await saveAdminViewMatrix(page, "category-primary-actions", `r50-density-${key}-${locale.slice(0, 2)}`, ready);
        }
        await action.click();
        await page.waitForURL((url) => url.pathname.endsWith(`/tools/${route}`));
      }
    }, 150_000);
  }
});
