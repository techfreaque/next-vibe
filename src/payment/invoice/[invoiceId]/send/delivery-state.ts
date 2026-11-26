import { z } from "zod";

export const invoiceMailStatusSchema = z.enum([
  "ready",
  "pending",
  "accepted",
  "retryable",
  "uncertain",
]);
export type InvoiceMailStatus = z.infer<typeof invoiceMailStatusSchema>;

export const invoiceMailClaimSchema = z.object({
  status: z.enum(["pending", "accepted", "retryable", "uncertain"]),
  attemptId: z.uuid(),
  actorId: z.uuid(),
  recipient: z.email(),
  updatedAt: z.iso.datetime(),
});
export type InvoiceMailClaim = z.infer<typeof invoiceMailClaimSchema>;

export interface InvoiceMailPayload {
  to: string;
  subject: string;
  text: string;
  actorId: string;
}
export type InvoiceMailOutcome = "accepted" | "retryable" | "uncertain";
