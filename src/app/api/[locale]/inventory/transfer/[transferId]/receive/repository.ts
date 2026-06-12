/**
 * Inventory Transfer Receive Repository
 * Transitions an IN_TRANSIT transfer to RECEIVED.
 * Creates TRANSFER_IN stock movements for each line item into the destination warehouse.
 * Updates quantityReceived on each transfer item.
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
import type { InventoryTransferReceiveRequestOutput } from "./definition";

export class InventoryTransferReceiveRepository {
  static async receiveTransfer(
    data: InventoryTransferReceiveRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        status: string;
        completedAt: Date;
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
          message: t("transferReceive.post.errors.notFound.title"),
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

      if (transfer.status !== "IN_TRANSIT") {
        return fail({
          message: t("transferReceive.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Fetch all items
      const items = await db
        .select()
        .from(warehouseTransferItems)
        .where(eq(warehouseTransferItems.transferId, transfer.id));

      const completedAt = new Date();

      // Apply TRANSFER_IN movements into destination warehouse
      for (const item of items) {
        const movResult = await applyStockMovement({
          warehouseId: transfer.toWarehouseId,
          productId: item.productId,
          type: "TRANSFER_IN",
          quantity: item.quantityRequested,
          sourceId: transfer.id,
          sourceType: "WAREHOUSE_TRANSFER",
          reference: transfer.reference ?? undefined,
          userId,
          logger,
          insufficientStockError: t(
            "transferReceive.post.errors.conflict.title",
          ),
        });

        if (!movResult.success) {
          return movResult;
        }

        // Update quantity received on the line item
        await db
          .update(warehouseTransferItems)
          .set({ quantityReceived: item.quantityRequested })
          .where(eq(warehouseTransferItems.id, item.id));
      }

      // Update transfer status to RECEIVED
      const [updated] = await db
        .update(warehouseTransfers)
        .set({
          status: "RECEIVED",
          completedAt,
          updatedAt: completedAt,
        })
        .where(eq(warehouseTransfers.id, transfer.id))
        .returning({
          id: warehouseTransfers.id,
          status: warehouseTransfers.status,
          completedAt: warehouseTransfers.completedAt,
        });

      if (!updated) {
        return fail({
          message: t("transferReceive.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        result: {
          id: updated.id,
          status: updated.status,
          completedAt: updated.completedAt ?? completedAt,
        },
      });
    } catch (error) {
      logger.error("Error receiving transfer", parseError(error));
      return fail({
        message: t("transferReceive.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
