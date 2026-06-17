/**
 * AP Bill Create Repository
 * Creates a new supplier bill in DRAFT status
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

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
