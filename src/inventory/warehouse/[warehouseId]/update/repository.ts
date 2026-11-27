/**
 * Inventory Warehouse Update Repository
 */

import { and, eq, ne } from "drizzle-orm";
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

import { warehouses } from "../../../db";
import type { NegativeStockPolicyDbValue } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import type { InventoryWarehouseUpdateRequestOutput } from "./definition";

export class InventoryWarehouseUpdateRepository {
  static async updateWarehouse(
    warehouseId: string,
    data: InventoryWarehouseUpdateRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        name: string;
        code: string;
        isActive: boolean;
        isDefault: boolean;
        negativeStockPolicy: NegativeStockPolicyDbValue;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [existing] = await db
        .select()
        .from(warehouses)
        .where(eq(warehouses.id, warehouseId))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("warehouseUpdate.patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        existing.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // Check code uniqueness if changing code
      if (data.code !== undefined && data.code !== existing.code) {
        const [conflict] = await db
          .select({ id: warehouses.id })
          .from(warehouses)
          .where(
            and(
              eq(warehouses.companyId, existing.companyId),
              eq(warehouses.code, data.code),
              ne(warehouses.id, warehouseId),
            ),
          )
          .limit(1);
        if (conflict) {
          return fail({
            message: t("warehouseUpdate.patch.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
      }

      // Clear other defaults if setting this as default
      if (data.isDefault === true) {
        await db
          .update(warehouses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(
            and(
              eq(warehouses.companyId, existing.companyId),
              ne(warehouses.id, warehouseId),
            ),
          );
      }

      const [updated] = await db
        .update(warehouses)
        .set({
          name: data.name ?? existing.name,
          code: data.code ?? existing.code,
          address: data.address !== undefined ? data.address : existing.address,
          isActive: data.isActive ?? existing.isActive,
          isDefault: data.isDefault ?? existing.isDefault,
          negativeStockPolicy:
            data.negativeStockPolicy ?? existing.negativeStockPolicy,
          updatedAt: new Date(),
        })
        .where(eq(warehouses.id, warehouseId))
        .returning();

      if (!updated) {
        return fail({
          message: t("warehouseUpdate.patch.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        result: {
          id: updated.id,
          name: updated.name,
          code: updated.code,
          isActive: updated.isActive,
          isDefault: updated.isDefault,
          negativeStockPolicy: updated.negativeStockPolicy,
        },
      });
    } catch (error) {
      logger.error("Error updating warehouse", parseError(error));
      return fail({
        message: t("warehouseUpdate.patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
