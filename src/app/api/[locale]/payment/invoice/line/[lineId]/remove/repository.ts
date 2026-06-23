/**
 * Invoice Line Remove Repository
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentInvoiceLines, paymentInvoices } from "../../../../db";
import { InvoiceStatus } from "../../../../enum";
import type {
  InvoiceLineRemoveResponseOutput,
  InvoiceLineRemoveUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceLineRemoveRepository {
  static async removeLine(
    userId: string,
    urlPathParams: InvoiceLineRemoveUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceLineRemoveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Get the line to find its invoice
      const [line] = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.id, urlPathParams.lineId))
        .limit(1);

      if (!line) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify invoice ownership and draft status
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, line.invoiceId))
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

      await db
        .delete(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.id, urlPathParams.lineId));

      // Recalculate invoice total
      await db
        .update(paymentInvoices)
        .set({
          amount: sql`COALESCE((
            SELECT SUM(line_total) FROM payment_invoice_lines
            WHERE invoice_id = ${invoice.id}
          ), 0)`,
          updatedAt: new Date(),
        })
        .where(eq(paymentInvoices.id, invoice.id));

      logger.debug("Invoice line removed", {
        lineId: urlPathParams.lineId,
        invoiceId: invoice.id,
      });

      return success({
        success: true,
        message: null,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to remove invoice line", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
