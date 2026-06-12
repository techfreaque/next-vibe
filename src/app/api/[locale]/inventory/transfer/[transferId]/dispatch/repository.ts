/**
 * Inventory Transfer Dispatch Repository
 * Transitions a DRAFT transfer to IN_TRANSIT.
 * Creates TRANSFER_OUT stock movements for each line item from the source warehouse.
 */

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { warehouseTransferItems, warehouseTransfers } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import { applyStockMovement } from "../../../stock/shared-helpers";
import type { InventoryTransferDispatchRequestOutput } from "./definition";

export class InventoryTransferDispatchRepository {
  static async dispatchTransfer(
    data: InventoryTransferDispatchRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        status: string;
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
          message: t("transferDispatch.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        transfer.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      if (transfer.status !== "DRAFT") {
        return fail({
          message: t("transferDispatch.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Fetch all items
      const items = await db
        .select()
        .from(warehouseTransferItems)
        .where(eq(warehouseTransferItems.transferId, transfer.id));

      // Apply TRANSFER_OUT movements from source warehouse
      for (const item of items) {
        const movResult = await applyStockMovement({
          warehouseId: transfer.fromWarehouseId,
          productId: item.productId,
          type: "TRANSFER_OUT",
          quantity: -item.quantityRequested,
          sourceId: transfer.id,
          sourceType: "WAREHOUSE_TRANSFER",
          reference: transfer.reference ?? undefined,
          userId,
          logger,
          insufficientStockError: t(
            "transferDispatch.post.errors.conflict.title",
          ),
        });

        if (!movResult.success) {
          return movResult;
        }
      }

      // Update transfer status to IN_TRANSIT
      const [updated] = await db
        .update(warehouseTransfers)
        .set({
          status: "IN_TRANSIT",
          updatedAt: new Date(),
        })
        .where(eq(warehouseTransfers.id, transfer.id))
        .returning({
          id: warehouseTransfers.id,
          status: warehouseTransfers.status,
        });

      if (!updated) {
        return fail({
          message: t("transferDispatch.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        result: {
          id: updated.id,
          status: updated.status,
        },
      });
    } catch (error) {
      logger.error("Error dispatching transfer", parseError(error));
      return fail({
        message: t("transferDispatch.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
