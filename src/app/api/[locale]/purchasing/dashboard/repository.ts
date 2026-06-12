/**
 * Purchasing Dashboard Repository
 * Aggregates KPI counts for purchase orders and vendors
 */

import "server-only";

import { and, countDistinct, eq, gt, inArray, lte, or } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { companyMembers } from "@/app/api/[locale]/companies/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { purchaseOrders, purchasingVendors } from "../db";
import { scopedTranslation } from "../i18n";
import type {
  PurchasingDashboardRequestOutput,
  PurchasingDashboardResponseOutput,
} from "./definition";

export class PurchasingDashboardRepository {
  static async getDashboard(
    userId: string,
    data: PurchasingDashboardRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PurchasingDashboardResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      let companyIds: string[];

      if (data.companyId) {
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          data.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return fail({
            message: t("dashboard.get.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        companyIds = [data.companyId];
      } else {
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
          return success({
            draftCount: 0,
            confirmedCount: 0,
            awaitingReceiptCount: 0,
            activeVendorCount: 0,
            dueThisWeekCount: 0,
          });
        }
      }

      const now = new Date();
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() + 7);

      const [draftRows, confirmedRows, awaitingRows, vendorRows, dueRows] =
        await Promise.all([
          // Draft POs
          db
            .select({ count: countDistinct(purchaseOrders.id) })
            .from(purchaseOrders)
            .where(
              and(
                inArray(purchaseOrders.companyId, companyIds),
                eq(purchaseOrders.status, "DRAFT"),
              ),
            ),

          // Confirmed POs
          db
            .select({ count: countDistinct(purchaseOrders.id) })
            .from(purchaseOrders)
            .where(
              and(
                inArray(purchaseOrders.companyId, companyIds),
                eq(purchaseOrders.status, "CONFIRMED"),
              ),
            ),

          // POs awaiting receipt: SENT or CONFIRMED (not yet fully received)
          db
            .select({ count: countDistinct(purchaseOrders.id) })
            .from(purchaseOrders)
            .where(
              and(
                inArray(purchaseOrders.companyId, companyIds),
                or(
                  eq(purchaseOrders.status, "SENT"),
                  eq(purchaseOrders.status, "CONFIRMED"),
                  eq(purchaseOrders.status, "PARTIALLY_RECEIVED"),
                ),
              ),
            ),

          // Active vendors
          db
            .select({ count: countDistinct(purchasingVendors.id) })
            .from(purchasingVendors)
            .where(
              and(
                inArray(purchasingVendors.companyId, companyIds),
                eq(purchasingVendors.isActive, true),
              ),
            ),

          // POs due this week: expected delivery between now and +7 days, not cancelled/received
          db
            .select({ count: countDistinct(purchaseOrders.id) })
            .from(purchaseOrders)
            .where(
              and(
                inArray(purchaseOrders.companyId, companyIds),
                gt(purchaseOrders.expectedDeliveryDate, now),
                lte(purchaseOrders.expectedDeliveryDate, weekEnd),
                or(
                  eq(purchaseOrders.status, "DRAFT"),
                  eq(purchaseOrders.status, "SENT"),
                  eq(purchaseOrders.status, "CONFIRMED"),
                  eq(purchaseOrders.status, "PARTIALLY_RECEIVED"),
                ),
              ),
            ),
        ]);

      return success({
        draftCount: draftRows[0]?.count ?? 0,
        confirmedCount: confirmedRows[0]?.count ?? 0,
        awaitingReceiptCount: awaitingRows[0]?.count ?? 0,
        activeVendorCount: vendorRows[0]?.count ?? 0,
        dueThisWeekCount: dueRows[0]?.count ?? 0,
      });
    } catch (error) {
      logger.error("Failed to load purchasing dashboard", parseError(error));
      return fail({
        message: t("dashboard.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
