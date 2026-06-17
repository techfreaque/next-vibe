/**
 * Purchase Order List Repository
 * Lists purchase orders for a company (or all user's companies) with optional status filter
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { purchaseOrders, purchasingVendors } from "../../db";
import { scopedTranslation } from "../../i18n";
import type {
  OrderListRequestOutput,
  OrderListResponseOutput,
} from "./definition";

export class OrderListRepository {
  static async listOrders(
    userId: string,
    data: OrderListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<OrderListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      let companyIds: string[];

      if (data.companyId) {
        // Single company — verify membership
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          data.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return fail({
            message: t("orderList.get.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        companyIds = [data.companyId];
      } else {
        // All companies the user is a member of
        const memberRows = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );

        companyIds = memberRows.map((r) => r.companyId);
        if (companyIds.length === 0) {
          return success({ result: [] });
        }
      }

      const conditions = [inArray(purchaseOrders.companyId, companyIds)];
      if (data.status) {
        conditions.push(eq(purchaseOrders.status, data.status));
      }

      const rows = await db
        .select({
          id: purchaseOrders.id,
          poNumber: purchaseOrders.poNumber,
          vendorId: purchaseOrders.vendorId,
          vendorName: purchasingVendors.name,
          status: purchaseOrders.status,
          currency: purchaseOrders.currency,
          total: purchaseOrders.total,
          expectedDeliveryDate: purchaseOrders.expectedDeliveryDate,
          createdAt: purchaseOrders.createdAt,
        })
        .from(purchaseOrders)
        .leftJoin(
          purchasingVendors,
          eq(purchaseOrders.vendorId, purchasingVendors.id),
        )
        .where(and(...conditions))
        .orderBy(purchaseOrders.createdAt);

      return success({
        result: rows.map((row) => ({
          id: row.id,
          poNumber: row.poNumber,
          vendorId: row.vendorId,
          vendorName: row.vendorName ?? "",
          status: row.status,
          currency: row.currency,
          total: row.total,
          expectedDeliveryDate: row.expectedDeliveryDate,
          createdAt: row.createdAt,
        })),
      });
    } catch (error) {
      logger.error("Failed to list purchase orders", parseError(error));
      return fail({
        message: t("orderList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
