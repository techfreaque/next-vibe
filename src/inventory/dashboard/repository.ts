/**
 * Inventory Dashboard Repository
 * Aggregates KPI counts for stock health, transfers, and warehouses
 */

import "server-only";

import {
  and,
  asc,
  countDistinct,
  eq,
  inArray,
  isNull,
  or,
  sql,
} from "drizzle-orm";
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

import { companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { catalogProducts } from "@/products/db";

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

      const available = sql`${stockLevels.quantityOnHand} - ${stockLevels.quantityReserved}`;
      const products = db
        .select({
          productId: stockLevels.productId,
          companyId: warehouses.companyId,
          available: sql<string>`sum(${available})`.as("available"),
          low: sql<boolean>`bool_or(case when ${stockLevels.reorderPoint} is not null then ${available} <= ${stockLevels.reorderPoint}
          else ${available} < ${LOW_STOCK_FALLBACK_THRESHOLD} end)`.as("low"),
        })
        .from(stockLevels)
        .innerJoin(warehouses, eq(warehouses.id, stockLevels.warehouseId))
        .where(inArray(warehouses.id, warehouseIds))
        .groupBy(warehouses.companyId, stockLevels.productId)
        .as("product_totals");
      const [[health], transferRows, attention] = await Promise.all([
        db
          .select({
            inStock: sql<number>`count(*) filter (where ${products.available} > 0)::int`,
            outOfStock: sql<number>`count(*) filter (where ${products.available} <= 0)::int`,
            lowStock: sql<number>`count(*) filter (where ${products.available} > 0 and ${products.low})::int`,
          })
          .from(products),
        db
          .select({ count: countDistinct(warehouseTransfers.id) })
          .from(warehouseTransfers)
          .where(
            and(
              inArray(warehouseTransfers.companyId, companyIds),
              eq(warehouseTransfers.status, "IN_TRANSIT"),
            ),
          ),
        db
          .select({
            id: stockLevels.id,
            companyId: warehouses.companyId,
            warehouseId: warehouses.id,
            warehouseName: warehouses.name,
            productId: stockLevels.productId,
            productName: catalogProducts.name,
            available: sql<number>`${available}`.mapWith(Number),
          })
          .from(stockLevels)
          .innerJoin(warehouses, eq(warehouses.id, stockLevels.warehouseId))
          .leftJoin(
            catalogProducts,
            and(
              eq(catalogProducts.id, stockLevels.productId),
              or(
                eq(catalogProducts.companyId, warehouses.companyId),
                and(
                  isNull(catalogProducts.companyId),
                  eq(catalogProducts.ownerUserId, userId),
                ),
              ),
            ),
          )
          .where(
            and(
              inArray(warehouses.id, warehouseIds),
              sql`(${available} <= 0 OR (case when ${stockLevels.reorderPoint} is null then ${available} < ${LOW_STOCK_FALLBACK_THRESHOLD} else ${available} <= ${stockLevels.reorderPoint} end))`,
            ),
          )
          .orderBy(
            asc(available),
            asc(catalogProducts.name),
            asc(stockLevels.id),
          )
          .limit(8),
      ]);
      return success({
        attention,
        inStockCount: health?.inStock ?? 0,
        outOfStockCount: health?.outOfStock ?? 0,
        lowStockCount: health?.lowStock ?? 0,
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
