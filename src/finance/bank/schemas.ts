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
