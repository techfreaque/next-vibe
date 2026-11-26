import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";

import {
  posOrderItems,
  posOrders,
  posPayments,
  posSessions,
  posTerminals,
} from "../db";
import { PosOrderStatus, PosPaymentMethod } from "../enum";
import { PosSessionOpenRepository } from "../session/open/repository";
import { scopedTranslation as registerTranslation } from "../session/[sessionId]/register/i18n";

const sessionResult = z.object({
  success: z.literal(true),
  data: z.object({ result: z.object({ id: z.uuid() }) }),
});


/** Polls until the value matches, then asserts it (bun has no expect.poll). */
async function eventually<T>(read: () => Promise<T>, expected: T): Promise<void> {
  let value = await read();
  for (let attempt = 0; attempt < 60 && value !== expected; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    value = await read();
  }
  expect(value).toBe(expected);
}

/**
 * The till screen as a cashier uses it: tap tiles, change quantities, park
 * and resume a sale, split tender, undo a tender, void a sale. No ledger
 * accounts are configured, so completion posts no journal (covered by
 * operator-sale.e2e.test.ts); this file proves the register flows.
 */
describe("POS register on Atlas", () => {
  const e2e = useE2E("pos/register");

  e2e.it(
    "rings up, parks, splits tender, undoes a tender and voids on the till screen",
    async (fixture) => {
      const { page, baseUrl, cleanup } = fixture;
      const actor = await createTestUser(fixture.uniqueEmail("pos-register"));
      expect(actor.success).toBe(true);
      if (!actor.success) {
        return;
      }
      const identity = {
        ...actor.data.user,
        roles: [UserPermissionRole.ADMIN, ...actor.data.user.roles],
      };
      cleanup(async () => deleteTestUser(identity.id));
      await db
        .insert(userRoles)
        .values({ userId: identity.id, role: UserPermissionRole.ADMIN });
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixture,
        "Synthetic register shop",
        identity,
      );
      const origin = new URL(baseUrl).origin;
      await page.route(
        (target) =>
          target.origin === origin && target.pathname.startsWith("/api/"),
        async (route) => {
          if (route.request().method() !== "GET") {
            await route.fallback();
            return;
          }
          await route.continue({
            headers: {
              ...route.request().headers(),
              authorization: headers.authorization,
            },
          });
        },
      );

      const terminalId = randomUUID();
      const coffee = randomUUID();
      const mug = randomUUID();
      cleanup(async () => {
        const sessions = await db
          .select({ id: posSessions.id })
          .from(posSessions)
          .where(eq(posSessions.terminalId, terminalId));
        for (const session of sessions) {
          const orders = await db
            .select({ id: posOrders.id })
            .from(posOrders)
            .where(eq(posOrders.sessionId, session.id));
          for (const order of orders) {
            await db.delete(posPayments).where(eq(posPayments.orderId, order.id));
            await db
              .delete(posOrderItems)
              .where(eq(posOrderItems.orderId, order.id));
            await db.delete(posOrders).where(eq(posOrders.id, order.id));
          }
          await db.delete(posSessions).where(eq(posSessions.id, session.id));
        }
        await db.delete(posTerminals).where(eq(posTerminals.id, terminalId));
        await db.delete(catalogProducts).where(eq(catalogProducts.id, coffee));
        await db.delete(catalogProducts).where(eq(catalogProducts.id, mug));
      });
      await db.insert(catalogProducts).values([
        {
          id: coffee,
          companyId,
          ownerUserId: userId,
          name: "Register flat white",
          sku: "REG-FW-1",
          type: ProductType.SERVICE,
          basePrice: 3.5,
          currency: "EUR",
          defaultTaxRate: 0,
        },
        {
          id: mug,
          companyId,
          ownerUserId: userId,
          name: "Register enamel mug",
          sku: "REG-MUG-1",
          type: ProductType.SERVICE,
          basePrice: 12,
          currency: "EUR",
          defaultTaxRate: 0,
        },
      ]);
      await db.insert(posTerminals).values({
        id: terminalId,
        companyId,
        name: "Synthetic counter",
        currency: "EUR",
      });
      const logger = createEndpointLogger(false, "en-US");
      const opened = await PosSessionOpenRepository.openSession(
        { details: { terminalId, openingFloat: 20 } },
        logger,
        userId,
        "en-US",
      );
      const sessionId = sessionResult.parse(opened).data.result.id;

      const { t } = registerTranslation.scopedT("en-US");
      const euro = (amount: number): string =>
        formatMoney(amount, "EUR", "en-US");
      const show = async (text: string): Promise<void> => {
        await page
          .getByText(text, { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor({ timeout: 45_000 });
      };
      const button = (name: string | RegExp) =>
        page.getByRole("button", { name }).first();
      const posted = (suffix: string) =>
        page.waitForResponse(
          (reply) =>
            reply.request().method() === "POST" &&
            new URL(reply.url()).pathname.endsWith(suffix),
        );
      const total = page.getByTestId("pos-register-total");
      const linesOf = async (orderId: string) =>
        db
          .select()
          .from(posOrderItems)
          .where(eq(posOrderItems.orderId, orderId));

      await page.goto(
        `${baseUrl}/en-US/tools/pos-register?sessionId=${sessionId}`,
        { waitUntil: "domcontentloaded", timeout: 90_000 },
      );
      await page.locator("#pos-register-search").waitFor({ timeout: 90_000 });
      await show(t("widget.cart.empty"));

      // Two taps on one tile make one line with quantity 2.
      const creating = posted("/pos/order/create");
      await button(/Register flat white/u).click();
      const created = await creating;
      const firstOrderId = sessionResult.parse(await created.json()).data.result
        .id;
      await eventually(async () => (await linesOf(firstOrderId)).length, 1);
      const merging = posted("/add-item");
      await button(/Register flat white/u).click();
      expect((await merging).ok()).toBe(true);
      await eventually(async () => (await linesOf(firstOrderId))[0]?.quantity, 2);
      await eventually(async () => total.textContent(), euro(7));

      // Minus lowers the quantity without dropping the line.
      const lowering = posted("/remove-item");
      await button(t("widget.cart.decrease", { name: "Register flat white" })).click();
      expect((await lowering).ok()).toBe(true);
      await eventually(async () => (await linesOf(firstOrderId))[0]?.quantity, 1);

      // A scanned SKU adds its product; an unknown term shows a clear empty state.
      await page.locator("#pos-register-search").fill("no-such-item");
      await show(t("widget.products.none", { query: "no-such-item" }));
      await page.locator("#pos-register-search").fill("REG-MUG-1");
      const scanning = posted("/add-item");
      await page.locator("#pos-register-search").press("Enter");
      expect((await scanning).ok()).toBe(true);
      await eventually(async () => total.textContent(), euro(15.5));

      // Park the sale, ring a second one, then resume the first.
      await button(t("widget.cart.park")).click();
      await show(t("widget.cart.newTitle"));
      const second = posted("/pos/order/create");
      await button(/Register enamel mug/u).click();
      const secondId = sessionResult.parse(await (await second).json()).data
        .result.id;
      await eventually(async () => (await linesOf(secondId)).length, 1);
      const firstNumber = (
        await db
          .select({ orderNumber: posOrders.orderNumber })
          .from(posOrders)
          .where(eq(posOrders.id, firstOrderId))
      )[0]?.orderNumber;
      expect(firstNumber).toBeTruthy();

      // Void the second sale (confirm dialog), the parked sale stays open.
      await button(t("widget.void.action")).click();
      const voiding = posted("/void");
      await page
        .getByRole("alertdialog")
        .getByRole("button", { name: t("widget.void.confirm") })
        .click();
      expect((await voiding).ok()).toBe(true);
      await eventually(async () =>
          (
            await db
              .select({ status: posOrders.status })
              .from(posOrders)
              .where(eq(posOrders.id, secondId))
          )[0]?.status, PosOrderStatus.VOIDED);
      await button(t("widget.cart.resume", { number: firstNumber ?? "" })).click();
      await eventually(async () => total.textContent(), euro(15.5));

      // Split tender: 5.00 by card, undo it, card again, the rest in cash.
      await button(t("widget.tender.card")).click();
      await page.getByLabel(t("widget.tender.amount"), { exact: true }).fill("5");
      const card = posted("/add-payment");
      await button(t("widget.tender.take", { amount: euro(5) })).click();
      expect((await card).ok()).toBe(true);
      await show(t("widget.cart.locked"));
      const undo = posted("/remove-payment");
      await button(
        t("widget.cart.removePayment", { method: t("widget.tender.card") }),
      ).click();
      expect((await undo).ok()).toBe(true);
      await eventually(async () =>
          (
            await db
              .select({ id: posPayments.id })
              .from(posPayments)
              .where(eq(posPayments.orderId, firstOrderId))
          ).length, 0);
      await button(t("widget.tender.card")).click();
      await page.getByLabel(t("widget.tender.amount"), { exact: true }).fill("5");
      const cardAgain = posted("/add-payment");
      await button(t("widget.tender.take", { amount: euro(5) })).click();
      expect((await cardAgain).ok()).toBe(true);
      await button(t("widget.tender.cash")).click();
      const cash = posted("/add-payment");
      const completing = posted("/complete");
      await button(euro(20)).click();
      expect((await cash).ok()).toBe(true);
      expect((await completing).ok()).toBe(true);
      await show(t("widget.receipt.title"));
      await show(t("widget.receipt.giveChange"));
      await show(euro(9.5));

      const tenders = await db
        .select()
        .from(posPayments)
        .where(eq(posPayments.orderId, firstOrderId));
      expect(tenders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            method: PosPaymentMethod.CARD,
            amount: 5,
            change: 0,
          }),
          expect.objectContaining({
            method: PosPaymentMethod.CASH,
            amount: 20,
            change: 9.5,
          }),
        ]),
      );
      const [done] = await db
        .select()
        .from(posOrders)
        .where(
          and(eq(posOrders.id, firstOrderId), eq(posOrders.sessionId, sessionId)),
        );
      expect(done).toMatchObject({
        status: PosOrderStatus.COMPLETED,
        total: 15.5,
      });

      // The next tap starts a fresh sale straight from the receipt.
      const third = posted("/pos/order/create");
      await button(/Register flat white/u).click();
      expect((await third).ok()).toBe(true);
      await show(euro(3.5));
    },
    240_000,
  );
});
