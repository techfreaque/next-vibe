/**
 * Invoice Create Repository
 * Creates a new AR invoice in DRAFT status with auto-incremented sequence number per company
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { CurrenciesArr, defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { nextCompanyInvoiceSequence } from "@/finance/document-number";
import {
  LINE_SETTLEMENT_V1,
  supportsLineCentSettlement,
} from "@/tax/line-settlement";
import { scopedTranslation as regimeTranslation } from "@/tax/regime/i18n";
import { getCompanyTaxRegime } from "@/tax/regime/policy";

import { paymentInvoiceLines, paymentInvoices } from "../../db";
import { InvoiceStatus } from "../../enum";
import { calculateInvoiceLine } from "../line/amounts";
import type {
  InvoiceCreateRequestOutput,
  InvoiceCreateResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceCreateRepository {
  static async createInvoice(
    userId: string,
    data: InvoiceCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const scope = { companyId: data.companyId };
      if (!(await getDocumentAccess(userId, scope))?.canManage) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, data.companyId);
        if (!(await getDocumentAccess(userId, scope, tx))?.canManage) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        const companyCurrency = z
          .enum(CurrenciesArr)
          .safeParse(company?.currency);
        const currency =
          data.currency ??
          (companyCurrency.success ? companyCurrency.data : "EUR");
        const lineSettlement = supportsLineCentSettlement(currency)
          ? LINE_SETTLEMENT_V1
          : undefined;
        const lines = (data.lineItems ?? []).map((line, sortOrder) => ({
          description: line.description,
          sortOrder,
          ...calculateInvoiceLine(line, lineSettlement),
        }));
        const totalUnits = lines.reduce(
          (total, line) => total + Math.round(line.lineTotal * 10_000),
          0,
        );
        const totalCents = Math.round(totalUnits / 100);
        if (
          !Number.isSafeInteger(totalCents) ||
          totalCents > 9_999_999_999 ||
          lines.some((line) => line.lineTotal >= 100_000_000)
        ) {
          return fail({
            message: t("post.widget.itemsTotalError"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const amount = (totalCents / 100).toFixed(2);

        const regime = await getCompanyTaxRegime(
          tx,
          data.companyId,
          new Date(),
        );
        if (regime.exempt && lines.some((line) => line.taxRate > 0)) {
          return fail({
            message: regimeTranslation.scopedT(locale).t("saleConflict"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const nextSeq = await nextCompanyInvoiceSequence(tx, data.companyId);
        const arInvoiceId = `AR-${data.companyId.slice(0, 8)}-${String(nextSeq).padStart(6, "0")}`;

        const [invoice] = await tx
          .insert(paymentInvoices)
          .values({
            userId,
            companyId: data.companyId,
            providerInvoiceId: arInvoiceId,
            invoiceSequenceNumber: nextSeq,
            currency,
            status: InvoiceStatus.DRAFT,
            amount,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            notes: data.notes ?? null,
            metadata:
              data.customerId ||
              lineSettlement ||
              data.vatTreatment ||
              data.supplyDate
                ? {
                    customerId: data.customerId,
                    lineSettlement,
                    // Read at issue by the country compliance checks.
                    vatTreatment: data.vatTreatment,
                    supplyDate: data.supplyDate?.toISOString().slice(0, 10),
                  }
                : null,
          })
          .returning();

        if (!invoice) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        if (lines.length > 0) {
          await tx
            .insert(paymentInvoiceLines)
            .values(lines.map((line) => ({ ...line, invoiceId: invoice.id })));
        }

        logger.debug("AR invoice created", {
          invoiceId: invoice.id,
          companyId: data.companyId,
          seq: nextSeq,
        });

        const metadataSchema = z.object({ customerId: z.string().optional() });
        const parsedMeta = metadataSchema.safeParse(invoice.metadata);
        const customerId = parsedMeta.success
          ? (parsedMeta.data.customerId ?? null)
          : null;

        return success({
          success: true,
          message: null,
          invoice: {
            id: invoice.id,
            companyId: invoice.companyId ?? null,
            customerId,
            invoiceSequenceNumber: invoice.invoiceSequenceNumber ?? null,
            currency: invoice.currency,
            status: invoice.status,
            dueDate: invoice.dueDate ?? null,
            notes: invoice.notes ?? null,
            amount: invoice.amount,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
          },
        });
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to create AR invoice", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
