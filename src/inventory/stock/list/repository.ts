/**
 * Inventory Stock List Repository
 */

import { and, asc, eq, isNull, or, sql } from "drizzle-orm";
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

import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { catalogProducts } from "@/products/db";

import { stockLevels, warehouses } from "../../db";
import { scopedTranslation } from "../../i18n";
import type {
  InventoryStockListGetRequestOutput,
  InventoryStockListGetResponseOutput,
} from "./definition";
import { DEFAULT_LOW_STOCK_THRESHOLD } from "./threshold";

export class InventoryStockListRepository {
  static async listStock(
    data: InventoryStockListGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InventoryStockListGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      let companyId = data.companyId;
      if (data.warehouseId) {
        const [warehouse] = await db
          .select({ companyId: warehouses.companyId })
          .from(warehouses)
          .where(eq(warehouses.id, data.warehouseId));
        if (!warehouse || (companyId && companyId !== warehouse.companyId)) {
          return fail({
            message: t("stockList.get.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        companyId = warehouse.companyId;
      }
      if (companyId) {
        const access = await CompanyAuthRepository.requireMember(
          userId,
          companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!access.success) {
          return access;
        }
      }
      const available = sql`${stockLevels.quantityOnHand}-${stockLevels.quantityReserved}`;
      const rows = await db
        .select({
          id: stockLevels.id,
          warehouseId: warehouses.id,
          warehouseName: warehouses.name,
          productId: stockLevels.productId,
          productName: catalogProducts.name,
          companyId: companies.id,
          currency: companies.currency,
          quantityOnHand: stockLevels.quantityOnHand,
          quantityReserved: stockLevels.quantityReserved,
          quantityOnOrder: stockLevels.quantityOnOrder,
          quantityAvailable: sql<number>`${available}`.mapWith(Number),
          reorderPoint: stockLevels.reorderPoint,
          unitCost: stockLevels.unitCost,
          stockValue: sql<
            number | null
          >`round(${stockLevels.quantityOnHand} * ${stockLevels.unitCost}, 4)`.mapWith(
            Number,
          ),
          isLowStock: sql<boolean>`case when ${stockLevels.reorderPoint} is not null
           then ${available} <= ${stockLevels.reorderPoint} else ${available} < ${DEFAULT_LOW_STOCK_THRESHOLD} end`,
          updatedAt: stockLevels.updatedAt,
        })
        .from(stockLevels)
        .innerJoin(warehouses, eq(warehouses.id, stockLevels.warehouseId))
        .innerJoin(companies, eq(companies.id, warehouses.companyId))
        .innerJoin(
          companyMembers,
          and(
            eq(companyMembers.companyId, companies.id),
            eq(companyMembers.userId, userId),
            eq(companyMembers.isActive, true),
          ),
        )
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
            eq(companies.isActive, true),
            companyId ? eq(companies.id, companyId) : undefined,
            data.warehouseId ? eq(warehouses.id, data.warehouseId) : undefined,
            data.productId
              ? eq(stockLevels.productId, data.productId)
              : undefined,
          ),
        )
        .orderBy(
          asc(catalogProducts.name),
          asc(warehouses.name),
          asc(stockLevels.id),
        );
      return success({ stockLevels: rows });
    } catch (error) {
      logger.error("Error listing stock levels", parseError(error));
      return fail({
        message: t("stockList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
