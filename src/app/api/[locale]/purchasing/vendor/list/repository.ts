/**
 * Vendor List Repository
 * Lists vendors for a company (or all user's companies when companyId is absent)
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { companyMembers } from "@/app/api/[locale]/companies/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { purchasingVendors } from "../../db";
import { scopedTranslation } from "../../i18n";
import type { VendorListGetRequestOutput } from "./definition";

export class VendorListRepository {
  static async listVendors(
    data: VendorListGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      vendors: {
        id: string;
        name: string;
        code: string | null;
        email: string | null;
        vatNumber: string | null;
        defaultCurrency: string;
        defaultPaymentTermsDays: number | null;
        isActive: boolean;
        createdAt: Date;
      }[];
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      if (data.companyId) {
        // Single company — verify membership
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          data.companyId,
          CompanyMemberRole.VIEWER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }

        const vendors = await db
          .select({
            id: purchasingVendors.id,
            name: purchasingVendors.name,
            code: purchasingVendors.code,
            email: purchasingVendors.email,
            vatNumber: purchasingVendors.vatNumber,
            defaultCurrency: purchasingVendors.defaultCurrency,
            defaultPaymentTermsDays: purchasingVendors.defaultPaymentTermsDays,
            isActive: purchasingVendors.isActive,
            createdAt: purchasingVendors.createdAt,
          })
          .from(purchasingVendors)
          .where(eq(purchasingVendors.companyId, data.companyId));

        return success({ vendors });
      }

      // No companyId — return vendors for all companies the user is a member of
      const memberRows = await db
        .select({ companyId: companyMembers.companyId })
        .from(companyMembers)
        .where(
          and(
            eq(companyMembers.userId, userId),
            eq(companyMembers.isActive, true),
          ),
        );

      const companyIds = memberRows.map((r) => r.companyId);
      if (companyIds.length === 0) {
        return success({ vendors: [] });
      }

      const vendors = await db
        .select({
          id: purchasingVendors.id,
          name: purchasingVendors.name,
          code: purchasingVendors.code,
          email: purchasingVendors.email,
          vatNumber: purchasingVendors.vatNumber,
          defaultCurrency: purchasingVendors.defaultCurrency,
          defaultPaymentTermsDays: purchasingVendors.defaultPaymentTermsDays,
          isActive: purchasingVendors.isActive,
          createdAt: purchasingVendors.createdAt,
        })
        .from(purchasingVendors)
        .where(inArray(purchasingVendors.companyId, companyIds));

      return success({ vendors });
    } catch (error) {
      logger.error("Failed to list vendors", parseError(error));
      return fail({
        message: t("vendorList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
