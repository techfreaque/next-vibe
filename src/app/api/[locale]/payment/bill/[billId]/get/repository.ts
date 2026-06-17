/**
 * AP Bill Get Repository
 * Retrieves a single bill with all line items
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentBillLines, paymentBills } from "../../../db";
import type { BillGetResponseOutput, BillGetUrlPathParams } from "./definition";
import { scopedTranslation } from "./i18n";

export class BillGetRepository {
  static async getBill(
    userId: string,
    urlPathParams: BillGetUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [bill] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, urlPathParams.billId))
        .limit(1);

      if (!bill) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        bill.companyId,
        null,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const lines = await db
        .select()
        .from(paymentBillLines)
        .where(eq(paymentBillLines.billId, bill.id))
        .orderBy(paymentBillLines.sortOrder);

      return success({
        id: bill.id,
        companyId: bill.companyId,
        supplierName: bill.supplierName,
        supplierVatNumber: bill.supplierVatNumber,
        billNumber: bill.billNumber,
        billDate: bill.billDate,
        dueDate: bill.dueDate,
        currency: bill.currency,
        subtotal: bill.subtotal,
        taxAmount: bill.taxAmount,
        total: bill.total,
        status: bill.status,
        notes: bill.notes,
        journalEntryId: bill.journalEntryId,
        paidAt: bill.paidAt,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
        lines: lines.map((l) => ({
          id: l.id,
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxRate: l.taxRate,
          taxAmount: l.taxAmount,
          lineTotal: l.lineTotal,
        })),
      });
    } catch (error) {
      logger.error("Failed to get AP bill", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
