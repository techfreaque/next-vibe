import { eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  getAtlasFixture,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { scopedTranslation as helpCopy } from "@/vibe/help-tool/i18n";

import { category as productsCategory } from "../category";
import { catalogProducts } from "../db";
import { ProductType } from "../enum";
import { scopedTranslation as productCopy } from "../i18n";
import detail from "./[productId]/get/definition";
import { scopedTranslation as detailCopy } from "./[productId]/get/i18n";
import update from "./[productId]/update/definition";
import { scopedTranslation as updateCopy } from "./[productId]/update/i18n";
import create from "./create/definition";
import { scopedTranslation as createCopy } from "./create/i18n";

describe("Catalog pricing operator", () => {
  const e2e = useE2E("products/catalog-pricing-operator");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`${locale}: creates recurring and one-time products and updates fractional pricing`, async (fixtures) => {
      const { page, baseUrl, capture } = fixtures;
      const { companyId, headers } = await prepareAtlasCompany(fixtures, "E2E Catalog Pricing");
      const recurringSku = `pricefixture${companyId.replaceAll("-", "")}recurringservice`;
      const revisedSku = `${recurringSku}V2`;
      const onceSku = `price-fixture-${companyId}-once`;
      fixtures.cleanup(async () => {
        for (const sku of [recurringSku, revisedSku, onceSku]) {
          await db.delete(catalogProducts).where(eq(catalogProducts.sku, sku));
        }
      });
      await page.route(`${baseUrl}/**`, async (route) => {
        await route.continue({ headers: { ...route.request().headers(), ...headers } });
      });
      const { t: createT } = createCopy.scopedT(locale);
      const { t: updateT } = updateCopy.scopedT(locale);
      const { t: detailT } = detailCopy.scopedT(locale);
      const { t: typesT } = productCopy.scopedT(locale);
      const { t: helpT } = helpCopy.scopedT(locale);
      const workspaceSwitch = page.locator("#erp-company-switch");
      const companyBadge = page.getByRole("button", {
        name: helpT("erp.companySwitch.current", { name: "E2E Catalog Pricing" }),
        exact: true,
      });
      const button = (name: string) => page.getByRole("button", { name, exact: true }).filter({ visible: true });
      const textbox = (name: string) => page.getByRole("textbox", { name, exact: true }).filter({ visible: true });
      const formatDecimal = (value: number): string =>
        new Intl.NumberFormat(locale, { maximumFractionDigits: 4, useGrouping: false }).format(value);
      const path = `/tools/${endpointToUrlSegment(create.POST)}`;
      const createButton = button(createT("post.title"));
      const interval = page.getByRole("combobox", { name: createT("post.billingInterval.label"), exact: true });
      const subscription = page.getByRole("checkbox", { name: createT("post.isSubscription.label"), exact: false });
      const prepare = async (name: string, sku: string): Promise<void> => {
        await fixtures.goto(path, locale);
        await workspaceSwitch.waitFor();
        if ((await workspaceSwitch.textContent())?.trim() !== "E2E Catalog Pricing") {
          await workspaceSwitch.click();
          await page.getByRole("menuitemradio").filter({ hasText: "E2E Catalog Pricing" }).click();
          await companyBadge.waitFor();
        }
        await textbox(createT("post.name.label")).fill(name);
        await textbox(createT("post.sku.label")).fill(sku);
        await page.getByRole("combobox", { name: createT("post.type.label"), exact: true }).click();
        await page.getByRole("option", { name: typesT(ProductType.SERVICE), exact: true }).click();
        await textbox(createT("post.currency.label")).fill("EUR");
        await textbox(createT("post.basePrice.label")).fill(formatDecimal(22.5));
        await textbox(createT("post.defaultTaxRate.label")).fill("19");
        await textbox(createT("post.defaultTaxRate.label")).press("Tab");
        expect(await interval.count()).toBe(0);
      };
      const recurringName = "E2E monthly studio access";
      await prepare(recurringName, recurringSku);
      await textbox(createT("post.unit.label")).fill("visit");
      await subscription.check();
      await interval.click();
      await page.getByRole("option", { name: createT("post.billingInterval.monthly"), exact: true }).click();
      await saveAdminViewMatrix(page, "products", `pricing-recurring-${locale}`, async () => {
        await interval.waitFor();
        await createButton.waitFor();
      });
      const made = await capture(create.POST, () => createButton.click());
      expect(made.response.success).toBe(true);
      if (!made.response.success) return;
      const { id: productId } = made.response.data.result;
      expect((await db.select().from(catalogProducts).where(eq(catalogProducts.id, productId)))[0]).toMatchObject({
        companyId, name: recurringName, type: ProductType.SERVICE, currency: "EUR", isActive: true,
        basePrice: 22.5, defaultTaxRate: 0.19, isSubscription: true, billingInterval: "MONTHLY",
      });

      await button(createT("post.widget.viewProduct")).click();
      await page.getByRole("heading", { name: recurringName, exact: true }).waitFor();
      await button(detailT("get.widget.edit")).click();
      const updatedPrice = textbox(updateT("patch.basePrice.label"));
      await updatedPrice.waitFor();
      expect(await textbox(updateT("patch.name.label")).inputValue()).toBe(recurringName);
      const skuInput = textbox(updateT("patch.sku.label"));
      expect(await skuInput.inputValue()).toBe(recurringSku);
      await skuInput.press("Enter");
      expect(await skuInput.inputValue()).toBe(recurringSku);
      await skuInput.fill(revisedSku);
      expect(update.PATCH.requestSchema.safeParse({
        fields: { sku: `${revisedSku}\n` },
      }).success).toBe(false);
      expect(await textbox(updateT("patch.unit.label")).inputValue()).toBe("visit");
      expect(await textbox(updateT("patch.currency.label")).inputValue()).toBe("EUR");
      expect(await updatedPrice.inputValue()).toBe(new Intl.NumberFormat(locale, { minimumFractionDigits: 2 }).format(22.5));
      expect(await textbox(updateT("patch.defaultTaxRate.label")).inputValue()).toBe("19");
      expect(await page.getByRole("checkbox", { name: updateT("patch.isActive.label"), exact: true }).isChecked()).toBe(true);
      expect(await page.getByRole("combobox", { name: updateT("patch.type.label"), exact: true }).textContent()).toBe(updateT(ProductType.SERVICE));
      await page.getByText("E2E Catalog Pricing", { exact: true }).filter({ visible: true }).last().waitFor();
      await page.getByText(detailT("get.widget.billingMonthly"), { exact: true }).filter({ visible: true }).last().waitFor();
      await textbox(updateT("patch.currency.label")).fill("USD");
      await updatedPrice.fill(formatDecimal(23.75));
      await textbox(updateT("patch.defaultTaxRate.label")).fill(formatDecimal(7.5));
      await textbox(updateT("patch.defaultTaxRate.label")).press("Tab");
      const updateButton = button(updateT("patch.title"));
      await saveAdminViewMatrix(page, "products", `pricing-update-${locale}`, async () => {
        await updateButton.waitFor();
        await page.mouse.move(385, 2);
        await workspaceSwitch.waitFor({ state: "hidden" });
        await companyBadge.waitFor({ state: "hidden" });
        await page.getByText("E2E Catalog Pricing", { exact: true }).filter({ visible: true }).last().waitFor();
        expect(await updatedPrice.inputValue()).toBe(formatDecimal(23.75));
        expect(await skuInput.inputValue()).toBe(revisedSku);
        const skuLayout = await skuInput.evaluate((node) => ({
          horizontalOverflow: node.scrollWidth - node.clientWidth,
          verticalOverflow: node.scrollHeight - node.clientHeight,
        }));
        expect(skuLayout.horizontalOverflow).toBeLessThanOrEqual(1);
        expect(skuLayout.verticalOverflow).toBeLessThanOrEqual(2);
        const viewport = page.viewportSize();
        if (viewport?.width === 1440) {
          const nav = page.locator("#platform-admin-navigation");
          const current = nav.locator('[aria-current="page"]');
          expect(await current.count()).toBe(1);
          expect((await current.textContent())?.trim()).toBe(productsCategory.label[locale]);
          await current.scrollIntoViewIfNeeded();
        }
        if (viewport?.width === 390) {
          const nameControl = await textbox(updateT("patch.name.label")).boundingBox();
          expect(nameControl?.width ?? 0).toBeGreaterThan(300);
          await updateButton.scrollIntoViewIfNeeded();
          const skuControl = await skuInput.boundingBox();
          expect(skuControl?.y ?? -1).toBeGreaterThanOrEqual(0);
          expect(skuControl ? skuControl.y + skuControl.height : Infinity).toBeLessThanOrEqual(viewport.height);
          const submitControl = await updateButton.boundingBox();
          expect(submitControl ? submitControl.y + submitControl.height : Infinity).toBeLessThanOrEqual(viewport.height);
        }
      });
      const changed = await capture(update.PATCH, () => updateButton.click());
      expect(changed.response.success).toBe(true);
      expect(changed.requestBody).toEqual({
        fields: { basePrice: 23.75, currency: "USD", defaultTaxRate: 0.075, sku: revisedSku },
      });
      const product = await getAtlasFixture(
        `${baseUrl}/api/${locale}/products/catalog/${productId}/get`,
        {},
        headers,
      );
      expect(product.ok).toBe(true);
      const result = z.object({ data: detail.GET.responseSchema }).parse(await product.json()).data.result;
      expect(result).toMatchObject({
        id: productId, basePrice: 23.75, currency: "USD", defaultTaxRate: 0.075,
        companyId, name: recurringName, sku: revisedSku, type: ProductType.SERVICE, isActive: true, unit: "visit",
        isSubscription: true, billingInterval: "MONTHLY",
      });
      const savedPrice = page.getByText(formatMoney(23.75, "USD", locale), { exact: true })
        .filter({ visible: true }).first();
      await savedPrice.waitFor();
      await saveAdminViewMatrix(page, "products", `pricing-saved-${locale}`, async () => {
        await savedPrice.waitFor();
        await page.getByText("USD", { exact: true }).filter({ visible: true }).first().waitFor();
      });

      if (locale === "en-US") {
        await button(detailT("get.widget.edit")).click();
        const unit = textbox(updateT("patch.unit.label"));
        await unit.fill("");
        const cleared = await capture(update.PATCH, () => updateButton.click());
        expect(cleared.response.success).toBe(true);
        expect(cleared.requestBody).toEqual({ fields: { unit: "" } });
        expect((await db.select().from(catalogProducts).where(eq(catalogProducts.id, productId)))[0]).toMatchObject({
          unit: "", isActive: true, name: recurringName, basePrice: 23.75,
        });
        await button(detailT("get.widget.edit")).waitFor();
      }

      await prepare("E2E single studio visit", onceSku);
      await subscription.check();
      await interval.click();
      await page.getByRole("option", { name: createT("post.billingInterval.monthly"), exact: true }).click();
      await subscription.uncheck();
      expect(await interval.count()).toBe(0);
      await saveAdminViewMatrix(page, "products", `pricing-one-time-${locale}`, async () => {
        expect(await interval.count()).toBe(0);
        await createButton.waitFor();
      });
      const once = await capture(create.POST, () => createButton.click());
      expect(once.response.success).toBe(true);
      if (!once.response.success) return;
      expect((await db.select().from(catalogProducts).where(eq(catalogProducts.id, once.response.data.result.id)))[0]).toMatchObject({
        companyId, currency: "EUR", basePrice: 22.5, defaultTaxRate: 0.19,
        isSubscription: false, billingInterval: null,
      });
    });
  }
});
