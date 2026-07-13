/**
 * POS Product Lookup Repository
 * Searches catalog products by name or SKU for POS use
 */

import { and, eq, ilike, inArray, or } from "drizzle-orm";
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

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { catalogProducts } from "@/app/api/[locale]/products/db";

import { scopedTranslation } from "../i18n";
import type { PosProductLookupGetRequestOutput } from "./definition";

export class PosProductLookupRepository {
  static async lookupProducts(
    data: PosProductLookupGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      products: {
        id: string;
        name: string;
        sku: string | null;
        type: string;
        basePrice: number;
        currency: string;
        defaultTaxRate: number | null;
        unit: string | null;
      }[];
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { query, companyId } = data;
      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;
      const searchPattern = `%${query}%`;

      const searchCondition = or(
        ilike(catalogProducts.name, searchPattern),
        ilike(catalogProducts.sku, searchPattern),
      );

      const activeCondition = eq(catalogProducts.isActive, true);

      if (companyId) {
        // Verify user is a member of the specified company
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }

        const products = await db
          .select({
            id: catalogProducts.id,
            name: catalogProducts.name,
            sku: catalogProducts.sku,
            type: catalogProducts.type,
            basePrice: catalogProducts.basePrice,
            currency: catalogProducts.currency,
            defaultTaxRate: catalogProducts.defaultTaxRate,
            unit: catalogProducts.unit,
          })
          .from(catalogProducts)
          .where(
            and(
              activeCondition,
              eq(catalogProducts.companyId, companyId),
              searchCondition,
            ),
          )
          .limit(pageSize)
          .offset(offset);

        return success({ products });
      }

      // No companyId: return products for all companies the user is a member of
      const memberCompanies = await db
        .select({ companyId: companyMembers.companyId })
        .from(companyMembers)
        .where(
          and(
            eq(companyMembers.userId, userId),
            eq(companyMembers.isActive, true),
          ),
        );

      const companyIds = memberCompanies.map((m) => m.companyId);

      if (companyIds.length === 0) {
        return success({ products: [] });
      }

      const products = await db
        .select({
          id: catalogProducts.id,
          name: catalogProducts.name,
          sku: catalogProducts.sku,
          type: catalogProducts.type,
          basePrice: catalogProducts.basePrice,
          currency: catalogProducts.currency,
          defaultTaxRate: catalogProducts.defaultTaxRate,
          unit: catalogProducts.unit,
        })
        .from(catalogProducts)
        .where(
          and(
            activeCondition,
            inArray(catalogProducts.companyId, companyIds),
            searchCondition,
          ),
        )
        .limit(pageSize)
        .offset(offset);

      return success({ products });
    } catch (error) {
      logger.error("Error looking up POS products", parseError(error));
      return fail({
        message: t("productLookup.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
