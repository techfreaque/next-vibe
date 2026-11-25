/**
 * Convert Estimate to Invoice Repository
 * Creates a draft invoice from a SENT or ACCEPTED estimate, sets invoiceId on estimate,
 * marks estimate as CONVERTED.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
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

import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { nextCompanyInvoiceSequence } from "@/finance/document-number";

import {
  paymentEstimateLines,
  paymentEstimates,
  paymentInvoiceLines,
  paymentInvoices,
} from "../../../db";
import { EstimateStatus, InvoiceStatus } from "../../../enum";
import type {
  EstimateConvertToInvoiceResponseOutput,
  EstimateConvertToInvoiceUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class EstimateConvertToInvoiceRepository {
  static async convertToInvoice(
    userId: string,
    urlPathParams: EstimateConvertToInvoiceUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateConvertToInvoiceResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [estimate] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, urlPathParams.estimateId))
        .limit(1);

      if (!estimate) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return await db.transaction(async (tx) => {
        await lockLedgerCompany(tx, estimate.companyId);
        const access = await getDocumentAccess(
          userId,
          { companyId: estimate.companyId },
          tx,
        );
        if (!access?.canManage) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        const [lockedEstimate] = await tx
          .select()
          .from(paymentEstimates)
          .where(
            and(
              eq(paymentEstimates.id, urlPathParams.estimateId),
              eq(paymentEstimates.companyId, estimate.companyId),
            ),
          )
          .limit(1)
          .for("update");
        if (
          !lockedEstimate ||
          lockedEstimate.invoiceId ||
          (lockedEstimate.status !== EstimateStatus.SENT &&
            lockedEstimate.status !== EstimateStatus.ACCEPTED)
        ) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        // Copy estimate lines to invoice lines
        const estimateLineRows = await tx
          .select()
          .from(paymentEstimateLines)
          .where(eq(paymentEstimateLines.estimateId, lockedEstimate.id))
          .orderBy(paymentEstimateLines.sortOrder);

        const grossUnits = estimateLineRows.reduce(
          (sum, line) => sum + Math.round(line.lineTotal * 10_000),
          0,
        );
        const cents = Math.round(grossUnits / 100);
        if (
          !Number.isSafeInteger(grossUnits) ||
          cents < 0 ||
          cents > 9_999_999_999 ||
          cents !== Math.round(Math.round(lockedEstimate.total * 10_000) / 100)
        ) {
          return fail({
            message: t("post.errors.reconcile"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const nextSeq = await nextCompanyInvoiceSequence(
          tx,
          lockedEstimate.companyId,
        );
        const arInvoiceId = `AR-${lockedEstimate.companyId.slice(0, 8)}-${String(nextSeq).padStart(6, "0")}`;
        const currency = lockedEstimate.currency;

        // Create invoice from estimate
        const [invoice] = await tx
          .insert(paymentInvoices)
          .values({
            userId,
            companyId: lockedEstimate.companyId,
            providerInvoiceId: arInvoiceId,
            invoiceSequenceNumber: nextSeq,
            currency,
            status: InvoiceStatus.DRAFT,
            amount: (cents / 100).toFixed(2),
            notes: lockedEstimate.notes ?? null,
            metadata: {
              estimateId: lockedEstimate.id,
              estimateNumber: lockedEstimate.estimateNumber,
              ...(lockedEstimate.customerId
                ? { customerId: lockedEstimate.customerId }
                : {}),
              ...(lockedEstimate.customerName
                ? { customerName: lockedEstimate.customerName }
                : {}),
              ...(lockedEstimate.customerEmail
                ? { customerEmail: lockedEstimate.customerEmail }
                : {}),
            },
          })
          .returning();

        if (!invoice) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        if (estimateLineRows.length > 0) {
          await tx.insert(paymentInvoiceLines).values(
            estimateLineRows.map((l) => ({
              invoiceId: invoice.id,
              description: l.description,
              productId: l.productId ?? null,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
              taxRate: l.taxRate,
              taxAmount: l.taxAmount,
              lineTotal: l.lineTotal,
              sortOrder: l.sortOrder ?? 0,
            })),
          );
        }

        // Mark estimate as CONVERTED and set invoiceId
        await tx
          .update(paymentEstimates)
          .set({
            status: EstimateStatus.CONVERTED,
            invoiceId: invoice.id,
            updatedAt: new Date(),
          })
          .where(eq(paymentEstimates.id, urlPathParams.estimateId));

        logger.info("Estimate converted to invoice", {
          estimateId: urlPathParams.estimateId,
          invoiceId: invoice.id,
          companyId: lockedEstimate.companyId,
        });

        return success({
          success: true,
          message: null,
          invoiceId: invoice.id,
        });
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to convert estimate to invoice", {
        error: parsed.message,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
