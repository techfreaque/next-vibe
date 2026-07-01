/**
 * Product Category List Repository
 * Fetches product categories for the calling user with optional company filter and pagination
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
