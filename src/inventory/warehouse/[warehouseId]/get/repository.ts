/**
 * Inventory Warehouse Get Repository
 */

import { eq, sql } from "drizzle-orm";
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

import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { stockLevels, warehouses } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { InventoryWarehouseGetResponseOutput } from "./definition";

export class InventoryWarehouseGetRepository {
  static async getWarehouse(
    warehouseId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InventoryWarehouseGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [warehouse] = await db
        .select()
        .from(warehouses)
        .where(eq(warehouses.id, warehouseId))
        .limit(1);

      if (!warehouse) {
        return fail({
          message: t("warehouseGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        warehouse.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const [[company], [stock]] = await Promise.all([
        db
          .select({ name: companies.name, currency: companies.currency })
          .from(companies)
          .where(eq(companies.id, warehouse.companyId)),
        db
          .select({
            stockedProducts: sql<number>`count(*) filter (where ${stockLevels.quantityOnHand} > 0)::int`,
            missingCosts: sql<number>`count(*) filter (where ${stockLevels.quantityOnHand} <> 0 and ${stockLevels.unitCost} is null)::int`,
            value:
              sql<number>`coalesce(sum(${stockLevels.quantityOnHand} * ${stockLevels.unitCost}), 0)`.mapWith(
                Number,
              ),
          })
          .from(stockLevels)
          .where(eq(stockLevels.warehouseId, warehouse.id)),
      ]);

      return success({
        result: {
          id: warehouse.id,
          companyId: warehouse.companyId,
          companyName: company?.name,
          stockedProducts: stock?.stockedProducts ?? 0,
          stockValue: stock?.missingCosts ? null : (stock?.value ?? 0),
          valuationCurrency: company?.currency ?? undefined,
          name: warehouse.name,
          code: warehouse.code,
          address: warehouse.address ?? null,
          isActive: warehouse.isActive,
          isDefault: warehouse.isDefault,
          negativeStockPolicy: warehouse.negativeStockPolicy,
          createdAt: warehouse.createdAt,
          updatedAt: warehouse.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Error fetching warehouse", parseError(error));
      return fail({
        message: t("warehouseGet.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
