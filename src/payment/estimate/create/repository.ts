/**
 * Estimate Create Repository
 * Creates a new estimate in DRAFT status with auto-generated number and optional lines
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
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
import {
  LINE_SETTLEMENT_V1,
  supportsLineCentSettlement,
} from "@/tax/line-settlement";

import { paymentEstimateLines, paymentEstimates } from "../../db";
import { EstimateStatus } from "../../enum";
import {
  estimateLine,
  estimateProductScope,
  nextEstimateNumber,
} from "../draft";
import type {
  EstimateCreateRequestOutput,
  EstimateCreateResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class EstimateCreateRepository {
  static async createEstimate(
    userId: string,
    data: EstimateCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<EstimateCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      return await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, data.companyId);
        const access = await getDocumentAccess(
          userId,
          { companyId: data.companyId },
          tx,
        );
        if (!access?.canManage) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        if (!company) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        const currency = CurrenciesArr.find(
          (code) => code === (data.currency ?? company.currency ?? "EUR"),
        );
        if (!currency) {
          return fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const settlement = supportsLineCentSettlement(currency)
          ? LINE_SETTLEMENT_V1
          : undefined;
        const lines = [];
        let grossUnits = 0,
          taxUnits = 0;
        for (const [index, input] of (data.lines ?? []).entries()) {
          const line = estimateLine(input, index, settlement);
          if (!line) {
            return fail({
              message: t("post.errors.validation.title"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          grossUnits += Math.round(line.lineTotal * 10_000);
          taxUnits += Math.round(line.taxAmount * 10_000);
          lines.push(line);
        }
        if (
          grossUnits >= 1_000_000_000_000 ||
          !(await estimateProductScope(
            tx,
            data.companyId,
            userId,
            lines.flatMap((line) => (line.productId ? [line.productId] : [])),
          ))
        ) {
          return fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const estimateNumber = await nextEstimateNumber(tx, data.companyId);
        const [estimate] = await tx
          .insert(paymentEstimates)
          .values({
            companyId: data.companyId,
            estimateNumber,
            status: EstimateStatus.DRAFT,
            currency,
            metadata: settlement ? { lineSettlement: settlement } : null,
            customerId: data.customerId,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            validUntil: data.validUntil ? new Date(data.validUntil) : null,
            title: data.title,
            notes: data.notes,
            terms: data.terms,
            subtotal: (grossUnits - taxUnits) / 10_000,
            taxAmount: taxUnits / 10_000,
            total: grossUnits / 10_000,
          })
          .returning();
        if (!estimate) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        if (lines.length) {
          await tx
            .insert(paymentEstimateLines)
            .values(
              lines.map((line) => ({ ...line, estimateId: estimate.id })),
            );
        }
        logger.debug("Estimate created", {
          estimateId: estimate.id,
          estimateNumber,
          companyId: data.companyId,
        });

        return success({
          success: true,
          message: null,
          estimate: {
            id: estimate.id,
            companyId: estimate.companyId,
            estimateNumber: estimate.estimateNumber,
            status: estimate.status,
            currency: estimate.currency,
            subtotal: estimate.subtotal,
            taxAmount: estimate.taxAmount,
            total: estimate.total,
            createdAt: estimate.createdAt,
            updatedAt: estimate.updatedAt,
          },
        });
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to create estimate", { error: parsed.message });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
