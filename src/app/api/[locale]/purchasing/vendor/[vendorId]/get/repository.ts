/**
 * Vendor Get Repository
 * Retrieves a single vendor by ID
 */

import "server-only";

import { eq } from "drizzle-orm";
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

import { purchasingVendors } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type { VendorGetResponseOutput } from "./definition";

export class VendorGetRepository {
  static async getVendor(
    vendorId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<VendorGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [vendor] = await db
        .select()
        .from(purchasingVendors)
        .where(eq(purchasingVendors.id, vendorId))
        .limit(1);

      if (!vendor) {
        return fail({
          message: t("vendorGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        vendor.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("vendorGet.get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return success({
        result: {
          id: vendor.id,
          companyId: vendor.companyId,
          name: vendor.name,
          code: vendor.code,
          email: vendor.email,
          phone: vendor.phone,
          website: vendor.website,
          vatNumber: vendor.vatNumber,
          taxId: vendor.taxId,
          addressLine1: vendor.addressLine1,
          addressLine2: vendor.addressLine2,
          city: vendor.city,
          region: vendor.region,
          postalCode: vendor.postalCode,
          country: vendor.country,
          defaultCurrency: vendor.defaultCurrency,
          defaultPaymentTermsDays: vendor.defaultPaymentTermsDays,
          isActive: vendor.isActive,
          notes: vendor.notes,
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Failed to get vendor", parseError(error));
      return fail({
        message: t("vendorGet.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
