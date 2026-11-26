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

import { getDocumentAccess } from "@/finance/document-company-scope";
import { getLineSettlementPolicy } from "@/tax/line-settlement";
import { scopedTranslation as regimeTranslation } from "@/tax/regime/i18n";
import { getCompanyTaxRegime } from "@/tax/regime/policy";

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import { calculateInvoiceLine } from "../amounts";
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
      return await db.transaction(async (tx) => {
        const [invoice] = await tx
          .select()
          .from(paymentInvoices)
          .where(eq(paymentInvoices.id, data.invoiceId))
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

        if (
          invoice.companyId &&
          data.taxRate > 0 &&
          (await getCompanyTaxRegime(tx, invoice.companyId, new Date())).exempt
        ) {
          return fail({
            message: regimeTranslation.scopedT(locale).t("saleConflict"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const { quantity, unitPrice, taxRate, taxAmount, lineTotal } =
          calculateInvoiceLine(
            {
              quantity: data.quantity ?? 1,
              unitPrice: data.unitPrice,
              taxRate: data.taxRate ?? 0,
            },
            getLineSettlementPolicy(invoice.currency, invoice.metadata),
          );
        if (
          quantity <= 0 ||
          quantity >= 100_000_000 ||
          unitPrice >= 100_000_000 ||
          !Number.isFinite(lineTotal) ||
          lineTotal >= 100_000_000
        ) {
          return fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        // Get current max sort order for this invoice
        const existingLines = await tx
          .select({
            sortOrder: paymentInvoiceLines.sortOrder,
            lineTotal: paymentInvoiceLines.lineTotal,
          })
          .from(paymentInvoiceLines)
          .where(eq(paymentInvoiceLines.invoiceId, data.invoiceId));

        const grossUnits = existingLines.reduce(
          (sum, item) => sum + Math.round(item.lineTotal * 10_000),
          Math.round(lineTotal * 10_000),
        );
        if (Math.round(grossUnits / 100) > 9_999_999_999) {
          return fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const maxSortOrder = existingLines.reduce(
          (max, l) => Math.max(max, l.sortOrder ?? 0),
          -1,
        );

        const [line] = await tx
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
        await tx
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
            currency: invoice.currency,
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
