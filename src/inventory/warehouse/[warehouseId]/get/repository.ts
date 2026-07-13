/**
 * Inventory Warehouse Get Repository
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

import { warehouses } from "../../../db";
import { scopedTranslation } from "../../../i18n";

export class InventoryWarehouseGetRepository {
  static async getWarehouse(
    warehouseId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        companyId: string;
        name: string;
        code: string;
        address: string | null;
        isActive: boolean;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [warehouse] = await db
        .select()
        .from(warehouses)
        .where(eq(warehouses.id, warehouseId))
        .limit(1);

      if (!warehouse) {
        return fail({
          message: t("warehouseGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        warehouse.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      return success({
        result: {
          id: warehouse.id,
          companyId: warehouse.companyId,
          name: warehouse.name,
          code: warehouse.code,
          address: warehouse.address ?? null,
          isActive: warehouse.isActive,
          isDefault: warehouse.isDefault,
          createdAt: warehouse.createdAt,
          updatedAt: warehouse.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Error fetching warehouse", parseError(error));
      return fail({
        message: t("warehouseGet.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
