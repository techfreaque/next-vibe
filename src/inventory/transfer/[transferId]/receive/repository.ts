/**
 * Inventory Transfer Receive Repository
 * Transitions an IN_TRANSIT transfer to RECEIVED.
 * Creates TRANSFER_IN stock movements for each line item into the destination warehouse.
 * Updates quantityReceived on each transfer item.
 */

import { and, eq } from "drizzle-orm";
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
import { withTransaction } from "next-vibe/database/utils/repository-helpers";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import {
  stockMovements,
  warehouseTransferItems,
  warehouseTransfers,
} from "../../../db";
import { scopedTranslation } from "../../../i18n";
import { applyStockMovement } from "../../../stock/shared-helpers";
import type {
  InventoryTransferReceiveRequestOutput,
  InventoryTransferReceiveResponseOutput,
} from "./definition";

export class InventoryTransferReceiveRepository {
  static async receiveTransfer(
    data: InventoryTransferReceiveRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InventoryTransferReceiveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [owner] = await db
        .select({ companyId: warehouseTransfers.companyId })
        .from(warehouseTransfers)
        .where(eq(warehouseTransfers.id, data.transferId))
        .limit(1);

      if (!owner) {
        return fail({
          message: t("transferReceive.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        owner.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const conflict = fail({
        message: t("transferReceive.post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
      return await withTransaction<
        ResponseType<InventoryTransferReceiveResponseOutput>
      >(
        logger,
        async (tx) => {
          const [transfer] = await tx
            .select()
            .from(warehouseTransfers)
            .where(
              and(
                eq(warehouseTransfers.id, data.transferId),
                eq(warehouseTransfers.companyId, owner.companyId),
              ),
            )
            .for("update");
          if (
            !transfer ||
            transfer.status !== "IN_TRANSIT" ||
            transfer.fromWarehouseId === transfer.toWarehouseId
          ) {
            return conflict;
          }
          // Fetch all items
          const items = await tx
            .select()
            .from(warehouseTransferItems)
            .where(eq(warehouseTransferItems.transferId, transfer.id));

          const completedAt = new Date();

          if (
            !items.length ||
            items.some((item) => item.quantityRequested <= 0)
          ) {
            return conflict;
          }
          const costs = await tx
            .select({
              productId: stockMovements.productId,
              cost: stockMovements.unitCost,
            })
            .from(stockMovements)
            .where(
              and(
                eq(stockMovements.sourceId, transfer.id),
                eq(stockMovements.sourceType, "WAREHOUSE_TRANSFER"),
                eq(stockMovements.warehouseId, transfer.fromWarehouseId),
                eq(stockMovements.type, "TRANSFER_OUT"),
              ),
            );
          const unitCosts = new Map(
            costs.map((movement) => [movement.productId, movement.cost]),
          );
          // Apply TRANSFER_IN movements into destination warehouse
          for (const item of items) {
            const movResult = await applyStockMovement(
              {
                companyId: transfer.companyId,
                warehouseId: transfer.toWarehouseId,
                productId: item.productId,
                type: "TRANSFER_IN",
                quantity: item.quantityRequested,
                unitCost: unitCosts.get(item.productId) ?? undefined,
                sourceId: transfer.id,
                sourceType: "WAREHOUSE_TRANSFER",
                reference: transfer.reference ?? undefined,
                userId,
                logger,
                insufficientStockError: t(
                  "transferReceive.post.errors.conflict.title",
                ),
              },
              tx,
            );

            if (!movResult.success) {
              tx.rollback();
            }

            // Update quantity received on the line item
            await tx
              .update(warehouseTransferItems)
              .set({ quantityReceived: item.quantityRequested })
              .where(eq(warehouseTransferItems.id, item.id));
          }

          // Update transfer status to RECEIVED
          const [updated] = await tx
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
            return tx.rollback();
          }
          return success({
            result: {
              id: updated.id,
              status: updated.status,
              completedAt: updated.completedAt ?? completedAt,
            },
          });
        },
        () => conflict,
      );
    } catch (error) {
      logger.error("Error receiving transfer", parseError(error));
      return fail({
        message: t("transferReceive.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
