/**
 * Inventory Warehouse Create Repository
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

import { warehouses } from "../../db";
import { scopedTranslation } from "../../i18n";
import type { InventoryWarehouseCreateRequestOutput } from "./definition";

export class InventoryWarehouseCreateRepository {
  static async createWarehouse(
    data: InventoryWarehouseCreateRequestOutput,
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
        isActive: boolean;
        isDefault: boolean;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      // If setting as default, clear existing default first
      if (data.isDefault) {
        await db
          .update(warehouses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(eq(warehouses.companyId, data.companyId));
      }

      const [created] = await db
        .insert(warehouses)
        .values({
          companyId: data.companyId,
          name: data.name,
          code: data.code,
          address: data.address ?? null,
          isActive: data.isActive ?? true,
          isDefault: data.isDefault ?? false,
        })
        .returning();

      if (!created) {
        return fail({
          message: t("warehouseCreate.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        result: {
          id: created.id,
          companyId: created.companyId,
          name: created.name,
          code: created.code,
          isActive: created.isActive,
          isDefault: created.isDefault,
        },
      });
    } catch (error) {
      // Unique constraint on companyId + code
      const raw = error instanceof Error ? error.message : String(error);
      if (raw.includes("uq_warehouse_company_code")) {
        return fail({
          message: t("warehouseCreate.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      logger.error("Error creating warehouse", parseError(error));
      return fail({
        message: t("warehouseCreate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
