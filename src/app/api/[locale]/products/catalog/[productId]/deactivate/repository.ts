/**
 * Catalog Product Deactivate Repository
 * Soft-deletes a catalog product by setting isActive = false
 */

import { and, eq } from "drizzle-orm";
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

import { catalogProducts } from "../../../db";
import { scopedTranslation } from "./i18n";

export class CatalogDeactivateRepository {
  static async deactivateProduct(
    productId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<{ result: { id: string; isActive: boolean } }>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Read the product's companyId for auth check
      const [existing] = await db
        .select({ companyId: catalogProducts.companyId })
        .from(catalogProducts)
        .where(
          and(
            eq(catalogProducts.id, productId),
            eq(catalogProducts.ownerUserId, userId),
          ),
        )
        .limit(1);

      if (!existing) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ADMIN+ company membership when product belongs to a company
      if (existing.companyId) {
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
      }

      const [product] = await db
        .update(catalogProducts)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(catalogProducts.id, productId),
            eq(catalogProducts.ownerUserId, userId),
          ),
        )
        .returning({
          id: catalogProducts.id,
          isActive: catalogProducts.isActive,
        });

      if (!product) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        result: { id: product.id, isActive: product.isActive },
      });
    } catch (error) {
      logger.error("Error deactivating catalog product", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
