/**
 * Inventory Stock Issue Repository
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
import type { InventoryStockIssueRequestOutput } from "./definition";

export class InventoryStockIssueRepository {
  static async issueStock(
    data: InventoryStockIssueRequestOutput,
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
        quantityAvailable: number;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const companyId = await getWarehouseCompanyId(data.warehouseId);
      if (!companyId) {
        return fail({
          message: t("stockIssue.post.errors.notFound.title"),
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

      // quantity input is positive; applyStockMovement expects negative for outbound
      const result = await applyStockMovement({
        warehouseId: data.warehouseId,
        productId: data.productId,
        type: "ISSUE",
        quantity: -data.quantity,
        unitCost: data.unitCost,
        reference: data.reference,
        userId,
        logger,
        insufficientStockError: t("stockIssue.post.errors.conflict.title"),
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
            quantityAvailable: result.data.quantityAvailable,
          },
        },
      };
    } catch (error) {
      logger.error("Error issuing stock", parseError(error));
      return fail({
        message: t("stockIssue.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
