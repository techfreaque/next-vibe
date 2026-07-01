/**
 * Purchase Order List Repository
 * Lists purchase orders for a company (or all user's companies) with optional status filter
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
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

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

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
