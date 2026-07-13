/**
 * Inventory Transfer Create Repository
 */

import { eq } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

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
