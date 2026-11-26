import "server-only";

import { and, eq } from "drizzle-orm";

import { accountingDay } from "@/chart-of-accounts/shared/journal-validation";
import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";
import type { paymentBills } from "@/payment/db";

import { supplierEvidenceRecords } from "./db";
import { parseEvidenceAmount } from "./rules";

/** The linked original must still substantiate the selected prepaid asset. */
export async function isConfirmedPrepaidSupplierBill(
  tx: LedgerTransaction,
  bill: Pick<
    typeof paymentBills.$inferSelect,
    "id" | "companyId" | "currency" | "billDate" | "total" | "taxAmount"
  >,
  accountId: string,
): Promise<boolean> {
  const [evidence] = await tx
    .select()
    .from(supplierEvidenceRecords)
    .where(
      and(
        eq(supplierEvidenceRecords.companyId, bill.companyId),
        eq(supplierEvidenceRecords.billId, bill.id),
        eq(supplierEvidenceRecords.kind, "fundBill"),
        eq(supplierEvidenceRecords.debitAccountId, accountId),
      ),
    )
    .for("share");

  return (
    !!evidence &&
    evidence.currency === bill.currency &&
    evidence.date.getTime() === accountingDay(bill.billDate).getTime() &&
    parseEvidenceAmount(evidence.grossAmount) ===
      Math.round(bill.total * 10_000) &&
    parseEvidenceAmount(evidence.taxAmount) ===
      Math.round(bill.taxAmount * 10_000)
  );
}
