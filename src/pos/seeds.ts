import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  AccountSubtype,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { postJournalEntry } from "@/chart-of-accounts/shared/auto-post";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import {
  demoRecordId,
  findDemoCompany,
} from "@/companies/demo-company.repository";
import { warehouses } from "@/inventory/db";
import { DEMO_MAIN_WAREHOUSE_CODE } from "@/inventory/demo-warehouse";
import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import {
  posOrderItems,
  posOrders,
  posPayments,
  posSessions,
  posTerminals,
} from "./db";
import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "./enum";

const DEMO_TERMINAL_NAME = "Main Register";
export const priority = 5;

export async function dev(logger: EndpointLogger): Promise<void> {
  const company = await findDemoCompany();
  if (!company) {
    logger.warn("POS seed requires the demo company");
    return;
  }
  const { id: companyId, adminId } = company;
  await db.transaction(async (tx) => {
    const ledgerCompany = await lockLedgerCompany(tx, companyId);
    if (ledgerCompany?.currency !== "EUR") {
      return;
    }
    const [warehouse] = await tx
      .select({ id: warehouses.id })
      .from(warehouses)
      .where(
        and(
          eq(warehouses.companyId, companyId),
          eq(warehouses.code, DEMO_MAIN_WAREHOUSE_CODE),
        ),
      )
      .limit(1);
    const [existing] = await tx
      .select({ id: posTerminals.id })
      .from(posTerminals)
      .where(
        and(
          eq(posTerminals.companyId, companyId),
          eq(posTerminals.name, DEMO_TERMINAL_NAME),
        ),
      )
      .limit(1);
    const terminalId = existing?.id ?? demoRecordId(companyId, "pos:main");
    if (!existing) {
      await tx.insert(posTerminals).values({
        id: terminalId,
        companyId,
        name: DEMO_TERMINAL_NAME,
        location: "Berlin Studio front desk",
        currency: "EUR",
        warehouseId: warehouse?.id,
      });
    }

    const orderId = demoRecordId(companyId, "pos:workshop-sale");
    const sessionId = demoRecordId(companyId, "pos:workshop-shift");
    const [order] = await tx
      .select({ id: posOrders.id })
      .from(posOrders)
      .where(eq(posOrders.id, orderId));
    if (order) {
      return;
    }

    const date = new Date();
    const journalEntryId = await postJournalEntry(
      {
        companyId,
        date,
        description: "POS demo workshop ticket",
        sourceType: JournalSourceType.POS_ORDER,
        sourceId: orderId,
        postedByUserId: adminId,
        logger,
        lines: [
          {
            subtype: AccountSubtype.CASH,
            type: LineType.DEBIT,
            amount: 47.6,
            currency: "EUR",
          },
          {
            subtype: AccountSubtype.REVENUE_SERVICE,
            fallbackSubtype: AccountSubtype.REVENUE_SALES,
            type: LineType.CREDIT,
            amount: 40,
            currency: "EUR",
          },
          {
            subtype: AccountSubtype.VAT_PAYABLE,
            type: LineType.CREDIT,
            amount: 7.6,
            currency: "EUR",
          },
        ],
      },
      tx,
    );
    if (!journalEntryId) {
      logger.warn("POS demo sale requires an open period and posting accounts");
      return;
    }

    await tx.insert(posSessions).values({
      id: sessionId,
      terminalId,
      cashierUserId: adminId,
      status: PosSessionStatus.CLOSED,
      openedAt: new Date(date.getTime() - 60 * 60 * 1000),
      closedAt: date,
      openingFloat: 100,
      closingFloat: 147.6,
    });
    await tx.insert(posOrders).values({
      id: orderId,
      sessionId,
      orderNumber: "DEMO-POS-001",
      status: PosOrderStatus.COMPLETED,
      lineSettlement: LINE_SETTLEMENT_V1,
      currency: "EUR",
      subtotal: 40,
      taxAmount: 7.6,
      total: 47.6,
      journalEntryId,
      createdAt: date,
      updatedAt: date,
    });
    await tx.insert(posOrderItems).values({
      orderId,
      description: "Studio workshop ticket",
      quantity: 1,
      unitPrice: 40,
      taxRate: 0.19,
      taxAmount: 7.6,
      lineTotal: 47.6,
    });
    await tx.insert(posPayments).values({
      orderId,
      method: PosPaymentMethod.CASH,
      amount: 50,
      change: 2.4,
      reference: "DEMO-POS-001",
    });
  });
}
