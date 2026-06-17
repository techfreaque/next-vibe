/**
 * Catalog Product Update Repository
 * Updates fields on an existing catalog product
 */

import { and, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
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

import { catalogProducts } from "../../../db";
import type { CatalogUpdateRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CatalogUpdateRepository {
  static async updateProduct(
    productId: string,
    userId: string,
    data: CatalogUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<{ result: { id: string; name: string } }>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { fields } = data;

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
          message: t("patch.errors.notFound.title"),
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

      if (!fields || Object.keys(fields).length === 0) {
        return fail({
          message: t("patch.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const updateValues: Record<
        string,
        string | number | boolean | null | undefined
      > = {};

      if (fields.name !== undefined) {
        updateValues["name"] = fields.name;
      }
      if (fields.productDescription !== undefined) {
        updateValues["description"] = fields.productDescription;
      }
      if (fields.sku !== undefined) {
        updateValues["sku"] = fields.sku;
      }
      if (fields.type !== undefined) {
        updateValues["type"] = fields.type;
      }
      if (fields.unit !== undefined) {
        updateValues["unit"] = fields.unit;
      }
      if (fields.basePrice !== undefined) {
        updateValues["basePrice"] = fields.basePrice;
      }
      if (fields.currency !== undefined) {
        updateValues["currency"] = fields.currency;
      }
      if (fields.defaultTaxRate !== undefined) {
        updateValues["defaultTaxRate"] = fields.defaultTaxRate;
      }
      if (fields.categoryId !== undefined) {
        updateValues["categoryId"] = fields.categoryId;
      }
      if (fields.imageUrl !== undefined) {
        updateValues["imageUrl"] = fields.imageUrl;
      }
      if (fields.isActive !== undefined) {
        updateValues["isActive"] = fields.isActive;
      }

      const [product] = await db
        .update(catalogProducts)
        .set({
          ...updateValues,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(catalogProducts.id, productId),
            eq(catalogProducts.ownerUserId, userId),
          ),
        )
        .returning({ id: catalogProducts.id, name: catalogProducts.name });

      if (!product) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ result: { id: product.id, name: product.name } });
    } catch (error) {
      logger.error("Error updating catalog product", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
