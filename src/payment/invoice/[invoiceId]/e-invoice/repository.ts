/**
 * Invoice E-Invoice Repository
 * Resolves an issued document (legal snapshot first, live company and
 * billing address for older documents) into a Peppol BIS 3.0 file.
 */

import "server-only";

import { and, desc, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { userAddresses, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { journalEntries } from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";
import { getDocumentAccess } from "@/finance/document-company-scope";
import {
  buildUblInvoice,
  type UblFieldId,
  type UblInvoiceInput,
  type UblParty,
  validateUblInput,
} from "@/finance/e-invoice/ubl";
import { VatTreatment, type VatTreatmentValue } from "@/tax/compliance/enum";
import {
  draftVatChoiceSchema,
  type LegalSnapshot,
  legalSnapshotSchema,
  type PartySnapshot,
} from "@/tax/compliance/legal-snapshot";
import { getCountryProfile } from "@/tax/compliance/profiles";
import { CompanyTaxRegime } from "@/tax/regime/enum";
import { getCompanyTaxRegime } from "@/tax/regime/policy";

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import type {
  InvoiceEInvoiceResponseOutput,
  InvoiceEInvoiceUrlPathParams,
} from "./definition";
import { type InvoiceEInvoiceTranslationKey, scopedTranslation } from "./i18n";

const FIELD_LABELS: Record<UblFieldId, InvoiceEInvoiceTranslationKey> = {
  "BT-1": "fields.bt1",
  "BT-2": "fields.bt2",
  "BT-5": "fields.bt5",
  "BT-9": "fields.bt9",
  "BT-27": "fields.bt27",
  "BT-31": "fields.bt31",
  "BT-34": "fields.bt34",
  "BT-40": "fields.bt40",
  "BT-44": "fields.bt44",
  "BT-48": "fields.bt48",
  "BT-49": "fields.bt49",
  "BT-55": "fields.bt55",
  "BT-153": "fields.bt153",
  "BG-25": "fields.bg25",
};

const metadataSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  originalInvoiceId: z.string().optional(),
  taxExemptionNotice: z.string().optional(),
});

/** Parses raw jsonb metadata (any shape) into the issue-time snapshot. */
function legalSnapshotOf(
  metadata: (typeof paymentInvoices.$inferSelect)["metadata"],
): LegalSnapshot | null {
  const parsed = z.object({ legal: legalSnapshotSchema }).safeParse(metadata);
  return parsed.success ? parsed.data.legal : null;
}

function isoDay(value: Date | null | undefined): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}

function fromSnapshot(party: PartySnapshot): UblParty {
  return { ...party };
}

function emptyParty(): UblParty {
  return {
    name: null,
    addressLine1: null,
    addressLine2: null,
    city: null,
    postalCode: null,
    country: null,
    registrationNumber: null,
    taxId: null,
    vatNumber: null,
    email: null,
  };
}

export class InvoiceEInvoiceRepository {
  static async getEInvoice(
    userId: string,
    urlPathParams: InvoiceEInvoiceUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceEInvoiceResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);
      if (!invoice) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!(await getDocumentAccess(userId, invoice))) {
        return fail({
          message: t("errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      if (invoice.status === InvoiceStatus.DRAFT) {
        return fail({
          message: t("errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const lines = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, invoice.id))
        .orderBy(paymentInvoiceLines.sortOrder);

      const snapshot = legalSnapshotOf(invoice.metadata);
      const parsedMeta = metadataSchema.safeParse(invoice.metadata);
      const meta = parsedMeta.success ? parsedMeta.data : {};
      const parsedDraft = draftVatChoiceSchema.safeParse(invoice.metadata);
      const draft = parsedDraft.success ? parsedDraft.data : {};
      const isCreditNote = invoice.providerInvoiceId.startsWith("CN-");

      const issueDate =
        snapshot?.issueDate ??
        (await InvoiceEInvoiceRepository.postingDay(invoice.journalEntryId)) ??
        isoDay(invoice.createdAt);

      const seller = snapshot
        ? fromSnapshot(snapshot.issuer)
        : await InvoiceEInvoiceRepository.liveIssuer(invoice.companyId);
      const buyer =
        (snapshot?.customer ? fromSnapshot(snapshot.customer) : null) ??
        (await InvoiceEInvoiceRepository.liveCustomer(
          meta.customerId,
          meta.customerName,
        ));

      const regime =
        snapshot?.regime ??
        (invoice.companyId && issueDate
          ? (
              await getCompanyTaxRegime(
                db,
                invoice.companyId,
                new Date(issueDate),
              )
            ).code
          : CompanyTaxRegime.STANDARD);
      const vatPayer = regime === CompanyTaxRegime.STANDARD;
      const treatment =
        snapshot?.treatment ?? draft.vatTreatment ?? VatTreatment.DOMESTIC;
      const notes =
        snapshot?.notes ??
        (meta.taxExemptionNotice ? [meta.taxExemptionNotice] : []);

      const original =
        isCreditNote && meta.originalInvoiceId
          ? await InvoiceEInvoiceRepository.originalInvoice(
              meta.originalInvoiceId,
              invoice.companyId,
            )
          : null;

      const input: UblInvoiceInput = {
        documentType: isCreditNote ? "CREDIT_NOTE" : "INVOICE",
        number: invoice.invoiceNumber,
        issueDate,
        dueDate: isoDay(invoice.dueDate),
        supplyDate: snapshot?.supplyDate ?? draft.supplyDate ?? issueDate,
        currency: invoice.currency,
        treatment,
        vatPayer,
        notes,
        exemptionReason: InvoiceEInvoiceRepository.exemptionReason(
          snapshot,
          seller.country,
          treatment,
          vatPayer,
          notes,
        ),
        buyerReference: null,
        originalInvoice: original,
        iban: null,
        seller,
        buyer,
        lines: lines.map((line) => ({
          description: line.description,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          taxRate: line.taxRate,
          taxAmount: line.taxAmount,
          lineTotal: line.lineTotal,
        })),
      };

      const missing = validateUblInput(input);
      const number = invoice.invoiceNumber ?? invoice.id;
      const safeNumber = number.replace(/[^A-Za-z0-9._-]+/g, "-");
      return success({
        invoiceNumber: number,
        isCreditNote,
        fileName: `${isCreditNote ? "credit-note" : "invoice"}-${safeNumber}.xml`,
        ready: missing.length === 0,
        missingFields: missing.map((field) => ({
          field,
          label: t(FIELD_LABELS[field]),
        })),
        xml: buildUblInvoice(input),
      });
    } catch (error) {
      logger.error("Failed to build e-invoice", {
        error: parseError(error).message,
        invoiceId: urlPathParams.invoiceId,
      });
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** The legal note for the treatment, else the stored exemption notice. */
  private static exemptionReason(
    snapshot: LegalSnapshot | null,
    country: string | null,
    treatment: typeof VatTreatmentValue,
    vatPayer: boolean,
    notes: readonly string[],
  ): string | null {
    if (!vatPayer) {
      return notes[0] ?? null;
    }
    const profileNote = getCountryProfile(snapshot?.country ?? country).invoice
      .notes[treatment];
    return profileNote ?? null;
  }

  private static async postingDay(
    journalEntryId: string | null,
  ): Promise<string | null> {
    if (!journalEntryId) {
      return null;
    }
    const [entry] = await db
      .select({ date: journalEntries.date })
      .from(journalEntries)
      .where(eq(journalEntries.id, journalEntryId))
      .limit(1);
    return isoDay(entry?.date);
  }

  private static async liveIssuer(companyId: string | null): Promise<UblParty> {
    if (!companyId) {
      return emptyParty();
    }
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);
    if (!company) {
      return emptyParty();
    }
    return {
      name: company.name,
      addressLine1: company.addressLine1,
      addressLine2: company.addressLine2,
      city: company.city,
      postalCode: company.postalCode,
      country: company.country,
      registrationNumber: company.registrationNumber,
      taxId: company.taxId,
      vatNumber: company.vatNumber,
      email: company.email,
    };
  }

  private static async liveCustomer(
    customerId: string | undefined,
    savedName: string | undefined,
  ): Promise<UblParty | null> {
    if (!customerId || !z.uuid().safeParse(customerId).success) {
      return savedName ? { ...emptyParty(), name: savedName } : null;
    }
    const [user] = await db
      .select({
        email: users.email,
        privateName: users.privateName,
        publicName: users.publicName,
      })
      .from(users)
      .where(eq(users.id, customerId))
      .limit(1);
    const [address] = await db
      .select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, customerId))
      .orderBy(
        desc(userAddresses.isDefaultBilling),
        desc(userAddresses.updatedAt),
      )
      .limit(1);
    if (!user && !address) {
      return savedName ? { ...emptyParty(), name: savedName } : null;
    }
    return {
      name:
        address?.company ??
        address?.fullName ??
        savedName ??
        user?.privateName ??
        user?.publicName ??
        null,
      addressLine1: address?.addressLine1 ?? null,
      addressLine2: address?.addressLine2 ?? null,
      city: address?.city ?? null,
      postalCode: address?.postalCode ?? null,
      country: address?.country ?? null,
      registrationNumber: null,
      taxId: address?.taxId ?? null,
      vatNumber: address?.vatNumber ?? null,
      email: user?.email ?? null,
    };
  }

  private static async originalInvoice(
    originalId: string,
    companyId: string | null,
  ): Promise<UblInvoiceInput["originalInvoice"]> {
    if (!z.uuid().safeParse(originalId).success) {
      return null;
    }
    const [original] = await db
      .select({
        invoiceNumber: paymentInvoices.invoiceNumber,
        metadata: paymentInvoices.metadata,
        journalEntryId: paymentInvoices.journalEntryId,
        createdAt: paymentInvoices.createdAt,
      })
      .from(paymentInvoices)
      .where(
        and(
          eq(paymentInvoices.id, originalId),
          companyId ? eq(paymentInvoices.companyId, companyId) : undefined,
        ),
      )
      .limit(1);
    if (!original?.invoiceNumber) {
      return null;
    }
    const issueDate =
      legalSnapshotOf(original.metadata)?.issueDate ??
      (await InvoiceEInvoiceRepository.postingDay(original.journalEntryId)) ??
      isoDay(original.createdAt);
    return { number: original.invoiceNumber, issueDate };
  }
}
