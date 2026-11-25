import "server-only";

import { eq, max } from "drizzle-orm";

import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";
import { paymentInvoices } from "@/payment/db";

/** The caller holds the company row lock until the new document is inserted. */
export async function nextCompanyInvoiceSequence(
  tx: LedgerTransaction,
  companyId: string,
): Promise<number> {
  const [{ value }] = await tx
    .select({ value: max(paymentInvoices.invoiceSequenceNumber) })
    .from(paymentInvoices)
    .where(eq(paymentInvoices.companyId, companyId));
  return (value ?? 0) + 1;
}
