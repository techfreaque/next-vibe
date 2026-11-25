/**
 * Inventory Transfer Dispatch Repository
 * Transitions a DRAFT transfer to IN_TRANSIT.
 * Creates TRANSFER_OUT stock movements for each line item from the source warehouse.
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

import { warehouseTransferItems, warehouseTransfers } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import { applyStockMovement } from "../../../stock/shared-helpers";
import type {
  InventoryTransferDispatchRequestOutput,
  InventoryTransferDispatchResponseOutput,
} from "./definition";

export class InventoryTransferDispatchRepository {
  static async dispatchTransfer(
    data: InventoryTransferDispatchRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InventoryTransferDispatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [owner] = await db
        .select({ companyId: warehouseTransfers.companyId })
        .from(warehouseTransfers)
        .where(eq(warehouseTransfers.id, data.transferId))
        .limit(1);

      if (!owner) {
        return fail({
          message: t("transferDispatch.post.errors.notFound.title"),
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
        message: t("transferDispatch.post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
      return await withTransaction<
        ResponseType<InventoryTransferDispatchResponseOutput>
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
            transfer.status !== "DRAFT" ||
            transfer.fromWarehouseId === transfer.toWarehouseId
          ) {
            return conflict;
          }
          // Fetch all items
          const items = await tx
            .select()
            .from(warehouseTransferItems)
            .where(eq(warehouseTransferItems.transferId, transfer.id));

          if (
            !items.length ||
            items.some((item) => item.quantityRequested <= 0)
          ) {
            return conflict;
          }
          // Apply TRANSFER_OUT movements from source warehouse
          for (const item of items) {
            const movResult = await applyStockMovement(
              {
                companyId: transfer.companyId,
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
              },
              tx,
            );

            if (!movResult.success) {
              tx.rollback();
            }
          }

          // Update transfer status to IN_TRANSIT
          const [updated] = await tx
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
            return tx.rollback();
          }
          return success({
            result: {
              id: updated.id,
              status: updated.status,
            },
          });
        },
        () => conflict,
      );
    } catch (error) {
      logger.error("Error dispatching transfer", parseError(error));
      return fail({
        message: t("transferDispatch.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
