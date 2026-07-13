/**
 * Inventory Dashboard Repository
 * Aggregates KPI counts for stock health, transfers, and warehouses
 */

import "server-only";

import { and, countDistinct, eq, gt, inArray, lt, lte, or } from "drizzle-orm";
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

import { stockLevels, warehouses, warehouseTransfers } from "../db";
import { scopedTranslation } from "../i18n";
import type {
  InventoryDashboardRequestOutput,
  InventoryDashboardResponseOutput,
} from "./definition";

const LOW_STOCK_FALLBACK_THRESHOLD = 5;

export class InventoryDashboardRepository {
  static async getDashboard(
    userId: string,
    data: InventoryDashboardRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InventoryDashboardResponseOutput>> {
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
            inStockCount: 0,
            outOfStockCount: 0,
            lowStockCount: 0,
            pendingTransferCount: 0,
            warehouseCount: 0,
          });
        }
      }

      // Get warehouse IDs for these companies
      const companyWarehouses = await db
        .select({ id: warehouses.id })
        .from(warehouses)
        .where(
          and(
            inArray(warehouses.companyId, companyIds),
            eq(warehouses.isActive, true),
          ),
        );

      const warehouseIds = companyWarehouses.map((w) => w.id);

      if (warehouseIds.length === 0) {
        return success({
          inStockCount: 0,
          outOfStockCount: 0,
          lowStockCount: 0,
          pendingTransferCount: 0,
          warehouseCount: 0,
        });
      }

      const [inStockRows, outOfStockRows, lowStockRows, transferRows] =
        await Promise.all([
          // In Stock: distinct products with quantityOnHand > 0 in any company warehouse
          db
            .select({ count: countDistinct(stockLevels.productId) })
            .from(stockLevels)
            .where(
              and(
                inArray(stockLevels.warehouseId, warehouseIds),
                gt(stockLevels.quantityOnHand, 0),
              ),
            ),

          // Out of stock: distinct products with quantityOnHand <= 0 across all warehouses
          db
            .select({ count: countDistinct(stockLevels.productId) })
            .from(stockLevels)
            .where(
              and(
                inArray(stockLevels.warehouseId, warehouseIds),
                lte(stockLevels.quantityOnHand, 0),
              ),
            ),

          // Low stock: below reorderPoint where set, else below fallback threshold
          // Products where quantityOnHand > 0 but below the low stock threshold
          db
            .select({ count: countDistinct(stockLevels.productId) })
            .from(stockLevels)
            .where(
              and(
                inArray(stockLevels.warehouseId, warehouseIds),
                gt(stockLevels.quantityOnHand, 0),
                or(
                  // Has reorder point set and is below it
                  and(
                    gt(stockLevels.reorderPoint, 0),
                    lt(stockLevels.quantityOnHand, stockLevels.reorderPoint),
                  ),
                  // No reorder point: below fallback threshold
                  and(
                    lte(stockLevels.reorderPoint, 0),
                    lt(
                      stockLevels.quantityOnHand,
                      LOW_STOCK_FALLBACK_THRESHOLD,
                    ),
                  ),
                ),
              ),
            ),

          // Pending transfers (IN_TRANSIT status) for these companies
          db
            .select({ count: countDistinct(warehouseTransfers.id) })
            .from(warehouseTransfers)
            .where(
              and(
                inArray(warehouseTransfers.companyId, companyIds),
                eq(warehouseTransfers.status, "IN_TRANSIT"),
              ),
            ),
        ]);

      return success({
        inStockCount: inStockRows[0]?.count ?? 0,
        outOfStockCount: outOfStockRows[0]?.count ?? 0,
        lowStockCount: lowStockRows[0]?.count ?? 0,
        pendingTransferCount: transferRows[0]?.count ?? 0,
        warehouseCount: warehouseIds.length,
      });
    } catch (error) {
      logger.error("Failed to load inventory dashboard", parseError(error));
      return fail({
        message: t("dashboard.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
