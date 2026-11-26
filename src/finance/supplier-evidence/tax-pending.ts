import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";
import { billDueDateFromTerms } from "@/payment/bill/create/dates";
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import { evidenceCurrencies, evidenceDay, parseEvidenceAmount } from "./rules";

const pendingSchema = z.object({
  mailboxTaxPending: z.object({
    debitAccountId: z.uuid(),
    reviewId: z.uuid(),
  }),
});

export function mailboxTaxPending(
  metadata: (typeof paymentBills.$inferSelect)["metadata"],
): { debitAccountId: string; reviewId: string } | null {
  const parsed = pendingSchema.safeParse(metadata);
  return parsed.success ? parsed.data.mailboxTaxPending : null;
}

interface PendingDraftInput {
  companyId: string;
  vendorId: string;
  debitAccountId: string;
  reference: string;
  date: string;
  currency: string;
  grossAmount: string;
  reviewId?: string;
}

export async function parkMailboxTaxPending(
  tx: LedgerTransaction,
  input: PendingDraftInput,
): Promise<{ outcome: "draft" | "existing" | "review"; billId?: string }> {
  // The intake caller holds the company lock shared by AP, supplier evidence and bank follow-up.
  const date = evidenceDay(input.date);
  const currency = evidenceCurrencies.safeParse(input.currency);
  const units = parseEvidenceAmount(input.grossAmount);
  const reference = input.reference.trim().toUpperCase();
  if (!date || !currency.success || !units || !reference) {
    return { outcome: "review" };
  }
  const [vendor] = await tx
    .select()
    .from(purchasingVendors)
    .where(
      and(
        eq(purchasingVendors.id, input.vendorId),
        eq(purchasingVendors.companyId, input.companyId),
        eq(purchasingVendors.isActive, true),
      ),
    )
    .for("share");
  const [account] = await tx
    .select({ id: accountNodes.id })
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.id, input.debitAccountId),
        eq(accountNodes.companyId, input.companyId),
        eq(accountNodes.type, AccountType.ASSET),
        eq(accountNodes.subtype, AccountSubtype.PREPAID),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
      ),
    )
    .for("share");
  if (!vendor || !account) {
    return { outcome: "review" };
  }
  const amount = units / 10_000;
  const [existing, ambiguous] = await tx
    .select()
    .from(paymentBills)
    .where(
      and(
        eq(paymentBills.companyId, input.companyId),
        sql`upper(btrim(${paymentBills.billNumber})) = ${reference}`,
        sql`(${paymentBills.metadata}->>'vendorId' = ${vendor.id} OR (${paymentBills.metadata}->>'vendorId' IS NULL AND ${paymentBills.supplierName} = ${vendor.name}))`,
      ),
    )
    .limit(2);
  if (existing) {
    return !ambiguous &&
      existing.total === amount &&
      existing.currency === currency.data &&
      existing.billDate.toISOString().slice(0, 10) === input.date &&
      existing.status !== BillStatus.DISPUTED &&
      z.object({ vendorId: z.literal(vendor.id) }).safeParse(existing.metadata)
        .success &&
      (mailboxTaxPending(existing.metadata)?.debitAccountId ?? account.id) ===
        account.id
      ? { outcome: "existing", billId: existing.id }
      : { outcome: "review" };
  }
  const [bankCandidate] = await tx
    .select({ id: paymentBills.id })
    .from(paymentBills)
    .where(
      and(
        eq(paymentBills.companyId, input.companyId),
        eq(paymentBills.currency, currency.data),
        eq(paymentBills.total, amount),
        sql`${paymentBills.metadata}->>'vendorId' = ${vendor.id}`,
        sql`${paymentBills.metadata}->>'bankStatementLineId' IS NOT NULL`,
        sql`abs(${paymentBills.billDate}::date - ${input.date}::date) <= 7`,
      ),
    )
    .limit(1);
  if (bankCandidate) {
    return { outcome: "review" };
  }
  if (!input.reviewId) {
    return { outcome: "draft" };
  }
  const [saved] = await tx
    .insert(paymentBills)
    .values({
      companyId: input.companyId,
      supplierName: vendor.name,
      supplierVatNumber: vendor.vatNumber,
      billNumber: input.reference.trim(),
      billDate: date,
      dueDate:
        billDueDateFromTerms(date, vendor.defaultPaymentTermsDays) ?? null,
      currency: currency.data,
      total: amount,
      metadata: {
        vendorId: vendor.id,
        mailboxTaxPending: {
          debitAccountId: account.id,
          reviewId: input.reviewId,
        },
      },
    })
    .returning({ id: paymentBills.id });
  return saved ? { outcome: "draft", billId: saved.id } : { outcome: "review" };
}
