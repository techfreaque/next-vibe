/**
 * Invoice Line Remove Repository
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

import { getDocumentAccess } from "@/finance/document-company-scope";

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
      return await db.transaction(async (tx) => {
        // Get the line to find its invoice
        const [line] = await tx
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

        const [invoice] = await tx
          .select()
          .from(paymentInvoices)
          .where(eq(paymentInvoices.id, line.invoiceId))
          .limit(1)
          .for("update");

        if (!invoice) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        if (!(await getDocumentAccess(userId, invoice, tx))?.canManage) {
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

        const [removed] = await tx
          .delete(paymentInvoiceLines)
          .where(eq(paymentInvoiceLines.id, urlPathParams.lineId))
          .returning({ id: paymentInvoiceLines.id });
        if (!removed) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        // Recalculate invoice total
        await tx
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
