/**
 * AP Bill Create Repository
 * Creates a new supplier bill in DRAFT status
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

import { paymentBills } from "../../db";
import type {
  BillCreateRequestOutput,
  BillCreateResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class BillCreateRepository {
  static async createBill(
    userId: string,
    data: BillCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Verify ACCOUNTANT+ company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const [bill] = await db
        .insert(paymentBills)
        .values({
          companyId: data.companyId,
          supplierName: data.supplierName,
          supplierVatNumber: data.supplierVatNumber ?? null,
          billNumber: data.billNumber ?? null,
          billDate: new Date(data.billDate),
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          currency: (data.currency ?? "EUR") as "EUR" | "PLN" | "USD",
          notes: data.notes ?? null,
          subtotal: 0,
          taxAmount: 0,
          total: 0,
        })
        .returning();

      if (!bill) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("AP bill created", {
        billId: bill.id,
        companyId: data.companyId,
        supplierName: data.supplierName,
      });

      return success({
        id: bill.id,
        companyIdResponse: bill.companyId,
        supplierNameResponse: bill.supplierName,
        billNumberResponse: bill.billNumber,
        status: bill.status,
        subtotal: bill.subtotal,
        taxAmount: bill.taxAmount,
        total: bill.total,
        createdAt: bill.createdAt,
      });
    } catch (error) {
      logger.error("Failed to create AP bill", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
