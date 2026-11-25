import "server-only";

import { and, eq } from "drizzle-orm";

import { paymentBills, paymentInvoices } from "@/payment/db";
import { posOrders, posSessions, posTerminals } from "@/pos/db";

import { journalEntries, type JournalEntry } from "../../../db";
import { JournalSourceType } from "../../../enum";
import type { LedgerTransaction } from "../../../shared/ledger-write";

export async function hasManagedJournalDocument(
  tx: LedgerTransaction,
  entry: JournalEntry,
): Promise<boolean> {
  if (entry.sourceType === JournalSourceType.MANUAL) {
    return false;
  }

  let sourceId = entry.sourceId;
  if (!sourceId && entry.reversalOfId) {
    const [original] = await tx
      .select({ sourceId: journalEntries.sourceId })
      .from(journalEntries)
      .where(
        and(
          eq(journalEntries.id, entry.reversalOfId),
          eq(journalEntries.companyId, entry.companyId),
          eq(journalEntries.sourceType, entry.sourceType),
        ),
      );
    sourceId = original?.sourceId ?? null;
  }
  if (!sourceId) {
    return false;
  }

  switch (entry.sourceType) {
    case JournalSourceType.AR_INVOICE:
    case JournalSourceType.AR_PAYMENT: {
      const [invoice] = await tx
        .select({ id: paymentInvoices.id })
        .from(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.id, sourceId),
            eq(paymentInvoices.companyId, entry.companyId),
          ),
        );
      return !!invoice;
    }
    case JournalSourceType.AP_BILL:
    case JournalSourceType.AP_PAYMENT: {
      const [bill] = await tx
        .select({ id: paymentBills.id })
        .from(paymentBills)
        .where(
          and(
            eq(paymentBills.id, sourceId),
            eq(paymentBills.companyId, entry.companyId),
          ),
        );
      return !!bill;
    }
    case JournalSourceType.POS_ORDER: {
      const [order] = await tx
        .select({ id: posOrders.id })
        .from(posOrders)
        .innerJoin(posSessions, eq(posOrders.sessionId, posSessions.id))
        .innerJoin(posTerminals, eq(posSessions.terminalId, posTerminals.id))
        .where(
          and(
            eq(posOrders.id, sourceId),
            eq(posTerminals.companyId, entry.companyId),
          ),
        );
      return !!order;
    }
    default:
      return false;
  }
}
