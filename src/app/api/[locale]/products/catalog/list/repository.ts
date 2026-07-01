/**
 * Catalog Product List Repository
 * Fetches catalog products with optional filters and pagination
 */

import { and, count, eq } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

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
