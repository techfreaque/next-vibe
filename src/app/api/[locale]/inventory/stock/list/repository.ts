/**
 * Inventory Stock List Repository
 */

import { and, eq, inArray } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { catalogProducts } from "@/app/api/[locale]/products/db";
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

import { stockLevels, warehouses } from "../../db";
import { scopedTranslation } from "../../i18n";
import type { InventoryStockListGetRequestOutput } from "./definition";

interface StockRow {
  id: string;
  warehouseId: string;
  warehouseName: string | null;
  productId: string;
  productName: string | null;
  quantityOnHand: number;
  quantityReserved: number;
  quantityOnOrder: number;
  quantityAvailable: number;
  reorderPoint: number | null;
  unitCost: number | null;
  isLowStock: boolean;
  updatedAt: Date;
}

function mapStockRow(
  row: {
    id: string;
    warehouseId: string;
    productId: string;
    quantityOnHand: number;
    quantityReserved: number;
    quantityOnOrder: number;
    reorderPoint: number | null | undefined;
    unitCost: number | null | undefined;
    updatedAt: Date;
  },
  warehouseMap: Map<string, string>,
  productMap: Map<string, string>,
): StockRow {
  const quantityAvailable = row.quantityOnHand - row.quantityReserved;
  const isLowStock =
    row.reorderPoint !== null &&
    row.reorderPoint !== undefined &&
    row.quantityOnHand <= row.reorderPoint;
  return {
    id: row.id,
    warehouseId: row.warehouseId,
    warehouseName: warehouseMap.get(row.warehouseId) ?? null,
    productId: row.productId,
    productName: productMap.get(row.productId) ?? null,
    quantityOnHand: row.quantityOnHand,
    quantityReserved: row.quantityReserved,
    quantityOnOrder: row.quantityOnOrder,
    quantityAvailable,
    reorderPoint: row.reorderPoint ?? null,
    unitCost: row.unitCost ?? null,
    isLowStock,
    updatedAt: row.updatedAt,
  };
}

export class InventoryStockListRepository {
  static async listStock(
    data: InventoryStockListGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      stockLevels: StockRow[];
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      if (!data.warehouseId) {
        // Return stock for all warehouses in all companies the user is a member of
        const memberRows = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );

        const companyIds = memberRows.map((r) => r.companyId);
        if (companyIds.length === 0) {
          return success({ stockLevels: [] });
        }

        // Get all warehouses for these companies
        const warehouseRows = await db
          .select({ id: warehouses.id, name: warehouses.name })
          .from(warehouses)
          .where(inArray(warehouses.companyId, companyIds));

        if (warehouseRows.length === 0) {
          return success({ stockLevels: [] });
        }

        const warehouseIds = warehouseRows.map((w) => w.id);
        const warehouseMap = new Map(warehouseRows.map((w) => [w.id, w.name]));

        const conditions = [inArray(stockLevels.warehouseId, warehouseIds)];
        if (data.productId) {
          conditions.push(eq(stockLevels.productId, data.productId));
        }

        const rows = await db
          .select()
          .from(stockLevels)
          .where(and(...conditions));

        // Fetch product names
        const productIds = [...new Set(rows.map((r) => r.productId))];
        const productRows =
          productIds.length > 0
            ? await db
                .select({ id: catalogProducts.id, name: catalogProducts.name })
                .from(catalogProducts)
                .where(inArray(catalogProducts.id, productIds))
            : [];
        const productMap = new Map(productRows.map((p) => [p.id, p.name]));

        const result = rows.map((row) =>
          mapStockRow(row, warehouseMap, productMap),
        );

        return success({ stockLevels: result });
      }

      // Specific warehouse requested — verify membership via the warehouse's company
      const [warehouse] = await db
        .select({ companyId: warehouses.companyId, name: warehouses.name })
        .from(warehouses)
        .where(eq(warehouses.id, data.warehouseId))
        .limit(1);

      if (!warehouse) {
        return fail({
          message: t("stockList.get.errors.notFound.title"),
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

      const warehouseMap = new Map([[data.warehouseId, warehouse.name]]);

      const conditions = [eq(stockLevels.warehouseId, data.warehouseId)];
      if (data.productId) {
        conditions.push(eq(stockLevels.productId, data.productId));
      }

      const rows = await db
        .select()
        .from(stockLevels)
        .where(and(...conditions));

      // Fetch product names
      const productIds = [...new Set(rows.map((r) => r.productId))];
      const productRows =
        productIds.length > 0
          ? await db
              .select({ id: catalogProducts.id, name: catalogProducts.name })
              .from(catalogProducts)
              .where(inArray(catalogProducts.id, productIds))
          : [];
      const productMap = new Map(productRows.map((p) => [p.id, p.name]));

      const result = rows.map((row) =>
        mapStockRow(row, warehouseMap, productMap),
      );

      return success({ stockLevels: result });
    } catch (error) {
      logger.error("Error listing stock levels", parseError(error));
      return fail({
        message: t("stockList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
