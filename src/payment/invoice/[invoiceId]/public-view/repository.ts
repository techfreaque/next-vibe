/**
 * Public Invoice View Repository
 * Retrieves invoice data for unauthenticated customer view via HMAC token
 */

import "server-only";

import { eq } from "drizzle-orm";
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

import { companies } from "@/companies/db";
import { buildInvoicePaymentQr } from "@/finance/pdf/payment-qr";

import {
  companyPaymentSettings,
  paymentInvoiceLines,
  paymentInvoices,
} from "../../../db";
import { InvoiceStatus } from "../../../enum";
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

      // Fetch company details & payment settings if available
      let companyName: string | null = null;
      let companyEmail: string | null = null;
      let companyCountry: string | null = null;
      let bankIban: string | null = null;
      let bankBic: string | null = null;
      let qrKind: "EPC" | "PAY_BY_SQUARE" | null = null;
      let qrSvg: string | null = null;

      if (invoice.companyId) {
        const [company] = await db
          .select({
            name: companies.name,
            email: companies.email,
            country: companies.country,
          })
          .from(companies)
          .where(eq(companies.id, invoice.companyId))
          .limit(1);

        if (company) {
          companyName = company.name;
          companyEmail = company.email ?? null;
          companyCountry = company.country ?? null;
        }

        const [paySettings] = await db
          .select({
            bankIban: companyPaymentSettings.bankIban,
            bankBic: companyPaymentSettings.bankBic,
            bankAccountHolder: companyPaymentSettings.bankAccountHolder,
          })
          .from(companyPaymentSettings)
          .where(eq(companyPaymentSettings.companyId, invoice.companyId))
          .limit(1);

        if (paySettings?.bankIban) {
          bankIban = paySettings.bankIban;
          bankBic = paySettings.bankBic ?? null;
          const amountNum = Number(invoice.amount);
          const docNum = invoice.invoiceNumber ?? invoice.providerInvoiceId;
          if (
            invoice.status === InvoiceStatus.OPEN &&
            Number.isFinite(amountNum) &&
            amountNum > 0
          ) {
            const qr = buildInvoicePaymentQr(companyCountry, {
              iban: paySettings.bankIban,
              bic: paySettings.bankBic ?? undefined,
              beneficiaryName:
                paySettings.bankAccountHolder ?? companyName ?? "Company",
              amount: amountNum,
              currency: invoice.currency,
              reference: docNum,
              dueDate: invoice.dueDate
                ? invoice.dueDate.toISOString().slice(0, 10)
                : undefined,
            });
            if (qr) {
              qrKind = qr.kind;
              qrSvg = qr.svg;
            }
          }
        }
      }

      const paymentUrl =
        invoice.status === InvoiceStatus.OPEN && invoice.invoiceUrl
          ? invoice.invoiceUrl
          : null;

      const lines = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, invoice.id))
        .orderBy(paymentInvoiceLines.sortOrder);

      logger.debug("Public invoice viewed", { invoiceId });

      return success({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber ?? invoice.providerInvoiceId,
        currency: invoice.currency,
        status: invoice.status,
        amount: invoice.amount,
        dueDate: invoice.dueDate ?? null,
        notes: invoice.notes ?? null,
        createdAt: invoice.createdAt,
        companyName,
        companyEmail,
        paymentUrl,
        bankIban,
        bankBic,
        qrKind,
        qrSvg,
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
