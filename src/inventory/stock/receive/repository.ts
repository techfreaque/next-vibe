/**
 * Inventory Stock Receive Repository
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

import { scopedTranslation } from "../../i18n";
import { applyStockMovement, getWarehouseCompanyId } from "../shared-helpers";
import type { InventoryStockReceiveRequestOutput } from "./definition";

export class InventoryStockReceiveRepository {
  static async receiveStock(
    data: InventoryStockReceiveRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        movementId: string;
        warehouseId: string;
        productId: string;
        quantityOnHand: number;
        unitCost: number | null;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const companyId = await getWarehouseCompanyId(data.warehouseId);
      if (!companyId) {
        return fail({
          message: t("stockReceive.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const result = await applyStockMovement({
        warehouseId: data.warehouseId,
        productId: data.productId,
        type: "RECEIPT",
        quantity: data.quantity,
        unitCost: data.unitCost,
        reference: data.reference,
        userId,
        logger,
        insufficientStockError: t("stockReceive.post.errors.conflict.title"),
      });

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: {
          result: {
            movementId: result.data.movementId,
            warehouseId: data.warehouseId,
            productId: data.productId,
            quantityOnHand: result.data.quantityOnHand,
            unitCost: result.data.unitCost,
          },
        },
      };
    } catch (error) {
      logger.error("Error receiving stock", parseError(error));
      return fail({
        message: t("stockReceive.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
