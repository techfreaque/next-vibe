/**
 * Invoice Duplicate Repository
 * Clones an existing invoice into a new DRAFT with all line items copied.
 * New invoice gets a new sequence number, DRAFT status, and today's date.
 */

import "server-only";

import { eq, max } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { z } from "zod";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { CurrenciesArr, defaultLocale } from "@/i18n/core/config";

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import type {
  InvoiceDuplicateResponseOutput,
  InvoiceDuplicateUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceDuplicateRepository {
  static async duplicateInvoice(
    userId: string,
    urlPathParams: InvoiceDuplicateUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceDuplicateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [source] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);

      if (!source) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (source.userId !== userId) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Auto-generate sequence number per company
      const companyId = source.companyId ?? null;
      let nextSeq = 1;

      if (companyId) {
        const [{ value: maxSeq }] = await db
          .select({ value: max(paymentInvoices.invoiceSequenceNumber) })
          .from(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId));
        nextSeq = (maxSeq ?? 0) + 1;
      } else {
        const [{ value: maxSeq }] = await db
          .select({ value: max(paymentInvoices.invoiceSequenceNumber) })
          .from(paymentInvoices)
          .where(eq(paymentInvoices.userId, userId));
        nextSeq = (maxSeq ?? 0) + 1;
      }

      // Generate new provider invoice ID
      const companyPrefix = companyId
        ? companyId.slice(0, 8)
        : userId.slice(0, 8);
      const arInvoiceId = `AR-${companyPrefix}-${String(nextSeq).padStart(6, "0")}`;

      const rawCurrency = source.currency;
      const currency = (CurrenciesArr as readonly string[]).includes(
        rawCurrency,
      )
        ? (rawCurrency as (typeof CurrenciesArr)[number])
        : "EUR";

      // Insert new invoice as DRAFT
      const [newInvoice] = await db
        .insert(paymentInvoices)
        .values({
          userId,
          companyId: source.companyId ?? undefined,
          providerInvoiceId: arInvoiceId,
          invoiceSequenceNumber: nextSeq,
          currency,
          status: InvoiceStatus.DRAFT,
          amount: "0",
          dueDate: source.dueDate ?? null,
          notes: source.notes ?? null,
          metadata: source.metadata ?? null,
        })
        .returning();

      if (!newInvoice) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Copy all line items from the source invoice
      const sourceLines = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, source.id));

      let totalAmount = 0;

      if (sourceLines.length > 0) {
        for (const line of sourceLines) {
          await db.insert(paymentInvoiceLines).values({
            invoiceId: newInvoice.id,
            description: line.description,
            productId: line.productId ?? undefined,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxRate: line.taxRate ?? 0,
            taxAmount: line.taxAmount,
            lineTotal: line.lineTotal,
            sortOrder: line.sortOrder ?? 0,
          });
          totalAmount += line.lineTotal;
        }

        // Update total amount on new invoice
        await db
          .update(paymentInvoices)
          .set({
            amount: totalAmount.toString(),
            updatedAt: new Date(),
          })
          .where(eq(paymentInvoices.id, newInvoice.id));
      }

      logger.debug("Invoice duplicated", {
        sourceInvoiceId: source.id,
        newInvoiceId: newInvoice.id,
        linesCount: sourceLines.length,
      });

      const metadataSchema = z.object({ customerId: z.string().optional() });
      const parsedMeta = metadataSchema.safeParse(newInvoice.metadata);
      const customerId = parsedMeta.success
        ? (parsedMeta.data.customerId ?? null)
        : null;

      return success({
        success: true,
        message: null,
        invoice: {
          id: newInvoice.id,
          companyId: newInvoice.companyId ?? null,
          customerId,
          invoiceSequenceNumber: newInvoice.invoiceSequenceNumber ?? null,
          currency: newInvoice.currency,
          status: newInvoice.status,
          dueDate: newInvoice.dueDate ? newInvoice.dueDate.toISOString() : null,
          notes: newInvoice.notes ?? null,
          amount: totalAmount > 0 ? totalAmount.toString() : newInvoice.amount,
          createdAt: newInvoice.createdAt.toISOString(),
          updatedAt: newInvoice.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to duplicate invoice", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
