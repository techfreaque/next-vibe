/**
 * Public Invoice View Repository
 * Retrieves invoice data for unauthenticated customer view via HMAC token
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

import { companies } from "@/app/api/[locale]/companies/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import { verifyInvoiceViewToken } from "../../token";
import type {
  InvoicePublicViewRequestOutput,
  InvoicePublicViewResponseOutput,
  InvoicePublicViewUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoicePublicViewRepository {
  static async getPublicInvoice(
    urlPathParams: InvoicePublicViewUrlPathParams,
    data: InvoicePublicViewRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoicePublicViewResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { invoiceId } = urlPathParams;
      const { token } = data;

      // Verify HMAC token before any DB query
      if (!verifyInvoiceViewToken(invoiceId, token)) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId))
        .limit(1);

      if (!invoice) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Fetch company name and email if available
      let companyName: string | null = null;
      let companyEmail: string | null = null;

      if (invoice.companyId) {
        const [company] = await db
          .select({ name: companies.name, email: companies.email })
          .from(companies)
          .where(eq(companies.id, invoice.companyId))
          .limit(1);

        if (company) {
          companyName = company.name;
          companyEmail = company.email ?? null;
        }
      }

      const lines = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, invoice.id))
        .orderBy(paymentInvoiceLines.sortOrder);

      logger.debug("Public invoice viewed", { invoiceId });

      return success({
        id: invoice.id,
        invoiceNumber: invoice.providerInvoiceId ?? null,
        currency: invoice.currency,
        status: invoice.status,
        amount: invoice.amount,
        dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,
        notes: invoice.notes ?? null,
        createdAt: invoice.createdAt.toISOString(),
        companyName,
        companyEmail,
        lines: lines.map((l) => ({
          id: l.id,
          description: l.description,
          productId: l.productId ?? null,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxRate: l.taxRate ?? null,
          taxAmount: l.taxAmount,
          lineTotal: l.lineTotal,
          sortOrder: l.sortOrder ?? null,
        })),
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to get public invoice", { error: parsed.message });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
