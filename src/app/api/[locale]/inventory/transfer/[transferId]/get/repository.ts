/**
 * Inventory Transfer Get Repository
 */

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { catalogProducts } from "../../../../products/db";
import {
  warehouses,
  warehouseTransferItems,
  warehouseTransfers,
} from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { InventoryTransferGetRequestOutput } from "./definition";

export class InventoryTransferGetRepository {
  static async getTransfer(
    data: InventoryTransferGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        companyId: string;
        fromWarehouseId: string;
        fromWarehouseName: string;
        toWarehouseId: string;
        toWarehouseName: string;
        status: string;
        reference: string | null;
        notes: string | null;
        createdAt: Date;
        completedAt: Date | null;
        items: {
          id: string;
          productId: string;
          productName: string;
          quantityRequested: number;
          quantityReceived: number;
        }[];
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [transfer] = await db
        .select()
        .from(warehouseTransfers)
        .where(eq(warehouseTransfers.id, data.transferId))
        .limit(1);

      if (!transfer) {
        return fail({
          message: t("transferGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        transfer.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // Get warehouse names
      const [fromWarehouse] = await db
        .select({ name: warehouses.name })
        .from(warehouses)
        .where(eq(warehouses.id, transfer.fromWarehouseId))
        .limit(1);

      const [toWarehouse] = await db
        .select({ name: warehouses.name })
        .from(warehouses)
        .where(eq(warehouses.id, transfer.toWarehouseId))
        .limit(1);

      // Get items with product names
      const rawItems = await db
        .select({
          id: warehouseTransferItems.id,
          productId: warehouseTransferItems.productId,
          productName: catalogProducts.name,
          quantityRequested: warehouseTransferItems.quantityRequested,
          quantityReceived: warehouseTransferItems.quantityReceived,
        })
        .from(warehouseTransferItems)
        .leftJoin(
          catalogProducts,
          eq(warehouseTransferItems.productId, catalogProducts.id),
        )
        .where(eq(warehouseTransferItems.transferId, transfer.id));

      return success({
        result: {
          id: transfer.id,
          companyId: transfer.companyId,
          fromWarehouseId: transfer.fromWarehouseId,
          fromWarehouseName: fromWarehouse?.name ?? "",
          toWarehouseId: transfer.toWarehouseId,
          toWarehouseName: toWarehouse?.name ?? "",
          status: transfer.status,
          reference: transfer.reference,
          notes: transfer.notes,
          createdAt: transfer.createdAt,
          completedAt: transfer.completedAt ?? null,
          items: rawItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName ?? "",
            quantityRequested: item.quantityRequested,
            quantityReceived: item.quantityReceived,
          })),
        },
      });
    } catch (error) {
      logger.error("Error fetching transfer", parseError(error));
      return fail({
        message: t("transferGet.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
