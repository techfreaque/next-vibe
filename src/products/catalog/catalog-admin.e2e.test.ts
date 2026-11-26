import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { sessions } from "next-vibe/identity/session/db";
import { userRoles } from "next-vibe/identity/user/db";
import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Page } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { stockLevels, warehouses } from "@/inventory/db";
import { paymentAccountingOffers } from "@/payment/accounting/db";
import { PaymentProvider } from "@/payment/enum";

import { catalogProducts, productPrices } from "../db";
import { ProductType } from "../enum";
import details from "./[productId]/get/definition";
import { scopedTranslation as detailTranslation } from "./[productId]/get/i18n";
import list from "./list/definition";
import { scopedTranslation as listTranslation } from "./list/i18n";

const locales = [
  { locale: "en-US", name: "en" },
  { locale: "de-DE", name: "de" },
  { locale: "sk-SK", name: "sk" },
] as const;

async function capture(page: Page, name: string, ready: () => Promise<void>): Promise<void> {
  if (process.env["PRODUCT_CATALOG_SHOTS"] !== "1") {
    return;
  }
  const root = "scratchpad/erp/shots/v2/products";
  await mkdir(root, { recursive: true });
  for (const { viewport, width, height } of [
    { viewport: "desktop", width: 1440, height: 900 },
    { viewport: "phone", width: 390, height: 844 },
  ]) {
    await page.setViewportSize({ width, height });
    for (const theme of ["light", "dark"] as const) {
      await page.evaluate((value) => {
        const key = "theme_v2";
        const oldValue = localStorage.getItem(key);
        localStorage.setItem(key, value);
        window.dispatchEvent(new StorageEvent("storage", { key, oldValue, newValue: value }));
      }, theme);
      await page.locator(`html.${theme}`).waitFor({ state: "attached" });
      await ready();
      await page.screenshot({ path: `${root}/${name}-${viewport}-${theme}.png` });
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}

describe("Product catalog administration on Atlas", () => {
  const e2e = useE2E("products/catalog-admin");
  for (const { locale, name } of locales) {
    e2e.it(`reviews configured services and physical stock in ${locale}`, async (fixture) => {
      const { page, baseUrl, cleanup } = fixture;
      const { userId, companyId, headers } = await prepareAtlasCompany(fixture, "Catalog studio fixture");
      const owner = atlasRequest(headers.authorization.slice("Bearer ".length), headers.cookie);
      const serviceId = randomUUID();
      const physicalId = randomUUID();
      const warehouseId = randomUUID();
      const offeringId = randomUUID();
      const serviceName = "000 Fixture monthly service";
      const physicalName = "001 Fixture warehouse item";
      const companyKey = `/api/${locale}/products/catalog/list`;
      const detailsKey = `/api/${locale}/products/catalog/${serviceId}/get`;
      const { t } = detailTranslation.scopedT(locale);
      const { t: listT } = listTranslation.scopedT(locale);

      let productOwner = userId;
      let coworkerHttp: ReturnType<typeof atlasRequest> | undefined;
      let coworkerId: string | undefined;
      if (name === "en") {
        const coworker = await createTestUser(fixture.uniqueEmail("catalog-coworker"), "Catalog coworker");
        expect(coworker.success).toBe(true);
        if (!coworker.success) {
          return;
        }
        coworkerId = coworker.data.user.id;
        const otherCompany = randomUUID();
        cleanup(async () => {
          await db.delete(companies).where(eq(companies.id, otherCompany));
          await deleteTestUser(coworker.data.user.id);
        });
        await db.insert(userRoles).values({ userId: coworkerId, role: UserPermissionRole.ADMIN });
        await db.insert(companies).values({
          id: otherCompany, ownerUserId: coworkerId,
          name: "Other catalog company fixture", type: CompanyType.B2B, currency: "EUR",
        });
        await db.insert(companyMembers).values({
          userId: coworkerId, companyId: otherCompany, role: CompanyMemberRole.OWNER,
        });
        const login = await createTestSessionToken({
          ...coworker.data.user,
          roles: [UserPermissionRole.ADMIN, ...coworker.data.user.roles],
        });
        expect(login.success).toBe(true);
        if (!login.success) {
          return;
        }
        cleanup(async () => { await db.delete(sessions).where(eq(sessions.token, login.data)); });
        coworkerHttp = atlasRequest(login.data);
        productOwner = coworkerId;
      }

      cleanup(async () => {
        await db.delete(paymentAccountingOffers).where(eq(paymentAccountingOffers.id, offeringId));
        await db.delete(warehouses).where(eq(warehouses.id, warehouseId));
        await db.delete(catalogProducts).where(eq(catalogProducts.id, serviceId));
        await db.delete(catalogProducts).where(eq(catalogProducts.id, physicalId));
      });
      await db.insert(catalogProducts).values([
        {
          id: serviceId, companyId, ownerUserId: productOwner, name: serviceName,
          type: ProductType.SERVICE, sku: "STUDIO-SVC-01", basePrice: 24.95, currency: "USD",
          defaultTaxRate: 0.2, isSubscription: true, billingInterval: "MONTHLY",
        },
        {
          id: physicalId, companyId, ownerUserId: userId, name: physicalName,
          type: ProductType.PHYSICAL, sku: "STUDIO-STOCK-01", basePrice: 7.5, currency: "EUR",
        },
      ]);
      await db.insert(productPrices).values({ productId: serviceId, price: 22.5, currency: "EUR", tierName: "Fixture regional tier" });
      await db.insert(warehouses).values({ id: warehouseId, companyId, name: "Fixture warehouse", code: "FIX-1" });
      await db.insert(stockLevels).values({ warehouseId, productId: physicalId, quantityOnHand: 17 });
      const receivable = randomUUID();
      const clearing = randomUUID();
      const revenue = randomUUID();
      await db.insert(accountNodes).values([
        { id: receivable, companyId, code: "1100", name: "Fixture receivable", type: AccountType.ASSET, subtype: AccountSubtype.ACCOUNTS_RECEIVABLE },
        { id: clearing, companyId, code: "1200", name: "Fixture clearing", type: AccountType.ASSET, subtype: AccountSubtype.BANK },
        { id: revenue, companyId, code: "4100", name: "Fixture service revenue", type: AccountType.REVENUE, subtype: AccountSubtype.REVENUE_SERVICE },
      ]);
      await db.insert(paymentAccountingOffers).values({
        id: offeringId, companyId, productId: serviceId, provider: PaymentProvider.STRIPE,
        merchantId: "synthetic-merchant", offerId: "price_synthetic_studio", currency: "EUR",
        recognition: "immediate", receivableAccountId: receivable, clearingAccountId: clearing,
        considerationAccountId: revenue, active: true,
      });

      const companyParams = { "filters.companyId": companyId };
      const listSchema = z.object({ success: z.literal(true), data: list.GET.responseSchema });
      const detailSchema = z.object({ success: z.literal(true), data: details.GET.responseSchema });
      const ownerList = listSchema.parse(await (await owner.get(companyKey, { params: companyParams })).json());
      expect(ownerList.data.products.map(({ sku }) => sku)).toEqual(["STUDIO-SVC-01", "STUDIO-STOCK-01"]);
      const ownerDetail = detailSchema.parse(await (await owner.get(detailsKey)).json());
      expect(ownerDetail.data.commerce?.prices[0]).toMatchObject({ currency: "EUR", price: 22.5 });
      expect(ownerDetail.data.commerce?.offers[0]).toMatchObject({ accountCode: "4100", currency: "EUR" });
      if (coworkerHttp && coworkerId) {
        expect((await coworkerHttp.get(companyKey, { params: companyParams })).status).toBe(403);
        expect((await coworkerHttp.get(`/api/${locale}/products/catalog/${physicalId}/get`)).status).toBe(403);
        await db.insert(companyMembers).values({ companyId, userId: coworkerId, role: CompanyMemberRole.VIEWER });
        const visible = listSchema.parse(await (await coworkerHttp.get(companyKey, { params: companyParams })).json());
        expect(visible.data.products).toHaveLength(2);
        const limited = detailSchema.parse(await (await coworkerHttp.get(detailsKey)).json());
        expect(limited.data.commerce?.offers).toEqual([]);
        expect(limited.data.commerce?.canConfigure).toBe(false);
      }

      const openCatalog = async (): Promise<void> => {
        await page.goto(`${baseUrl}/${locale}/tools/products-catalog-list?arg.filters=${encodeURIComponent(JSON.stringify({ companyId }))}`, { waitUntil: "domcontentloaded" });
      };
      const service = page.getByRole("button", { name: serviceName, exact: true });
      await openCatalog();
      await service.waitFor({ timeout: 60_000 });
      await capture(page, `catalog-products-${name}`, () => service.waitFor());
      const offers = page.getByRole("button", { name: listT("get.widget.checkout"), exact: true });
      await offers.click();
      const creditPack = page.getByText("credit_pack", { exact: true });
      await creditPack.waitFor();
      expect(await page.getByText("subscription_plus", { exact: true }).count()).toBe(1);
      if (name === "en") {
        await capture(page, "catalog-checkout-en", async () => {
          if (!(await creditPack.isVisible())) {
            await offers.click();
          }
          await creditPack.waitFor();
        });
      }
      if (await creditPack.isVisible()) {
        await offers.click();
      }

      const search = page.getByRole("textbox", { name: listT("get.widget.searchPage"), exact: true });
      await search.fill("STUDIO-SVC-01");
      expect(await page.getByRole("button", { name: physicalName, exact: true }).count()).toBe(0);
      await search.clear();
      await service.click();
      const configure = page.getByRole("button", { name: t("get.widget.configureOffer"), exact: true });
      await configure.waitFor({ timeout: 60_000 });
      await page.getByText("price_synthetic_studio", { exact: true }).waitFor();
      expect(await page.getByRole("button", { name: t("get.widget.viewStock"), exact: true }).count()).toBe(0);
      await capture(page, `catalog-service-${name}`, () => configure.waitFor());
      if (name === "en") {
        await configure.click();
        await page.locator("#admin-tool-processor-accounting-map").waitFor();
        const selectedProduct = page.locator("#admin-tool-processor-accounting-map [data-field=productId] select");
        await selectedProduct.locator(`option[value="${serviceId}"]:checked`).waitFor({ state: "attached" });
        expect(await selectedProduct.inputValue()).toBe(serviceId);
      }
      await openCatalog();
      const physical = page.getByRole("button", { name: physicalName, exact: true });
      await physical.click();
      const stock = page.getByRole("button", { name: t("get.widget.viewStock"), exact: true });
      await stock.waitFor();
      await capture(page, `catalog-physical-${name}`, () => stock.waitFor());
      if (name === "en") {
        await stock.click();
        await page.locator("#admin-tool-inventory-stock").waitFor();
        await page.locator("#admin-tool-inventory-stock").getByText("Fixture warehouse", { exact: true }).filter({ visible: true }).first().waitFor();
      }
    });
  }
});
