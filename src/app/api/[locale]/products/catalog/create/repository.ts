/**
 * Catalog Product Create Repository
 * Inserts a new product or service into the catalog
 */

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
import type { CatalogCreateRequestTypeOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CatalogCreateRepository {
  static async createProduct(
    data: CatalogCreateRequestTypeOutput,
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

      const [product] = await db
        .insert(catalogProducts)
        .values({
          ownerUserId: userId,
          companyId: details.companyId,
          categoryId: details.categoryId,
          name: details.name,
          description: details.productDescription,
          sku: details.sku,
          type: details.type,
          unit: details.unit,
          basePrice: details.basePrice,
          currency: details.currency ?? "EUR",
          defaultTaxRate: details.defaultTaxRate,
          imageUrl: details.imageUrl,
          isSubscription: details.isSubscription ?? false,
          billingInterval: details.isSubscription
            ? (details.billingInterval ?? null)
            : null,
        })
        .returning({ id: catalogProducts.id, name: catalogProducts.name });

      if (!product) {
        logger.error("Failed to insert catalog product");
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ result: { id: product.id, name: product.name } });
    } catch (error) {
      logger.error("Error creating catalog product", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
