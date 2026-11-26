import "server-only";

import { eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";
import { stockLevels, stockMovements, warehouses } from "../../db";
import { scopedTranslation } from "../../i18n";
import definition from "./definition";

describe("Fractional warehouse receipt", () => {
  const e2e = useE2E("inventory/fractional-stock-receipt");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(
      "receives material by weight at a fractional unit cost in " + locale,
      async (fixture) => {
        const { companyId, userId } = await prepareAtlasCompany(
          fixture,
          "Fixture textile workshop",
        );
        const warehouseId = crypto.randomUUID();
        const productId = crypto.randomUUID();
        fixture.cleanup(async () => {
          await db.delete(stockMovements).where(eq(stockMovements.warehouseId, warehouseId));
          await db.delete(stockLevels).where(eq(stockLevels.warehouseId, warehouseId));
          await db.delete(catalogProducts).where(eq(catalogProducts.id, productId));
          await db.delete(warehouses).where(eq(warehouses.id, warehouseId));
        });
        await db
          .insert(warehouses)
          .values({ id: warehouseId, companyId, code: "TEXTILE", name: "Fixture textile store" });
        await db.insert(catalogProducts).values({
          id: productId,
          companyId,
          ownerUserId: userId,
          name: "Fixture recycled cotton",
          sku: "COTTON-FRAC",
          type: ProductType.PHYSICAL,
          currency: "EUR",
          basePrice: 9.25,
        });
        const { page } = fixture;
        const { t } = scopedTranslation.scopedT(locale);
        const path = endpointToUrlSegment(definition.POST);
        const params = new URLSearchParams({
          "arg.warehouseId": warehouseId,
          "arg.productId": productId,
        });
        await fixture.goto(`/tools/${path}?${params}`, locale);
        const panel = page.locator(`[id="admin-tool-${path}"]`);
        const qty = panel.getByRole("spinbutton", {
          name: t("stockReceive.post.quantity.label"),
          exact: true,
        });
        const cost = panel.getByRole("spinbutton", {
          name: t("stockReceive.post.unitCost.label"),
          exact: true,
        });
        await qty.fill("1.5");
        await cost.fill("12.375");
        expect(await qty.getAttribute("step")).toBe("any");
        expect(await cost.getAttribute("step")).toBe("any");
        expect(
          await cost.evaluate(
            (element) => element instanceof HTMLInputElement && element.validity.valid,
          ),
        ).toBe(true);
        const [response] = await Promise.all([
          page.waitForResponse(
            (reply) =>
              reply.request().method() === "POST" &&
              new URL(reply.url()).pathname.endsWith("/inventory/stock/receive"),
          ),
          panel.getByRole("button", { name: t("stockReceive.post.title"), exact: true }).click(),
        ]);
        expect(response.ok()).toBe(true);
        const body = z
          .object({ success: z.literal(true), data: definition.POST.responseSchema })
          .parse(await response.json());
        expect(body.data.result).toMatchObject({
          warehouseId,
          productId,
          quantityOnHand: 1.5,
          unitCost: 12.375,
        });
        const movements = await db
          .select()
          .from(stockMovements)
          .where(eq(stockMovements.warehouseId, warehouseId));
        expect(movements).toHaveLength(1);
        expect(movements[0]).toMatchObject({ productId, quantity: 1.5, unitCost: 12.375 });
      },
      90000,
    );
  }
});
