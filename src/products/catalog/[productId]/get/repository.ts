/**
 * Catalog Product Get Repository
 * Retrieves a single catalog product by ID
 */

import { and, asc, eq } from "drizzle-orm";
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

import { accountNodes } from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { paymentAccountingOffers } from "@/payment/accounting/db";

import { catalogProducts, productPrices } from "../../../db";
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

      const isOwner = product.ownerUserId === userId;
      const companyId = product.companyId;
      const membership = companyId
        ? await CompanyAuthRepository.requireMember(
            userId,
            companyId,
            CompanyMemberRole.VIEWER,
            logger,
            locale,
          )
        : undefined;
      const role = membership?.success ? membership.data.role : undefined;
      if (!isOwner && !role) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const canEdit =
        isOwner ||
        role === CompanyMemberRole.OWNER ||
        role === CompanyMemberRole.ADMIN;
      const canConfigure =
        role === CompanyMemberRole.OWNER ||
        role === CompanyMemberRole.ADMIN ||
        role === CompanyMemberRole.ACCOUNTANT;
      const [prices, companyRows, offers] = await Promise.all([
        db
          .select({
            id: productPrices.id,
            price: productPrices.price,
            currency: productPrices.currency,
            tierName: productPrices.tierName,
          })
          .from(productPrices)
          .where(
            and(
              eq(productPrices.productId, productId),
              eq(productPrices.isActive, true),
            ),
          )
          .orderBy(asc(productPrices.currency), asc(productPrices.tierName))
          .limit(25),
        companyId && role
          ? db
              .select({ name: companies.name, currency: companies.currency })
              .from(companies)
              .where(eq(companies.id, companyId))
              .limit(1)
          : [],
        companyId && canConfigure
          ? db
              .select({
                id: paymentAccountingOffers.id,
                offerId: paymentAccountingOffers.offerId,
                provider: paymentAccountingOffers.provider,
                currency: paymentAccountingOffers.currency,
                recognition: paymentAccountingOffers.recognition,
                accountCode: accountNodes.code,
                accountName: accountNodes.name,
              })
              .from(paymentAccountingOffers)
              .leftJoin(
                accountNodes,
                and(
                  eq(
                    accountNodes.id,
                    paymentAccountingOffers.considerationAccountId,
                  ),
                  eq(accountNodes.companyId, companyId),
                ),
              )
              .where(
                and(
                  eq(paymentAccountingOffers.productId, productId),
                  eq(paymentAccountingOffers.companyId, companyId),
                  eq(paymentAccountingOffers.active, true),
                ),
              )
              .orderBy(asc(paymentAccountingOffers.offerId))
              .limit(25)
          : [],
      ]);
      const [company] = companyRows;

      return success({
        commerce: {
          companyName: company?.name,
          companyCurrency: company?.currency ?? undefined,
          canEdit,
          canConfigure,
          canViewStock: !!role,
          prices,
          offers,
        },
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
