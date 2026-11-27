/**
 * Document PDF & Platform Email Delivery Service
 *
 * Generates branded PDF/A-3B documents (with ZUGFeRD/Factur-X CII XML & payment QR)
 * for invoices, credit notes, and estimates, and delivers them exclusively via the
 * platform `hi@` mailer (never `thea@`), recording every send/resend in
 * `document_email_deliveries`.
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
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createElement } from "react";
import { z } from "zod";

import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentAccess } from "@/finance/document-company-scope";
import {
  generateDocumentPdf,
  type PdfDocumentKind,
  type PdfParty,
} from "@/finance/pdf/document-pdf";
import {
  buildInvoicePaymentQr,
  type PaymentQrKind,
} from "@/finance/pdf/payment-qr";
import { buildCiiInvoice } from "@/finance/pdf/zugferd-cii";
import { CampaignType } from "@/messenger/accounts/enum";
import { EmailSendingRepository } from "@/messenger/providers/email/smtp-client/email-sending/repository";
import { systemMailboxEnv } from "@/messenger/system-mailbox/env";
import {
  companyPaymentSettings,
  documentEmailDeliveries,
  paymentEstimateLines,
  paymentEstimates,
  paymentInvoiceLines,
  paymentInvoices,
} from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";
import { buildInvoiceViewUrl } from "@/payment/invoice/token";
import { VatTreatment } from "@/tax/compliance/enum";
import { readLegalSnapshot } from "@/tax/compliance/legal-snapshot";

import { scopedTranslation } from "./i18n";

const invoiceMetaSchema = z
  .object({
    customerId: z.uuid().optional(),
    customerName: z.string().optional(),
    customerEmail: z.email().optional(),
    originalInvoiceId: z.uuid().optional(),
    originalInvoiceNumber: z.string().optional(),
    buyerReference: z.string().optional(),
    taxExemptionNotice: z.string().optional(),
  })
  .loose();

function sanitizeFilename(name: string): string {
  return (
    name.replaceAll(/[^A-Za-z0-9._-]+/gu, "_").replaceAll(/^_+|_+$/gu, "") ||
    "document"
  );
}

function isoDate(d: Date | null | undefined): string {
  return (d ?? new Date()).toISOString().slice(0, 10);
}

export interface GeneratedDocumentPdf {
  documentId: string;
  documentType: PdfDocumentKind;
  documentNumber: string;
  filename: string;
  contentType: string;
  pdfBytes: Uint8Array;
  pdfBase64: string;
  hasZugferd: boolean;
  qrKind: PaymentQrKind | null;
  qrSvg: string | null;
  paymentUrl: string | null;
  companyId: string | null;
  companyName: string;
  defaultRecipientEmail: string | null;
  defaultRecipientName: string | null;
}

export interface DeliveryRecordItem {
  id: string;
  documentType: PdfDocumentKind;
  documentId: string;
  documentNumber: string;
  recipientEmail: string;
  senderEmail: string;
  subject: string;
  attachmentFilename: string | null;
  status: "sent" | "failed";
  messageId: string | null;
  errorMessage: string | null;
  isResend: boolean;
  sentAt: string;
}

export class DocumentDeliveryService {
  static async generateInvoicePdf(
    invoiceId: string,
    userId: string,
    locale: CountryLanguage = defaultLocale,
    logger: EndpointLogger,
  ): Promise<ResponseType<GeneratedDocumentPdf>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId))
        .limit(1);
      if (!invoice) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const access = await getDocumentAccess(userId, invoice);
      if (!access) {
        return fail({
          message: t("errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const [company] = invoice.companyId
        ? await db
            .select()
            .from(companies)
            .where(eq(companies.id, invoice.companyId))
            .limit(1)
        : [];
      const [paySettings] = invoice.companyId
        ? await db
            .select()
            .from(companyPaymentSettings)
            .where(eq(companyPaymentSettings.companyId, invoice.companyId))
            .limit(1)
        : [];

      const lines = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, invoice.id))
        .orderBy(paymentInvoiceLines.sortOrder);

      const metaParsed = invoiceMetaSchema.safeParse(invoice.metadata ?? {});
      const meta = metaParsed.success ? metaParsed.data : undefined;
      const legal = readLegalSnapshot(invoice.metadata);
      const isCreditNote = invoice.providerInvoiceId.startsWith("CN-");
      const kind: PdfDocumentKind = isCreditNote ? "credit_note" : "invoice";
      const docNumber =
        invoice.invoiceNumber?.trim() ||
        (invoice.invoiceSequenceNumber
          ? `${isCreditNote ? "CN" : "INV"}-${invoice.invoiceSequenceNumber}`
          : invoice.providerInvoiceId);

      // Resolve customer contact email & name
      let recipientEmail: string | null =
        meta?.customerEmail ?? legal?.customer?.email ?? null;
      let recipientName: string | null =
        meta?.customerName ?? legal?.customer?.name ?? null;
      if (!recipientEmail && meta?.customerId) {
        const [customer] = await db
          .select({ email: users.email, publicName: users.publicName })
          .from(users)
          .where(eq(users.id, meta.customerId))
          .limit(1);
        recipientEmail = customer?.email ?? null;
        recipientName = recipientName ?? customer?.publicName ?? null;
      }

      // Compute open balance
      let amountPaid = 0;
      let amountDue = Number(invoice.amount);
      if (invoice.companyId && invoice.status === InvoiceStatus.OPEN) {
        const parts = getInvoiceOpenBalanceParts(
          db,
          invoice.companyId,
          invoice.currency,
        );
        const [bal] = await db
          .select({
            amountPaid: parts.amountPaid,
            openAmount: parts.openAmount,
          })
          .from(paymentInvoices)
          .leftJoin(parts.payments, parts.paymentJoin)
          .leftJoin(parts.credits, parts.creditJoin)
          .where(eq(paymentInvoices.id, invoice.id))
          .limit(1);
        if (bal) {
          amountPaid = Number(bal.amountPaid ?? 0);
          amountDue = Number(bal.openAmount ?? invoice.amount);
        }
      } else if (invoice.status === InvoiceStatus.PAID) {
        amountPaid = Number(invoice.amount);
        amountDue = 0;
      }

      const seller: PdfParty = {
        name: legal?.issuer?.name ?? company?.name ?? "Company",
        addressLine1:
          legal?.issuer?.addressLine1 ?? company?.addressLine1 ?? null,
        addressLine2:
          legal?.issuer?.addressLine2 ?? company?.addressLine2 ?? null,
        city: legal?.issuer?.city ?? company?.city ?? null,
        postalCode: legal?.issuer?.postalCode ?? company?.postalCode ?? null,
        country: legal?.issuer?.country ?? company?.country ?? "DE",
        registrationNumber:
          legal?.issuer?.registrationNumber ??
          company?.registrationNumber ??
          null,
        taxId: legal?.issuer?.taxId ?? company?.taxId ?? null,
        vatNumber: legal?.issuer?.vatNumber ?? company?.vatNumber ?? null,
        email: legal?.issuer?.email ?? company?.email ?? null,
        phone: legal?.issuer?.phone ?? company?.phone ?? null,
        website: company?.website ?? null,
      };
      const buyer: PdfParty = {
        name: recipientName ?? "Customer",
        addressLine1: legal?.customer?.addressLine1 ?? null,
        addressLine2: legal?.customer?.addressLine2 ?? null,
        city: legal?.customer?.city ?? null,
        postalCode: legal?.customer?.postalCode ?? null,
        country: legal?.customer?.country ?? null,
        registrationNumber: legal?.customer?.registrationNumber ?? null,
        taxId: legal?.customer?.taxId ?? null,
        vatNumber: legal?.customer?.vatNumber ?? null,
        email: recipientEmail,
      };

      const total = Number(invoice.amount);
      const taxAmount = lines.reduce((sum, l) => sum + Number(l.taxAmount), 0);
      const subtotal = Math.round((total - taxAmount) * 100) / 100;
      const issueDateStr = legal?.issueDate ?? isoDate(invoice.createdAt);
      const dueDateStr = invoice.dueDate ? isoDate(invoice.dueDate) : null;
      const supplyDateStr = legal?.supplyDate ?? issueDateStr;

      const paymentUrl =
        invoice.invoiceUrl ||
        (invoice.status === InvoiceStatus.OPEN ||
        invoice.status === InvoiceStatus.PAID
          ? buildInvoiceViewUrl(invoice.id)
          : null);

      const bankIban = paySettings?.bankIban?.trim() || null;
      const bankBic = paySettings?.bankBic?.trim() || null;
      const bankHolder = paySettings?.bankAccountHolder?.trim() || seller.name;

      const paymentQr =
        !isCreditNote && bankIban && amountDue > 0
          ? buildInvoicePaymentQr(seller.country, {
              beneficiaryName: bankHolder,
              iban: bankIban,
              bic: bankBic,
              amount: amountDue,
              currency: invoice.currency,
              reference: docNumber,
              remittanceText: docNumber,
              dueDate: dueDateStr,
              variableSymbol: docNumber.replaceAll(/\D+/gu, "").slice(0, 10),
              beneficiaryAddressLine1: seller.addressLine1,
              beneficiaryAddressLine2: [seller.postalCode, seller.city]
                .filter(Boolean)
                .join(" "),
            })
          : null;

      const notes: string[] = [];
      if (meta?.taxExemptionNotice) {
        notes.push(meta.taxExemptionNotice);
      }
      if (invoice.notes) {
        notes.push(invoice.notes);
      }

      // Embed ZUGFeRD / Factur-X EN 16931 CII XML for issued invoices & credit notes
      const isIssued =
        invoice.status === InvoiceStatus.OPEN ||
        invoice.status === InvoiceStatus.PAID;
      const zugferdXml =
        isIssued && lines.length > 0
          ? buildCiiInvoice({
              number: docNumber,
              issueDate: issueDateStr,
              supplyDate: supplyDateStr,
              dueDate: dueDateStr,
              currency: invoice.currency,
              isCreditNote,
              treatment: legal?.treatment ?? VatTreatment.DOMESTIC,
              buyerReference: meta?.buyerReference ?? null,
              paymentIban: bankIban,
              paymentBic: bankBic,
              paymentUrl,
              notes,
              seller: {
                name: seller.name,
                addressLine1: seller.addressLine1 ?? null,
                addressLine2: seller.addressLine2 ?? null,
                city: seller.city ?? null,
                postalCode: seller.postalCode ?? null,
                country: seller.country ?? null,
                registrationNumber: seller.registrationNumber ?? null,
                taxId: seller.taxId ?? null,
                vatNumber: seller.vatNumber ?? null,
                email: seller.email ?? null,
                phone: seller.phone ?? null,
              },
              buyer: {
                name: buyer.name,
                addressLine1: buyer.addressLine1 ?? null,
                addressLine2: buyer.addressLine2 ?? null,
                city: buyer.city ?? null,
                postalCode: buyer.postalCode ?? null,
                country: buyer.country ?? null,
                registrationNumber: buyer.registrationNumber ?? null,
                taxId: buyer.taxId ?? null,
                vatNumber: buyer.vatNumber ?? null,
                email: buyer.email ?? null,
              },
              lines: lines.map((l) => ({
                description: l.description,
                quantity: Number(l.quantity),
                unitPrice: Number(l.unitPrice),
                netAmount:
                  Math.round(
                    (Number(l.lineTotal) - Number(l.taxAmount)) * 100,
                  ) / 100,
                taxRate: Number(l.taxRate),
                taxAmount: Number(l.taxAmount),
              })),
            })
          : null;

      const pdfBytes = generateDocumentPdf({
        kind,
        locale,
        countryCode: seller.country,
        documentNumber: docNumber,
        issueDate: issueDateStr,
        supplyDate: supplyDateStr,
        dueDate: dueDateStr,
        originalInvoiceNumber: meta?.originalInvoiceNumber ?? null,
        buyerReference: meta?.buyerReference ?? null,
        currency: invoice.currency,
        seller,
        buyer,
        lines: lines.map((l) => ({
          description: l.description,
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
          taxRate: Number(l.taxRate),
          taxAmount: Number(l.taxAmount),
          lineTotal: Number(l.lineTotal),
        })),
        subtotal,
        taxAmount,
        total,
        amountPaid,
        amountDue,
        notes,
        bankIban,
        bankBic,
        bankHolder,
        paymentUrl,
        paymentQr,
        zugferdXml,
      });

      const filename = `${sanitizeFilename(docNumber)}.pdf`;
      return success({
        documentId: invoice.id,
        documentType: kind,
        documentNumber: docNumber,
        filename,
        contentType: "application/pdf",
        pdfBytes,
        pdfBase64: Buffer.from(pdfBytes).toString("base64"),
        hasZugferd: Boolean(zugferdXml),
        qrKind: paymentQr?.kind ?? null,
        qrSvg: paymentQr?.svg ?? null,
        paymentUrl,
        companyId: invoice.companyId,
        companyName: seller.name,
        defaultRecipientEmail: recipientEmail,
        defaultRecipientName: recipientName,
      });
    } catch (error) {
      logger.error("Failed to generate invoice PDF", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async generateEstimatePdf(
    estimateId: string,
    userId: string,
    locale: CountryLanguage = defaultLocale,
    logger: EndpointLogger,
  ): Promise<ResponseType<GeneratedDocumentPdf>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [estimate] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, estimateId))
        .limit(1);
      if (!estimate) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const auth = await CompanyAuthRepository.requireMember(
        userId,
        estimate.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!auth.success) {
        return auth;
      }

      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, estimate.companyId))
        .limit(1);
      const lines = await db
        .select()
        .from(paymentEstimateLines)
        .where(eq(paymentEstimateLines.estimateId, estimate.id))
        .orderBy(paymentEstimateLines.sortOrder);

      const seller: PdfParty = {
        name: company?.name ?? "Company",
        addressLine1: company?.addressLine1 ?? null,
        addressLine2: company?.addressLine2 ?? null,
        city: company?.city ?? null,
        postalCode: company?.postalCode ?? null,
        country: company?.country ?? "DE",
        registrationNumber: company?.registrationNumber ?? null,
        taxId: company?.taxId ?? null,
        vatNumber: company?.vatNumber ?? null,
        email: company?.email ?? null,
        phone: company?.phone ?? null,
        website: company?.website ?? null,
      };
      const buyer: PdfParty = {
        name: estimate.customerName ?? "Customer",
        email: estimate.customerEmail ?? null,
      };
      const notes = [estimate.notes, estimate.terms].filter((n): n is string =>
        Boolean(n && n.trim().length > 0),
      );

      const pdfBytes = generateDocumentPdf({
        kind: "estimate",
        locale,
        countryCode: seller.country,
        documentNumber: estimate.estimateNumber,
        issueDate: isoDate(estimate.createdAt),
        dueDate: estimate.validUntil ? isoDate(estimate.validUntil) : null,
        currency: estimate.currency,
        seller,
        buyer,
        lines: lines.map((l) => ({
          description: l.description,
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
          taxRate: Number(l.taxRate),
          taxAmount: Number(l.taxAmount),
          lineTotal: Number(l.lineTotal),
        })),
        subtotal: estimate.subtotal,
        taxAmount: estimate.taxAmount,
        total: estimate.total,
        notes,
      });

      const filename = `${sanitizeFilename(estimate.estimateNumber)}.pdf`;
      return success({
        documentId: estimate.id,
        documentType: "estimate",
        documentNumber: estimate.estimateNumber,
        filename,
        contentType: "application/pdf",
        pdfBytes,
        pdfBase64: Buffer.from(pdfBytes).toString("base64"),
        hasZugferd: false,
        qrKind: null,
        qrSvg: null,
        paymentUrl: null,
        companyId: estimate.companyId,
        companyName: seller.name,
        defaultRecipientEmail: estimate.customerEmail ?? null,
        defaultRecipientName: estimate.customerName ?? null,
      });
    } catch (error) {
      logger.error("Failed to generate estimate PDF", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Sends a document PDF via the platform mailer (`hi@` system account, NEVER `thea@`)
   * and records every send/resend attempt in `document_email_deliveries`.
   */
  static async sendDocumentEmail(params: {
    documentType: PdfDocumentKind;
    documentId: string;
    recipientEmail: string;
    recipientName?: string;
    customMessage?: string;
    isResend?: boolean;
    userId: string;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<ResponseType<DeliveryRecordItem>> {
    const { t } = scopedTranslation.scopedT(params.locale);

    const pdfResult =
      params.documentType === "estimate"
        ? await DocumentDeliveryService.generateEstimatePdf(
            params.documentId,
            params.userId,
            params.locale,
            params.logger,
          )
        : await DocumentDeliveryService.generateInvoicePdf(
            params.documentId,
            params.userId,
            params.locale,
            params.logger,
          );

    if (!pdfResult.success) {
      return pdfResult;
    }

    const doc = pdfResult.data;
    if (doc.companyId) {
      const auth = await CompanyAuthRepository.requireMember(
        params.userId,
        doc.companyId,
        CompanyMemberRole.ACCOUNTANT,
        params.logger,
        params.locale,
      );
      if (!auth.success) {
        return auth;
      }
    }

    const subject =
      doc.documentType === "credit_note"
        ? t("deliver.subjectCreditNote", {
            number: doc.documentNumber,
            company: doc.companyName,
          })
        : doc.documentType === "estimate"
          ? t("deliver.subjectEstimate", {
              number: doc.documentNumber,
              company: doc.companyName,
            })
          : t("deliver.subjectInvoice", {
              number: doc.documentNumber,
              company: doc.companyName,
            });

    const lines: string[] = [
      t("deliver.bodyIntro", { document: doc.documentNumber }),
    ];
    if (params.customMessage?.trim()) {
      lines.push(params.customMessage.trim());
    }
    if (doc.paymentUrl) {
      lines.push(`${t("deliver.bodyPayOnline")} ${doc.paymentUrl}`);
    }
    const textBody = lines.join("\n\n");

    const htmlElement = createElement(
      "div",
      {
        style: {
          fontFamily: "sans-serif",
          lineHeight: "1.6",
          color: "#111827",
        },
      },
      ...lines.map((line, index) =>
        createElement("p", { key: String(index) }, line),
      ),
    );

    const sendRes = await EmailSendingRepository.sendEmail(
      {
        jsx: htmlElement,
        text: textBody,
        subject,
        toEmail: params.recipientEmail,
        toName:
          params.recipientName ??
          doc.defaultRecipientName ??
          params.recipientEmail,
        locale: params.locale,
        senderName: doc.companyName,
        campaignType: CampaignType.SYSTEM,
        attachments: [
          {
            filename: doc.filename,
            content: Buffer.from(doc.pdfBytes),
            contentType: "application/pdf",
          },
        ],
      },
      params.logger,
      params.locale,
    );

    // Guard: verify the platform mailer never used thea@
    const theaAddress =
      systemMailboxEnv.THEA_MAIL_ADDRESS?.trim().toLowerCase();
    const senderAccountName = sendRes.success
      ? sendRes.data.result.accountName
      : "platform-smtp";
    if (theaAddress && senderAccountName.toLowerCase().includes(theaAddress)) {
      return fail({
        message: t("deliver.theaBlocked"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const status = sendRes.success ? "sent" : "failed";
    const messageId = sendRes.success ? sendRes.data.result.messageId : null;
    const errorMessage = sendRes.success ? null : sendRes.message;

    const [logged] = await db
      .insert(documentEmailDeliveries)
      .values({
        companyId: doc.companyId,
        documentType: doc.documentType,
        documentId: doc.documentId,
        documentNumber: doc.documentNumber,
        recipientEmail: params.recipientEmail,
        senderEmail: senderAccountName,
        subject,
        attachmentFilename: doc.filename,
        status,
        messageId,
        errorMessage,
        isResend: params.isResend ?? false,
        sentByUserId: params.userId,
      })
      .returning();

    if (!sendRes.success) {
      return fail({
        message: t("deliver.mailerUnavailable"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    return success({
      id: logged.id,
      documentType: logged.documentType,
      documentId: logged.documentId,
      documentNumber: logged.documentNumber,
      recipientEmail: logged.recipientEmail,
      senderEmail: logged.senderEmail,
      subject: logged.subject,
      attachmentFilename: logged.attachmentFilename,
      status: logged.status,
      messageId: logged.messageId,
      errorMessage: logged.errorMessage,
      isResend: logged.isResend,
      sentAt: logged.sentAt.toISOString(),
    });
  }

  static async listDeliveries(
    documentType: PdfDocumentKind,
    documentId: string,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      documentNumber: string;
      defaultRecipientEmail: string | null;
      defaultRecipientName: string | null;
      deliveries: DeliveryRecordItem[];
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const pdfMeta =
        documentType === "estimate"
          ? await DocumentDeliveryService.generateEstimatePdf(
              documentId,
              userId,
              locale,
              logger,
            )
          : await DocumentDeliveryService.generateInvoicePdf(
              documentId,
              userId,
              locale,
              logger,
            );
      if (!pdfMeta.success) {
        return pdfMeta;
      }

      const rows = await db
        .select()
        .from(documentEmailDeliveries)
        .where(
          and(
            eq(documentEmailDeliveries.documentId, documentId),
            eq(documentEmailDeliveries.documentType, pdfMeta.data.documentType),
          ),
        )
        .orderBy(desc(documentEmailDeliveries.sentAt))
        .limit(50);

      return success({
        documentNumber: pdfMeta.data.documentNumber,
        defaultRecipientEmail: pdfMeta.data.defaultRecipientEmail,
        defaultRecipientName: pdfMeta.data.defaultRecipientName,
        deliveries: rows.map((row) => ({
          id: row.id,
          documentType: row.documentType,
          documentId: row.documentId,
          documentNumber: row.documentNumber,
          recipientEmail: row.recipientEmail,
          senderEmail: row.senderEmail,
          subject: row.subject,
          attachmentFilename: row.attachmentFilename,
          status: row.status,
          messageId: row.messageId,
          errorMessage: row.errorMessage,
          isResend: row.isResend,
          sentAt: row.sentAt.toISOString(),
        })),
      });
    } catch (error) {
      logger.error("Failed to load document delivery log", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
