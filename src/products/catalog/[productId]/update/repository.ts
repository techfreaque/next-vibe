/**
 * Catalog Product Update Repository
 * Updates fields on an existing catalog product
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

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
