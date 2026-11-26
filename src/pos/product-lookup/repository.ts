/**
 * POS Product Lookup Repository
 * Searches catalog products by name or SKU for POS use
 */

import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
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

import { companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { catalogProducts } from "@/products/db";

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
      const { companyId, currency } = data;
      const query = (data.query ?? "").trim();
      const page = data.page ?? 1;
      const pageSize = data.pageSize ?? 20;
      const offset = (page - 1) * pageSize;
      const escaped = query.replace(/[\\%_]/g, (char) => `\\${char}`);
      const searchPattern = `%${escaped}%`;

      // Empty query browses the active catalog (register product grid).
      const searchCondition = query
        ? or(
            ilike(catalogProducts.name, searchPattern),
            ilike(catalogProducts.sku, searchPattern),
          )
        : undefined;
      const currencyCondition = currency
        ? eq(catalogProducts.currency, currency.toUpperCase())
        : undefined;

      const activeCondition = and(
        eq(catalogProducts.isActive, true),
        currencyCondition,
      );
      // A scanned barcode or typed SKU matches exactly: list it first.
      const ordering = [
        desc(
          sql<boolean>`lower(coalesce(${catalogProducts.sku}, '')) = lower(${query})`,
        ),
        asc(catalogProducts.name),
      ];

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
          .orderBy(...ordering)
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
        .orderBy(...ordering)
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
