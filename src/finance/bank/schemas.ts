import { dateSchema } from "next-vibe/core/definition/common.schema";
import { z } from "zod";

export const bankLineSchema = z.object({
  id: z.uuid(),
  transactionId: z.string(),
  bookedDate: z.iso.date(),
  amount: z.string(),
  currency: z.string(),
});

export const bankCandidateSchema = z.object({
  id: z.uuid(),
  entryNumber: z.string(),
  description: z.string(),
  journalDate: dateSchema,
});
