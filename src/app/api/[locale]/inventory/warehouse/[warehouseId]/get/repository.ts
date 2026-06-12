/**
 * Inventory Warehouse Get Repository
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
