import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { posOrders, posPayments, posSessions, posTerminals } from "../db";
import { scopedTranslation } from "../i18n";
import sessionDetails from "../session/[sessionId]/get/definition";
import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "../enum";

describe("POS cash sale and day close", () => {
  const e2e = useE2E("pos/cash-sale-close");

  e2e.it(
    "reconciles one cash sale and tender change without duplicating the journal",
    async (fixtures) => {
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        "E2E POS Company",
      );
      const terminalId = randomUUID();
      const cash = randomUUID();
      const revenue = randomUUID();
      fixtures.cleanup(async () => {
        const sessions = await db
          .select({ id: posSessions.id })
          .from(posSessions)
          .where(eq(posSessions.terminalId, terminalId));
        for (const { id } of sessions) {
          await db.delete(posOrders).where(eq(posOrders.sessionId, id));
        }
        await db
          .delete(posSessions)
          .where(eq(posSessions.terminalId, terminalId));
        await db.delete(posTerminals).where(eq(posTerminals.id, terminalId));
        expect(
          await db
            .select()
            .from(posSessions)
            .where(eq(posSessions.terminalId, terminalId)),
        ).toEqual([]);
      });
      const now = new Date();
      await db.insert(accountingPeriods).values({
        companyId,
        name: "E2E Open",
        startDate: new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
        ),
        endDate: new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0),
        ),
      });
      await db.insert(accountNodes).values([
        {
          id: cash,
          companyId,
          code: "1000",
          name: "Cash drawer",
          type: AccountType.ASSET,
          subtype: AccountSubtype.CASH,
        },
        {
          id: revenue,
          companyId,
          code: "4100",
          name: "Counter sales",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SALES,
        },
      ]);
      await db.insert(posTerminals).values({
        id: terminalId,
        companyId,
        name: "E2E Counter",
        currency: "EUR",
        cashAccountNodeId: cash,
      });

      const resultId = z.object({
        success: z.literal(true),
        data: z.object({ result: z.object({ id: z.uuid() }) }),
      });
      const opened = await postAtlas(fixtures, "pos/session/open", {
        details: { terminalId, openingFloat: 50 },
      });
      expect(opened.ok).toBe(true);
      const sessionId = resultId.parse(await opened.json()).data.result.id;
      const created = await postAtlas(fixtures, "pos/order/create", {
        details: { sessionId },
      });
      expect(created.ok).toBe(true);
      const orderId = resultId.parse(await created.json()).data.result.id;
      const orderPath = `pos/order/${orderId}`;
      const addItem = await postAtlas(fixtures, `${orderPath}/add-item`, {
        orderId,
        item: {
          description: "E2E counter item",
          quantity: 2,
          unitPrice: 8,
          taxRate: 0,
        },
      });
      expect(addItem.ok).toBe(true);
      const complete = () =>
        postAtlas(fixtures, `${orderPath}/complete`, { orderId });
      expect((await complete()).ok).toBe(false);
      const close = () =>
        postAtlas(fixtures, "pos/session/close", {
          details: { sessionId, closingFloat: 66 },
        });
      expect((await close()).ok).toBe(false);

      const tender = await postAtlas(fixtures, `${orderPath}/add-payment`, {
        details: { orderId, method: PosPaymentMethod.CASH, amount: 20 },
      });
      expect(tender.ok).toBe(true);
      expect(await tender.json()).toMatchObject({
        success: true,
        data: { result: { change: 4, outstanding: 0 } },
      });
      const completed = await Promise.all([complete(), complete()]);
      expect(completed.some((response) => response.ok)).toBe(true);
      const [savedOrder] = await db
        .select()
        .from(posOrders)
        .where(eq(posOrders.id, orderId));
      expect(savedOrder?.status).toBe(PosOrderStatus.COMPLETED);
      expect(savedOrder?.total).toBe(16);
      const [savedPayment] = await db
        .select()
        .from(posPayments)
        .where(eq(posPayments.orderId, orderId));
      expect(savedPayment).toMatchObject({ amount: 20, change: 4 });

      const [entry, duplicate] = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.sourceId, orderId));
      expect(duplicate).toBeUndefined();
      expect(entry?.sourceType).toBe(JournalSourceType.POS_ORDER);
      expect(savedOrder?.journalEntryId).toBe(entry?.id);
      if (entry) {
        const lines = await db
          .select()
          .from(journalEntryLines)
          .where(eq(journalEntryLines.journalEntryId, entry.id));
        expect(lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              accountId: cash,
              type: LineType.DEBIT,
              amount: 16,
            }),
            expect.objectContaining({
              accountId: revenue,
              type: LineType.CREDIT,
              amount: 16,
            }),
          ]),
        );
      }

      const closed = await close();
      expect(closed.ok).toBe(true);
      expect(await closed.json()).toMatchObject({
        success: true,
        data: {
          result: {
            expectedFloat: 66,
            cashSalesTotal: 16,
            variance: 0,
            orderCount: 1,
          },
        },
      });
      expect((await close()).ok).toBe(false);
      const [savedSession] = await db
        .select()
        .from(posSessions)
        .where(eq(posSessions.id, sessionId));
      expect(savedSession).toMatchObject({
        status: PosSessionStatus.CLOSED,
        closingFloat: 66,
      });
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      await fixtures.open(sessionDetails.GET, {
        query: { sessionId },
        ready: async () => {
          await fixtures.page
            .getByText(t("sessionGet.get.response.closingFloat"), {
              exact: true,
            })
            .first()
            .waitFor();
        },
      });
      await saveWorkflowScreenshots(fixtures, "pos-cash-day-closed");
    },
  );
});
