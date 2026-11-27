import { dateSchema } from "next-vibe/core/definition/common.schema";
import { z } from "zod";

export const bankLineSchema = z.object({
  id: z.uuid(),
  transactionId: z.string(),
  bookedDate: z.iso.date(),
  amount: z.string(),
  currency: z.string(),
  valueDate: z.iso.date().nullable().optional(),
  nativeAmount: z.string().nullable().optional(),
  nativeCurrency: z.string().nullable().optional(),
  feeAmount: z.string().nullable().optional(),
  feeCurrency: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  counterparty: z.string().nullable().optional(),
  supplierBillId: z.uuid().nullable().optional(),
  adjustmentJournalEntryId: z.uuid().nullable().optional(),
  matchKind: z.enum(["exact", "fee", "fx", "split"]).nullable().optional(),
  matchedAt: z.string().nullable().optional(),
});

export const bankCandidateSchema = z.object({
  id: z.uuid(),
  entryNumber: z.string(),
  description: z.string(),
  journalDate: dateSchema,
  kind: z.enum(["exact", "fee", "fx"]).optional(),
  fee: z.number().optional(),
  fx: z.number().optional(),
});

export const bankDocumentCandidateSchema = z.object({
  id: z.uuid(),
  documentType: z.enum(["invoice", "bill"]),
  documentNumber: z.string(),
  counterpartyName: z.string(),
  openAmount: z.string(),
  currency: z.string(),
  dueDate: z.string().nullable().optional(),
  matchBasis: z
    .enum(["reference", "iban", "amount_date", "fx_tolerance"])
    .optional(),
});

export const bankSplitRecordSchema = z.object({
  id: z.uuid(),
  targetType: z.enum(["journal_line", "invoice", "bill", "account"]),
  targetId: z.uuid(),
  amount: z.string(),
  description: z.string().nullable().optional(),
  createdJournalEntryId: z.uuid().nullable().optional(),
});

export const bankAccountStatusSchema = z.object({
  accountId: z.uuid(),
  accountCode: z.string(),
  accountName: z.string(),
  currency: z.string(),
  totalLines: z.number().int(),
  matchedLines: z.number().int(),
  unmatchedLines: z.number().int(),
  matchedAmount: z.string(),
  unmatchedAmount: z.string(),
  statementNetAmount: z.string(),
  ledgerBalance: z.string(),
  difference: z.string(),
  lastBookedDate: z.string().nullable(),
});
