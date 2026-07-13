/**
 * Catalog Product Get Repository
 * Retrieves a single catalog product by ID
 */

import { eq } from "drizzle-orm";
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

import { catalogProducts } from "../../../db";
import type { CatalogGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CatalogGetRepository {
  static async getProduct(
    productId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CatalogGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [product] = await db
        .select({
          id: catalogProducts.id,
          companyId: catalogProducts.companyId,
          name: catalogProducts.name,
          description: catalogProducts.description,
          sku: catalogProducts.sku,
          type: catalogProducts.type,
          unit: catalogProducts.unit,
          basePrice: catalogProducts.basePrice,
          currency: catalogProducts.currency,
          defaultTaxRate: catalogProducts.defaultTaxRate,
          categoryId: catalogProducts.categoryId,
          imageUrl: catalogProducts.imageUrl,
          isActive: catalogProducts.isActive,
          isSubscription: catalogProducts.isSubscription,
          billingInterval: catalogProducts.billingInterval,
          createdAt: catalogProducts.createdAt,
          updatedAt: catalogProducts.updatedAt,
          ownerUserId: catalogProducts.ownerUserId,
        })
        .from(catalogProducts)
        .where(eq(catalogProducts.id, productId))
        .limit(1);

      if (!product) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ownership: either the user owns it directly or is a member of the owning company
      const isOwner = product.ownerUserId === userId;

      if (!isOwner) {
        if (product.companyId) {
          const authResult = await CompanyAuthRepository.requireMember(
            userId,
            product.companyId,
            CompanyMemberRole.VIEWER,
            logger,
            locale,
          );
          if (!authResult.success) {
            return fail({
              message: t("get.errors.forbidden.title"),
              errorType: ErrorResponseTypes.FORBIDDEN,
            });
          }
        } else {
          return fail({
            message: t("get.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
      }

      return success({
        result: {
          id: product.id,
          companyId: product.companyId ?? null,
          name: product.name,
          description: product.description ?? null,
          sku: product.sku ?? null,
          type: product.type,
          unit: product.unit ?? null,
          basePrice: product.basePrice,
          currency: product.currency,
          defaultTaxRate: product.defaultTaxRate ?? null,
          categoryId: product.categoryId ?? null,
          imageUrl: product.imageUrl ?? null,
          isActive: product.isActive,
          isSubscription: product.isSubscription ?? false,
          billingInterval: product.billingInterval ?? null,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Error fetching catalog product", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
