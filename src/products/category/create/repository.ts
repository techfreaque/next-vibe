/**
 * Product Category Create Repository
 * Creates a new product category for the calling user
 */

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

import { productCategories } from "../../db";
import type { CategoryCreateRequestTypeOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CategoryCreateRepository {
  static async createCategory(
    data: CategoryCreateRequestTypeOutput,
    logger: EndpointLogger,
    userId: string,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<{ result: { id: string; name: string } }>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;

      // Verify ADMIN+ company membership when companyId is provided
      if (details.companyId) {
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          details.companyId,
          CompanyMemberRole.ADMIN,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
      }

      const [category] = await db
        .insert(productCategories)
        .values({
          ownerUserId: userId,
          companyId: details.companyId,
          parentId: details.parentId,
          name: details.name,
          sortOrder: details.sortOrder ?? 0,
        })
        .returning({ id: productCategories.id, name: productCategories.name });

      if (!category) {
        logger.error("Failed to insert product category");
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ result: { id: category.id, name: category.name } });
    } catch (error) {
      logger.error("Error creating product category", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
