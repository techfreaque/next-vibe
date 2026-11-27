/**
 * Legal snapshot stored on an issued sales document
 * (payment_invoices.metadata.legal). Captured at issue so later edits to the
 * company or customer never change an issued document.
 */

import { z } from "zod";

import type { paymentInvoices } from "@/payment/db";

import { VatTreatmentDB } from "./enum";

/** Stored jsonb metadata of a sales document. */
export type DocumentMetadata =
  (typeof paymentInvoices.$inferSelect)["metadata"];

export const partySnapshotSchema = z.object({
  name: z.string(),
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  city: z.string().nullable(),
  postalCode: z.string().nullable(),
  country: z.string().nullable(),
  registrationNumber: z.string().nullable(),
  taxId: z.string().nullable(),
  vatNumber: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullish(),
});

export type PartySnapshot = z.infer<typeof partySnapshotSchema>;

export const legalSnapshotSchema = z.object({
  version: z.literal(1),
  country: z.string(),
  regime: z.string(),
  treatment: z.enum(VatTreatmentDB),
  issueDate: z.iso.date(),
  supplyDate: z.iso.date(),
  issuer: partySnapshotSchema,
  customer: partySnapshotSchema.nullable(),
  notes: z.array(z.string()),
});

export type LegalSnapshot = z.infer<typeof legalSnapshotSchema>;

/** Reads the snapshot from document metadata, null for older documents. */
export function readLegalSnapshot(
  metadata: DocumentMetadata,
): LegalSnapshot | null {
  const parsed = z.object({ legal: legalSnapshotSchema }).safeParse(metadata);
  return parsed.success ? parsed.data.legal : null;
}

/** Draft-time choices stored in metadata before issue. */
export const draftVatChoiceSchema = z.object({
  vatTreatment: z.enum(VatTreatmentDB).optional(),
  supplyDate: z.iso.date().optional(),
});

export function readDraftVatChoice(
  metadata: DocumentMetadata,
): z.infer<typeof draftVatChoiceSchema> {
  const parsed = draftVatChoiceSchema.safeParse(metadata);
  return parsed.success ? parsed.data : {};
}
