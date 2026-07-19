/**
 * Purchase Order Create Repository
 * Creates a new purchase order in Draft status with auto-generated PO number
 */

import "server-only";

import { and, count, eq } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { purchaseOrders, purchasingVendors } from "../../db";
import { scopedTranslation } from "../../i18n";
import type {
  OrderCreateRequestOutput,
  OrderCreateResponseOutput,
} from "./definition";

export class OrderCreateRepository {
  static async createOrder(
    userId: string,
    data: OrderCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Auth check
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("orderCreate.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Verify vendor belongs to same company
      const [vendor] = await db
        .select({
          id: purchasingVendors.id,
          companyId: purchasingVendors.companyId,
        })
        .from(purchasingVendors)
        .where(eq(purchasingVendors.id, data.vendorId))
        .limit(1);

      if (!vendor || vendor.companyId !== data.companyId) {
        return fail({
          message: t("orderCreate.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Generate PO number: PO-{YYYY}-{NNNN} per company per year
      const year = new Date().getFullYear();
      const yearPrefix = `PO-${year.toString()}-`;

      const [{ value: existingCount }] = await db
        .select({ value: count() })
        .from(purchaseOrders)
        .where(and(eq(purchaseOrders.companyId, data.companyId)));

      const sequence = (existingCount + 1).toString().padStart(4, "0");
      const poNumber = `${yearPrefix}${sequence}`;

      const [created] = await db
        .insert(purchaseOrders)
        .values({
          companyId: data.companyId,
          vendorId: data.vendorId,
          poNumber,
          status: "DRAFT",
          currency: data.currency,
          expectedDeliveryDate: data.expectedDeliveryDate ?? null,
          deliveryWarehouseId: data.deliveryWarehouseId ?? null,
          notes: data.notes ?? null,
          subtotal: 0,
          taxAmount: 0,
          total: 0,
          createdByUserId: userId,
        })
        .returning();

      if (!created) {
        return fail({
          message: t("orderCreate.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Purchase order created", {
        poId: created.id,
        poNumber: created.poNumber,
      });

      return success({
        result: {
          id: created.id,
          poNumber: created.poNumber,
          status: created.status,
          subtotal: created.subtotal,
          taxAmount: created.taxAmount,
          total: created.total,
          createdAt: created.createdAt,
        },
      });
    } catch (error) {
      logger.error("Failed to create purchase order", parseError(error));
      return fail({
        message: t("orderCreate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
