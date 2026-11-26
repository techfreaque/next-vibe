import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { prepareAtlasCompany, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { scopedTranslation as helpCopy } from "@/vibe/help-tool/i18n";

import categoryCreate from "../category/create/definition";
import { scopedTranslation as categoryCreateCopy } from "../category/create/i18n";
import categoryList from "../category/list/definition";
import { scopedTranslation as categoryListCopy } from "../category/list/i18n";
import { catalogProducts, productCategories } from "../db";
import { ProductType } from "../enum";
import { scopedTranslation as productCopy } from "../i18n";
import deactivate from "./[productId]/deactivate/definition";
import { scopedTranslation as deactivateCopy } from "./[productId]/deactivate/i18n";
import { scopedTranslation as detailCopy } from "./[productId]/get/i18n";
import update from "./[productId]/update/definition";
import { scopedTranslation as updateCopy } from "./[productId]/update/i18n";
import create from "./create/definition";
import { scopedTranslation as createCopy } from "./create/i18n";

const SHOTS = "../coverage/catalog/e2e";

describe("Catalog lifecycle operator", () => {
  const e2e = useE2E("products/catalog-lifecycle");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`${locale}: creates, deactivates and reactivates a product, then adds a category`, async (fixtures) => {
      const { page, baseUrl, capture } = fixtures;
      const companyName = `E2E Catalog Lifecycle ${randomUUID().slice(0, 6)}`;
      const { companyId, headers } = await prepareAtlasCompany(fixtures, companyName);
      const categoryIds: string[] = [];
      fixtures.cleanup(async () => {
        await db.delete(catalogProducts).where(eq(catalogProducts.companyId, companyId));
        if (categoryIds.length > 0) {
          await db.delete(productCategories).where(inArray(productCategories.id, categoryIds));
        }
      });
      await page.route(`${baseUrl}/**`, async (route) => {
        await route.continue({ headers: { ...route.request().headers(), ...headers } });
      });
      const { t: createT } = createCopy.scopedT(locale);
      const { t: detailT } = detailCopy.scopedT(locale);
      const { t: deactivateT } = deactivateCopy.scopedT(locale);
      const { t: updateT } = updateCopy.scopedT(locale);
      const { t: typesT } = productCopy.scopedT(locale);
      const { t: categoryListT } = categoryListCopy.scopedT(locale);
      const { t: categoryCreateT } = categoryCreateCopy.scopedT(locale);
      const { t: helpT } = helpCopy.scopedT(locale);
      const button = (name: string) => page.getByRole("button", { name, exact: true }).filter({ visible: true });
      const textbox = (name: string) => page.getByRole("textbox", { name, exact: true }).filter({ visible: true });
      const visibleText = (text: string) => page.getByText(text, { exact: true }).filter({ visible: true }).first();
      const workspaceSwitch = page.locator("#erp-company-switch");

      // 1. Create a one-time physical product in a fresh company. The catalog
      // list ignores the header workspace switch (it lists every product the
      // admin owns unless filters.companyId is set), so the flow starts on the
      // create form, which does use the active company.
      await fixtures.goto(`/tools/${endpointToUrlSegment(create.POST)}`, locale);
      await workspaceSwitch.waitFor();
      if ((await workspaceSwitch.textContent())?.trim() !== companyName) {
        await workspaceSwitch.click();
        await page.getByRole("menuitemradio").filter({ hasText: companyName }).click();
        await page.getByRole("button", {
          name: helpT("erp.companySwitch.current", { name: companyName }),
          exact: true,
        }).waitFor();
      }
      const productName = `E2E lifecycle mug ${locale}`;
      await textbox(createT("post.name.label")).fill(productName);
      await textbox(createT("post.sku.label")).fill(`lifecycle-${companyId}`);
      await page.getByRole("combobox", { name: createT("post.type.label"), exact: true }).click();
      await page.getByRole("option", { name: typesT(ProductType.PHYSICAL), exact: true }).click();
      await textbox(createT("post.currency.label")).fill("EUR");
      await textbox(createT("post.basePrice.label")).fill(new Intl.NumberFormat(locale).format(12.5));
      await textbox(createT("post.defaultTaxRate.label")).fill("20");
      await textbox(createT("post.defaultTaxRate.label")).press("Tab");
      const made = await capture(create.POST, () => button(createT("post.title")).click());
      expect(made.response.success).toBe(true);
      if (!made.response.success) return;
      const productId = made.response.data.result.id;
      expect((await db.select().from(catalogProducts).where(eq(catalogProducts.id, productId)))[0]).toMatchObject({
        companyId, name: productName, type: ProductType.PHYSICAL, isActive: true, basePrice: 12.5,
      });

      // 3. Detail, then deactivate with confirmation.
      await button(createT("post.widget.viewProduct")).click();
      await page.getByRole("heading", { name: productName, exact: true }).waitFor();
      await button(detailT("get.widget.deactivate")).click();
      const confirm = button(deactivateT("post.titleShort"));
      await confirm.waitFor();
      await visibleText(deactivateT("post.widget.warning")).waitFor();
      await saveAdminViewMatrix(page, SHOTS, `deactivate-confirm-${locale}`, async () => {
        await confirm.waitFor();
      });
      const off = await capture(deactivate.POST, () => confirm.click());
      expect(off.response.success).toBe(true);
      expect((await db.select().from(catalogProducts).where(eq(catalogProducts.id, productId)))[0]?.isActive).toBe(false);

      // Back on the detail: inactive pill and an Activate action.
      const activate = button(detailT("get.widget.activate"));
      await activate.waitFor();
      await visibleText(detailT("get.widget.inactive")).waitFor();
      await saveAdminViewMatrix(page, SHOTS, `detail-inactive-${locale}`, async () => {
        await activate.waitFor();
      });

      // 4. Reactivate: the edit form opens with Active pre-set, save sends only isActive.
      await activate.click();
      const active = page.getByRole("checkbox", { name: updateT("patch.isActive.label"), exact: true });
      await active.waitFor();
      expect(await active.isChecked()).toBe(true);
      const on = await capture(update.PATCH, () => button(updateT("patch.title")).click());
      expect(on.response.success).toBe(true);
      expect(on.requestBody).toEqual({ fields: { isActive: true } });
      expect((await db.select().from(catalogProducts).where(eq(catalogProducts.id, productId)))[0]?.isActive).toBe(true);
      await button(detailT("get.widget.deactivate")).waitFor();

      // 5. Categories: list, create, see it listed.
      await fixtures.goto(`/tools/${endpointToUrlSegment(categoryList.GET)}`, locale);
      await button(categoryListT("get.widget.addCategory")).first().click();
      const categoryName = `E2E lifecycle ${locale} ${companyId.slice(0, 8)}`;
      await textbox(categoryCreateT("post.name.label")).fill(categoryName);
      await saveAdminViewMatrix(page, SHOTS, `category-create-${locale}`, async () => {
        await button(categoryCreateT("post.titleShort")).waitFor();
      });
      const category = await capture(categoryCreate.POST, () => button(categoryCreateT("post.titleShort")).click());
      expect(category.response.success).toBe(true);
      if (!category.response.success) return;
      categoryIds.push(category.response.data.result.id);
      await button(categoryCreateT("post.widget.backToList")).click();
      const row = visibleText(categoryName);
      await row.waitFor();
      await saveAdminViewMatrix(page, SHOTS, `category-list-${locale}`, async () => {
        await row.waitFor();
      });
    }, 420_000);
  }
});
