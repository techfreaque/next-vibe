/**
 * Vendor List Repository
 * Lists vendors for a company (or all user's companies when companyId is absent)
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
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
