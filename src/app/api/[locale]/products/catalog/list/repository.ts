/**
 * Catalog Product List Repository
 * Fetches catalog products with optional filters and pagination
 */

import { and, count, eq } from "drizzle-orm";
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

import { catalogProducts } from "../../db";
import type {
  CatalogListGetRequestOutput,
  CatalogListGetResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class CatalogListRepository {
  static async listProducts(
    data: CatalogListGetRequestOutput,
    logger: EndpointLogger,
    userId: string,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CatalogListGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { filters } = data;

      // Verify VIEWER+ company membership when filtering by companyId
      if (filters?.companyId) {
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          filters.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
      }

      const conditions = [eq(catalogProducts.ownerUserId, userId)];

      if (filters?.companyId) {
        conditions.push(eq(catalogProducts.companyId, filters.companyId));
      }
      if (filters?.categoryId) {
        conditions.push(eq(catalogProducts.categoryId, filters.categoryId));
      }
      if (filters?.type) {
        conditions.push(eq(catalogProducts.type, filters.type));
      }
      if (filters?.isActive !== undefined) {
        conditions.push(eq(catalogProducts.isActive, filters.isActive));
      }

      const where = and(...conditions);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(catalogProducts)
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select({
          id: catalogProducts.id,
          name: catalogProducts.name,
          type: catalogProducts.type,
          sku: catalogProducts.sku,
          basePrice: catalogProducts.basePrice,
          currency: catalogProducts.currency,
          unit: catalogProducts.unit,
          isActive: catalogProducts.isActive,
          isSubscription: catalogProducts.isSubscription,
          billingInterval: catalogProducts.billingInterval,
          categoryId: catalogProducts.categoryId,
          createdAt: catalogProducts.createdAt,
        })
        .from(catalogProducts)
        .where(where)
        .limit(pageSize)
        .offset(offset);

      const products = rows.map((row) => ({
        ...row,
        isSubscription: row.isSubscription ?? false,
      }));

      return success({ total: total ?? 0, products });
    } catch (error) {
      logger.error("Error listing catalog products", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
