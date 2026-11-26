import "server-only";

import { and, eq } from "drizzle-orm";
import type { db } from "next-vibe/database";

import { JournalSourceType } from "@/chart-of-accounts/enum";
import { paymentBills, paymentInvoices } from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";

import type { BankDocumentBasis } from "./reconciliation-plan";

export async function getBankPaymentBasis(
  reader: Pick<typeof db, "select">,
  companyId: string,
  source: { sourceId: string | null; sourceType: string },
): Promise<BankDocumentBasis | undefined> {
  if (!source.sourceId) {
    return undefined;
  }
  if (source.sourceType === JournalSourceType.AP_PAYMENT) {
    const [bill] = await reader
      .select({
        currency: paymentBills.currency,
        amount: paymentBills.total,
      })
      .from(paymentBills)
      .where(
        and(
          eq(paymentBills.companyId, companyId),
          eq(paymentBills.id, source.sourceId),
          eq(paymentBills.status, BillStatus.PAID),
        ),
      );
    return bill && { currency: bill.currency, amount: bill.amount.toFixed(4) };
  }
  if (source.sourceType === JournalSourceType.AR_PAYMENT) {
    const [invoice] = await reader
      .select({
        currency: paymentInvoices.currency,
        amount: paymentInvoices.amount,
      })
      .from(paymentInvoices)
      .where(
        and(
          eq(paymentInvoices.companyId, companyId),
          eq(paymentInvoices.id, source.sourceId),
          eq(paymentInvoices.status, InvoiceStatus.PAID),
        ),
      );
    return (
      invoice && {
        currency: invoice.currency,
        amount: invoice.amount,
      }
    );
  }
  return undefined;
}
