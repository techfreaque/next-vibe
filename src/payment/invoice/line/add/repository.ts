/**
 * Invoice Line Add Repository
 * Handles adding line items to draft invoices
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
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

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import type {
  InvoiceLineAddRequestOutput,
  InvoiceLineAddResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceLineAddRepository {
  static async addLine(
    userId: string,
    data: InvoiceLineAddRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceLineAddResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Verify invoice exists and belongs to user
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, data.invoiceId))
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

      if (invoice.status !== InvoiceStatus.DRAFT) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const quantity = data.quantity ?? 1;
      const unitPrice = data.unitPrice;
      const taxRate = data.taxRate ?? 0;
      const taxAmount = quantity * unitPrice * taxRate;
      const lineTotal = quantity * unitPrice + taxAmount;

      // Get current max sort order for this invoice
      const existingLines = await db
        .select({ sortOrder: paymentInvoiceLines.sortOrder })
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, data.invoiceId));

      const maxSortOrder = existingLines.reduce(
        (max, l) => Math.max(max, l.sortOrder ?? 0),
        -1,
      );

      const [line] = await db
        .insert(paymentInvoiceLines)
        .values({
          invoiceId: data.invoiceId,
          description: data.description,
          productId: data.productId ?? null,
          quantity,
          unitPrice,
          taxRate,
          taxAmount,
          lineTotal,
          sortOrder: maxSortOrder + 1,
        })
        .returning();

      if (!line) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Update invoice total by summing all lines
      await db
        .update(paymentInvoices)
        .set({
          amount: sql`(
            SELECT SUM(line_total) FROM payment_invoice_lines
            WHERE invoice_id = ${data.invoiceId}
          )`,
          updatedAt: new Date(),
        })
        .where(eq(paymentInvoices.id, data.invoiceId));

      logger.debug("Invoice line added", {
        lineId: line.id,
        invoiceId: data.invoiceId,
        lineTotal,
      });

      return success({
        success: true,
        message: null,
        line: {
          id: line.id,
          invoiceId: line.invoiceId,
          description: line.description,
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          taxRate: line.taxRate,
          taxAmount: line.taxAmount,
          lineTotal: line.lineTotal,
          sortOrder: line.sortOrder,
          createdAt: line.createdAt,
          updatedAt: line.updatedAt,
        },
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to add invoice line", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
