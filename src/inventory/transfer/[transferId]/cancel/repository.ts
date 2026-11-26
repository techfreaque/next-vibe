/**
 * Inventory Transfer Cancel Repository
 * Cancels a DRAFT or IN_TRANSIT transfer. A dispatched transfer puts its stock
 * back into the source warehouse (TRANSFER_IN at the dispatch unit cost), so
 * nothing stays lost in transit.
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
  InventoryTransferCancelRequestOutput,
  InventoryTransferCancelResponseOutput,
} from "./definition";

export class InventoryTransferCancelRepository {
  static async cancelTransfer(
    data: InventoryTransferCancelRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InventoryTransferCancelResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [owner] = await db
        .select({ companyId: warehouseTransfers.companyId })
        .from(warehouseTransfers)
        .where(eq(warehouseTransfers.id, data.transferId))
        .limit(1);

      if (!owner) {
        return fail({
          message: t("transferCancel.post.errors.notFound.title"),
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
        message: t("transferCancel.post.errors.conflict.description"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
      return await withTransaction<
        ResponseType<InventoryTransferCancelResponseOutput>
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
            (transfer.status !== "DRAFT" && transfer.status !== "IN_TRANSIT")
          ) {
            return conflict;
          }

          if (transfer.status === "IN_TRANSIT") {
            const items = await tx
              .select()
              .from(warehouseTransferItems)
              .where(eq(warehouseTransferItems.transferId, transfer.id));
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
            for (const item of items) {
              const returned = await applyStockMovement(
                {
                  companyId: transfer.companyId,
                  warehouseId: transfer.fromWarehouseId,
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
                    "transferCancel.post.errors.conflict.title",
                  ),
                },
                tx,
              );
              if (!returned.success) {
                return tx.rollback();
              }
            }
          }

          const now = new Date();
          const [updated] = await tx
            .update(warehouseTransfers)
            .set({ status: "CANCELLED", updatedAt: now })
            .where(eq(warehouseTransfers.id, transfer.id))
            .returning({
              id: warehouseTransfers.id,
              status: warehouseTransfers.status,
            });
          if (!updated) {
            return tx.rollback();
          }
          return success({
            result: { id: updated.id, status: updated.status },
          });
        },
        () => conflict,
      );
    } catch (error) {
      logger.error("Error cancelling transfer", parseError(error));
      return fail({
        message: t("transferCancel.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
