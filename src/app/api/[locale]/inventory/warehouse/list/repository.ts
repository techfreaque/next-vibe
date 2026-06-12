/**
 * Inventory Warehouse List Repository
 */

import { and, eq, inArray } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { companyMembers } from "@/app/api/[locale]/companies/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { warehouses } from "../../db";
import { scopedTranslation } from "../../i18n";
import type { InventoryWarehouseListGetRequestOutput } from "./definition";

export class InventoryWarehouseListRepository {
  static async listWarehouses(
    data: InventoryWarehouseListGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      warehouses: {
        id: string;
        name: string;
        code: string;
        address: string | null;
        isActive: boolean;
        isDefault: boolean;
        createdAt: Date;
      }[];
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      if (!data.companyId) {
        // Return warehouses for all companies the user is a member of
        const memberRows = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );

        const companyIds = memberRows.map((r) => r.companyId);
        if (companyIds.length === 0) {
          return success({ warehouses: [] });
        }

        const rows = await db
          .select({
            id: warehouses.id,
            name: warehouses.name,
            code: warehouses.code,
            address: warehouses.address,
            isActive: warehouses.isActive,
            isDefault: warehouses.isDefault,
            createdAt: warehouses.createdAt,
          })
          .from(warehouses)
          .where(inArray(warehouses.companyId, companyIds));

        return success({ warehouses: rows });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const rows = await db
        .select({
          id: warehouses.id,
          name: warehouses.name,
          code: warehouses.code,
          address: warehouses.address,
          isActive: warehouses.isActive,
          isDefault: warehouses.isDefault,
          createdAt: warehouses.createdAt,
        })
        .from(warehouses)
        .where(eq(warehouses.companyId, data.companyId));

      return success({ warehouses: rows });
    } catch (error) {
      logger.error("Error listing warehouses", parseError(error));
      return fail({
        message: t("warehouseList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
