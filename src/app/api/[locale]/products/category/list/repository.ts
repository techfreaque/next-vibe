/**
 * Product Category List Repository
 * Fetches product categories for the calling user with optional company filter and pagination
 */

import { and, count, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { productCategories } from "../../db";
import type {
  CategoryListGetRequestOutput,
  CategoryListGetResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class CategoryListRepository {
  static async listCategories(
    data: CategoryListGetRequestOutput,
    logger: EndpointLogger,
    userId: string,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CategoryListGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { filters } = data;

      const conditions = [eq(productCategories.ownerUserId, userId)];

      if (filters?.companyId) {
        conditions.push(eq(productCategories.companyId, filters.companyId));
      }

      const where = and(...conditions);

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(productCategories)
        .where(where);

      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select({
          id: productCategories.id,
          name: productCategories.name,
          parentId: productCategories.parentId,
          sortOrder: productCategories.sortOrder,
          isActive: productCategories.isActive,
          createdAt: productCategories.createdAt,
        })
        .from(productCategories)
        .where(where)
        .limit(pageSize)
        .offset(offset);

      return success({ total: total ?? 0, categories: rows });
    } catch (error) {
      logger.error("Error listing product categories", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
