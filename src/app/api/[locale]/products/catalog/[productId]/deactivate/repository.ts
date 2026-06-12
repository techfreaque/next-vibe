/**
 * Catalog Product Deactivate Repository
 * Soft-deletes a catalog product by setting isActive = false
 */

import { and, eq } from "drizzle-orm";
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
