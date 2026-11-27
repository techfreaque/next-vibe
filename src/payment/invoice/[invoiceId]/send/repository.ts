/**
 * Issues a draft invoice and posts the company's receivable.
 */

import "server-only";

import { and, eq, ne, sql } from "drizzle-orm";
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
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  AccountSubtype,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { evaluateInvoiceIssue } from "@/tax/compliance/invoice-issue";
import type { LegalSnapshot } from "@/tax/compliance/legal-snapshot";
import { scopedTranslation as regimeTranslation } from "@/tax/regime/i18n";
import { getCompanyTaxRegime, notesWithTaxNotice } from "@/tax/regime/policy";

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import { buildInvoiceViewUrl } from "../../token";
import type {
  InvoiceSendResponseOutput,
  InvoiceSendUrlPathParams,
} from "./definition";
import { InvoiceDeliveryRepository } from "./delivery-repository";
import { scopedTranslation } from "./i18n";

export class InvoiceSendRepository {
  static shareInvoice = InvoiceDeliveryRepository.share;
  static emailInvoice = InvoiceDeliveryRepository.send;

  static async sendInvoice(
    userId: string,
    urlPathParams: InvoiceSendUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceSendResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [observedInvoice] = await db
        .select({
          companyId: paymentInvoices.companyId,
          userId: paymentInvoices.userId,
        })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);
      if (!observedInvoice) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!(await getDocumentAccess(userId, observedInvoice))?.canManage) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return await db
        .transaction(async (tx) => {
          if (observedInvoice.companyId) {
            await lockLedgerCompany(tx, observedInvoice.companyId);
          }
          const [invoice] = await tx
            .select()
            .from(paymentInvoices)
            .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
            .limit(1)
            .for("update");
          if (!invoice) {
            return fail({
              message: t("post.errors.notFound.title"),
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }
          if (
            invoice.companyId !== observedInvoice.companyId ||
            !(await getDocumentAccess(userId, invoice, tx))?.canManage
          ) {
            return fail({
              message: t("post.errors.forbidden.title"),
              errorType: ErrorResponseTypes.FORBIDDEN,
            });
          }
          if (
            invoice.status !== InvoiceStatus.DRAFT ||
            invoice.journalEntryId
          ) {
            return fail({
              message: t("post.errors.conflict.title"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }

          const today = new Date();
          let taxNotice: string | null = null;
          let legalSnapshot: LegalSnapshot | null = null;
          let legalNotes: string[] = [];
          let invoiceNumber = invoice.invoiceNumber;
          let journalEntryId: string | null = null;
          if (invoice.companyId) {
            const regime = await getCompanyTaxRegime(
              tx,
              invoice.companyId,
              today,
            );
            taxNotice = regime.notice;
            const [totals] = await tx
              .select({
                taxedLines:
                  sql<number>`count(*) filter (where ${paymentInvoiceLines.taxRate} > 0 or ${paymentInvoiceLines.taxAmount} <> 0)`.mapWith(
                    Number,
                  ),
                grossCents:
                  sql<number>`round(sum(${paymentInvoiceLines.lineTotal}) * 100)`.mapWith(
                    Number,
                  ),
                vatCents:
                  sql<number>`round(sum(${paymentInvoiceLines.taxAmount}) * 100)`.mapWith(
                    Number,
                  ),
              })
              .from(paymentInvoiceLines)
              .where(eq(paymentInvoiceLines.invoiceId, invoice.id));
            if (regime.exempt && (totals?.taxedLines ?? 0) > 0) {
              return fail({
                message: regimeTranslation.scopedT(locale).t("saleConflict"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }
            // Country rules (e.g. Slovak IČO/DIČ/IČ DPH, rates on the supply
            // date, reverse charge customer VAT id). Snapshot at issue.
            const lineRates = await tx
              .select({ rate: paymentInvoiceLines.taxRate })
              .from(paymentInvoiceLines)
              .where(eq(paymentInvoiceLines.invoiceId, invoice.id));
            const compliance = await evaluateInvoiceIssue(tx, {
              companyId: invoice.companyId,
              regime: regime.code,
              metadata: invoice.metadata,
              issueDate: today,
              lineRates: lineRates.map((line) => line.rate),
              locale,
            });
            if (compliance.blockingMessage) {
              return fail({
                message: compliance.blockingMessage,
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }
            legalSnapshot = compliance.snapshot;
            legalNotes = compliance.notes;
            const grossCents = totals?.grossCents ?? 0;
            const vatCents = totals?.vatCents ?? 0;
            if (
              grossCents <= 0 ||
              grossCents !== Math.round(Number(invoice.amount) * 100) ||
              vatCents < 0 ||
              vatCents > grossCents
            ) {
              return fail({
                message: t("post.errors.invoiceLines"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }

            const existingNumber = invoiceNumber?.trim();
            const sequence = invoice.invoiceSequenceNumber;
            const reference =
              existingNumber ||
              (sequence && sequence > 0 ? `INV-${sequence}` : "");
            if (reference) {
              const [duplicate] = await tx
                .select({ id: paymentInvoices.id })
                .from(paymentInvoices)
                .where(
                  and(
                    eq(paymentInvoices.companyId, invoice.companyId),
                    ne(paymentInvoices.id, invoice.id),
                    sql`lower(trim(${paymentInvoices.invoiceNumber})) = lower(${reference})`,
                  ),
                )
                .limit(1);
              if (duplicate) {
                return fail({
                  message: t("post.errors.conflict.title"),
                  errorType: ErrorResponseTypes.CONFLICT,
                });
              }
              if (!existingNumber) {
                invoiceNumber = reference;
              }
            }

            const lines: AutoPostLine[] = [
              {
                subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
                type: LineType.DEBIT,
                currency: invoice.currency,
                amount: grossCents / 100,
              },
            ];
            const netCents = grossCents - vatCents;
            if (netCents > 0) {
              lines.push({
                subtype: AccountSubtype.REVENUE_SERVICE,
                fallbackSubtype: AccountSubtype.REVENUE_SALES,
                type: LineType.CREDIT,
                currency: invoice.currency,
                amount: netCents / 100,
              });
            }
            if (vatCents > 0) {
              lines.push({
                subtype: AccountSubtype.VAT_PAYABLE,
                type: LineType.CREDIT,
                currency: invoice.currency,
                amount: vatCents / 100,
              });
            }

            journalEntryId = await postJournalEntry(
              {
                companyId: invoice.companyId,
                date: today,
                description: `AR invoice: ${reference || invoice.id}`,
                sourceType: JournalSourceType.AR_INVOICE,
                sourceId: invoice.id,
                postedByUserId: userId,
                lines,
                logger,
              },
              tx,
            );
            if (!journalEntryId) {
              return fail({
                message: t("post.errors.posting"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }
          }

          await tx
            .update(paymentInvoices)
            .set({
              status: InvoiceStatus.OPEN,
              ...(taxNotice || legalNotes.length > 0 || legalSnapshot
                ? {
                    notes: [taxNotice, ...legalNotes].reduce(
                      (notes, notice) => notesWithTaxNotice(notes, notice),
                      invoice.notes,
                    ),
                    metadata: sql`coalesce(${paymentInvoices.metadata}, '{}'::jsonb) || ${JSON.stringify(
                      {
                        ...(taxNotice ? { taxExemptionNotice: taxNotice } : {}),
                        ...(legalSnapshot ? { legal: legalSnapshot } : {}),
                      },
                    )}::jsonb`,
                  }
                : {}),
              invoiceNumber,
              journalEntryId,
              updatedAt: today,
            })
            .where(eq(paymentInvoices.id, invoice.id));

          const viewUrl = buildInvoiceViewUrl(invoice.id);
          logger.debug("Invoice issued", {
            invoiceId: invoice.id,
            userId,
            journalEntryId,
          });

          return success({ success: true, message: null, viewUrl });
        })
        .then(async (result) => {
          if (result.success) {
            // Best-effort Stripe Checkout link preparation if enabled for the company.
            // Never fails invoice issuance when Stripe is unavailable or unconfigured.
            const { prepareInvoiceStripeCheckout } =
              await import("../../stripe-checkout");
            await prepareInvoiceStripeCheckout(
              urlPathParams.invoiceId,
              logger,
              locale,
            ).catch(() => undefined);
          }
          return result;
        });
    } catch (error) {
      logger.error("Failed to send invoice", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
