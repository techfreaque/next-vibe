import "server-only";

import { and, eq, isNotNull, isNull, ne, sql } from "drizzle-orm";
import { z } from "zod";

import { journalEntries, journalEntryLines } from "@/chart-of-accounts/db";
import {
  JournalEntryStatus,
  JournalSourceType,
} from "@/chart-of-accounts/enum";
import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";
import { paymentBills } from "@/payment/db";

import { bankStatementLines } from "../db";
import { bankUnits } from "../reconciliation-plan";

const bankBillOrigin = z.object({
  vendorId: z.uuid(),
  expenseAccountId: z.uuid(),
  bankStatementLineId: z.uuid(),
  originalSupplierInvoicePending: z.boolean(),
  noSupplierDocumentConfirmedAt: z.iso.datetime().optional(),
  supplierDocumentLinkedAfterPosting: z.boolean().optional(),
});

export type BankBillOrigin = z.output<typeof bankBillOrigin>;

export function readBankBillOrigin(
  bill: Pick<typeof paymentBills.$inferSelect, "metadata">,
): BankBillOrigin | null {
  const result = bankBillOrigin.safeParse(bill.metadata);
  return result.success ? result.data : null;
}

export async function findBankBillStatement(
  tx: Pick<LedgerTransaction, "select">,
  bill: Pick<
    typeof paymentBills.$inferSelect,
    "id" | "companyId" | "currency" | "total"
  >,
  origin: BankBillOrigin,
): Promise<
  Pick<typeof bankStatementLines.$inferSelect, "id" | "bookedDate"> | undefined
> {
  const [statement] = await tx
    .select({
      id: bankStatementLines.id,
      bookedDate: bankStatementLines.bookedDate,
      amount: bankStatementLines.amount,
      currency: bankStatementLines.currency,
      nativeAmount: bankStatementLines.nativeAmount,
      nativeCurrency: bankStatementLines.nativeCurrency,
      matchedJournalLineId: bankStatementLines.matchedJournalLineId,
    })
    .from(bankStatementLines)
    .where(
      and(
        eq(bankStatementLines.id, origin.bankStatementLineId),
        eq(bankStatementLines.companyId, bill.companyId),
        eq(bankStatementLines.supplierBillId, bill.id),
      ),
    );
  if (!statement) {
    return undefined;
  }
  if (statement.matchedJournalLineId) {
    const [payment] = await tx
      .select({ id: journalEntries.id })
      .from(journalEntries)
      .innerJoin(
        journalEntryLines,
        eq(journalEntries.id, journalEntryLines.journalEntryId),
      )
      .where(
        and(
          eq(journalEntryLines.id, statement.matchedJournalLineId),
          eq(journalEntries.companyId, bill.companyId),
          eq(journalEntries.sourceType, JournalSourceType.AP_PAYMENT),
          eq(journalEntries.sourceId, bill.id),
          eq(journalEntries.status, JournalEntryStatus.POSTED),
          isNull(journalEntries.reversedById),
        ),
      );
    if (!payment) {
      return undefined;
    }
  }
  const matchesGross = (
    amount: string | null,
    currency: string | null,
  ): boolean => {
    const units = amount && bankUnits(amount);
    return Boolean(
      units &&
      currency === bill.currency &&
      units < BigInt(0) &&
      Number(-units) / 10_000 === bill.total,
    );
  };
  return matchesGross(statement.nativeAmount, statement.nativeCurrency) ||
    matchesGross(statement.amount, statement.currency)
    ? { id: statement.id, bookedDate: statement.bookedDate }
    : undefined;
}

interface SupplierBillFacts {
  companyId: string;
  vendorId: string | null;
  supplierName: string;
  currency: typeof paymentBills.$inferSelect.currency;
  total: number;
  date: Date;
  excludedBillId?: string;
  maxDateDistance?: number;
}

/** Candidate detection is deliberately approximate. Linking always uses the selected bill ID. */
export async function hasSupplierBillCandidate(
  tx: Pick<LedgerTransaction, "select">,
  facts: SupplierBillFacts,
  mode: "bank-pending" | "numbered-document" | "mailbox-tax-pending",
): Promise<boolean> {
  const [candidate] = await tx
    .select({ id: paymentBills.id })
    .from(paymentBills)
    .where(
      and(
        eq(paymentBills.companyId, facts.companyId),
        eq(paymentBills.currency, facts.currency),
        eq(paymentBills.total, facts.total),
        facts.excludedBillId
          ? ne(paymentBills.id, facts.excludedBillId)
          : undefined,
        facts.maxDateDistance === undefined
          ? undefined
          : sql`abs(${paymentBills.billDate}::date - ${facts.date.toISOString().slice(0, 10)}::date) <= ${facts.maxDateDistance}`,
        mode === "mailbox-tax-pending"
          ? sql`${paymentBills.metadata}->>'vendorId' = ${facts.vendorId}`
          : sql`(
              (${facts.vendorId}::uuid IS NOT NULL AND ${paymentBills.metadata}->>'vendorId' = ${facts.vendorId})
              OR ((${facts.vendorId}::uuid IS NULL OR ${paymentBills.metadata}->>'vendorId' IS NULL)
                AND ${paymentBills.supplierName} = ${facts.supplierName})
            )`,
        mode === "bank-pending"
          ? and(
              isNull(paymentBills.billNumber),
              sql`${paymentBills.metadata}->>'originalSupplierInvoicePending' = 'true'`,
              sql`${paymentBills.metadata}->>'bankStatementLineId' IS NOT NULL`,
            )
          : mode === "mailbox-tax-pending"
            ? sql`${paymentBills.metadata}->'mailboxTaxPending' IS NOT NULL`
            : and(
                isNotNull(paymentBills.billNumber),
                sql`length(btrim(${paymentBills.billNumber})) > 0`,
              ),
      ),
    )
    .limit(1);
  return Boolean(candidate);
}
