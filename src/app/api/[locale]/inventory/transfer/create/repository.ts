/**
 * Inventory Transfer Create Repository
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

import {
  warehouses,
  warehouseTransferItems,
  warehouseTransfers,
} from "../../db";
import { scopedTranslation } from "../../i18n";
import type { InventoryTransferCreateRequestOutput } from "./definition";

export class InventoryTransferCreateRepository {
  static async createTransfer(
    data: InventoryTransferCreateRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        status: string;
        reference: string | null;
        fromWarehouseId: string;
        toWarehouseId: string;
        items: {
          id: string;
          productId: string;
          quantityRequested: number;
        }[];
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // Validate same company owns both warehouses
      if (data.fromWarehouseId === data.toWarehouseId) {
        return fail({
          message: t("transferCreate.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Validate from warehouse belongs to company
      const [fromWarehouse] = await db
        .select({ companyId: warehouses.companyId })
        .from(warehouses)
        .where(eq(warehouses.id, data.fromWarehouseId))
        .limit(1);

      if (!fromWarehouse || fromWarehouse.companyId !== data.companyId) {
        return fail({
          message: t("transferCreate.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Validate to warehouse belongs to company
      const [toWarehouse] = await db
        .select({ companyId: warehouses.companyId })
        .from(warehouses)
        .where(eq(warehouses.id, data.toWarehouseId))
        .limit(1);

      if (!toWarehouse || toWarehouse.companyId !== data.companyId) {
        return fail({
          message: t("transferCreate.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Create transfer
      const [transfer] = await db
        .insert(warehouseTransfers)
        .values({
          companyId: data.companyId,
          fromWarehouseId: data.fromWarehouseId,
          toWarehouseId: data.toWarehouseId,
          reference: data.reference ?? null,
          notes: data.notes ?? null,
          createdByUserId: userId,
        })
        .returning();

      if (!transfer) {
        return fail({
          message: t("transferCreate.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Create line items
      const insertedItems = await db
        .insert(warehouseTransferItems)
        .values(
          data.items.map((item) => ({
            transferId: transfer.id,
            productId: item.productId,
            quantityRequested: item.quantityRequested,
          })),
        )
        .returning();

      return success({
        result: {
          id: transfer.id,
          status: transfer.status,
          reference: transfer.reference,
          fromWarehouseId: transfer.fromWarehouseId,
          toWarehouseId: transfer.toWarehouseId,
          items: insertedItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantityRequested: item.quantityRequested,
          })),
        },
      });
    } catch (error) {
      logger.error("Error creating transfer", parseError(error));
      return fail({
        message: t("transferCreate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
