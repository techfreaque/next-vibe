/**
 * Invoice Record Payment Repository
 * Records a manual payment against an invoice
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  AccountSubtype,
  JournalSourceType,
  LineType,
} from "@/app/api/[locale]/chart-of-accounts/enum";
import { autoPostJournalEntry } from "@/app/api/[locale]/chart-of-accounts/shared/auto-post";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import type {
  InvoiceRecordPaymentRequestOutput,
  InvoiceRecordPaymentResponseOutput,
  InvoiceRecordPaymentUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceRecordPaymentRepository {
  static async recordPayment(
    userId: string,
    urlPathParams: InvoiceRecordPaymentUrlPathParams,
    data: InvoiceRecordPaymentRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceRecordPaymentResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);

      if (!invoice) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (invoice.userId !== userId) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      if (
        invoice.status === InvoiceStatus.PAID ||
        invoice.status === InvoiceStatus.VOID
      ) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const paidAt = data.paidAt ? new Date(data.paidAt) : new Date();
      const invoiceAmount = Number(invoice.amount);
      const isFullyPaid = data.amount >= invoiceAmount;
      const newStatus = isFullyPaid ? InvoiceStatus.PAID : invoice.status;

      await db
        .update(paymentInvoices)
        .set({
          status: newStatus,
          paidAt: isFullyPaid ? paidAt : invoice.paidAt,
          updatedAt: new Date(),
        })
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId));

      // --- AR_PAYMENT journal entry (best-effort, never blocks payment recording) ---
      if (invoice.companyId) {
        try {
          await autoPostJournalEntry({
            companyId: invoice.companyId,
            date: paidAt,
            description: `AR Payment: Invoice ${urlPathParams.invoiceId}`,
            sourceType: JournalSourceType.AR_PAYMENT,
            sourceId: urlPathParams.invoiceId,
            lines: [
              {
                subtype: AccountSubtype.BANK,
                // If caller specified which account received the payment, use it directly
                accountNodeId: data.accountNodeId ?? undefined,
                type: LineType.DEBIT,
                amount: data.amount,
                currency: invoice.currency,
                description: "AR Payment received",
              },
              {
                subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
                type: LineType.CREDIT,
                amount: data.amount,
                currency: invoice.currency,
                description: "AR Payment — clear receivable",
              },
            ],
          });
        } catch (journalError) {
          logger.warn(
            "AR_PAYMENT journal entry posting failed — payment recording continues",
            {
              invoiceId: urlPathParams.invoiceId,
              error: parseError(journalError).message,
            },
          );
        }
      }

      logger.debug("Manual payment recorded", {
        invoiceId: urlPathParams.invoiceId,
        amount: data.amount,
        method: data.method,
        isFullyPaid,
        newStatus,
      });

      return success({
        success: true,
        message: null,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to record manual payment", {
        error: parsed.message,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
